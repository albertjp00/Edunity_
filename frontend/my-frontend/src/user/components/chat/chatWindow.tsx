import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./chatWindow.css";
import api from "../../../api/userApi";

import attachmentImage from '../../../assets/documentImage.jpg'

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

          // socket.emit("markAsRead", { userId, receiverId })
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





  const sendMessage = async (file?: File) => {
    if (!receiverId) return;

    const formData = new FormData();
    formData.append("receiverId", receiverId);
    formData.append("senderId", userId);

    // always append text
    formData.append("text", newMsg.trim() || "");

    if (file) {
      formData.append("attachment", file);
    }

    try {
      const res = await api.post("/user/chat", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        const newMessage = res.data.message;

        // setMessages((prev) => [...prev, newMessage]);
        socket.emit("sendMessage", newMessage);
      }

      setNewMsg("")
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };





  const handleSendMessage = () => {
    sendMessage()
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) sendMessage(file);
  };


  const viewFile =  (fileName: string) => {
  const fileUrl = `${import.meta.env.VITE_API_URL}/assets/${fileName}`;
  window.open(fileUrl, "_blank"); // opens in new tab
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
                {msg.text && <div className="message-text">{msg.text}</div>}

                {msg.attachment && (



                  <div className="message-attachment">
  {msg.attachment &&
    (/\.(jpg|jpeg|png|gif|webp)$/i.test(msg.attachment) ? (
      // Render image inline
      <img onClick={()=>viewFile(msg.attachment!)}
        src={`${import.meta.env.VITE_API_URL}/assets/${msg.attachment}`}
        alt="attachment"
        className="message-image"
      />
    ) : (
      // Render file link
      <img
        onClick={()=>viewFile(msg.attachment!)}
        src={attachmentImage}
        alt="_blank"
        className="message-image"
      />

    ))}
</div>

                )}

                <div className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
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


        <button onClick={handleSendMessage}>Send</button>
        <button onClick={() => document.getElementById("fileInput")?.click()}>
          📎
        </button>
      </div>

    </div>
  );
};

export default ChatWindow;
