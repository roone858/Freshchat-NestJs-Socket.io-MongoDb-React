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
import logo from "../../assets/logo.svg";
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
    <div className="flex flex-row lg:flex">
      <div className="sidebar-menu w-full lg:w-[75px] shadow lg:flex lg:flex-col flex flex-row justify-between items-center fixed lg:relative z-40 bottom-0 bg-white dark:bg-zinc-600 ">
        <div className=" lg:my-5 lg:block">
          <a href="index.html" className="block dark:hidden">
            <span>
              <img src={logo} alt="" className="h-[30px]" />
            </span>
          </a>

          <a href="index.html" className="hidden dark:block">
            <span>
              <img src={logo} alt="" className="h-[30px]" />
            </span>
          </a>
        </div>
        {/* <!-- end navbar-brand-box -->
    
    
        <!-- Start side-menu nav -->
        <!-- Tabs --> */}
        <div className="w-full mx-auto lg:my-auto">
          <ul
            id="tabs"
            className="flex flex-row justify-center w-full lg:flex-col lg:flex nav-tabs dark:text-violet-100/80"
          >
            <li className="flex-grow lg:flex-grow-0">
              <a
                id="default-tab"
                href="#first"
                className="tab-button flex relative items-center justify-center mx-auto h-14 w-14 leading-[14px] group/tab my-2 rounded-lg"
              >
                <div className="absolute items-center hidden -top-10 ltr:left-0 group-hover/tab:flex rtl:right-0">
                  <div className="absolute -bottom-1 left-[40%] w-3 h-3 rotate-45 bg-black"></div>
                  <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded shadow-lg">
                    Profile
                  </span>
                </div>
                <i className="text-2xl ri-user-2-line"></i>
              </a>
            </li>
            <li className="flex-grow lg:flex-grow-0">
              <a
                href="#second"
                className="tab-button active relative flex items-center justify-center mx-auto h-14 w-14 leading-[14px] group/tab my-2 rounded-lg"
              >
                <div className="absolute items-center hidden -top-10 ltr:left-0 group-hover/tab:flex rtl:right-0">
                  <div className="absolute -bottom-1 left-[40%] w-3 h-3 rotate-45 bg-black"></div>
                  <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded shadow-lg">
                    Chats
                  </span>
                </div>
                <i className="text-2xl ri-message-3-line"></i>
              </a>
            </li>
            <li className="flex-grow lg:flex-grow-0">
              <a
                href="#third"
                className="tab-button relative flex items-center justify-center mx-auto h-14 w-14 leading-[14px] group/tab my-2 rounded-lg"
              >
                <div className="absolute items-center hidden -top-10 ltr:left-0 group-hover/tab:flex rtl:right-0">
                  <div className="absolute -bottom-1 left-[40%] w-3 h-3 rotate-45 bg-black"></div>
                  <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded shadow-lg">
                    Groups
                  </span>
                </div>
                <i className="text-2xl ri-group-line"></i>
              </a>
            </li>
            <li className="flex-grow lg:flex-grow-0">
              <a
                href="#fourth"
                className="tab-button relative flex items-center justify-center mx-auto h-14 w-14 leading-[14px] group/tab my-2 rounded-lg"
              >
                <div className="absolute items-center hidden -top-10 ltr:left-0 group-hover/tab:flex rtl:right-0">
                  <div className="absolute -bottom-1 left-[40%] w-3 h-3 rotate-45 bg-black"></div>
                  <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded shadow-lg">
                    Contacts
                  </span>
                </div>
                <i className="text-2xl ri-contacts-line"></i>
              </a>
            </li>
            <li className="flex-grow lg:flex-grow-0">
              <a
                href="#fifth"
                className="tab-button relative flex items-center justify-center mx-auto h-14 w-14 leading-[14px] group/tab my-2 rounded-lg"
              >
                <div className="absolute items-center hidden -top-10 ltr:left-0 group-hover/tab:flex rtl:right-0">
                  <div className="absolute -bottom-1 left-[40%] w-3 h-3 rotate-45 bg-black"></div>
                  <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded shadow-lg">
                    Settings
                  </span>
                </div>
                <i className="text-2xl ri-settings-2-line"></i>
              </a>
            </li>
          </ul>
        </div>

        <div className="w-20 my-5 lg:w-auto">
          <ul className="lg:block">
            <li className="hidden text-center light-dark-mode nav-item lg:block">
              <a href="#" className="hidden dark:block dark:text-violet-100/80">
                <i className="text-2xl ri-sun-line "></i>
              </a>
              <a href="#" className="block text-gray-500 dark:hidden">
                <i className="text-2xl ri-moon-clear-line"></i>
              </a>
            </li>

            <li className="relative lg:mt-4 dropdown lg:dropup">
              <a
                href="#"
                className="dropdown-toggle"
                id="dropdownButton2"
                data-bs-toggle="dropdown"
              >
                <img
                  src={`../../src/assets/${user?.image}`}
                  alt=""
                  className="w-10 h-10 p-1 mx-auto rounded-full bg-gray-50 dark:bg-zinc-700"
                />
              </a>

              <ul
                className="absolute z-40 hidden float-left w-40 py-2 mx-4 mb-12 text-left list-none bg-white border-none rounded-lg shadow-lg dropdown-menu bg-clip-padding dark:bg-zinc-700"
                aria-labelledby="dropdownButton2"
              >
                <li>
                  <a
                    className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/30 dark:text-gray-100 dark:hover:bg-zinc-600/50 ltr:text-left rtl:text-right"
                    href="#"
                  >
                    Profile{" "}
                    <i className="text-gray-500 rtl:float-left ltr:float-right ri-profile-line text-16"></i>
                  </a>
                </li>
                <li>
                  <a
                    className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/30 dark:text-gray-100 dark:hover:bg-zinc-600/50 ltr:text-left rtl:text-right"
                    href="#"
                  >
                    Setting{" "}
                    <i className="text-gray-500 rtl:float-left ltr:float-right ri-settings-3-line text-16"></i>
                  </a>
                </li>
                <li>
                  <a
                    className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/30 dark:text-gray-100 dark:hover:bg-zinc-600/50 ltr:text-left rtl:text-right"
                    href="auth-lock-screen.html"
                  >
                    Lock Screen{" "}
                    <i className="text-gray-500 rtl:float-left ltr:float-right ri-git-repository-private-line text-16"></i>
                  </a>
                </li>
                <li className="my-2 border-b border-gray-100/20"></li>
                <li>
                  <a
                    className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/30 dark:text-gray-100 dark:hover:bg-zinc-600/50 ltr:text-left rtl:text-right"
                    href="auth-login.html"
                  >
                    Log out{" "}
                    <i className="text-gray-500 rtl:float-left ltr:float-right ri-logout-circle-r-line text-16"></i>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
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
