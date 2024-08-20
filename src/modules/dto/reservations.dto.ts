import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsBoolean()
  status: boolean;

  @IsNotEmpty()
  @IsDate()
  checkin: Date;

  @IsNotEmpty()
  @IsDate()
  checkout: Date;

  @IsNotEmpty()
  @IsString()
  accountId: string;

  @IsNotEmpty()
  @IsString()
  roomId: string;
  @IsOptional()
  @IsNumber()
  guests?: number;
}

export class ReservationResponseDto {
  @IsString()
  id: string;

  @IsNumber()
  price: number;

  @IsBoolean()
  status: boolean;

  @IsDate()
  checkin: Date;

  @IsDate()
  checkout: Date;

  @IsString()
  accountId: string;

  @IsString()
  roomId: string;

  @IsOptional()
  @IsNumber()
  guests?: number;
}

export class UpdateReservationDto extends PartialType(CreateReservationDto) {}
