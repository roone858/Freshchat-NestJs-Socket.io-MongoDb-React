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
import { NotFoundException } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UsersService, // Inject user service
  ) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);

    // Remove the socketId from the user record in the database
    await this.userService.updateUserSocketAndLastSeen(client.id, null);
  }

  @SubscribeMessage('setUsername')
  async handleSetUsername(
    @MessageBody() username: string,
    @ConnectedSocket() client: Socket,
  ) {
    const user = await this.userService.findByUsername(username);

    if (user) {
      // Update the socket ID if the user already exists
      await this.userService.updateUserSocket(user.username, client.id);
    } else {
      throw new NotFoundException('user not found');
      // Create a new user record if they don’t exist
      // await this.userService.createUser(username, client.id);
    }

    console.log(`Client ${username} connected with Socket ID: ${client.id}`);
  }

  @SubscribeMessage('sendPrivateMessage')
  async handlePrivateMessage(
    @MessageBody() data: { sender: string; receiver: string; message: string },
  ) {
    const receiver = await this.userService.findByUsername(data.receiver);

    // Save the message in the database
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
        timeSent: new Date().toLocaleString('en-US'),
      });
    } else {
      console.log(`Client ${data.receiver} is not connected`);
    }
  }

  @SubscribeMessage('getChatHistory')
  async handleGetChatHistory(
    @MessageBody() data: { sender: string; receiver: string },
    @ConnectedSocket() client: Socket,
  ) {
    const messages = await this.chatService.getMessages(
      data.sender,
      data.receiver,
    );
    client.emit('chatHistory', messages);
  }

  @SubscribeMessage('getLastMessages')
  async handleGetLastMessages(
    @MessageBody() username: string,
    @ConnectedSocket() client: Socket,
  ) {
    const users = await this.userService.getAllUsersExcept(username); // إحضار جميع المستخدمين باستثناء المستخدم الحالي

    const lastMessages = await Promise.all(
      users.map(async (user) => {
        const lastMessage = await this.chatService.getLastMessage(
          username,
          user.username,
        );
        return lastMessage;
      }),
    );

    client.emit(
      'lastMessages',
      lastMessages.filter((msg) => msg !== null),
    );
  }
}
