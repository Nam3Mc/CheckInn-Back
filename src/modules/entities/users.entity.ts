import { Column, Entity, OneToMany, PrimaryGeneratedColumn, } from 'typeorm';
import { Account } from './accounts.entity';
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
} from 'class-validator';
import { MatchPassword } from 'src/decorators/matchPassword.decorator';

export enum Roll {
  ADMIM = 'admin',
  GUEST = 'guest',
  USER = 'user',
}

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: Roll.GUEST })
  roll: Roll;

  @Column({ length: 50, nullable: false })
  name: string;

  @Column({ length: 50, nullable: false })
  email: string;

  @Column({ length: 50, nullable: false })
  phone: number;

  @IsString()
  @Matches(
    /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,15}$/,
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

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];
}