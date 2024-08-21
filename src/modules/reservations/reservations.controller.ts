import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Body,
  Put,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import {
  CreateReservationDto,
  UpdateReservationDto,
} from '../dto/reservations.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Post()
  addReservation(@Body() reservation: CreateReservationDto) {
    const { accountId, roomId, nights } = reservation;
    return this.reservationsService.addReservation(accountId, roomId, nights);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(id, updateReservationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(id);
  }
}
