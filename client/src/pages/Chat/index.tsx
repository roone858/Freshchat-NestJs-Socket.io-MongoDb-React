import { setTokenInAxios } from "../../utils/axios";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { MessageType, User } from "../../types/types";
import Message from "../../components/chat/Message";
import ChatList from "../../components/ChatList";
import React from "react";
import { ChatIcon } from "../../icons";
import chatService from "../../services/chat.service";
const MemoizedMessage = React.memo(Message);

const socket = io("http://localhost:3001");
const Chat = () => {
  //   const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState<string>();
  const [user, setUser] = useState<User>();
  const [receiver, setReceiver] = useState<User>();
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTokenInAxios();
    const currentUser = JSON.parse(sessionStorage.getItem("user") || "");
    if (currentUser) {
      setUser(currentUser);
    }

    socket.on("connect", () => {
      //  setIsConnected(true);
    });

    socket.on("disconnect", () => {
      //  setIsConnected(false);
    });
    socket.on("disconnect", () => {
      //  setIsConnected(false);
    });
    // socket.emit("getMessages", user?.username);

    // socket.on("messages", (receivedMessages: MessageType[]) => {
    //   const filterMessage = receivedMessages?.filter(
    //     (msg) =>
    //       (msg.receiver == receiver?.username &&
    //         msg.sender == user?.username) ||
    //       (msg.receiver == user?.username && msg.sender == receiver?.username)
    //   );
    //   setMessages(filterMessage);
    // });
    (async () => {
      const messages = await chatService.getMessages(currentUser.username);
      const filterMessage = messages?.filter(
        (msg: MessageType) =>
          (msg.receiver == receiver?.username &&
            msg.sender == user?.username) ||
          (msg.receiver == user?.username && msg.sender == receiver?.username)
      );
      setMessages(filterMessage);
      scrollToBottom();
    })();

    socket.on("chat", (sentMessage) => {
      ((sentMessage.receiver == receiver?.username &&
        sentMessage.sender == user?.username) ||
        (sentMessage.receiver == user?.username &&
          sentMessage.sender == receiver?.username)) &&
        setMessages((messages) => [...messages, sentMessage]);
      scrollToBottom();
    });

    // socket.on("messageReceived", (receivedMessage) => {
    //  setMessages((messages) => [...messages, receivedMessage]);
    //   console.log("Message received:", receivedMessage);
    // });

    // Clean up the event listeners when the component unmounts
    // return () => {
    //   socket.off("messages");
    //   socket.off("messageSent");
    //   socket.off("messageReceived");
    // };

    // socket.on("chat", (e: MessageType) => {
    //   ((e.receiver == receiver?.username && e.sender == user?.username) ||
    //     (e.receiver == user?.username && e.sender == receiver?.username)) &&
    //     setMessages((messages) => [...messages, e]);
    //   scrollToBottom(messagesContainerRef);
    // });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("chat");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiver]);

  const sendMessage = async () => {
    if (user && newMessage && receiver) {
      try {
        const message = {
          sender: user.username,
          timeSent: new Date(Date.now()).toLocaleString("en-US"),
          receiver: receiver?.username,
          message: newMessage,
        };
        socket.emit("chat", message);
      } catch (error) {
        console.error("Error sending message:", error);
      }
      scrollToBottom();
    }

    setNewMessage("");
  };
  const scrollToBottom = () => {
    const timeOut = setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
      return () => clearTimeout(timeOut);
    }, 10);
  };

  return (
    <div className="flex  flex-row">
      <div className="flex-2 h-screen pt-16 overflow-y-auto ">
        <ChatList receiver={receiver} setReceiver={setReceiver} />
      </div>
      {receiver ? (
        <div className="flex-1 h-screen pt-14  relative flex flex-col transition-all duration-150 bg-white user-chat dark:bg-zinc-800 ">
          <div className="p-4 border-b  border-gray-100 lg:p-6 dark:border-zinc-600">
            <div className="grid items-center grid-cols-12">
              <div className="col-span-8 sm:col-span-4">
                {receiver && (
                  <div className="flex items-center gap-3">
                    <div className="rtl:ml-3 ltr:mr-3">
                      <img
                        src={"../../src/assets" + receiver.image}
                        className="rounded-full h-9 w-9 hoverZoomLink"
                        alt=""
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-grow overflow-hidden">
                      <h5 className="mb-0 truncate text-16 ltr:block rtl:hidden">
                        <a href="#" className="text-gray-800 dark:text-gray-50">
                          {receiver.name}
                        </a>{" "}
                        <i className="text-green-500 ltr:ml-1 rtl:mr-1 ri-record-circle-fill text-10 "></i>
                      </h5>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            ref={messagesContainerRef}
            className="messages-container flex-grow  p-4 lg:p-6 overflow-y-scroll"
          >
            {messages?.map((msg, index) =>
              user?.username == msg.sender ? (
                <MemoizedMessage
                  showAvatar={
                    index === 0 || messages[index - 1].sender !== msg.sender
                  }
                  me={user?.username === msg.sender}
                  user={user}
                  key={index}
                  message={msg}
                />
              ) : (
                receiver && (
                  <MemoizedMessage
                    me={user?.username === msg.sender}
                    showAvatar={
                      index === 0 ||
                      messages[index - 1].receiver !== msg.receiver
                    }
                    user={receiver}
                    key={index}
                    message={msg}
                  />
                )
              )
            )}
          </div>
          <div className="z-40 w-full p-6 mb-0  bg-white border-t lg:mb-1 border-gray-50 dark:bg-zinc-800 dark:border-zinc-700">
            <form
              className="flex gap-2"
              action="#"
              method=""
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
            >
              <div className="flex-grow">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  type="text"
                  className="w-full border appearance-none focus:outline-none focus:shadow-outline focus:border-violet-500 p-2 border-transparent focus:border-transparent rounded bg-gray-50 placeholder:text-14 text-14 dark:bg-zinc-700 dark:placeholder:text-gray-300 dark:text-gray-300"
                  placeholder="Enter Message..."
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="py-2 px-3 rounded text-white border-transparent btn bg-violet-500 group-data-[theme-color=green]:bg-green-500 group-data-[theme-color=red]:bg-red-500 hover:bg-violet-600 "
                >
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 h-screen pt-14  relative flex flex-col justify-center items-center dark:bg-zinc-800 ">
          <h1 className="text-white text-3xl">Please select your Friend</h1>
          <ChatIcon />
        </div>
      )}
    </div>
  );
};

export default Chat;
