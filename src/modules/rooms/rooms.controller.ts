import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { RoomService } from './rooms.service';
import { isUUID } from 'class-validator';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomService: RoomService) {}

  @Get('seeder')
  seedRooms() {
    return this.roomService.seedRooms();
  }

  @Get()
  getRooms(@Query('page') page: number, @Query('limit') limit: number) {
    if (page && limit) {
      return this.roomService.getRooms(page, limit);
    } else {
      return this.roomService.getRooms(1, 3);
    }
  }

  @Get(':id')
  async getRoom(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    return this.roomService.getRoom(id);
  }
}
