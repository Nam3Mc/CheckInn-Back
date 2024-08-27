import { Controller, Get, Param, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Account } from '../entities/accounts.entity';
import { sensitiveInfoInterceptor } from '../users/interceptors/sensitive-info/sensitive-info.interceptor';
import { Rolls } from 'src/decorators/rolls.decorator';
import { Roll } from '../entities/users.entity';
import { RollsGuard } from 'src/guards/rolls.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ACCOUNTS')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  @Rolls(Roll.ADMIN)
  @UseGuards(RollsGuard)
  //excluir informacion sensible
  async getAllAccounts(): Promise<Account[]> {
    return this.accountsService.getAllAccounts();
  }

  @Get(':id')
  @Rolls(Roll.ADMIN, Roll.USER)
  @UseGuards(RollsGuard)
  //excluir informacion sensible
  async getAccountById(@Param('id') id: string): Promise<Account> {
    return this.accountsService.getAccountById(id);
  }

  @Post("picture")
  @Rolls(Roll.ADMIN, Roll.USER)
  @UseGuards(RollsGuard)
  @UseInterceptors(FileInterceptor("picture"))
  addProfilePicture(@UploadedFiles() file: Express.Multer.File ) {
    return this.accountsService.addPicture(file)
  }


}
