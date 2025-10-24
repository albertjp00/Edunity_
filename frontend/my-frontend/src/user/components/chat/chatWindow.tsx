import React, { useEffect, useRef, useState } from "react";

import "./chatWindow.css";
import api from "../../../api/userApi";


import attachmentImage from '../../../assets/documentImage.jpg'
import { io } from "socket.io-client";
// import { connectSocket } from "../../../api/socketApi";

// const socket = connectSocket()
// if (!socket) throw new Error("Socket not connected")

const socket = io(import.meta.env.VITE_API_URL);

// ---------- Message Interface ----------
interface Message {
  senderId: string;
  receiverId?: string;
  text: string;
  attachment?: string;
  timestamp: Date | string;
  read?: boolean;
}

// ---------- ChatWindow Props ----------
interface ChatWindowProps {
  userId: string;
  receiverId?: string;
  receiverName: string;
  receiverAvatar?: string;
  onMessageSent?: (receiverId: string, message: string, file?: string) => void;
  unreadIncrease: (receiverId: string) => void;
  resetUnread: (receiverId: string) => void;
}

// ---------- ChatWindow Component ----------
const ChatWindow: React.FC<ChatWindowProps> = ({
  userId,
  receiverId,
  receiverName,
  receiverAvatar,
  onMessageSent,
  unreadIncrease,
  resetUnread,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isTyping, setIsTyping] = useState(false);



  // ---------------- Fetch chat history once ----------------
  useEffect(() => {
    if (!receiverId) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/user/messages/${userId}/${receiverId}`);
        if (res.data.success) {
          const sorted = res.data.messages.sort(
            (a: Message, b: Message) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          setMessages(sorted);

    
          socket.emit("messagesRead", { senderId: receiverId, receiverId: userId });

    
          resetUnread(receiverId);
        }
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    };

    fetchMessages();
  }, [userId, receiverId]);




  useEffect(() => {
    if (!receiverId) return;

    socket.emit("joinRoom", { userId, receiverId });

    const handleReceive = (message: Message) => {
      if (message.senderId === userId) return;

      setMessages((prev) => [...prev, message]);

      // Increase unread if current chat not open
      if (message.senderId !== receiverId) {
        unreadIncrease(message.senderId);
      } else {
        // Mark as read instantly
        socket.emit("messagesRead", { senderId: receiverId, receiverId: userId });
        resetUnread(receiverId);
      }
    };

    const handleReadUpdate = ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderId === senderId && msg.receiverId === receiverId ? { ...msg, read: true } : msg
        )
      );
    };

    socket.on("receiveMessage", handleReceive);
    socket.on("messagesReadUpdate", handleReadUpdate);

    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.off("messagesReadUpdate", handleReadUpdate);
    };
  }, [userId, receiverId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---------------- Send Message ----------------
  const sendMessage = async (file?: File) => {
    if (!receiverId || (!newMsg && !file)) return;

    const formData = new FormData();
    formData.append("receiverId", receiverId); 
    formData.append("senderId", userId);
    formData.append("text", newMsg.trim() || "");
    if (file) formData.append("attachment", file);

    try {
      const res = await api.post("/user/chat", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        const newMessage = res.data.message;
        setMessages((prev) => [...prev, { ...newMessage, read: false }]);
        socket.emit("sendMessage", newMessage);
        onMessageSent?.(receiverId, newMsg.trim(), file?.name);

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



  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // to 
  useEffect(() => {
    if (!receiverId) return;

    const handleTyping = ({ senderId }: { senderId: string }) => {
      if (senderId === receiverId) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000); // auto hide after 2s
      }
    };

    const handleStopTyping = ({ senderId }: { senderId: string }) => {
      if (senderId === receiverId) {
        setIsTyping(false);
      }
    };

    socket.on("userTyping", handleTyping);
    socket.on("userStopTyping", handleStopTyping);

    return () => {
      socket.off("userTyping", handleTyping);
      socket.off("userStopTyping", handleStopTyping);
    };
  }, [receiverId]);




  // Updated input handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMsg(value);

    if (!receiverId) return;

    // Emit typing
    socket.emit("typing", { senderId: userId, receiverId });

    // Clear previous timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // Set timeout to emit stopTyping after 1.5s of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { senderId: userId, receiverId });
    }, 1500);
  };




  useEffect(() => {
    if (!newMsg) {
      socket.emit("stopTyping", { senderId: userId, receiverId });
    }
  }, [newMsg]);


  // clears timeout when timeout unmounts
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);




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
            {isTyping && <small className="typing-text">Typing...</small>}

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
                        <img onClick={() => viewFile(msg.attachment!)}
                          src={`${import.meta.env.VITE_API_URL}/assets/${msg.attachment}`}
                          alt="attachment"
                          className="message-image"
                        />
                      ) : (
                        // Render file link
                        <img
                          onClick={() => viewFile(msg.attachment!)}
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
          onChange={handleInputChange}
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
