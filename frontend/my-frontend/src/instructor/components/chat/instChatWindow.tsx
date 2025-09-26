import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./chatwindow.css";
import instructorApi from "../../../api/instructorApi";

const socket = io("http://localhost:5000");

interface Message {
  senderId: string;
  receiverId?: string;
  text: string;
  timestamp: Date | string;
  read : boolean
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
        // console.log('selected student',receiverId);

        const res = await instructorApi.get(`/instructor/messages/${receiverId}`
        );
        if (res.data.success) {
          console.log(res.data);
          
          setMessages(res.data.messages);
          socket.emit("markAsRead", { instructorId, receiverId })
        }
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    };

    fetchMessages();
  }, [instructorId, receiverId]);


useEffect(() => {
  if (receiverId && instructorId) {
    socket.emit("joinRoom", { userId: receiverId, receiverId: instructorId });
  }

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
      read : false
    };

    // Send through socket (this will trigger receiveMessage on both sides)
    socket.emit("sendMessage", message);

    try {
      await instructorApi.post(`/instructor/sendMessage/${receiverId}`, message);
    } catch (err) {
      console.error("Failed to save message", err);
    }

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
            <div className="message-read">
              {msg.senderId === instructorId && (msg.read ? "✓✓" : "✓")}
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
