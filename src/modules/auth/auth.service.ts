import { Injectable } from '@nestjs/common';
import { User } from '../entities/users.entity';
import { UsersService } from '../users/users.service';
import { BadRequestException } from '@nestjs/common';
import { Account } from '../entities/accounts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  
 
  async signUpService(user: Partial<User>) {
    const { email, password } = user;
  
    try {
      const foundUser = await this.userService.getUsersByEmailService(email, { relations: ['accounts'] });
  
      if (foundUser) {
        throw new BadRequestException('User already registered');
      }
  
      // Crea un nuevo usuario
      const newUser = await this.userService.addUserService({
        ...user,
        password,
      });
  
      // Crea una nueva cuenta asociada al usuario
      const newAccount = this.accountsRepository.create({
        user: newUser,
      });
      const savedAccount = await this.accountsRepository.save(newAccount);
  
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
  

  async signInService(email: string, password: string) {
    // Busca al usuario por email, incluyendo la relación con Account
    const foundUser = await this.userService.getUsersByEmailService(email, {
      relations: ['accounts'],
    });

    if (!foundUser) {
      throw new BadRequestException('User not found');
    }

    // Comparación directa de las contraseñas
    if (foundUser.password !== password) {
      throw new BadRequestException('Invalid password');
    }

    return {
      message: 'User logged in successfully',
    };
  }
}
