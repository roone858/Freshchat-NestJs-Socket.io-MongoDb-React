import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UsersService } from 'src/users/users.service';
import { NotFoundException, Logger } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UsersService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    this.logger.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket): Promise<void> {
    this.logger.log(`Client disconnected: ${client.id}`);

    try {
      const user = await this.userService.findUserBySocketId(client.id);
      if (!user) return;

      await this.userService.updateUserSocketAndLastSeen(client.id, null);
      this.server.emit('userOffline', user.username);
    } catch (error) {
      this.logger.error('Error handling disconnect:', error);
    }
  }

  @SubscribeMessage('setUsername')
  async handleSetUsername(
    @MessageBody() username: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const user = await this.userService.findByUsername(username);
      if (!user) throw new NotFoundException('User not found');

      await this.userService.updateUserSocket(user.username, client.id);

      client.broadcast.emit('userOnline', {
        username: user.username,
        socketId: client.id,
      });

      this.logger.log(
        `Client ${username} connected with Socket ID: ${client.id}`,
      );
    } catch (error) {
      this.logger.error(`Error in handleSetUsername: ${error.message}`);
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('sendPrivateMessage')
  async handlePrivateMessage(
    @MessageBody() data: { sender: string; receiver: string; message: string },
  ): Promise<void> {
    try {
      const receiver = await this.userService.findByUsername(data.receiver);
      await this.chatService.saveMessage(
        data.sender,
        data.receiver,
        data.message,
      );

      if (receiver?.socketId) {
        this.server.to(receiver.socketId).emit('receivePrivateMessage', {
          receiver: data.receiver,
          sender: data.sender,
          message: data.message,
          timeSent: new Date().toISOString(),
        });
      } else {
        this.logger.warn(`Client ${data.receiver} is offline`);
      }
    } catch (error) {
      this.logger.error(`Error sending private message: ${error.message}`);
    }
  }

  @SubscribeMessage('getChatHistory')
  async handleGetChatHistory(
    @MessageBody() data: { sender: string; receiver: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const messages = await this.chatService.getMessages(
        data.sender,
        data.receiver,
      );
      client.emit('chatHistory', messages);
    } catch (error) {
      this.logger.error(`Error fetching chat history: ${error.message}`);
    }
  }

  @SubscribeMessage('getLastMessages')
  async handleGetLastMessages(
    @MessageBody() username: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const users = await this.userService.getAllUsersExcept(username);
      const lastMessages = await Promise.all(
        users.map((user) =>
          this.chatService.getLastMessage(username, user.username),
        ),
      );

      client.emit(
        'lastMessages',
        lastMessages.filter((msg) => msg !== null),
      );
    } catch (error) {
      this.logger.error(`Error fetching last messages: ${error.message}`);
    }
  }
}
