import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import profileImage from "../../../assets/profilePic.png";
import "./instructorChat.css";
import InstructorChatWindow from "./instChatWindow";
import InstructorNavbar from "../navbar/navbar";
import type { ApiStudent, IStudent } from "../../interterfaces/chat";
import { io } from "socket.io-client";
import { fetchMessagedStudents } from "../../services/Instructor/instructorServices";


const socket = io(import.meta.env.VITE_API_URL)

const InstructorChat: React.FC = () => {
  const { id: userId } = useParams<{ id?: string }>();
  const [students, setStudents] = useState<IStudent[]>([]);
  const [selected, setSelected] = useState<IStudent | null>(null);
  const [instructorId, setInstructorId] = useState<string | null>(null);
  const [typingStudents, setTypingStudents] = useState<Record<string, boolean>>({});
  // const [isTyping, setIsTyping] = useState(false);



  const getMessagedStudents = async () => {
    try {
      const response = await fetchMessagedStudents()
      if (!response) return

      if (response.data.success) {
        // assuming the backend also returns instructorId
        setInstructorId(response.data.instructorId);

        console.log(response.data);

        const normalized: IStudent[] = response.data.students.map(
          (item: ApiStudent) => ({
            id: item.instructor._id,
            name: item.instructor.name,
            avatar: item.instructor.avatar
              ? `${import.meta.env.VITE_API_URL}/assets/${item.instructor.avatar}`
              : profileImage,
            hasAttachment: !!item.lastMessage.attachment,
            lastMessage: item.lastMessage.text
              ? item.lastMessage.text
              : item.lastMessage.attachment
                ? "📎 Attachment"
                : "No messages yet",
            timestamp: item.lastMessage.timestamp,
            unreadCount: item.unreadCount || 0,
          })
        );


        setStudents(normalized);


        if (userId) {
          const found = normalized.find((s) => s.id === userId);
          if (found) setSelected(found);
        }
      }
    } catch (error) {
      console.error("Error fetching messaged students:", error);
    }
  }


  const sortStudents = (students: IStudent[]) => {
    return [...students].sort((a, b) => {
      const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return timeB - timeA; // newest first
    });
  };



  const handleMessageSent = (
    receiverId: string,
    messageText?: string,
    attachment?: string
  ) => {
    setStudents((prev) => {
      const updated = prev.map((stu) => {
        if (stu.id === receiverId) {
          let displayMessage = "";

          if (messageText && messageText.trim() !== "") {
            displayMessage = messageText;
          } else if (attachment) {
            displayMessage = /\.(jpg|jpeg|png|gif|webp)$/i.test(attachment)
              ? "📷 Image"
              : "📄 Document";
          }

          return {
            ...stu,
            lastMessage: displayMessage || stu.lastMessage,
            timestamp: new Date().toISOString(),
            unreadCount: 0,
          };
        }
        return stu;
      });

      return sortStudents(updated);
    });
  };



  const handleUnreadIncrease = (senderId: string) => {
    setStudents(prev =>
      prev.map(stu =>
        stu.id === senderId ? { ...stu, unreadCount: (stu.unreadCount || 0) + 1 } : stu
      )
    );
  };


  useEffect(() => {
    getMessagedStudents();
  }, []);






  // const timeoutRefs = useRef<NodeJS.Timeout | null>(null);

  //joining room for typing status 
  useEffect(() => {
    if (!userId) return;

    const handleTyping = ({ senderId }: { senderId: string }) => {
      console.log(`💬 Typing event received from: ${senderId}`);
      setTypingStudents((prev) => ({ ...prev, [senderId]: true }));


      setTimeout(() => {
        setTypingStudents((prev) => ({ ...prev, [senderId]: false }));
      }, 2000);
    };


    const handleStopTyping = ({ senderId }: { senderId: string }) => {
      setTypingStudents((prev) => ({ ...prev, [senderId]: false }));
    };

    socket.on("userTyping", handleTyping);
    socket.on("userStopTyping", handleStopTyping);

    return () => {
      socket.off("userTyping", handleTyping);
      socket.off("userStopTyping", handleStopTyping);
    };
  }, [userId]);



  // console.log("🔗 Socket ID:", socket.id);


  //to show typing status in the list 
  useEffect(() => {
    const handleTyping = ({ senderId }: { senderId: string }) => {
      console.log(`💬 Typing event received from: ${senderId}`);
      setTypingStudents((prev) => ({ ...prev, [senderId]: true }));

      // Auto-clear after 2s of inactivity
      setTimeout(() => {
        setTypingStudents((prev) => ({ ...prev, [senderId]: false }));
      }, 2000);
    };

    const handleStopTyping = ({ senderId }: { senderId: string }) => {
      console.log(`🛑 Stop typing received from: ${senderId}`);
      setTypingStudents((prev) => ({ ...prev, [senderId]: false }));
    };

    socket.on("userTyping", handleTyping);
    socket.on("userStopTyping", handleStopTyping);

    return () => {
      socket.off("userTyping", handleTyping);
      socket.off("userStopTyping", handleStopTyping);
    };
  }, []);

  useEffect(() => {
    const handleReceiveMessage = (message: {
      senderId: string;
      text?: string;
      attachment?: string;
      timestamp: Date;
    }) => {
      setStudents(prev => {
        const updated = prev.map(stu => {
          if (stu.id === message.senderId) {
            let displayMessage = "";

            if (message.text?.trim()) {
              displayMessage = message.text;
            } else if (message.attachment) {
              displayMessage = /\.(jpg|jpeg|png|gif|webp)$/i.test(message.attachment)
                ? "📷 Image"
                : "📄 Document";
            }

            return {
              ...stu,
              lastMessage: displayMessage || stu.lastMessage,
              timestamp: message.timestamp.toString(),
              unreadCount:
                selected?.id === stu.id ? 0 : (stu.unreadCount || 0) + 1,
            };
          }
          return stu;
        });

        // 🔥 Move sender to top
        return sortStudents(updated);
      });
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [selected]);




  return (
    <>
      <InstructorNavbar />
      <div className="instructor-chat-container">
        {/* Sidebar */}
        <div className="chat-sidebar">
          <h2 className="sidebar-title">Students</h2>

          {students.map((stu) => (
            <div
              key={stu.id}
              className={`sidebar-user ${selected?.id === stu.id ? "active" : ""}`}
              onClick={() => {
                setSelected({ ...stu });
                setStudents(prev =>
                  prev.map(s =>
                    s.id === stu.id ? { ...s, unreadCount: 0 } : s
                  )
                );
              }}
            >
              <img
                src={stu.avatar || profileImage}
                alt={stu.name}
                className="sidebar-avatar"
              />
              <div className="sidebar-user-info">
                <p className="user-name">{stu.name}</p>

                {/* <p className="last-message">
                  {typingInstructors[stu.id] ? "Typing..." : stu.lastMessage || "No messages yet"}
                </p> */}

                <p className="last-message">
                  {typingStudents[stu.id]
                    ? "Typing..."
                    : stu.lastMessage || "No messages yet"}
                </p>

                {!typingStudents[stu.id] && (
                  <p className="message-time">
                    {stu.timestamp
                      ? new Date(stu.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                      : ""}
                  </p>
                )}




                {/* {stu.unreadCount > 0 && (
                  <span className="unread-badge">{stu.unreadCount}</span>
                )} */}
              </div>
            </div>
          ))}

        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {selected && instructorId ? (
            <>
              <h1 className="chat-title">Chat with {selected.name}</h1>
              <div className="chat-box">
                <InstructorChatWindow
                  instructorId={instructorId}
                  receiverId={selected.id}
                  receiverName={selected.name}
                  receiverAvatar={selected.avatar || profileImage}
                  onMessageSent={(receiverId, messageText, attachment) =>
                    handleMessageSent(receiverId, messageText, attachment)
                  }

                  unreadIncrease={handleUnreadIncrease}
                />
              </div>
            </>
          ) : (
            <p className="chat-placeholder">Select a student to start chatting</p>
          )}
        </div>
      </div>
    </>
  );
};

export default InstructorChat;
