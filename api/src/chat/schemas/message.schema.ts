// chat/schemas/message.schema.ts
import * as mongoose from 'mongoose';

export const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  timeSent: { type: Date, default: Date.now }, // ⏰ إضافة الوقت تلقائيًا عند إنشاء الرسالة
  message: { type: String, required: true },
  receiver: { type: String, required: true },
});
