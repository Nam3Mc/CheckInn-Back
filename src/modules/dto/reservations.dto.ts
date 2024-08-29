import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { ReservationStatus } from '../entities/reservations.entity';

export class CreateReservationDto {
  @IsOptional() //revisar
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  checkinDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  checkoutDate: Date;

  @IsNotEmpty()
  @IsString()
  accountId: string;

  @IsNotEmpty()
  @IsString()
  roomId: string;

  @IsOptional()
  @IsNumber()
  guests?: number;

  @IsOptional()
  @IsBoolean()
  hasMinor?: boolean;
}

export class ReservationResponseDto {
  @IsString()
  id: string;

  @IsNumber()
  price?: number;

  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @IsString()
  checkin: string;

  @IsString()
  checkout: string;

  @IsString()
  accountId: string;

  @IsString()
  roomId: string;

  @IsOptional()
  @IsNumber()
  guests?: number;
}

export class UpdateReservationDto extends PartialType(CreateReservationDto) {}
