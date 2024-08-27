import { Injectable } from '@nestjs/common';
import { InboxRepository } from './inbox.repository';
import { Inbox } from '../entities/inbox.entity';

@Injectable()
export class InboxService {
  constructor(private readonly inboxRepository: InboxRepository) {}

  async saveMessage(
    message: string,
    senderId: string,
    receiverId: string,
  ): Promise<Inbox> {
    return this.inboxRepository.saveMessage(message, senderId, receiverId);
  }

  async getMessagesByAccount(accountId: string): Promise<Inbox[]> {
    return this.inboxRepository.getMessagesByAccount(accountId);
  }
}
