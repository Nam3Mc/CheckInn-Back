import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../entities/rooms.entity';
import * as path from 'path';
import * as fs from 'fs';
import { Amenity } from '../entities/amenities.entity';
import { RoomFilterDto } from '../dto/rooms.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,
    @InjectRepository(Amenity)
    private readonly amenitiesRepository: Repository<Amenity>,
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

      await this.roomsRepository
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

  async getRooms(): Promise<Room[]> {
    return this.roomsRepository.find(); // Devuelve todas las habitaciones
  }

  async getRoom(id: string) {
    const room = await this.roomsRepository.findOne({
      where: { id },
    });
    return room;
  }

  addPhotos(file: Express.Multer.File) {
    // return this.roomsRepo.savePictures(file)
  }

  async getFilteredRooms(filterDto: RoomFilterDto): Promise<Room[]> {
    const { beds, baths, capacity, price } = filterDto;

    // Convertir parámetros a números
    const bedNumber = beds ? Number(beds) : undefined;
    const bathNumber = baths ? Number(baths) : undefined;
    const capacityNumber = capacity ? Number(capacity) : undefined;
    const priceNumber = price ? Number(price) : undefined;

    const queryBuilder = this.roomsRepository.createQueryBuilder('room');

    if (bedNumber !== undefined) {
      queryBuilder.andWhere('room.beds = :beds', { beds: bedNumber });
    }

    if (bathNumber !== undefined) {
      queryBuilder.andWhere('room.baths = :baths', { baths: bathNumber });
    }

    if (capacityNumber !== undefined) {
      queryBuilder.andWhere('room.capacity = :capacity', {
        capacity: capacityNumber,
      });
    }

    if (priceNumber !== undefined) {
      queryBuilder.andWhere('room.price = :price', { price: priceNumber });
    }

    const rooms = await queryBuilder.getMany();
    return rooms;
  }
}
