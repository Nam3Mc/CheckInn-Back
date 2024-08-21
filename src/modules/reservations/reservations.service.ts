import { Injectable } from '@nestjs/common';
import { ReservationsRepository } from './reservations.repository';
import {
  CreateReservationDto,
  UpdateReservationDto,
} from '../dto/reservations.dto';
@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
  ) {}

  findAll() {
    return this.reservationsRepository.findAll();
  }

  findOne(id: string) {
    return this.reservationsRepository.findOne(id);
  }

  create(createReservationDto: CreateReservationDto) {
    return this.reservationsRepository.create(createReservationDto);
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.update(id, updateReservationDto);
  }

  remove(id: string) {
    return this.reservationsRepository.remove(id);
  }
}
