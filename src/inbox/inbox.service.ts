import { Injectable } from '@nestjs/common';
import { CreateInboxDto } from './dto/create-inbox.dto';
import { UpdateInboxDto } from './dto/update-inbox.dto';

@Injectable()
export class InboxService {
  create(createInboxDto: CreateInboxDto) {
    return 'This action adds a new inbox';
  }

  findAll() {
    return `This action returns all inbox`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inbox`;
  }

  update(id: number, updateInboxDto: UpdateInboxDto) {
    return `This action updates a #${id} inbox`;
  }

  remove(id: number) {
    return `This action removes a #${id} inbox`;
  }
}
