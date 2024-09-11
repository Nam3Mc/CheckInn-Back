// app.gateway.ts
import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { InboxService } from './modules/inbox/inbox.service';
import { CreateMessageDto } from './modules/dto/inbox.dto';

@WebSocketGateway()
export class AppGateway {
  constructor(private readonly inboxService: InboxService) {}

  @SubscribeMessage('sendMessage')
  async handleSendMessage(@MessageBody() createMessageDto: CreateMessageDto, @ConnectedSocket() client: Socket) {
    const { message, senderId, receiverId } = createMessageDto;
    await this.inboxService.saveMessage(message, senderId, receiverId);
    client.broadcast.emit('receiveMessage', createMessageDto);
  }
}
