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
  const [friend, setFriend] = useState<User | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [lastMessages, setLastMessages] = useState<MessageType[]>([]);

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
    }

    setTokenInAxios();
    const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
    if (currentUser?.username) {
      socketRef.current.emit("getLastMessages", currentUser.username);

      const handleLastMessages = (messages: MessageType[]) => {
        setLastMessages(messages);
        console.log(messages);
      };

      socketRef.current.on("lastMessages", handleLastMessages);
      setUser(currentUser);
      socketRef.current.emit("setUsername", currentUser.username);
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current?.off("lastMessages");
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (user && friend) {
      socketRef.current?.emit("getChatHistory", {
        sender: user.username,
        receiver: friend.username,
      });

      const handleHistory = (history: MessageType[]) => {
        setMessages(history);
        scrollToBottom();
      };
      const handleMessage = (message: MessageType) => {
        if (friend?.username === message.sender)
          setMessages((prev) => [...prev, message]);
        setLastMessages((prev) => {
          // تنظيف المصفوفة من القيم null
          const filteredMessages = prev.filter((msg) => msg !== null);
  
          // البحث عن الرسالة القديمة لتحديثها
          const existingIndex = filteredMessages.findIndex(
            (msg) =>
              msg.sender === message.sender || msg.receiver === message.sender
          );
  
          if (existingIndex !== -1) {
            // تحديث الرسالة القديمة
            const updatedMessages = [...filteredMessages];
            updatedMessages[existingIndex] = message;
            return updatedMessages;
          } else {
            // إضافة الرسالة إذا لم تكن موجودة
            return [...filteredMessages, message];
          }
        });
        scrollToBottom();
      };

      socketRef.current?.on("chatHistory", handleHistory);
      socketRef.current?.on("receivePrivateMessage", handleMessage);

      return () => {
        socketRef.current?.off("chatHistory", handleHistory);
        socketRef.current?.off("receivePrivateMessage", handleMessage);
      };
    }
  }, [friend, user, scrollToBottom]);

  const sendMessage = useCallback(() => {
    if (user && newMessage && friend) {
      const message: MessageType = {
        sender: user.username,
        receiver: friend.username,
        message: newMessage,
        timeSent: new Date().toLocaleString("en-US"),
      };
      socketRef.current?.emit("sendPrivateMessage", message);

      setMessages((prev) => [...prev, message]);
      setLastMessages((prev) => {
        // تنظيف المصفوفة من القيم null
        const filteredMessages = prev.filter((msg) => msg !== null);

        // البحث عن الرسالة القديمة لتحديثها
        const existingIndex = filteredMessages.findIndex(
          (msg) =>
            msg.sender === message.sender || msg.receiver === message.sender
        );

        if (existingIndex !== -1) {
          // تحديث الرسالة القديمة
          const updatedMessages = [...filteredMessages];
          updatedMessages[existingIndex] = message;
          return updatedMessages;
        } else {
          // إضافة الرسالة إذا لم تكن موجودة
          return [...filteredMessages, message];
        }
      });

      setNewMessage("");
      scrollToBottom();
    }
  }, [newMessage, friend, scrollToBottom, user]);

  const addEmoji = (emoji: { native: string }) => {
    setNewMessage((prev) => prev + emoji.native);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-row">
      <div className="flex-2 h-screen pt-16 overflow-y-auto">
        <ChatList
          lastMessages={lastMessages}
          me={user}
          setReceiver={setFriend}
        />
      </div>
      {friend ? (
        <div className="flex-1 h-screen pt-14 flex flex-col bg-white dark:bg-zinc-800">
          <div className="p-4 border-b dark:border-zinc-600 flex items-center gap-3">
            <img
              src={`../../src/assets/${friend.image}`}
              className="rounded-full h-9 w-9"
              alt={friend.name}
            />
            <h5 className="text-gray-800 dark:text-gray-50">{friend.name}</h5>
          </div>
          <div
            ref={messagesContainerRef}
            className="messages-container flex-grow p-4 overflow-y-scroll"
          >
            {messages.map((msg, index) => (
              <MemoizedMessage
                key={index}
                me={user?.username === msg.sender}
                user={user?.username === msg.sender ? user : friend}
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
