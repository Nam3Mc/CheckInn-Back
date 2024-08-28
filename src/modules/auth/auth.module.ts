import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { Account } from '../entities/accounts.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailService } from '../commons/nodemailer.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([User, Account])],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
})
export class AuthModule {}
