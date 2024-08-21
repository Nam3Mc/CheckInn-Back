import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { ReservationsRepository } from './reservations.repository';
import { AccountsRepository } from '../accounts/accounts.repository';

@Module({
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository, AccountsRepository],
})
export class ReservationsModule {}
