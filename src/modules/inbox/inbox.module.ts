import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inbox } from '../entities/inbox.entity';
import { InboxController } from './inbox.controller';
import { InboxRepository } from './inbox.repository';
import { InboxService } from './inbox.service';

@Module({
  imports: [TypeOrmModule.forFeature([Inbox])],
  controllers: [InboxController],
  providers: [ChatGateway, InboxRepository, InboxService],
  exports: [InboxService],
})
export class inboxModule {}
