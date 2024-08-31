import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/modules/entities/accounts.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountsRepository {
  constructor(
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
  ) {}

  async createAccount(account: Account): Promise<Account> {
    const newAccount = await this.accountsRepository.save(account);
    return newAccount;
  }

  async getAccounts(): Promise<Account[]> {
    const accounts: Account[] = await this.accountsRepository.find({
      relations: ['reservation_', 'comments', 'inbox'],
    });
    return accounts;
  }

  async getAccountById(id: string): Promise<Account> {
    const account = await this.accountsRepository.findOne({
      where: { id },
      relations: ['reservation_', 'comments', 'inbox'],
    });
    return account;
  }
}