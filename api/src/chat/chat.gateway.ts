import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { MessageType } from './interfaces/message.interface';

export interface User {
  userId: string;
  userName: string;
}

export interface Message {
  user: User;
  timeSent: string;
  message: string;
  to: string;
}

// Interface for when server emits events to clients.
export interface ServerToClientEvents {
  chat: (e: Message) => void;
}

// Interface for when clients emit events to the server.
export interface ClientToServerEvents {
  chat: (e: Message) => void;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}
  @WebSocketServer() server: Server = new Server<
    ServerToClientEvents,
    ClientToServerEvents
  >();
  private logger = new Logger('ChatGateway');

  @SubscribeMessage('getMessages')
  async handleGetMessages(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const messages = await this.chatService.getMessages(username);
      socket.emit('messages', messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() message: MessageType, // Adjust the type based on your actual type
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      // Save the message to the database or perform any necessary logic
      await this.chatService.saveMessage(message);

      // Broadcast the message to the sender and receiver
      socket.emit('messageSent', message);
      socket.to(message.receiver).emit('messageReceived', message);
      return message;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
  @SubscribeMessage('chat')
  async handleEvent(
    @MessageBody()
    payload: MessageType,
  ): Promise<MessageType> {
    this.logger.log(payload);
    this.chatService.saveMessage(payload);
    this.server.emit('chat', payload); // broadcast messages
    return payload;
  }
}
