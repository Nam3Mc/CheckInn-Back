import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from 'src/modules/entities/reservations.entity';
import { Room } from 'src/modules/entities/rooms.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomsRepository {
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,
  ) {}

  async getRooms(): Promise<Room[]> {
    return await this.roomsRepository.find();
  }

  async getRoomById(id: string): Promise<Room> {
    return await this.roomsRepository.findOneBy({ id });
  }

  async isAvailable(roomId: string, checkIn: Date, checkOut: Date): Promise<boolean> {
    const room: Room = await this.roomsRepository.findOne({
      where: { id: roomId },
      relations: ['reservation']
    });

    if (!room) {
      throw new Error('Room not found');
    }

    const reservations: Reservation[] = room.reservation;

    for (const reservation of reservations) {
      if (
        (checkIn < reservation.checkout && checkOut > reservation.checkin) ||
        (checkIn < reservation.checkin && checkOut > reservation.checkin)
      ) {
        return false;
      }
    }

    return true;
  }

  async roomCalendar(roomId: string): Promise<any[]> {
    const room: Room = await this.roomsRepository.findOne({
      where: { id: roomId },
      relations: ['reservation']
    });

    if (!room) {
      throw new Error('Room not found');
    }

    const dates = [];
    const reservations: Reservation[] = room.reservation;

    for (const reservation of reservations) {
      const { id, price, status, guests, hasMinor, ...date } = reservation;
      dates.push(date);
      console.log(date.checkout.getDate() - date.checkin.getDate());
    }

    return dates;
  }
}
