import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MercadoPagoDto {
  @IsNumber()
  @IsNotEmpty()
  transaction_amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  reservationId: string; // ID de la reserva, si aplica
}
