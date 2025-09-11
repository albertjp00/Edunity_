import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./chatWindow.css";
import api from "../../../api/userApi";

const socket = io("http://localhost:5000");

interface Message {
  senderId: string;
  receiverId?: string;
  text: string;
  timestamp: Date | string;
}

interface ChatWindowProps {
  instructorId: string;
  receiverId?: string;
  receiverName: string;
  receiverAvatar?: string;
}



const InstructorChatWindow: React.FC<ChatWindowProps> = ({
  instructorId,
  receiverId,
  receiverName,
  receiverAvatar,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  // const {instructorId} = useParams()

  // const receiverId = instructorId

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/instructor/messages/${instructorId}/${receiverId}`
        );
        if (res.data.success) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    };

    fetchMessages();
  }, [instructorId, receiverId]);

  useEffect(() => {
    socket.emit("joinRoom", { instructorId, receiverId });

    socket.on("receiveMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [instructorId, receiverId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (newMsg.trim()) {
      const message: Message = {
        senderId: instructorId,
        receiverId,
        text: newMsg,
        timestamp: new Date(),
      };

      socket.emit("sendMessage", message);

      try {
        await api.post("/instructor/sendMessage", message);
      } catch (err) {
        console.error("Failed to save message", err);
      }

      // setMessages((prev) => [...prev, message]);
      setNewMsg("");
    }
  };

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-header">
        <div className="user-info">
          <img
            src={receiverAvatar || "/default-avatar.png"}
            alt={receiverName}
            className="avatar"
          />
          <div>
            <h4>{receiverName}</h4>
            {/* <small>Online - Last seen just now</small> */}
          </div>
        </div>
        {/* <div className="chat-actions">
          <button>📞</button>
          <button>🎥</button>
          <button>⋮</button>
        </div> */}
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.senderId === instructorId ? "sent" : "received"}`}
          >
            <div className="message-text">{msg.text}</div>
            <div className="message-time">
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))}
      </div>


      {/* Input */}
      <div className="chat-input">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default InstructorChatWindow;
