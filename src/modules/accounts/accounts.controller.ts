import { Controller, Get, Param } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Account } from '../entities/accounts.entity';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  async getAllAccounts(): Promise<Account[]> {
    return this.accountsService.getAllAccounts();
  }

  @Get(':id')
  async getAccountById(@Param('id') id: string): Promise<Account> {
    return this.accountsService.getAccountById(id);
  }
}
