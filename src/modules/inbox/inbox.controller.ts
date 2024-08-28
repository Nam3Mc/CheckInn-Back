import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { InboxService } from './inbox.service';
import { CreateMessageDto } from '../dto/inbox.dto';

@Controller('inbox')
export class InboxController {
  constructor(private readonly inboxService: InboxService) {}

  @Post('send')
  async sendMessage(@Body() createMessageDto: CreateMessageDto) {
    const { message, senderId, receiverId } = createMessageDto;
    return this.inboxService.saveMessage(message, senderId, receiverId);
  }

  @Get('messages/:accountId')
  async getMessagesByAccount(@Param('accountId') accountId: string) {
    return this.inboxService.getMessagesByAccount(accountId);
  }
}
