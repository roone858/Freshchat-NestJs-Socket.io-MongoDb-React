import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './interfaces/message.interface';

@Injectable()
export class ChatService {
  constructor(@InjectModel('Message') private messageModel: Model<Message>) {}

  // حفظ رسالة جديدة في MongoDB
  async saveMessage(
    sender: string,
    receiver: string,
    message: string,
  ): Promise<Message> {
    const newMessage = new this.messageModel({ sender, receiver, message });
    return newMessage.save();
  }

  // استرجاع محادثة بين شخصين
  async getMessages(sender: string, receiver: string): Promise<Message[]> {
    return await this.messageModel
      .find({
        $or: [
          { sender, receiver },
          { sender: receiver, receiver: sender },
        ],
      })
      .sort({ timeSent: 1 }) // 1 للترتيب تصاعدي (الأقدم أولًا) و -1 للأحدث أولًا
      .exec();
  }
}
