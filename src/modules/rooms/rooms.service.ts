import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../entities/rooms.entity';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async seedRooms() {
    const filePath = path.join(__dirname, '..', '..', '..', 'src/rooms.json');
    const roomsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    for (const roomData of roomsData) {
      const room = new Room();
      room.name = roomData.name;
      room.description = roomData.description;
      room.beds = roomData.beds;
      room.baths = roomData.baths;
      room.photos = roomData.photos;
      room.capacity = roomData.capacity;
      room.price = roomData.price;

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

  async getRooms(page: number, limit: number) {
    let rooms = await this.roomRepository.find();
    const start = (page - 1) * limit;
    const end = start + limit;

    rooms = rooms.slice(start, end);

    return rooms;
  }

  async getRoom(id: string) {
    let room = await this.roomRepository.findOne({
      where: { id }
    })
    return room;
  }
}
