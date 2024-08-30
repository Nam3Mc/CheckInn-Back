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

      // Verifica que el transaction_amount coincida con el total de la reserva
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
          success: 'https://your-website.com/success', // URL a la que se redirige después de un pago exitoso
          failure: 'https://your-website.com/failure', // URL a la que se redirige si el pago falla
          pending: 'https://your-website.com/pending', // URL a la que se redirige si el pago está pendiente
        },
        auto_return: 'approved', // Opcional: Redirige automáticamente después de que el pago sea aprobado
        notification_url: 'https://your-website.com/notification', // Opcional: URL para recibir notificaciones de eventos de pago
      };

      // Crea la preferencia de pago
      const response = await this.preference.create({ body: preferenceData });

      // Guarda la referencia de la preferencia en la base de datos si es necesario
      await this.processReservationPayment(paymentData.reservationId);

      return {
        init_point: response.init_point, // URL para redirigir al usuario
      };
    } catch (error) {
      throw new BadRequestException(
        `Error creating payment preference: ${error.message}`,
      );
    }
  }

  private async processReservationPayment(reservationId: string) {
    try {
      const reservation =
        await this.reservationsRepository.findOneWithRelations(reservationId, [
          'room',
          'account',
        ]);

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      if (reservation.status === ReservationStatus.PAID) {
        throw new BadRequestException('Reservation is already paid');
      }

      if (reservation.status !== ReservationStatus.PENDING) {
        throw new BadRequestException(
          'Reservation is not in a valid state for payment',
        );
      }

      // Marcamos la reserva como pagada
      reservation.status = ReservationStatus.PAID;

      // Actualizamos la disponibilidad de la habitación
      const room = reservation.room;
      room.status = RoomStatus.OCCUPIED;

      // Guardamos los cambios en la base de datos
      await this.roomsRepository.saveRoom(room);
      await this.reservationsRepository.saveReservation(reservation);

      // Podrías incluir aquí lógica adicional, como enviar notificaciones al usuario.

      return {
        message: 'Payment processed and reservation confirmed successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        `Error processing reservation: ${error.message}`,
      );
    }
  }
}
