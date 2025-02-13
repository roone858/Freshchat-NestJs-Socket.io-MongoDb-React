import { useState, useEffect, useRef, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import { setTokenInAxios } from "../../utils/axios";
import { MessageType, User } from "../../types/types";
import ChatList from "../../components/ChatList";
import { ChatIcon } from "../../icons";

import logo from "../../assets/logo.svg";
import Dropdown from "../../lib/Popper/Dropdown";
import ChatHeader from "../../components/ChatHeader";
import MessagesContainer from "../../components/MessagesContainer";
import NewMessageForm from "../../components/NewMessageForm";
const Chat = () => {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [friend, setFriend] = useState<User | null>(null);
  const [lastMessages, setLastMessages] = useState<MessageType[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <div className="flex flex-row lg:flex h-screen relative">
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
              ></a>
              <Dropdown
                items={[
                  { label: "Profile", icon: "ri-profile-line" },
                  { label: "Setting", icon: "ri-settings-3-line" },
                  {
                    label: "Lock Screen ",
                    icon: "ri-git-repository-private-line",
                  },
                  { label: "Log out", icon: " ri-logout-circle-r-line" },
                ]}
                button={
                  <img
                    src={`../../src/assets/${user?.image}`}
                    alt=""
                    className="w-10 h-10 p-1 mx-auto shadow-xl  rounded-full bg-gray-50 dark:bg-zinc-800"
                  />
                }
              />
            </li>
          </ul>
        </div>
      </div>

      <div className="flex-2  overflow-y-auto bg-[#303841] pt-4">
        <h5 className="px-5 mb-4 text-16 dark:text-gray-50 font-semibold">
          Recent
        </h5>
        <ChatList
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
