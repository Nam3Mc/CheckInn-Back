import { Injectable } from '@nestjs/common';
import { ReservationsRepository } from './reservations.repository';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
  ) {}

  findAll() {
    return this.reservationsRepository.findAll;
  }

  findOne(id: string) {
    return this.reservationsRepository.findOne(id);
  }

  remove(id: string) {
    return this.reservationsRepository.remove(id);
  }
}
