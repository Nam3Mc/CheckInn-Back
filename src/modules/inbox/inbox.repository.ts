import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inbox } from '../entities/inbox.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InboxRepository {
  @InjectRepository(Inbox)
  private readonly inboxRepositoy: Repository<Inbox>;

  async saveMessage(
    message: string,
    senderId: string,
    receiverId: string,
  ): Promise<Inbox> {
    const inboxMessage = this.inboxRepositoy.create({
      message,
      sender: { id: senderId },
      receiver: { id: receiverId },
    });
    return await this.inboxRepositoy.save(inboxMessage);
  }

  async getMessagesByAccount(accountId: string): Promise<Inbox[]> {
    return await this.inboxRepositoy.find({
      where: [{ sender: { id: accountId } }, { receiver: { id: accountId } }],
      relations: ['sender', 'receiver'],
      order: { createdAt: 'ASC' },
    });
  }
}
