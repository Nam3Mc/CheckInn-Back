import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/users.dto';
import { sensitiveInfoInterceptor } from '../users/interceptors/sensitive-info/sensitive-info.interceptor';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}


  @Post('register-google')
  async registerWithGoogle (@Body() googleUserData:any){
    const {name,email,phone} = googleUserData;
    
    const user = await this.usersService.createUserFromGoogle({
      name,
      email,
      phone,
    });
    return user
  }

  @Post('/signUp')
  @UseInterceptors(sensitiveInfoInterceptor)
  signUpController(@Body() user: CreateUserDto) {
    return this.authService.signUpService(user);
  }
  
  @Post('/login')
  loginController(
    @Body() body: { email: string; password: string; phone: number },
  ) {
    return this.authService.signInService(
      body.email,
      body.password,
      body.phone,
    );
  }

  @Post("resetpassword")
  resetPassword(@Body()  email: string ) {
    return this.authService.resertPassword(email)
  }
}
