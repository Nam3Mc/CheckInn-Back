import { Controller, Get } from '@nestjs/common';
import { RoomService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomSeeder: RoomService) {}

  @Get('seeder')
  seedRooms() {
    return this.roomSeeder.seedRooms()
  }
}
