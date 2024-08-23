import { Injectable } from '@nestjs/common';
import { User } from '../entities/users.entity';
import { UsersService } from '../users/users.service';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async signUpService(user: Partial<User>) {
    const { email, password } = user;
    
    try {
      const foundUser = await this.userService.getUsersByEmailService(email);

      if (foundUser) {
        throw new BadRequestException('User already registered');
      }

      return await this.userService.addUserService({ ...user, password });
    } catch (error) {
      console.error('Error during sign-up:', error.message);
      throw error;
    }
  }
  async signInService(email: string, password: string) {
    // Busca al usuario por email, incluyendo la relación con Account
    const foundUser = await this.userService.getUsersByEmailService(email, { relations: ['accounts'] });

    if (!foundUser) {
      throw new BadRequestException('User not found');
    }

    // Comparación directa de las contraseñas
    if (foundUser.password !== password) {
      throw new BadRequestException('Invalid password');
    }

    // Elimina las propiedades sensibles como password y roll antes de devolver el usuario
    const { password: _, roll, ...userWithoutSensitiveInfo } = foundUser;

    return {
      message: 'User logged in successfully',
      user: userWithoutSensitiveInfo,
    };
  }
}