import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Message } from './interfaces/message.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Endpoint to send a message (Alternative to WebSockets)
  @UseGuards(JwtAuthGuard)
  @Post('send')
  async sendMessage(
    @Req() request: any, // 👈 احصل على المستخدم من الـ request
    // @Param('sender') sender: string,
    @Body() data: { sender: string; receiver: string; message: string },
  ): Promise<Message> {
    const sender = request.user._doc.username;
    return this.chatService.saveMessage(sender, data.receiver, data.message);
  }

  // Get chat history between two users
  @UseGuards(JwtAuthGuard)
  @Get('history/:receiver')
  async getChatHistory(
    @Req() request: any, // 👈 احصل على المستخدم من الـ request
    // @Param('sender') sender: string,
    @Param('receiver') receiver: string,
  ): Promise<Message[]> {
    const sender = request.user._doc.username;
    return this.chatService.getMessages(sender, receiver);
  }
}
