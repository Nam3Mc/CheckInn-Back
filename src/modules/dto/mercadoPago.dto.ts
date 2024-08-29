import { IsNotEmpty, IsNumber, IsString, IsEmail } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  transaction_amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  payment_method_id: string;

  @IsEmail()
  @IsNotEmpty()
  payer_email: string; // Ajusta el campo para coincidir con el DTO y el servicio
}
