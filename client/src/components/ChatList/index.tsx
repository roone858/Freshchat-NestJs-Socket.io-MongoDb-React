import { useEffect, useState } from "react";
import ChatListItem from "../ChatListItem";
import usersService from "../../services/users.service";
import { MessageType, User } from "../../types/types";
import React from "react";
const ItemMemo = React.memo(ChatListItem);
const ChatList = ({
  me,
  lastMessages,
  setReceiver,
}: {
  lastMessages: MessageType[];
  me: User | null;
  setReceiver: (user: User) => void;
}) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = users.length ? users : await usersService.getUsers();
        if (!res) return;

        // ترتيب المستخدمين فور تحميل البيانات
        const sortedUsers = [...res].sort((a, b) => {
          const lastMsgA = lastMessages.find(
            (msg) => msg.sender === a.username || msg.receiver === a.username
          );
          const lastMsgB = lastMessages.find(
            (msg) => msg.sender === b.username || msg.receiver === b.username
          );

          const timeA = lastMsgA ? new Date(lastMsgA.timeSent).getTime() : 0;
          const timeB = lastMsgB ? new Date(lastMsgB.timeSent).getTime() : 0;

          return timeB - timeA; // ترتيب تنازلي حسب الأحدث
        });

        setUsers(sortedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, [lastMessages]);

  const getLastMessage = (user: User) => {
    if (!Array.isArray(lastMessages)) return undefined;
    const messageObj = lastMessages.find(
      (message) =>
        message?.sender === user.username || message?.receiver === user.username
    );
    if (!messageObj) return "no message yet";

    const senderLabel =
      messageObj.sender === me?.username ? "You" : user.name.split(" ")[0];
    return `${senderLabel}: ${messageObj.message}`;
  };

  return (
    <ul>
      {users?.map(
        (user, index) =>
          me?.username != user.username && (
            <div key={index} onClick={() => setReceiver(user)}>
              <ItemMemo lastMessage={getLastMessage(user)} user={user} />
            </div>
          )
      )}
    </ul>
  );
};

export default ChatList;
