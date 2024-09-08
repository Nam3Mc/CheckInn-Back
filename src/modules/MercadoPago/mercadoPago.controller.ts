import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { MercadoPagoService } from './mercadoPago.service';
import { MercadoPagoDto } from '../dto/mercadoPago.dto';
import { ReservationStatus } from '../entities/reservations.entity';
import { ReservationsService } from '../reservations/reservations.service';
import { Response } from 'express';
import { Rolls } from 'src/decorators/rolls.decorator';
import { RollsGuard } from 'src/guards/rolls.guard';
import { Roll } from '../entities/users.entity';

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
  @Rolls(Roll.USER, Roll.ADMIN)
  @UseGuards(RollsGuard)
  async createPayment(@Body() paymentData: MercadoPagoDto) {
    const preference =
      await this.mercadoPagoService.createPaymentPreference(paymentData);
    return preference;
  }

  @Post('complete-payment/:reservationId')
  @Rolls(Roll.USER, Roll.ADMIN)
  @UseGuards(RollsGuard)
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
  @Rolls(Roll.USER, Roll.ADMIN)
  @UseGuards(RollsGuard)
  async handlePaymentNotification(@Body() notificationData: any) {
    try {
      const { id, status, external_reference } = notificationData;

      if (!id || !status || !external_reference) {
        throw new BadRequestException('Missing required notification data');
      }

      const reservationId = external_reference;

      if (status === 'approved') {
        await this.mercadoPagoService.updateReservationStatus(
          reservationId,
          ReservationStatus.PAID,
        );
      } else if (status === 'pending') {
        await this.mercadoPagoService.updateReservationStatus(
          reservationId,
          ReservationStatus.PENDING,
        );
      } else if (status === 'rejected') {
        await this.mercadoPagoService.updateReservationStatus(
          reservationId,
          ReservationStatus.CANCELLED,
        );
      } else {
        throw new BadRequestException('Unknown payment status');
      }

      return { message: 'Notification processed successfully' };
    } catch (error) {
      throw new BadRequestException(
        `Error processing payment notification: ${error.message}`,
      );
    }
  }
}
