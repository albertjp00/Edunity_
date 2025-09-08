// src/components/ChatWindow.tsx
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // your backend socket server

// Define message type
interface Message {
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date | string;
}

// Define props type
interface ChatWindowProps {
  userId: string;
  receiverId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ userId, receiverId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState<string>("");

  useEffect(() => {
    socket.emit("joinRoom", { userId, receiverId });

    socket.on("receiveMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [userId, receiverId]);

  const sendMessage = () => {
    if (newMsg.trim()) {
      const message: Message = {
        senderId: userId,
        receiverId,
        text: newMsg,
        timestamp: new Date(),
      };

      socket.emit("sendMessage", message);
      setMessages((prev) => [...prev, message]); // show instantly
      setNewMsg("");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow rounded-lg p-4">
      <div className="h-80 overflow-y-auto border p-2 mb-2 rounded">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`my-1 p-2 rounded ${
              msg.senderId === userId
                ? "bg-blue-500 text-white text-right"
                : "bg-gray-200 text-left"
            }`}
          >
            {msg.text}
            <div className="text-xs text-gray-600">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow border rounded-l px-2 py-1"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
