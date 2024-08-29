import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MercadoPagoController } from './mercadoPago.controller';
import { MercadoPagoService } from './mercadoPago.service';
import { MercadoPago } from '../entities/mercadoPago.entity';
import { MercadoPagoRepository } from './mercadoPago.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MercadoPago])],
  controllers: [MercadoPagoController],
  providers: [MercadoPagoService, MercadoPagoRepository],
})
export class MercadoPagoModule {}
