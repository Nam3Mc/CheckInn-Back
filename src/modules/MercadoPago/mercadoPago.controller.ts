import { Body, Controller, Post } from '@nestjs/common';

import { MercadoPagoService } from './mercadoPago.service';

import { CreatePaymentDto } from '../dto/mercadoPago.dto';

@Controller('mercadopago')
export class MercadoPagoController {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}

  @Post('create')
  async createPayment(@Body() paymentData: CreatePaymentDto) {
    return this.mercadoPagoService.createPayment(paymentData);
  }
}
