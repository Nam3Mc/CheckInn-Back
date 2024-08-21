import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../entities/rooms.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async seedRooms() {
    const filePath = path.join(__dirname, 'rooms.json');

    const roomsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    for (const roomData of roomsData) {
      const room = new Room();
      room.name = roomData.name;
      room.description = roomData.description;
      room.beds = roomData.beds;
      room.baths = roomData.baths;
      room.photos = roomData.photos;
      room.capacity = roomData.capacity;
      room.pricePerNight = roomData.price;

      await this.roomRepository
        .createQueryBuilder()
        .insert()
        .into(Room)
        .values(room)
        .orUpdate(
          ['description', 'beds', 'baths', 'photos', 'capacity', 'price'],
          ['name'],
        )
        .execute();
    }

    return 'Rooms seeded successfully';
  }
}
