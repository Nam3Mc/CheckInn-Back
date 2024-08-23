import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreateReservationDto {
  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  checkin: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  checkout: Date;

  @IsNotEmpty()
  @IsString()
  accountId: string;

  @IsNotEmpty()
  @IsString()
  roomId: string;

  @IsNotEmpty()
  @IsNumber()
  nights: number;

  @IsOptional()
  @IsNumber()
  guests?: number;
}

export class ReservationResponseDto {
  @IsString()
  id: string;

  @IsNumber()
  price?: number;

  @IsBoolean()
  status?: boolean;

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
