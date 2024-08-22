import { Controller, Get, Query } from '@nestjs/common';
import { RoomService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomService: RoomService) {}

  @Get('seeder')
  seedRooms() {
    return this.roomService.seedRooms()
  }

  @Get()
  getRooms(@Query("page") page: number, @Query("limit") limit: number) {

    if (page && limit) {
      return this.roomService.getRooms(page, limit)
    }
    else {
      return this.roomService.getRooms(1, 3)
    }
  }
}
