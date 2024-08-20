import {
  IsNotEmpty,
  IsString,
  IsEmail,
  Matches,
  MaxLength,
  Validate,
  MinLength,
  IsNumber,
  IsEmpty,
  IsOptional
} from 'class-validator';


import { MatchPassword } from 'src/decorators/matchPassword.decorator';
export class CreateUserDto {

  
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  @MinLength(8)
  @MaxLength(15)
  password: string;

  @IsNotEmpty()
  @Validate(MatchPassword, ['password'])
  passwordConfirmation: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  city?: string;
}
