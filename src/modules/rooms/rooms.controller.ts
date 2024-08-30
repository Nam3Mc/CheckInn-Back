import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RoomService } from './rooms.service';
import { isUUID } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Rolls } from 'src/decorators/rolls.decorator';
import { Roll } from '../entities/users.entity';
import { RollsGuard } from 'src/guards/rolls.guard';
import { ApiTags } from '@nestjs/swagger';
import { RoomFilterDto } from '../dto/rooms.dto';

@ApiTags('ROOMS')
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

  @Post('photos')
  @Rolls(Roll.ADMIN)
  @UseGuards(RollsGuard)
  @UseInterceptors(FileInterceptor('picture'))
  addRoomPhoto(@UploadedFile() file: Express.Multer.File) {
    return this.roomService.addPhotos(file);
  }

  @Get('filter')
  async getFilteredRooms(@Query() filterDto: RoomFilterDto) {
    return this.roomService.getFilteredRooms(filterDto);
  }

  @Get(':id')
  async getRoom(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    return this.roomService.getRoom(id);
  }
}
