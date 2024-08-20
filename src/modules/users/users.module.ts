import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './user.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService,UsersRepository],
})
export class UsersModule {}
