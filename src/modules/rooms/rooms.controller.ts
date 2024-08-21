import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { RoomSeeder } from './rooms.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly roomSeeder: RoomSeeder) {}

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
