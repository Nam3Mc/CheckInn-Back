import { Module } from '@nestjs/common';
import { InboxService } from './inbox.service';
import { InboxController } from './inbox.controller';

@Module({
  controllers: [InboxController],
  providers: [InboxService],
})
export class InboxModule {}
