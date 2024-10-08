import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { ReservationsRepository } from './reservations.repository';
import { AccountsRepository } from '../accounts/accounts.repository';
import { RoomsRepository } from '../rooms/rooms.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '../entities/reservations.entity';
import { Room } from '../entities/rooms.entity';
import { Account } from '../entities/accounts.entity';
import { CloudinaryConfig } from 'src/config/cloudinary';
import { CloudinaryService } from '../commons/cloudinary.service';
import { MercadoPago } from '../entities/mercadoPago.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Room, Account, MercadoPago]),
  ],
  controllers: [ReservationsController],
  providers: [
    ReservationsService,
    ReservationsRepository,
    AccountsRepository,
    RoomsRepository,
    CloudinaryConfig,
    CloudinaryService,
  ],
  exports: [ReservationsRepository, ReservationsService],
})
export class ReservationsModule {}
