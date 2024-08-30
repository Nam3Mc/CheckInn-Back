import {
  IsOptional,
  IsNumber,
  IsString,
  IsNumberString,
} from 'class-validator';

export class RoomsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  beds?: number;

  @IsOptional()
  @IsNumber()
  baths?: number;

  @IsOptional()
  @IsString()
  photos?: string;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsNumber()
  price?: number;
}

export class RoomFilterDto {
  @IsOptional()
  @IsNumberString()
  readonly beds?: string;

  @IsOptional()
  @IsNumberString()
  readonly baths?: string;

  @IsOptional()
  @IsNumberString()
  readonly capacity?: string;

  @IsOptional()
  @IsNumberString()
  readonly price?: string;
}
