import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MercadoPago } from '../entities/mercadoPago.entity';

@Injectable()
export class MercadoPagoRepository {
  constructor(
    @InjectRepository(MercadoPago)
    private readonly mercadoPagoRepository: Repository<MercadoPago>,
  ) {}

  async createPayment(paymentData: Partial<MercadoPago>): Promise<MercadoPago> {
    const payment = this.mercadoPagoRepository.create(paymentData);
    return this.mercadoPagoRepository.save(payment);
  }

  async getPaymentById(paymentId: string): Promise<MercadoPago> {
    return this.mercadoPagoRepository.findOne({ where: { paymentId } });
  }
}
