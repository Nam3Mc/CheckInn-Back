import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Payment } from 'mercadopago';

@Injectable()
export class AppService {
  private client: MercadoPagoConfig;
  private payment: Payment;

  constructor() {
    this.client = new MercadoPagoConfig({
      accessToken:
        'APP_USR-8648688575050045-082714-00eb57dc0919995506b727145ce94c3d-735868828',
      options: { timeout: 5000, idempotencyKey: 'unique_key' },
    });
    this.payment = new Payment(this.client);
  }

  async createPreference(body: any) {
    const preference = {
      transaction_amount: body.transaction_amount,
      description: body.description,
      payment_method_id: body.payment_method_id,
      payer: {
        email: body.payer.email,
      },
    };

    const requestOptions = {
      idempotencyKey: 'unique_key',
    };

    const response = await this.payment.create({
      body: preference,
      requestOptions,
    });
    return response;
  }
}
