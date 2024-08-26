import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../entities/reservations.entity';
import { UpdateReservationDto } from '../dto/reservations.dto';
import { AccountsRepository } from '../accounts/accounts.repository';
import { Room } from '../entities/rooms.entity';

@Injectable()
export class ReservationsRepository {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
    private readonly accountsRepository: AccountsRepository,

    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,
  ) {}

  async findAll() {
    return this.reservationsRepository.find();
  }

  async findOne(id: string) {
    const reservation = this.reservationsRepository.findOne({ where: { id } });
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
    if (room.status !== 'available') {
      throw new NotFoundException(`The room with id: ${roomId} is occupied.`);
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
    reservation.status = true;
    reservation.room = room;
    reservation.guests = guests;
    reservation.hasMinor = hasMinor;

    room.status = 'occupied';
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
    this.reservationsRepository.remove(reservation);
  }
}
