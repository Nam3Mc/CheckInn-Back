import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './modules/users/users.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { AuthModule } from './modules/auth/auth.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { AppService } from './app.service';


@Module({
  imports: [UsersModule,RoomsModule,AuthModule,ReservationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
