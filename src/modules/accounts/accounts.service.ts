import { Injectable } from '@nestjs/common';
import { AccountsRepository } from './accounts.repository';
import { Account } from '../entities/accounts.entity';

@Injectable()
export class AccountsService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  async getAllAccounts(): Promise<Account[]> {
    return this.accountsRepository.findAccounts();
  }

  async getAccountById(id: string): Promise<Account | null> {
    return this.accountsRepository.findOne(id);
  }

  async addPicture(
    accountId: string,
    file: Express.Multer.File,
  ): Promise<Account> {
    const photoUrl = await this.accountsRepository.savePicture(file);
    return this.accountsRepository.updateAccountPhoto(accountId, photoUrl);
  }
}
