import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/users.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signUp')
  signUpController(@Body() user: CreateUserDto) {
    const { passwordConfirmation, ...cleanUser } = user;

    return this.authService.signUpService(cleanUser);
  }

  @Post('/login')
  loginController(@Body() body: { email: string; password: string }) {
    return this.authService.signInService(body.email, body.password);
  }
}
