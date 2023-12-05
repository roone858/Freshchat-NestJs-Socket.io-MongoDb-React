import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

const Chat = () => {
  const [messages, setMessages] = useState<{ status: string; text: string }[]>(
    []
  );
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket.on("chat", (message) => {
      setMessages([...messages, { status: "incoming", text: message }]);
    });
    console.log(messages);
  }, [messages]);

  const sendMessage = () => {
    setMessages([...messages, { status: "sent", text: newMessage }]);
    socket.emit("chat", newMessage);
    setNewMessage("");
  };

  return (
    <div>
      <div className="chat">
        {messages.map((msg, index) => (
          <div key={index}>{msg.text}</div>
        ))}
      </div>
      <div className="input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
