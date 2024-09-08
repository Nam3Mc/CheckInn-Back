import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import * as dotenv from 'dotenv';

import { ReservationsRepository } from '../reservations/reservations.repository';
import { RoomsRepository } from '../rooms/rooms.repository';
import { AccountsRepository } from '../accounts/accounts.repository';
import { ReservationStatus } from '../entities/reservations.entity';
import { RoomStatus } from '../entities/rooms.entity';
import { MercadoPagoDto } from '../dto/mercadoPago.dto';

dotenv.config();

@Injectable()
export class MercadoPagoService {
  private preference: Preference;

  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    private readonly roomsRepository: RoomsRepository,
    private readonly accountsRepository: AccountsRepository,
  ) {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
      options: { timeout: 5000, idempotencyKey: 'abc' },
    });

    this.preference = new Preference(client);
  }

  async createPaymentPreference(paymentData: MercadoPagoDto) {
    try {
      const reservation =
        await this.reservationsRepository.findOneWithRelations(
          paymentData.reservationId,
          ['room', 'account'],
        );

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      if (reservation.status !== ReservationStatus.PENDING) {
        throw new BadRequestException(
          'Reservation is not in a valid state for payment',
        );
      }

      if (paymentData.transaction_amount !== reservation.price) {
        throw new BadRequestException(
          'Transaction amount does not match reservation total',
        );
      }
      // Configura la preferencia de pago
      const preferenceData = {
        items: [
          {
            id: '1',
            title: paymentData.description,
            status: 'inactive',
            quantity: 1,
            unit_price: paymentData.transaction_amount,
          },
        ],
        back_urls: {
          success: 'http://localhost:3000/reservations',
          failure: 'http://localhost:3000/reservations',
          pending: 'http://localhost:3000/reservations',
        },
        auto_return: 'approved',
        notification_url: 'https://your-website.com/notification',
      };

      // Crea la preferencia de pago
      const response = await this.preference.create({ body: preferenceData });

      // // Guarda la referencia de la preferencia en la base de datos si es necesario

      return {
        init_point: response.init_point,
      };
    } catch (error) {
      throw new BadRequestException(
        `Error creating payment preference: ${error.message}`,
      );
    }
  }

  async updateReservationStatus(
    reservationId: string,
    status: ReservationStatus,
  ) {
    try {
      const reservation =
        await this.reservationsRepository.findOneWithRelations(reservationId, [
          'room',
          'account',
        ]);

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      reservation.status = status;

      const room = reservation.room;
      if (status === ReservationStatus.PAID) {
        room.status = RoomStatus.OCCUPIED;
      }

      await this.roomsRepository.saveRoom(room);
      await this.reservationsRepository.saveReservation(reservation);

      return {
        message: 'Reservation status updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        `Error updating reservation status: ${error.message}`,
      );
    }
  }
}
