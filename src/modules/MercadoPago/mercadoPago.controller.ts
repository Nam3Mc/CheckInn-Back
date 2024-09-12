import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { MercadoPagoService } from './mercadoPago.service';
import { MercadoPagoDto } from '../dto/mercadoPago.dto';
import { ReservationStatus } from '../entities/reservations.entity';
import { ReservationsService } from '../reservations/reservations.service';
import { Response } from 'express';

export interface PaymentNotification {
  id: string;
  status: string;
}

@Controller('mercadopago')
export class MercadoPagoController {
  constructor(
    private readonly mercadoPagoService: MercadoPagoService,
    private readonly reservationsService: ReservationsService,
  ) {}

  @Post('create')
  // @Rolls(Roll.USER, Roll.ADMIN)
  // @UseGuards(AuthGuard, RollsGuard)
  async createPayment(@Body() paymentData: MercadoPagoDto) {
    const preference =
      await this.mercadoPagoService.createPaymentPreference(paymentData);
    return preference;
  }

  @Post('complete-payment/:reservationId')
  // @Rolls(Roll.USER, Roll.ADMIN)
  // @UseGuards(AuthGuard, RollsGuard)
  async completePayment(
    @Param('reservationId') reservationId: string,
    @Body() body: { transaction_amount: number; description: string },
    @Res() res: Response,
  ) {
    try {
      const { transaction_amount, description } = body;
      const { init_point } =
        await this.mercadoPagoService.createPaymentPreference({
          reservationId,
          transaction_amount,
          description,
        });

      res.status(HttpStatus.OK).json({ init_point });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Post('notification')
  async handlePaymentNotification(
    @Body() notificationData: any,
    @Res() res: Response,
  ) {
    try {
      const { id, status, external_reference } = notificationData;

      if (!id || !status || !external_reference) {
        throw new BadRequestException('Missing required notification data');
      }

      const reservationId = external_reference;

      switch (status) {
        case 'approved':
          await this.mercadoPagoService.updateReservationStatus(
            reservationId,
            ReservationStatus.PAID,
          );
          break;
        case 'pending':
          await this.mercadoPagoService.updateReservationStatus(
            reservationId,
            ReservationStatus.PENDING,
          );
          break;
        case 'rejected':
          await this.mercadoPagoService.updateReservationStatus(
            reservationId,
            ReservationStatus.CANCELLED,
          );
          break;
        default:
          console.warn(`Unhandled payment status: ${status}`);
      }

      // Responder a MercadoPago con un 200 para confirmar recepción
      res
        .status(HttpStatus.OK)
        .json({ message: 'Notification processed successfully' });
    } catch (error) {
      // Log de errores detallados y respuesta con un mensaje claro
      console.error('Error processing payment notification:', error);
      res.status(HttpStatus.BAD_REQUEST).json({
        message: `Error processing payment notification: ${error.message}`,
      });
    }
  }
}
