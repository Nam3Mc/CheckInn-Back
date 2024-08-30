import { Body, Controller, Post } from '@nestjs/common';

import { MercadoPagoService } from './mercadoPago.service';

import { MercadoPagoDto } from '../dto/mercadoPago.dto';

@Controller('mercadopago')
export class MercadoPagoController {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}

  @Post('create')
  async createPayment(@Body() paymentData: MercadoPagoDto) {
    const preference =
      await this.mercadoPagoService.createPaymentPreference(paymentData);
    return preference;
  }
}
