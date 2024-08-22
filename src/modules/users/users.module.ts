import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], 
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService,UsersRepository],
})
export class UsersModule {}
