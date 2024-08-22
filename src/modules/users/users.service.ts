import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
  @InjectRepository(User) private userRepository:Repository<User>
  ) {}


  async addUserService(user: Partial<User>): Promise<Omit<User, 'roll' | 'password'>> {
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

    
    async getUsersByEmailService(email: string, options?: { relations: string[] }): Promise<User | undefined> {
      return this.userRepository.findOne({
        where: { email },
        ...options,
      });
    }
  
  
  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  async deleteUserService(id: string): Promise<{ message: string }> {
    const result = await this.userRepository.delete(id);
    return result ? { message: 'User Deleted' } : { message: 'User not found' };
  }
}
