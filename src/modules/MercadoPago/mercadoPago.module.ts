import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MercadoPagoController } from './mercadoPago.controller';
import { MercadoPagoService } from './mercadoPago.service';
import { MercadoPago } from '../entities/mercadoPago.entity';
import { MercadoPagoRepository } from './mercadoPago.repository';
import { ReservationsModule } from '../reservations/reservations.module';
import { accountsModule } from '../accounts/accounts.module';
import { RoomsModule } from '../rooms/rooms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MercadoPago]),
    ReservationsModule,
    accountsModule,
    RoomsModule,
  ],
  controllers: [MercadoPagoController],
  providers: [MercadoPagoService, MercadoPagoRepository],
})
export class MercadoPagoModule {}
