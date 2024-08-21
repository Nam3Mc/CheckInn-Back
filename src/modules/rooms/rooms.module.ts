import { Module } from '@nestjs/common';
import { RoomService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { RoomsRepository } from './rooms.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../entities/rooms.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  controllers: [RoomsController],
  providers: [RoomService, RoomsRepository],
  exports: [RoomsRepository],
})
export class RoomsModule {}
