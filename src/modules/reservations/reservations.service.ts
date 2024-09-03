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

  addReservation(createReservationDto: CreateReservationDto) {
    const { accountId, roomId, checkinDate, checkoutDate, guests, hasMinor } =
      createReservationDto;
    return this.reservationsRepository.addReservation(
      accountId,
      roomId,
      checkinDate,
      checkoutDate,
      guests,
      hasMinor,
    );
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.update(id, updateReservationDto);
  }

  async remove(id: string) {
    return this.reservationsRepository.remove(id);
  }

  async findByUserId(userId: string) {
    return this.reservationsRepository.findByUserId(userId);
  }
}
