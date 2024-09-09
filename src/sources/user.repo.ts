import { Injectable } from '@nestjs/common';
import { User } from '../modules/entities/users.entity';
import { CreateUserDto } from 'src/modules/dto/users.dto';
import { Account } from 'src/modules/entities/accounts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountsRepository } from './account.repo';
import { EmailService } from 'src/modules/commons/nodemailer.service';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly accountsRepository: AccountsRepository,
    private readonly emailServices: EmailService,
  ) {}

  async getUsers(): Promise<User[]> {
    const usersList = await this.userRepository.find();
    return usersList;
  }

  async getUserById(id: string): Promise<User> {
    const user: User = await this.userRepository.findOneBy({ id });
    return user;
  }

  async addUser(userDto: CreateUserDto): Promise<Partial<User>> {
    const { name, email, phone, password } = userDto;
    const user = new User();
    const account = new Account();
    user.accounts = [account];
    user.name = name;
    user.email = email;
    user.phone = phone;
    user.password = password;

    const createdAccount = await this.accountsRepository.createAccount(account);
    const createdUser = await this.userRepository.save(user);

    const subject: string = 'Wellcome to Check-Inn we are glad you are here';
    const message: string = `
        Dear ${name} 
        Your Account was created successfuly
        `;
    await this.emailServices.sendRegistrationEmail(
      userDto.email,
      subject,
      message,
    );

    return createdUser;
  }
}
