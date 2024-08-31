import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/modules/entities/accounts.entity';
import { Reservation } from 'src/modules/entities/reservations.entity';
import { Room } from 'src/modules/entities/rooms.entity';
import { User } from 'src/modules/entities/users.entity';
// import { TestControler } from './general.controler';
// import { ReservationsRepository } from './reservations.repo';
import { AccountsRepository } from './account.repo';
import { UsersRepository } from './user.repo';
import { RoomsRepository } from './rooms.repo';
import { EmailService } from 'src/modules/commons/nodemailer.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Reservation, Account, Room])],
  exports: [],
  // controllers: [TestControler],
  providers: [
    // ReservationsRepository,
    AccountsRepository,
    UsersRepository,
    RoomsRepository,
    EmailService,
  ],
})
export class TestModule {}