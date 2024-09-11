import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Body,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import {
  CreateReservationDto,
  UpdateReservationDto,
} from '../dto/reservations.dto';
import { Rolls } from 'src/decorators/rolls.decorator';
import { Roll } from '../entities/users.entity';
import { RollsGuard } from 'src/guards/rolls.guard';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';

@ApiTags('RESERVATIONS')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}
  
  @Get('availability/:roomId')
  async getRoomAvailability(@Param('roomId') roomId: string): Promise<Date[]> {
    return this.reservationsService.findRoomByAvalibity(roomId);
  }

  
  @Get()
  @Rolls(Roll.ADMIN)
  @UseGuards(RollsGuard)
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.reservationsService.findByUserId(userId);
  }

  @Post()
  @Rolls(Roll.USER, Roll.ADMIN)
  @UseGuards(AuthGuard, RollsGuard)
  addReservation(@Body() reservation: CreateReservationDto) {
    return this.reservationsService.addReservation(reservation);
  }

  @Put(':id')
  @Rolls(Roll.USER, Roll.ADMIN)
  @UseGuards(AuthGuard, RollsGuard)
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(id, updateReservationDto);
  }

  @Delete(':id')
  @Rolls(Roll.USER, Roll.ADMIN)
  @UseGuards(AuthGuard, RollsGuard)
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(id);
  }

  
}
