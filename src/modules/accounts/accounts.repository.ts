import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../entities/accounts.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../commons/cloudinary.service';

@Injectable()
export class AccountsRepository {

  constructor(
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async findOne(id: string): Promise<Account> {
    const account = await this.accountsRepository.findOne({
      where: { id },
      relations: ['user', 'reservation_', 'comments', 'inbox'],
    });
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

  async findAccounts(): Promise<Account[]> {
    return this.accountsRepository.find({
      relations: ['user', 'reservation_', 'comments', 'inbox'],
      select: {
        user: {
          id: true,
          email: true,
          name: true,
          phone: true,
        },
      },
    });
  }

  async savePicture(file: Express.Multer.File): Promise<string> {
    const image = (await this.cloudinaryService.uploadImage(file)).url
    return image
  }

}
