import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReservationsRepository {
  constructor(
    @InjectRepository(Reservations)
    private reservationsRepository: Repository<Reservations>,
  ) {}

  async findAll() {
    return this.reservationsRepository.reservations;
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
