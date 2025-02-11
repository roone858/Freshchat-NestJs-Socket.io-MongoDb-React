import { setTokenInAxios } from "../../utils/axios";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { MessageType, User } from "../../types/types";
import Message from "../../components/chat/Message";
import ChatList from "../../components/ChatList";
import React from "react";
import { ChatIcon } from "../../icons";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
const MemoizedMessage = React.memo(Message);
const socket = io("http://localhost:3001");

const Chat = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [receiver, setReceiver] = useState<User | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    console.log(messages);
    setTokenInAxios();
    const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
    if (currentUser?.username) {
      setUser(currentUser);
      socket.emit("setUsername", currentUser.username);
    }

    socket.on("receivePrivateMessage", (message: MessageType) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    return () => {
      socket.off("receivePrivateMessage");
    };
  }, []);

  useEffect(() => {
    if (user && receiver) {
      socket.emit("getChatHistory", {
        sender: user.username,
        receiver: receiver.username,
      });

      socket.on("chatHistory", (history: MessageType[]) => {
        setMessages(history);
        scrollToBottom();
      });

      return () => {
        socket.off("chatHistory");
      };
    }
  }, [receiver, user]);

  const sendMessage = async () => {
    if (user && newMessage && receiver) {
      const message: MessageType = {
        sender: user.username,
        receiver: receiver.username,
        message: newMessage,
        timeSent: new Date().toLocaleString("en-US"),
      };
      socket.emit("sendPrivateMessage", message);
      setMessages((prev) => [...prev, message]); // عرض الرسالة مباشرة
      setNewMessage("");
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    }, 100);
  };
  const addEmoji = (emoji: any) => {
    setNewMessage((prev) => prev + emoji.native);
    inputRef.current?.focus(); // إعادة تركيز المؤشر على حقل الإدخال
  };

  return (
    <div className="flex flex-row">
      <div className="flex-2 h-screen pt-16 overflow-y-auto">
        <ChatList receiver={receiver} setReceiver={setReceiver} />
      </div>
      {receiver ? (
        <div className="flex-1 h-screen pt-14 flex flex-col bg-white dark:bg-zinc-800">
          <div className="p-4 border-b dark:border-zinc-600">
            <div className="flex items-center gap-3">
              <img
                src={`../../src/assets${receiver.image}`}
                className="rounded-full h-9 w-9"
                alt=""
              />
              <h5 className="text-gray-800 dark:text-gray-50">
                {receiver.name}
              </h5>
            </div>
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
          <div className="p-6 border-t dark:border-zinc-700">
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
                <div className="absolute bottom-12 right-0 bottom-20 z-50">
                  <Picker data={data} onEmojiSelect={addEmoji} />
                </div>
              )}
              <button
                type="button"
                className="p-2 bg-violet-300 bg-transparent  hover:bg-violet-600 text-xl rounded-full"
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
