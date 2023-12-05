// chat/schemas/message.schema.ts
import * as mongoose from 'mongoose';

export const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  timeSent: { type: String, required: true },
  message: { type: String, required: true },
  receiver: { type: String, required: true },
});
