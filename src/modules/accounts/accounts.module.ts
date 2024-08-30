import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { AccountsRepository } from './accounts.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../entities/accounts.entity';
import { CloudinaryConfig } from 'src/config/cloudinary';
import { CloudinaryService } from '../commons/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  controllers: [AccountsController],
  providers: [
    AccountsService,
    AccountsRepository,
    CloudinaryConfig,
    CloudinaryService,
  ],
  exports: [AccountsRepository],
})
export class accountsModule {}
