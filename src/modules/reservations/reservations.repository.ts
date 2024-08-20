import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../entities/reservations.entity';

@Injectable()
export class ReservationsRepository {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
  ) {}

  async findAll() {
    return this.reservationsRepository.reservation;
  }

  async findOne(id: string) {
    const reservation = this.reservationsRepository.findOne({ where: { id } });
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return reservation;
  }

  async remove(id: string) {
    const reservation = await this.reservationsRepository.findOneBy({ id });
    this.reservationsRepository.remove(reservation);
  }

  async;
}
