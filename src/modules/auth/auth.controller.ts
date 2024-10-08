import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '../dto/users.dto';
import { sensitiveInfoInterceptor } from '../users/interceptors/sensitive-info/sensitive-info.interceptor';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { BadRequestException } from '@nestjs/common';
import axios from 'axios';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  

  // @Post('/login-google')
  // async loginGoogleController(@Body() body: { accessToken: string }) {
  //   if (!body.accessToken) {
  //     throw new UnauthorizedException('Acces token required');
  //   }

  //   return this.authService.loginWithGoogleService(body.accessToken)

  // }
  

  @Post('/login-google')
  async loginGoogleController(@Body() body: { email: string }) {
    if (!body.email) {
      throw new UnauthorizedException('Register with google first token required');
    }

    return this.authService.loginWithGoogleService(body.email)

  }


  @Post('/register-google')
  async registerGoogleController(
    @Body() body: { name: string; email: string; phone?: string },
  ) {
    if (!body.name || !body.email) {
      throw new BadRequestException('Name and email are required');
    }
  
    try {
      // Verificar si el usuario ya está registrado
      const existingUser = await this.usersService.getUsersByEmailService(body.email);
      if (existingUser) {
        // Si ya está registrado, devolver el usuario existente
        return existingUser; // O devolver algún token de autenticación si es necesario
      }
  
      // Si no está registrado, proceder con el registro
      return this.authService.registerWithGoogle(body);
    } catch (error) {
      throw new BadRequestException('Error registering user with Google');
    }
  }
  
  @Post('/signUp')
  @UseInterceptors(sensitiveInfoInterceptor)
  async signUpController(@Body() user: CreateUserDto) {
    if (!user.email || !user.password) {
      throw new BadRequestException('Email and password are required');
    }
    return this.authService.signUpService(user);
  }

  @Post('/login')
  async loginController(
    @Body() body: { email: string; password: string; phone: number },
  ) {
    if (!body.email || !body.password || body.phone === undefined) {
      throw new BadRequestException(
        'Email, password, and phone number are required',
      );
    }
    return this.authService.signInService(
      body.email,
      body.password,
      body.phone,
    );
  }

  @Post('resetpassword')
  async resetPassword(@Body() body: { email: string }) {
    if (!body.email) {
      throw new BadRequestException('Email is required');
    }
    return this.authService.resetPassword(body.email);
  }
}
