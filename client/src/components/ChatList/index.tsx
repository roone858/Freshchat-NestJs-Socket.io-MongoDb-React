import { useMemo } from "react";
import ChatListItem from "../ChatListItem";
import { MessageType, User } from "../../types/types";
import React from "react";

const ItemMemo = React.memo(ChatListItem);

const ChatList = ({
  me,
  lastMessages,
  setFriend,
  users,
}: {
  users: User[];
  lastMessages: MessageType[];
  me: User | null;
  setFriend: (user: User) => void;
}) => {
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const lastMsgA = lastMessages.find(
        (msg) => msg.sender === a.username || msg.receiver === a.username
      );
      const lastMsgB = lastMessages.find(
        (msg) => msg.sender === b.username || msg.receiver === b.username
      );

      const timeA = lastMsgA ? new Date(lastMsgA.timeSent).getTime() : 0;
      const timeB = lastMsgB ? new Date(lastMsgB.timeSent).getTime() : 0;

      return timeB - timeA;
    });
  }, [users, lastMessages]);

  const getLastMessage = (user: User) => {
    if (!Array.isArray(lastMessages)) return "no messages yet";
    const messageObj = lastMessages.find(
      (message) =>
        message?.sender === user.username || message?.receiver === user.username
    );
    if (!messageObj) return "no messages yet";

    const senderLabel =
      messageObj.sender === me?.username ? "You" : user.name.split(" ")[0];
    return `${senderLabel}: ${messageObj.message}`;
  };

  return (
    <ul>
      {sortedUsers?.map(
        (user, index) =>
          me?.username !== user.username && (
            <div key={index} onClick={() => setFriend(user)}>
              <ItemMemo lastMessage={getLastMessage(user)} user={user} />
            </div>
          )
      )}
    </ul>
  );
};

export default ChatList;
