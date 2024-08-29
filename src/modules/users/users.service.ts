import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountsRepository } from '../accounts/accounts.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { Account } from '../entities/accounts.entity';
import { privateDecrypt } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Account) private accountRepository: Repository<Account>,
  ) {}

  async addUserService(
    user: Partial<User>,
  ): Promise<Omit<User, 'roll' | 'password'>> {
    const newUser = await this.userRepository.save(user);

    const { roll, password, ...userWithoutSensitiveInfo } = newUser;

    return userWithoutSensitiveInfo;
  }

  async getUsersService(page: number, limit: number): Promise<User[]> {
    const users = await this.userRepository.find();
    const start = (page - 1) * limit;
    const end = start + limit;
    return users.slice(start, end);
  }

  async getUsersByEmailService(
    email: string,
    options?: { relations: string[] },
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      ...options,
    });
    return user || null;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  async deleteUserService(id: string): Promise<{ message: string }> {
    // Verifica si existen cuentas relacionadas antes de eliminar
    const accounts = await this.accountRepository.find({
      where: { user: { id } },
    });
    if (accounts.length > 0) {
      // Elimina las cuentas relacionadas
      await this.accountRepository.remove(accounts);
    } else {
      return { message: 'User not found' };
    }

    // Luego elimina el usuario
    await this.userRepository.delete(id);

    return { message: 'User deleted successfully' };
  }
}
