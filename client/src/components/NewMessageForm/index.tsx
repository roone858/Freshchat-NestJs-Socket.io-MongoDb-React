import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { MessageType, User } from "../../types/types";
import { MutableRefObject, useCallback, useRef, useState } from "react";
import { Socket } from "socket.io-client";
const NewMessageForm = ({
  friend,
  user,
  socketRef,
  setMessages,
  setLastMessages,
  scrollToBottom,
}: {
  friend: User;
  user: User | null;
  socketRef: MutableRefObject<Socket | null>; 
  setMessages: (updater: (prevMessages: MessageType[]) => MessageType[]) => void; 
  setLastMessages: (updater: (prevMessages: MessageType[]) => MessageType[]) => void; 
  scrollToBottom: () => void; 
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const updateLastMessages = (
    prev: MessageType[],
    newMessage: MessageType
  ): MessageType[] => {
    const filteredMessages = prev.filter((msg) => msg !== null);

    const existingIndex = filteredMessages.findIndex(
      (msg: MessageType) =>
        msg.sender === newMessage.sender || msg.receiver === newMessage.sender
    );

    if (existingIndex !== -1) {
      const updatedMessages = [...filteredMessages];
      updatedMessages[existingIndex] = newMessage;
      return updatedMessages;
    } else {
      return [...filteredMessages, newMessage];
    }
  };

  const sendMessage = useCallback(() => {
    if (user && newMessage && friend) {
      const message: MessageType = {
        sender: user.username,
        receiver: friend.username,
        message: newMessage,
        timeSent: new Date().toLocaleString("en-US"),
      };
      socketRef.current?.emit("sendPrivateMessage", message);

      setMessages((prev: MessageType[]) => [...prev, message]);
      setLastMessages((prev: MessageType[]) =>
        updateLastMessages(prev, message)
      );

      setNewMessage("");
      scrollToBottom();
    }
  }, [
    user,
    newMessage,
    friend,
    socketRef,
    setMessages,
    setLastMessages,
    scrollToBottom,
  ]);

  const addEmoji = (emoji: { native: string }) => {
    setNewMessage((prev) => prev + emoji.native);
    inputRef.current?.focus();
  };
  return (
    <div className="p-6 border-t dark:border-zinc-700 relative">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <input
          ref={inputRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          type="text"
          className="w-full border-0 focus:outline-violet-500 outline-none focus:border-0 p-2 rounded bg-gray-50 dark:bg-zinc-700 dark:text-gray-400"
          placeholder="Enter Message..."
        />
        {showEmojiPicker && (
          <div className="absolute bottom-12 right-0 z-50">
            <Picker data={data} onEmojiSelect={addEmoji} />
          </div>
        )}
        <button
          type="button"
          className="p-2 bg-transparent hover:bg-violet-600 text-xl rounded-full"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          😀
        </button>
        <button
          type="submit"
          className="py-2 px-3 text-white bg-violet-500 hover:bg-violet-600 rounded"
        >
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
};

export default NewMessageForm;
