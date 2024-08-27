import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../entities/rooms.entity';
import { CloudinaryService } from '../commons/cloudinary.service';

@Injectable()
export class RoomsRepository {

  constructor(
    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async findOne(id: string): Promise<Room> {
    const room = await this.roomsRepository.findOne({ where: { id } });
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return room;
  }

  async savePictures(file: Express.Multer.File): Promise<string> {
    const photo = (await this.cloudinaryService.uploadImage(file)).url
    return photo
  }

}
