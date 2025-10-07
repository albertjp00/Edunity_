import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./chatwindow.css";
import instructorApi from "../../../api/instructorApi";
import attachmentImage from '../../../assets/documentImage.jpg'

const socket = io("http://localhost:5000");

interface Message {
  senderId: string;
  receiverId?: string;
  text: string;
  attachment?: string;
  timestamp: Date | string;
  read?: boolean;
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

  useEffect(() => {
    const fetchMessages = async () => {
      try {


        const res = await instructorApi.get(`/instructor/messages/${receiverId}`);
        if (res.data.success) {
          setMessages(res.data.messages);
          console.log(res.data);

          socket.emit("markAsRead", { instructorId, receiverId });
        }
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    };
    fetchMessages();
  }, [instructorId, receiverId]);


  
  useEffect(() => {
  const fetchMessages = async () => {
    try {
      const res = await instructorApi.get(`/instructor/messages/${receiverId}`);
      if (res.data.success) {
        // ✅ Sort messages by timestamp (oldest → newest)
        const sortedMessages = res.data.messages.sort(
          (a: Message, b: Message) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        setMessages(sortedMessages);
        console.log(sortedMessages);

        socket.emit("markAsRead", { instructorId, receiverId });
      }
    } catch (err) {
      console.error("Failed to load chat history", err);
    }
  };
  fetchMessages();
}, [instructorId, receiverId]);




  const sendMessage = async (file?: File) => {
    if (!receiverId) return;

    const formData = new FormData();
    formData.append("receiverId", receiverId);
    formData.append("senderId", instructorId);
    formData.append("text", newMsg.trim() || "");

    if (file) formData.append("attachment", file);

    try {
      const res = await instructorApi.post(`/instructor/sendMessage/${receiverId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        const newMessage = res.data.message;
        socket.emit("sendMessage", newMessage);
      }

      setNewMsg("");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const handleSendMessage = () => sendMessage();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) sendMessage(file);
  };

  const viewFile = (fileName: string) => {
    const fileUrl = `${import.meta.env.VITE_API_URL}/assets/${fileName}`;
    window.open(fileUrl, "_blank");
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="user-info">
          <img
            src={receiverAvatar || "/default-avatar.png"}
            alt={receiverName}
            className="avatar"
          />
          <div>
            <h4>{receiverName}</h4>
          </div>
        </div>
      </div>

      <div className="chat-messages">
        
        {messages.map((msg, idx) => (
          
          <div
            key={idx}
            className={`message ${msg.senderId === instructorId ? "sent" : "received"}`}
          >
            
            {msg.text && <div className="message-text">{msg.text}</div>}

            {msg.attachment && (
              <div className="message-attachment">
                {/\.(jpg|jpeg|png|gif|webp)$/i.test(msg.attachment) ? (
                  <img
                    onClick={() => viewFile(msg.attachment!)}
                    src={`${import.meta.env.VITE_API_URL}/assets/${msg.attachment}`}
                    alt="attachment"
                    className="message-image"
                  />
                ) : (
                  <img
                    onClick={() => viewFile(msg.attachment!)}
                    src={attachmentImage}
                    alt="_blank"
                    className="message-image"
                  />
                )}
              </div>
            )}


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
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
        <button onClick={() => document.getElementById("fileInput")?.click()}>
          📎
        </button>
      </div>
    </div>
  );
};

export default InstructorChatWindow;
