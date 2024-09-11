import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Roll, User } from '../entities/users.entity';
import { UsersService } from '../users/users.service';
import { Account } from '../entities/accounts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../commons/nodemailer.service';
import { AccountsRepository } from '../accounts/accounts.repository';
import { accountCreated } from 'src/sources/emails';

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
    private readonly accountRepo: AccountsRepository,
  ) {}

  async registerWithGoogle(user: Partial<User>): Promise<User> {
    try {
      if (!user.name || !user.email) {
        throw new BadRequestException('Name and email are required');
      }

      // Verifica si el usuario ya existe en la base de datos
      const existingUser = await this.userService.getUsersByEmailService(
        user.email,
      );
      if (existingUser) {
        throw new BadRequestException('User already registered');
      }

      // Crea el usuario en la base de datos local usando la función createUserFromGoogle
      const newUser = await this.userService.createUserFromGoogle({
        name: user.name,
        email: user.email,
        phone: user.phone,
        roll: Roll.USER,
      });

      // Crea la nueva cuenta asociada al usuario
      const newAccount = this.accountsRepository.create({
        user: newUser,
      });
      const savedAccount = await this.accountsRepository.save(newAccount);

      // Asigna el accountId al nuevo usuario y guarda los cambios
      newUser.accounts = [savedAccount];
      await this.usersRepository.save(newUser);

      // Enviar correo de bienvenida
      const subject: string = 'Welcome to Check-Inn';

      const message = accountCreated(newUser);
      await this.emailService.sendRegistrationEmail(
        newUser.email,
        subject,
        message,

 //     const htmlContent = accountCreated(newUser);
   //   await this.emailService.sendRegistrationEmail(
     //   newUser.email,
       // subject,

      );

      return newUser; // Devolviendo el nuevo usuario con la cuenta creada
    } catch (error) {
      console.error('Error in registerWithGoogle:', error);
      throw new BadRequestException('Error registering user with Google');
    }
  }


  async loginWithGoogleService(email: string) {

   // async loginWithGoogleService(
  //  email: string,
 //  ): Promise<{ accessToken: string }> {

    try {
      if (!email) {
        throw new BadRequestException('Email is required');
      }

      // Busca al usuario en la base de datos por el correo electrónico
      const user = await this.userService.getUsersByEmailService(email, {
        relations: ['accounts'],
      });
      if (!user) {
        throw new UnauthorizedException('User not registered with Google');
      }

      // Genera un token JWT
      const payload = {
        email: user.email,
        id: user.id,
      };
      const accessToken = this.jwtService.sign(payload);

      return {
        message: 'Google user logged succesfully',
        user: { ...user },
        accessToken,
      };
    } catch (error) {
      console.error('Error in loginWithGoogleService:', error);
      throw new UnauthorizedException('Error logging in with Google');
    }
  }

  async signUpService(user: Partial<User>) {
    const { email, password } = user;

    try {
      if (!email || !password) {
        throw new BadRequestException('Email and password are required');
      }

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
        roll: Roll.USER,
      })) as User;

      const newAccount = this.accountsRepository.create({
        user: newUser,
      });
      const savedAccount = await this.accountsRepository.save(newAccount);

      newUser.roll = Roll.USER;
      await this.usersRepository.save(newUser);

      const subject: string = 'Welcome to Check-Inn';

      const message = accountCreated(newUser);
      await this.emailService.sendRegistrationEmail(
        newUser.email,
        subject,

      //const htmlContent = accountCreated(newUser);
      //await this.emailService.sendRegistrationEmail(
       // newUser.email,
       // subject,
       // htmlContent,

      );

      return {
        ...newUser,
        accountId: savedAccount.id,
      }; // Crea una nueva cuenta asociada al usuario
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; // Relanzar la excepción personalizada
      } else {
        console.error('Unexpected error in signUpService:', error);
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
      throw new BadRequestException('Phone number is required');
    }

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

    const accountId = foundUser.accounts?.[0]?.id;

    const payload = {
      id: foundUser.id,
      email: foundUser.email,
      phone: foundUser.phone,
      roll: Roll.GUEST,
    };
    const token = this.jwtService.sign(payload);

    return {
      message: 'User logged in successfully',
      user: { ...foundUser },
      token,
    };
  }

  async resetPassword(email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    return this.userService.resetPassword(email);
  }
}
