import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../entities/rooms.entity';
import { CloudinaryService } from '../commons/cloudinary.service';
import { RoomsDto } from '../dto/rooms.dto';
import { Reservation } from '../entities/reservations.entity';
import { ReservationDto } from 'src/sources/reservation.dto';

@Injectable()
export class RoomsRepository {
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findOne(id: string): Promise<Room> {
    const room = await this.roomsRepository.findOne({ where: { id } });
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return room;
  }

  async savePictures(file: Express.Multer.File): Promise<string> {
    const photo = (await this.cloudinaryService.uploadImage(file)).url;
    return photo;
  }

  async newRoom(roomData: RoomsDto): Promise<Room> {
    const room = new Room();
    return room;
  }

  async roomCalendar(
    roomId: string,
    checkIn: Date,
    checkOut: Date,
  ): Promise<boolean> {
    const room: Room = await this.roomsRepository.findOne({
      where: { id: roomId },
    });
    const reservations: Reservation[] = room.reservation;
    for (const book of reservations) {
      if (
        checkIn >= book.checkin ||
        checkIn < book.checkout ||
        checkOut > book.checkin
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

  async newReservation(reservationData: ReservationDto) {
    return 'In creation';
  }
}
