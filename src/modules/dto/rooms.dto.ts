import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RoomsDto {
  @IsNotEmpty()
  @IsNumber()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  beds: number;

  @IsNotEmpty()
  @IsNumber()
  baths: number;

  @IsNotEmpty()
  @IsString()
  photos: string;

  @IsNotEmpty()
  @IsNumber()
  capacity: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
