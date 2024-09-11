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

  @Post('/login-google')
  async loginGoogleController(@Body() body: { accessToken: string }) {
    if (!body.accessToken) {
      throw new UnauthorizedException('Access token required');
    }

    try {
      // Verifica el token de acceso con Google y obtén la información del usuario
      const response = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${body.accessToken}`);
      const { email } = response.data;

      if (!email) {
        throw new UnauthorizedException('Google token invalid');
      }

      // Llama al servicio de autenticación con el email obtenido
      return this.authService.loginWithGoogleService(email);

    } catch (error) {
      console.error('Error verifying Google access token:', error);
      throw new UnauthorizedException('Google login failed');
    }
  }


  // @Post('/login-googgle')
  // async loginGoogleController(@Body() body: { accessToken: string }) {
  //   if (!body.accessToken) {
  //     throw new UnauthorizedException('Acces token required');
  //   }

  //   return this.authService.loginWithGoogleService(body.accessToken)

  // }


  @Post('/register-google')
  async registerGoogleController(
    @Body() body: { name: string; email: string; phone?: string },
  ) {
    if (!body.name || !body.email) {
      throw new BadRequestException('Name and email are required');
    }
    return this.authService.registerWithGoogle(body);
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
