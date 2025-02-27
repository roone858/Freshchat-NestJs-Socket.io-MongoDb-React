export interface MessageType {
  sender: string;
  timeSent: string;
  message: string;
  receiver: string;
}
export interface User {
  userId: string;
  name: string;
  username: string;
  image: string;
  socketId: string | null;
  lastSeen: Date;
}
