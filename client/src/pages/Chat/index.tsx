import { useState, useEffect, useRef, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import React from "react";
import { setTokenInAxios } from "../../utils/axios";
import { MessageType, User } from "../../types/types";
import Message from "../../components/chat/Message";
import ChatList from "../../components/ChatList";
import { ChatIcon } from "../../icons";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const MemoizedMessage = React.memo(Message);
const Chat = () => {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [receiver, setReceiver] = useState<User | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesContainerRef.current?.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  }, []);
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3001");

      socketRef.current.on("receivePrivateMessage", (message: MessageType) => {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      });
    }

    setTokenInAxios();
    const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
    if (currentUser?.username) {
      setUser(currentUser);
      socketRef.current.emit("setUsername", currentUser.username);
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [scrollToBottom]);

  useEffect(() => {
    if (user && receiver) {
      socketRef.current?.emit("getChatHistory", {
        sender: user.username,
        receiver: receiver.username,
      });

      socketRef.current?.on("chatHistory", (history: MessageType[]) => {
        setMessages(history);
        scrollToBottom();
      });

      return () => {
        socketRef.current?.off("chatHistory");
      };
    }
  }, [receiver, scrollToBottom, user]);

  const sendMessage = useCallback(() => {
    if (user && newMessage && receiver) {
      const message: MessageType = {
        sender: user.username,
        receiver: receiver.username,
        message: newMessage,
        timeSent: new Date().toLocaleString("en-US"),
      };
      socketRef.current?.emit("sendPrivateMessage", message);

      setMessages((prev) => [...prev, message]);
      setNewMessage("");
      scrollToBottom();
    }
  }, [newMessage, receiver, scrollToBottom, user]);

  const addEmoji = (emoji: { native: string }) => {
    setNewMessage((prev) => prev + emoji.native);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-row">
      <div className="flex-2 h-screen pt-16 overflow-y-auto">
        <ChatList me={user} setReceiver={setReceiver} />
      </div>
      {receiver ? (
        <div className="flex-1 h-screen pt-14 flex flex-col bg-white dark:bg-zinc-800">
          <div className="p-4 border-b dark:border-zinc-600 flex items-center gap-3">
            <img
              src={`../../src/assets/${receiver.image}`}
              className="rounded-full h-9 w-9"
              alt={receiver.name}
            />
            <h5 className="text-gray-800 dark:text-gray-50">{receiver.name}</h5>
          </div>
          <div
            ref={messagesContainerRef}
            className="messages-container flex-grow p-4 overflow-y-scroll"
          >
            {messages.map((msg, index) => (
              <MemoizedMessage
                key={index}
                me={user?.username === msg.sender}
                user={user?.username === msg.sender ? user : receiver}
                message={msg}
                showAvatar={
                  index === 0 || messages[index - 1].sender !== msg.sender
                }
              />
            ))}
          </div>
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
                className="w-full p-2 rounded bg-gray-50 dark:bg-zinc-700 dark:text-gray-300"
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
        </div>
      ) : (
        <div className="flex-1 h-screen flex flex-col justify-center items-center dark:bg-zinc-800">
          <h1 className="text-white text-3xl">Please select your Friend</h1>
          <ChatIcon />
        </div>
      )}
    </div>
  );
};

export default Chat;
