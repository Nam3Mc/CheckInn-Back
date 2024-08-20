import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './src/users/users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { CommentsModule } from './comments/comments.module';
import { ReservationsModule } from './reservations/reservations.module';
import { RoomsModule } from './rooms/rooms.module';
import { InboxModule } from './inbox/inbox.module';
import { AmenitiesModule } from './amenities/amenities.module';
import { InboxModule } from './inbox/inbox.module';

@Module({
  imports: [UsersModule, AccountsModule, CommentsModule, ReservationsModule, RoomsModule, InboxModule, AmenitiesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
