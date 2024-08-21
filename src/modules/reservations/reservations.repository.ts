import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../entities/reservations.entity';
import { UpdateReservationDto } from '../dto/reservations.dto';
import { AccountsRepository } from '../accounts/accounts.repository';

@Injectable()
export class ReservationsRepository {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
    private readonly accountsRepository: AccountsRepository,
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
  async addReservation(accountId: string, roomId: string, nights: number) {
    let total = 0;

    const account = await this.accountsRepository.findOne(accountId);
    if (!account) {
      throw new NotFoundException(`Cuenta con id: ${accountId} no encontrada.`);
    }

    const room = await this.roomsRepository.findOne(roomId);
    if (!room) {
      throw new NotFoundException(
        `Habitación con id: ${roomId} no encontrada.`,
      );
    }
    if (room.status !== 'available') {
      throw new NotFoundException(
        `La habitación con id: ${roomId} no está disponible.`,
      );
    }

    const roomTotal = Number(room.pricePerNight) * nights;
    total = roomTotal;

    const reservation = new Reservation();
    reservation.checkin = new Date();
    reservation.checkout = null;
    reservation.price = total;
    reservation.account = account;
    reservation.status = true;
    reservation.room = room;
    reservation.guests = 1;

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
