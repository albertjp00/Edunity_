import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./chatwindow.css";
import instructorApi from "../../../api/instructorApi";
import attachmentImage from "../../../assets/documentImage.jpg";

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

  // ---------------- Fetch messages once ----------------
  useEffect(() => {
    if (!receiverId) return;

    const fetchMessages = async () => {
      try {
        const res = await instructorApi.get(`/instructor/messages/${receiverId}`);
        if (res.data.success) {
          const sorted = res.data.messages.sort(
            (a: Message, b: Message) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          setMessages(sorted);

          // Mark messages as read in real-time
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

  // ---------------- Auto-scroll ----------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!receiverId) return;

    socket.emit("joinRoom", { userId: instructorId, receiverId });

    // const handleReceiveMessage = (message: Message) => {
    //   setMessages((prev) => [...prev, message]);
    // };

    socket.on("messagesReadUpdate", ({ senderId, receiverId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderId === senderId && msg.receiverId === receiverId
            ? { ...msg, read: true }
            : msg
        )
      );
    });


    socket.on("receiveMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);

      //  marking read immediately
      if (message.senderId === receiverId && message.receiverId === instructorId) {
        socket.emit("messagesRead", {
          senderId: receiverId,
          receiverId: instructorId,
        });
      }
    });


    // socket.on("messagesReadUpdate", handleMessagesRead);

    return () => {
      // socket.off("receiveMessage", handleReceiveMessage);
      // socket.off("messagesReadUpdate", handleMessagesRead);
    };
  }, [instructorId, receiverId]);



  const sendMessage = async (file?: File) => {
    if (!receiverId || (!newMsg && !file)) return;

    const formData = new FormData();
    formData.append("receiverId", receiverId);
    formData.append("senderId", instructorId);
    formData.append("text", newMsg.trim() || "");
    if (file) formData.append("attachment", file);




    try {
      const res = await instructorApi.post(
        `/instructor/sendMessage/${receiverId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        const newMessage = res.data.message;


        setMessages((prev) => [...prev, newMessage]);


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
