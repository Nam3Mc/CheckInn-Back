import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { Account } from '../entities/accounts.entity';
import { EmailService } from '../commons/nodemailer.service';

@Module({
  imports: [TypeOrmModule.forFeature([User,Account])], 
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService,UsersRepository, EmailService],
})
export class UsersModule {}
