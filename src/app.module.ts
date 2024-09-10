import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './modules/users/users.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { accountsModule } from './modules/accounts/accounts.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoomService } from './modules/rooms/rooms.service';
import { TestModule } from './sources/general.module';
import { JwtModule } from '@nestjs/jwt';
import { inboxModule } from './modules/inbox/inbox.module';
import { MercadoPagoModule } from './modules/MercadoPago/mercadoPago.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [typeorm] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('typeorm'),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src', 'roomsPhotos'),
      serveRoot: '/roomsPhotos',
    }),
    UsersModule,
    RoomsModule,
    AuthModule,
    ReservationsModule,
    accountsModule,
    TestModule,
    inboxModule,
    MercadoPagoModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly roomService: RoomService) {}
  async onModuleInit() {
    await this.seedData();
  }
  private async seedData() {
    await this.roomService.seedRooms();
  }
}
