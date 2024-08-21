import { IsEmail, IsNotEmpty, IsOptional, IsString, IsBoolean, IsEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string; 

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsBoolean()
  @IsEmpty()
  isAdmin?: boolean = false; // Cambiado a @IsOptional() y @IsBoolean()
}
