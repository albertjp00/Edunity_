import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./chatwindow.css";
import attachmentImage from "../../../assets/documentImage.jpg";
import { getMessages, sendMessages } from "../../services/Instructor/instructorServices";

const socket = io(import.meta.env.VITE_API_URL);

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
  onMessageSent?: (receiverId: string, messageText: string, attachment: string) => void;
  unreadIncrease?: (senderId: string) => void
}



const InstructorChatWindow: React.FC<ChatWindowProps> = ({
  instructorId,
  receiverId,
  receiverName,
  receiverAvatar,
  onMessageSent,
  unreadIncrease
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isTyping, setIsTyping] = useState(false);





  useEffect(() => {
    if (!receiverId) return;

    const fetchMessages = async () => {
      try {
        const res = await getMessages(receiverId)
        if(!res) return
        if (res.data.success) {
          const sorted = res.data.messages.sort(
            (a: Message, b: Message) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          setMessages(sorted);

          // Notify backend that messages are read;
          if (res.data.messages.some((m: Message) => m.senderId !== instructorId && !m.read)) {
            socket.emit("messagesRead", { senderId: receiverId, receiverId: instructorId });
          }
        }
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    };

    fetchMessages();
  }, [instructorId, receiverId]);



  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);





  useEffect(() => {
    if (!receiverId) return;

    socket.emit("joinRoom", { userId: instructorId, receiverId });

    const handleReceive = (message: Message) => {

      if (message.senderId === instructorId) return;
      setMessages((prev) => [...prev, message]);

      if (message.senderId !== receiverId && unreadIncrease) {
        unreadIncrease(message.senderId);
      }

      if (message.senderId === receiverId && message.receiverId === instructorId) {


        socket.emit("messagesRead", { senderId: receiverId, receiverId: instructorId });
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
  }, [instructorId, receiverId]);

  // ---------------- Send message ----------------
  const sendMessage = async (file?: File) => {
    if (!receiverId || (!newMsg && !file)) return;

    const formData = new FormData();
    formData.append("receiverId", receiverId);
    formData.append("senderId", instructorId);
    formData.append("text", newMsg.trim() || "");
    if (file) formData.append("attachment", file);

    try {
      const res = await sendMessages(receiverId , formData)
      if(!res) return
      if (res.data.success) {
        const newMessage = res.data.message;

        setMessages((prev) => [...prev, { ...newMessage, read: false }]);

        // Let socket handle adding the message
        socket.emit("sendMessage", newMessage);

        if (onMessageSent) {
          onMessageSent(receiverId, newMsg.trim() || "", file?.name || "");
        }

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


useEffect(() => {
  if (receiverId && instructorId) {
    const room = [instructorId, receiverId].sort().join("_");
    console.log(`🟣 Instructor joining room: ${room}`);
    socket.emit("joinRoom", { userId: instructorId, receiverId });
  }
}, [receiverId, instructorId]);


// console.log("🔗 Socket ID:", socket.id);



  // to 
  useEffect(() => {
    if (!receiverId) return;

    const handleTyping = ({ senderId }: { senderId: string }) => {
      if (senderId === receiverId) {
        console.log('user is typing',receiverId);
        
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
    socket.emit("typing", { senderId: instructorId, receiverId });

    // Clear previous timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // Set timeout to emit stopTyping after 1.5s of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { senderId: instructorId, receiverId });
    }, 1500);
  };




  useEffect(() => {
    if (!newMsg) {
      socket.emit("stopTyping", { senderId: instructorId, receiverId });
    }
  }, [newMsg]);


  // clears timeout when timeout unmounts
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);





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
            {isTyping && <small className="typing-text">Typing...</small>}
          
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div
            className={`message ${msg.senderId === instructorId ? "sent" : "received"}`}
            key={idx}
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
                    alt="file"
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

      {/* Input */}
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
          onChange={handleInputChange}
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
