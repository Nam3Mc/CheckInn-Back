import {
  MaxLength,
  MinLength,
  Validate,
  Matches,
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsString,
  IsEmpty,
  IsOptional,
} from 'class-validator';
import { MatchPassword } from 'src/decorators/matchPassword.decorator';
import { Account } from '../entities/accounts.entity';
import { PickType } from '@nestjs/mapped-types';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

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
  @MinLength(8)
  phone: number;

  @IsOptional()
  accounts?: Account[];
}

export class LoginUserDto extends PickType(CreateUserDto, [
  'email',
  'password',
] as const) {}
