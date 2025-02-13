import React, { MutableRefObject } from "react";
import { MessageType, User } from "../../types/types";
import Message from "../../components/chat/Message";

const MemoizedMessage = React.memo(Message);

const MessagesContainer = ({
  messages,
  friend,
  user,
  messagesContainerRef,
}: {
  messages: MessageType[];
  friend: User;
  messagesContainerRef: MutableRefObject<HTMLDivElement | null>;
  user: User | null;
}) => {
  return (
    <div
      ref={messagesContainerRef}
      className="messages-container flex-grow p-6 overflow-y-scroll"
    >
      {messages.map((msg, index) => (
        <MemoizedMessage
          key={index}
          me={user?.username === msg.sender}
          user={user?.username === msg.sender ? user : friend}
          message={msg}
          showAvatar={index === 0 || messages[index - 1].sender !== msg.sender}
        />
      ))}
    </div>
  );
};

export default MessagesContainer;
