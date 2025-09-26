import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./chatWindow.css";
import api from "../../../api/userApi";
// import 

const socket = io(import.meta.env.VITE_API_URL);

interface Message {
  senderId: string;
  receiverId?: string;
  text: string;
  attachment?: string;
  timestamp: Date | string;
  read?: boolean
}

interface ChatWindowProps {
  userId: string;
  receiverId?: string;
  receiverName: string;
  receiverAvatar?: string;
}



const ChatWindow: React.FC<ChatWindowProps> = ({
  userId,
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
        const res = await api.get(`/user/messages/${userId}/${receiverId}`
        );
        if (res.data.success) {
          setMessages(res.data.messages);

          socket.emit("markAsRead", { userId, receiverId })
        }
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    };

    fetchMessages();
  }, [userId, receiverId]);


  useEffect(() => {
    socket.on("messagesRead", ({ userId: readerId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.receiverId === readerId ? { ...msg, read: true } : msg
        )
      );
    });

    return () => {
      socket.off("messagesRead");
    };
  }, []);


  useEffect(() => {
    socket.emit("joinRoom", { userId, receiverId });

    socket.on("receiveMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [userId, receiverId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (newMsg.trim()) {
      const message: Message = {
        senderId: userId,
        receiverId,
        text: newMsg,
        timestamp: new Date(),

      };

      socket.emit("sendMessage", message);

      try {
        await api.post("/user/chat", message);
      } catch (err) {
        console.error("Failed to save message", err);
      }

      // setMessages((prev) => [...prev, message]);
      setNewMsg("");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
     if(!file) return 

     const formData = new FormData()
     formData.append('attachemnt',file)
 };


  return (
    <div className="chat-window-user">
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
        {messages.map((msg, idx) => {
          const msgDate = new Date(msg.timestamp);
          const formattedDate = msgDate.toLocaleDateString([], {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          const prevMsg = messages[idx - 1];
          const prevDate =
            prevMsg && new Date(prevMsg.timestamp).toLocaleDateString([], {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

          const showDate = formattedDate !== prevDate;

          return (
            <React.Fragment key={idx}>
              {showDate && (
                <div className="date-divider">
                  <span>{formattedDate}</span>
                </div>
              )}

              <div
                className={`message ${msg.senderId === userId ? "sent" : "received"}`}
              >
                <div className="message-text">{msg.text}</div>
                <div className="message-time">
                  {msgDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="message-read">
                  {msg.senderId === userId && (msg.read ? "✓✓" : "✓")}
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </div>



      {/* Input */}
      <div className="chat-input">
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={(e) => handleFileUpload(e)}
        />
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message..."
        />

        {/* hidden file input */}
        

        <button onClick={sendMessage}>Send</button>
        <button onClick={() => document.getElementById("fileInput")?.click()}>
          📎
        </button>
      </div>

    </div>
  );
};

export default ChatWindow;
