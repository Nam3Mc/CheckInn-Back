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

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

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

  @Post()
  @Rolls(Roll.ADMIN || Roll.USER)
  @UseGuards(RollsGuard)
  addReservation(@Body() reservation: CreateReservationDto) {
    const { accountId, roomId, nights, guests } = reservation;
    return this.reservationsService.addReservation(
      accountId,
      roomId,
      nights,
      guests,
    );
  }

  @Put(':id')
  @Rolls(Roll.ADMIN || Roll.USER)
  @UseGuards(RollsGuard)
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(id, updateReservationDto);
  }

  @Delete(':id')
  @Rolls(Roll.ADMIN || Roll.USER)
  @UseGuards(RollsGuard)
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(id);
  }
}
