import { useState, useEffect, useRef, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import { setTokenInAxios } from "../../utils/axios";
import { MessageType, User } from "../../types/types";
import ChatList from "../../components/ChatList";
import { ChatIcon } from "../../icons";

import ChatHeader from "../../components/ChatHeader";
import MessagesContainer from "../../components/MessagesContainer";
import NewMessageForm from "../../components/NewMessageForm";
import usersService from "../../services/users.service";
const Chat = () => {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [user, setUser] = useState<User | null>(null);
  const [friend, setFriend] = useState<User | null>(null);
  const [lastMessages, setLastMessages] = useState<MessageType[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const handleLastMessages = (messages: MessageType[]) => {
    setLastMessages(messages);
    console.log(lastMessages);
  };

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
      setUser(currentUser);
      const fetchUsers = async () => {
        try {
          const res = await usersService.getUsers();
          if (res) {
            setUsers(res);
          }
        } catch (error) {
          console.error("Failed to fetch users:", error);
        }
      };

      fetchUsers();

      // ✅ Listen for online users
      const handleUserOnline = (onlineUser: {
        username: string;
        socketId: string;
      }) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.username === onlineUser.username
              ? { ...user, socketId: onlineUser.socketId }
              : user
          )
        );
      };
      const handleReceiveMessage = (message: MessageType) => {
        console.log(message);
        console.log(friend);
        if (
          friend?.username === message.sender ||
          friend?.username === message.receiver
        )
          setMessages((prev) => [...prev, message]);
        setLastMessages((prev) => {
          const filteredMessages = prev.filter((msg) => msg !== null);
          const existingIndex = filteredMessages.findIndex(
            (msg) =>
              msg.sender === message.sender || msg.receiver === message.sender
          );
          if (existingIndex !== -1) {
            const updatedMessages = [...filteredMessages];
            updatedMessages[existingIndex] = message;
            return updatedMessages;
          } else {
            return [...filteredMessages, message];
          }
        });
        scrollToBottom();
      };

      socketRef.current.emit("setUsername", currentUser.username);
      socketRef.current.on("userOnline", handleUserOnline);
      socketRef.current?.emit("getLastMessages", currentUser.username);
      socketRef.current?.on("lastMessages", handleLastMessages);
      socketRef.current?.on("receivePrivateMessage", handleReceiveMessage);
    }

    return () => {
      socketRef.current?.off("userOnline");
      socketRef.current?.off("lastMessages");
      socketRef.current?.off("receivePrivateMessage");
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [friend]);

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
      socketRef.current?.on("chatHistory", handleHistory);

      return () => {
        socketRef.current?.off("chatHistory", handleHistory);
      };
    }
  }, [friend, user, scrollToBottom]);

  return (
    <div className="flex flex-row lg:flex h-screen relative">
      <div className="flex-2  overflow-y-auto bg-[#303841] pt-4">
        <h5 className="px-5 mb-4 text-16 dark:text-gray-50 font-semibold">
          Recent
        </h5>
        <ChatList
          users={users}
          lastMessages={lastMessages}
          me={user}
          setFriend={setFriend}
        />
      </div>
      {friend ? (
        <div className=" overflow-hidden flex-1  flex flex-col bg-white dark:bg-zinc-800  ">
          <ChatHeader friend={friend} />
          <MessagesContainer
            messagesContainerRef={messagesContainerRef}
            friend={friend}
            user={user}
            messages={messages}
          />
          <NewMessageForm
            friend={friend}
            user={user}
            socketRef={socketRef}
            setLastMessages={setLastMessages}
            setMessages={setMessages}
            scrollToBottom={scrollToBottom}
          />
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
