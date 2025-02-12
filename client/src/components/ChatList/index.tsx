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
  me: User;
  setReceiver: (user: User) => void;
}) => {
  const [users, setUsers] = useState<User[]>();

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await usersService.getUsers();
      setUsers(res);
    };
    fetchUsers();
  }, [users]);
  const getLastMessage = (user: User) => {
    if (!Array.isArray(lastMessages)) return undefined;
    const messageObj = lastMessages.find(
      (message) =>
        message?.sender === user.username || message?.receiver === user.username
    );
    if (!messageObj) return undefined;

    const senderLabel =
      messageObj.sender === me.username ? "You" : user.name.split(" ")[0];
    return `${senderLabel}: ${messageObj.message}`;
  };
  return (
    <ul>
      {users?.map(
        (user, index) =>
          me.username != user.username && (
            <div key={index} onClick={() => setReceiver(user)}>
              <ItemMemo lastMessage={getLastMessage(user)} user={user} />
            </div>
          )
      )}
    </ul>
  );
};

export default ChatList;
