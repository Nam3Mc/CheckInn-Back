import { Module } from '@nestjs/common';
import { RoomService } from './rooms.service';
import { RoomsController } from './rooms.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../entities/rooms.entity';
import { RoomsRepository } from './rooms.repository';
import { CloudinaryConfig } from 'src/config/cloudinary';
import { CloudinaryService } from '../commons/cloudinary.service';
import { Amenity } from '../entities/amenities.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Amenity])],
  controllers: [RoomsController],
  providers: [
    RoomService,
    RoomsRepository,
    CloudinaryConfig,
    CloudinaryService,
  ],
  exports: [RoomService, RoomsRepository],
})
export class RoomsModule {}
