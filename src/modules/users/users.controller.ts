import {
  UseGuards,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/users.dto';
import { Query } from '@nestjs/common';
import { sensitiveInfoInterceptor } from './interceptors/sensitive-info/sensitive-info.interceptor';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt/jwt.guard';

@ApiTags('USERS')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  //  @UseGuards(JwtGuard)
  //@UseInterceptors(sensitiveInfoInterceptor)
  getUsersController(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    if (page && limit) {
      return this.usersService.getUsersService(page, limit);
    }
    return this.usersService.getUsersService(1, 3);
  }

  @Post()
  addUserController(@Body() user: CreateUserDto) {
    const { passwordConfirmation, ...cleanUser } = user;
    return this.usersService.addUserService(cleanUser);
  }

  @Get(':email')
  @UseGuards(JwtGuard)
  @UseInterceptors(sensitiveInfoInterceptor)
  findOne(@Param('email') email: string) {
    return this.usersService.getUsersByEmailService(email);
  }

  // //pendiente
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  deleteUserController(@Param('id') id: string) {
    return this.usersService.deleteUserService(id);
  }
}
