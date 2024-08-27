import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Account } from '../entities/accounts.entity';
import { sensitiveInfoInterceptor } from '../users/interceptors/sensitive-info/sensitive-info.interceptor';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ACCOUNTS')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  //excluir informacion sensible
  async getAllAccounts(): Promise<Account[]> {
    return this.accountsService.getAllAccounts();
  }

  @Get(':id')
  //excluir informacion sensible
  async getAccountById(@Param('id') id: string): Promise<Account> {
    return this.accountsService.getAccountById(id);
  }
}
