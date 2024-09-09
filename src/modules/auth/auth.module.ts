import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { Account } from '../entities/accounts.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt-strategy.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from '../commons/nodemailer.service';
import { AccountsRepository } from '../accounts/accounts.repository';
import { CloudinaryService } from '../commons/cloudinary.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Usa la clave secreta aquí si usas HS256
      
        signOptions: { 
          expiresIn: '1h',
          algorithm: 'HS256', // Asegúrate de que esto esté configurado si usas RS256
        },
      }),
    }),
    ConfigModule,
    UsersModule,
    TypeOrmModule.forFeature([User, Account]),
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, EmailService, AccountsRepository, CloudinaryService],
})
export class AuthModule {}
