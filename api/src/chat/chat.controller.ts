// chat/chat.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessageType } from './interfaces/message.interface'; // Update this import
import { ChatGateway } from './chat.gateway';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Get('messages/:username')
  async getMessages(
    @Param('username') username: string,
  ): Promise<MessageType[]> {
    return this.chatService.getMessages(username);
  }

  @Post('send')
  async sendMessage(@Body() message: MessageType): Promise<MessageType> {
    const savedMessage = await this.chatService.saveMessage(message);
    this.chatGateway.server.emit('message', savedMessage);
    return savedMessage;
  }
}
