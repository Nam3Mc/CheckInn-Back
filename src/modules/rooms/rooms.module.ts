import { Module } from '@nestjs/common';
import { RoomService } from './rooms.service';
import { RoomsController } from './rooms.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../entities/rooms.entity';
import { RoomsRepository } from './rooms.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  controllers: [RoomsController],
  providers: [RoomService, RoomsRepository],
  exports: [RoomService],
})
export class RoomsModule {}
