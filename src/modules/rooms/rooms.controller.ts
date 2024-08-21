import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { RoomService } from './rooms.service';

@Controller('seed')
export class RoomsController {
  constructor(private readonly roomSeeder: RoomService) {}

  @Get('rooms')
  async seedRooms() {
    try {
      const result = await this.roomSeeder.seedRooms();
      return {
        message: result,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to seed rooms: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
