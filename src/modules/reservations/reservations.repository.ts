import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../entities/reservations.entity';
import {
  CreateReservationDto,
  UpdateReservationDto,
} from '../dto/reservations.dto';

@Injectable()
export class ReservationsRepository {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
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
  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const newReservation =
      this.reservationsRepository.create(createReservationDto);
    return this.reservationsRepository.save(newReservation);
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
