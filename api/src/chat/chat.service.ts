// chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageType } from './interfaces/message.interface'; // Update this import

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<MessageType>,
  ) {}

  async saveMessage(message: MessageType): Promise<MessageType> {
    const newMessage = new this.messageModel(message);
    return newMessage.save();
  }

  async getMessages(username: string): Promise<MessageType[]> {
    return this.messageModel
      .find({ $or: [{ sender: username }, { receiver: username }] })
      .exec();
  }
}
