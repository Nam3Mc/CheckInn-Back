import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository, User } from './user.repository';

@Injectable()
export class UsersService {

  constructor( private readonly usersRepository: UsersRepository ){}


  createUser(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async getUsersService(page: number, limit: number): Promise<User[]> {
    return this.usersRepository.getUsers(page, limit);
  }


  async getUsersByEmailService(email:string):Promise<User | null>{
    const user = await this.usersRepository.getUserByEmail(email)

    if (!user ){
     throw new BadRequestException ("User doens´t exists")
    }
    return user 
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async deleteUserService(id: number): Promise<{ message: string }> {
    const result = await this.usersRepository.deleteUser(id);
    return result ? { message: 'User Deleted' } : { message: 'User not found' };
  }
}
