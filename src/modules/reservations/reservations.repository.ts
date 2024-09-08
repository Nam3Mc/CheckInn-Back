import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Reservation,
  ReservationStatus,
} from '../entities/reservations.entity';
import { UpdateReservationDto } from '../dto/reservations.dto';
import { AccountsRepository } from '../accounts/accounts.repository';
import { Room, RoomStatus } from '../entities/rooms.entity';
import { MercadoPago } from '../entities/mercadoPago.entity';

@Injectable()
export class ReservationsRepository {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
    private readonly accountsRepository: AccountsRepository,
    @InjectRepository(MercadoPago)
    private readonly mercadoPagoRepository: Repository<MercadoPago>,

    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,
  ) {}

  async findAll() {
    return this.reservationsRepository.find();
  }

  async findOne(id: string) {
    const reservation = await this.reservationsRepository.findOne({
      where: { id },
    });
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return reservation;
  }
  async findByUserId(userId: string): Promise<Reservation[]> {
    return this.reservationsRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.account', 'account')
      .where('account.id = :userId', { userId })
      .getMany();
  }

  async findOneWithRelations(
    id: string,
    relations: string[],
  ): Promise<Reservation> {
    const reservation = await this.reservationsRepository.findOne({
      where: { id },
      relations,
    });
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return reservation;
  }
  async addReservation(
    accountId: string,
    roomId: string,
    checkinDate: Date,
    checkoutDate: Date,
    guests: number,
    hasMinor: boolean,
  ) {
    let total = 0;

    const account = await this.accountsRepository.findOne(accountId);
    if (!account) {
      throw new NotFoundException(`Account with id: ${accountId} not found.`);
    }
    if (guests <= 0) {
      throw new NotFoundException(
        `The number of guests must be greater than zero.`,
      );
    }

    const room = await this.roomsRepository.findOne({
      where: { id: roomId },
    });
    if (!room) {
      throw new NotFoundException(`Room with id: ${roomId} not found.`);
    }

    if (room.capacity < guests) {
      throw new NotFoundException(
        `The room with id: ${roomId} does not have enough capacity for ${guests} guest(s). Maximum capacity: ${room.capacity}.`,
      );
    }

    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);
    const nights = Math.ceil(
      (checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (nights <= 0) {
      throw new BadRequestException(
        `The checkout date must be after the checkin date.`,
      );
    }

    const roomTotal = Number(room.price) * nights;
    total = roomTotal;

    const reservation = new Reservation();
    reservation.checkin = checkin;
    reservation.checkout = checkout;
    reservation.checkout.setDate(reservation.checkout.getDate() + nights);
    reservation.price = total;
    reservation.account = account;
    reservation.status = ReservationStatus.PENDING;
    reservation.room = room;
    reservation.guests = guests;
    reservation.hasMinor = hasMinor;

    room.status = RoomStatus.OCCUPIED;
    await this.roomsRepository.save(room);

    const newReservation = await this.reservationsRepository.save(reservation);

    const reservationWithRelations = await this.reservationsRepository.findOne({
      where: { id: newReservation.id },
      relations: ['room'],
    });

    return {
      reservation: reservationWithRelations,
      total: total.toFixed(2),
    };
  }

  async saveReservation(reservation: Reservation) {
    return this.reservationsRepository.save(reservation);
  }

  async update(
    id: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    await this.findOne(id);
    await this.reservationsRepository.update(id, updateReservationDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const reservation = await this.reservationsRepository.findOneBy({ id });
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    const room = reservation.room;
    if (room) {
      room.status = RoomStatus.AVAILABLE;
      await this.roomsRepository.save(room);
    }

    const payments = await this.mercadoPagoRepository.find({
      where: { reservation: { id } },
    });
    for (const payment of payments) {
      await this.mercadoPagoRepository.remove(payment);
    }
    this.reservationsRepository.remove(reservation);

    return {
      message: 'Reservation successfully canceled.',
      reservation: {
        id: reservation.id,
        checkin: reservation.checkin,
        checkout: reservation.checkout,
        guests: reservation.guests,
        hasMinor: reservation.hasMinor,
      },
    };
  }
  async getRoomAvailability(roomId: string): Promise<Date[]> {
    const reservations = await this.reservationsRepository.find({
      where: {
        room: {
          id: roomId, // Usa la relación para filtrar las reservas
        },
      },
    });

    const bookedDates: Date[] = [];
    reservations.forEach((reservation: Reservation) => {
      const checkinDate = new Date(reservation.checkin);
      const checkoutDate = new Date(reservation.checkout);

      let currentDate = new Date(checkinDate);
      while (currentDate <= checkoutDate) {
        bookedDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    return bookedDates;
  }

  async updateReservationWithPayment(
    reservationId: string,
    paymentId: string,
    paymentStatus: string,
    amount: number, // Añade amount como argumento
  ): Promise<Reservation> {
    const reservation = await this.findOneWithRelations(reservationId, [
      'room',
      'payment',
    ]);
    if (!reservation) {
      throw new NotFoundException(
        `Reservation with ID ${reservationId} not found`,
      );
    }

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException(
        'Reservation is not in a valid state for payment update',
      );
    }

    if (paymentStatus === 'approved') {
      reservation.status = ReservationStatus.PAID;
      // Create or update MercadoPago entity
      let mercadoPago = reservation.payment;

      if (mercadoPago) {
        // Update existing MercadoPago entity
        mercadoPago.paymentId = paymentId;
        mercadoPago.status = paymentStatus;
        mercadoPago.amount = amount; // Asegúrate de establecer el amount

        await this.mercadoPagoRepository.save(mercadoPago);
      } else {
        // Create new MercadoPago entity
        mercadoPago = new MercadoPago();
        mercadoPago.paymentId = paymentId;
        mercadoPago.status = paymentStatus;
        mercadoPago.amount = amount; // Asegúrate de establecer el amount

        // Set other fields as necessary
        mercadoPago.reservation = reservation;
        await this.mercadoPagoRepository.save(mercadoPago);

        // Associate the new MercadoPago entity with the reservation
        reservation.payment = mercadoPago;
      }

      reservation.room.status = RoomStatus.OCCUPIED;
      await this.roomsRepository.save(reservation.room);

      return this.reservationsRepository.save(reservation);
    } else {
      throw new BadRequestException('Payment has not been approved.');
    }
  }
}
