import { Injectable } from '@nestjs/common';
import { Roll, User } from '../entities/users.entity';
import { UsersService } from '../users/users.service';
import { BadRequestException } from '@nestjs/common';
import { Account } from '../entities/accounts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../commons/nodemailer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly emailService: EmailService,
  ) {}

  async signUpService(user: Partial<User>) {
    const { email, password } = user;

    try {
      const foundUser = await this.userService.getUsersByEmailService(email, {
        relations: ['accounts'],
      });

      if (foundUser) {
        throw new BadRequestException('User already registered');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Crea un nuevo usuario
      const newUser = (await this.userService.addUserService({
        ...user,
        password: hashedPassword,
        roll: Roll.GUEST,
      })) as User;

      // Crea una nueva cuenta asociada al usuario
      const newAccount = this.accountsRepository.create({
        user: newUser,
      });
      const savedAccount = await this.accountsRepository.save(newAccount);

      newUser.roll = Roll.USER;
      await this.usersRepository.save(newUser);

      await this.emailService.sendRegistrationEmail(
        newUser.email,
        'Bienvenido a nuestra aplicación',
        'Gracias por registrarte en nuestra aplicación.',
      );

      // Incluye el ID de la cuenta en el usuario retornado
      return {
        ...newUser,
        accountId: savedAccount.id,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; // Relanzar la excepción personalizada
      } else {
        throw new BadRequestException('An unexpected error occurred'); // Manejo general de errores
      }
    }
  }

  async signInService(email: string, password: string, phone: number) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    if (!password) {
      throw new BadRequestException('Password is required');
    }
    if (phone === undefined) {
      // phone puede ser 0, por eso comparo con undefined
      throw new BadRequestException('Phone number is required');
    }

    // Busca al usuario por email, incluyendo la relación con Account
    const foundUser = await this.userService.getUsersByEmailService(email, {
      relations: ['accounts'],
    });

    if (!foundUser) {
      throw new BadRequestException('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(password, foundUser.password);
    if (!validPassword) {
      throw new BadRequestException('Invalid credentials');
    }

    // if (foundUser.phone !== phone) {
    //   throw new BadRequestException('Invalid credentials');
    // }

    // Incluye el ID de la cuenta en la respuesta
    const accountId = foundUser.accounts?.[0]?.id; // Asumiendo que el usuario tiene al menos una cuenta

    const payLoad = {
      id: foundUser.id,
      email: foundUser.email,
      phone: foundUser.phone,
    };
    const token = this.jwtService.sign(payLoad);

    return {
      message: 'User logged in successfully',
      user: {
        ...foundUser,
      },
      token,
    };
  }
}
