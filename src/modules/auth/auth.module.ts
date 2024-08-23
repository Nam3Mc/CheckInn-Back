import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';


@Module({
  imports:[UsersModule,TypeOrmModule.forFeature([User])],
  exports:[AuthService],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
