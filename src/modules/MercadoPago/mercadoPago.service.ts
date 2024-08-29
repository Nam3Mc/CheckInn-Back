import { Injectable, BadRequestException } from '@nestjs/common';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

@Injectable()
export class MercadoPagoService {
  private payment: Payment;

  constructor() {
    // Inicializa el cliente de MercadoPago
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
      options: { timeout: 5000, idempotencyKey: 'abc' },
    });

    // Inicializa el objeto Payment con el cliente
    this.payment = new Payment(client);
  }

  async createPayment(paymentData: any) {
    try {
      const validPaymentMethodIds = await this.getValidPaymentMethodIds();

      if (!validPaymentMethodIds.includes(paymentData.payment_method_id)) {
        throw new BadRequestException(
          `Invalid payment_method_id: ${paymentData.payment_method_id}`,
        );
      }

      const body = {
        transaction_amount: paymentData.transaction_amount,
        description: paymentData.description,
        payment_method_id: paymentData.payment_method_id,
        payer: {
          email: paymentData.payer_email,
        },
      };

      const requestOptions = {
        idempotencyKey: 'unique_key', // Puedes usar un valor único para idempotencia
      };

      // Realiza la solicitud de creación de pago
      const response = await this.payment.create({ body, requestOptions });
      return response;
    } catch (error) {
      throw new BadRequestException(`Error creating payment: ${error.message}`);
    }
  }
  private async getValidPaymentMethodIds(): Promise<string[]> {
    try {
      const response = await axios.get(
        'https://api.mercadopago.com/v1/payment_methods',
        {
          headers: {
            Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          },
        },
      );
      // console.log(response.data);

      // Asumiendo que `id` es el campo que contiene el ID del método de pago
      return response.data.map((method: any) => method.id);
    } catch (error) {
      throw new BadRequestException(
        `Error fetching payment methods: ${error.message}`,
      );
    }
  }
}
