import { useEffect, useRef, useState } from "react";
import ChatWindow from "./chatWindow";
// import { useParams } from "react-router-dom";
import profileImage from "../../../assets/profilePic.png";
import "./userChat.css";
import Navbar from "../navbar/navbar";
import { io, Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import { getMessagedInstructors, toMessageInstructor } from "../../services/instructorServices";
import type { IInstructorChat } from "../../interfaces";


// const socket = io(import.meta.env.VITE_API_URL)



const UserChat = () => {
  const { instructorId } = useParams();
  const [instructors, setInstructors] = useState<IInstructorChat[]>([]);
  const [selected, setSelected] = useState<IInstructorChat | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [typingInstructors, setTypingInstructors] = useState<Record<string, boolean>>({});

  const socketRef = useRef<Socket | null>(null) 


  const sortInstructors = (list: IInstructorChat[]) => {
    return [...list].sort((a, b) => {
      const timeA = a.time ? new Date(a.time).getTime() : 0;
      const timeB = b.time ? new Date(b.time).getTime() : 0;
      return timeB - timeA;
    });
  };


  const getInstructors = async () => {
    try {
      // const response = await api.get("/user/messagedInstructors");
      const response = await getMessagedInstructors()
      if (!response) return
      setUserId(response.data.userId);

      const normalized = response.data.data.map(
        (item: {
          instructor: IInstructorChat;
          lastMessage: { text?: string; attachment?: string; timeStamp: Date; createdAt: string };
        }) => {
          let displayMessage = "";
          if (item.lastMessage?.text) {
            displayMessage = item.lastMessage.text;
          } else if (item.lastMessage?.attachment) {
            displayMessage = /\.(jpg|jpeg|png|gif|webp)$/i.test(item.lastMessage.attachment)
              ? "📷 Image"
              : "📄 Document";
          }

          return {
            id: item.instructor._id,
            name: item.instructor.name,
            avatar: item.instructor.avatar || profileImage,
            lastMessage: displayMessage || "No messages yet",
            time: item.lastMessage?.timeStamp || item.lastMessage?.createdAt || null,
            unreadCount: 0,
          };
        }
      );

      const sorted = sortInstructors(normalized);
      // console.log(sorted);

      setInstructors(sorted);

      //auto-selecting instructor with chatWindow opened
      if (instructorId) {
        const found = sorted.find((i) => i.id === instructorId);
        if (found) {
          setSelected(found);
        } else {
          //to select the new Instructor to message
          getInstructorToMessage(instructorId);
        }
      }

    } catch (error) {
      console.log(error);
    }
  };

  const getInstructorToMessage = async (id: string) => {
    try {
      // const response = await api.get(`/user/instructor/${id}`);
      const response = await toMessageInstructor(id)
      if (!response) return
      const instructor = response.data.instructor;

      if (instructor) {
        const newInstructor = {
          id: instructor.id,
          name: instructor.name,
          avatar: instructor.avatar || profileImage,
          lastMessage: "No messages yet",
          time: null,
          unreadCount: 0,
        };

        setInstructors((prev) => [...prev, newInstructor]);

        setSelected(newInstructor);
      }
    } catch (error) {
      console.error("Failed to fetch instructor to message:", error);
    }
  };









  const handleMessageSent = (receiverId: string, messageText?: string, attachment?: string) => {
    setInstructors((prev) => {
      const updated = prev.map((inst) => {
        if (inst.id === receiverId) {
          let displayMessage = "";

          if (messageText && messageText.trim() !== "") {
            displayMessage = messageText;
          } else if (attachment) {
            displayMessage = /\.(jpg|jpeg|png|gif|webp)$/i.test(attachment)
              ? "📷 Image"
              : "📄 Document";
          }

          return {
            ...inst,
            lastMessage: displayMessage || inst.lastMessage,
            time: new Date().toISOString(),
          };
        }
        return inst;
      });

      return sortInstructors(updated);
    });
  };



  const handleUnreadIncrease = (senderId: string) => {
    setInstructors((prev) =>
      prev.map((inst) =>
        inst.id === senderId
          ? { ...inst, unreadCount: (inst.unreadCount || 0) + 1 }
          : inst
      )
    );
  };


  const resetUnread = (receiverId: string) => {
    setInstructors((prev) =>
      prev.map((inst) =>
        inst.id === receiverId ? { ...inst, unreadCount: 0 } : inst
      )
    );
  };

  useEffect(() => {
    getInstructors();
  }, []);


  //joining room for typing status 
  useEffect(() => {
    if (selected && userId) {
      const room = [userId, selected.id].sort().join("_");
      console.log(`🟢 User joining room: ${room}`);
      socketRef.current?.emit("joinRoom", { userId, receiverId: selected.id });
    }
  }, [selected, userId]);


  // console.log("🔗 Socket ID:", socket.id);



  //to show typing status in the list 
  useEffect(() => {
    const handleTyping = ({ senderId }: { senderId: string }) => {
      console.log(`💬 Typing event received from: ${senderId}`);
      setTypingInstructors((prev) => ({ ...prev, [senderId]: true }));

      // Auto-clear after 2s of inactivity
      setTimeout(() => {
        setTypingInstructors((prev) => ({ ...prev, [senderId]: false }));
      }, 2000);
    };

    const handleStopTyping = ({ senderId }: { senderId: string }) => {
      console.log(`🛑 Stop typing received from: ${senderId}`);
      setTypingInstructors((prev) => ({ ...prev, [senderId]: false }));
    };

    socketRef.current?.on("userTyping", handleTyping);
    socketRef.current?.on("userStopTyping", handleStopTyping);

    return () => {
      socketRef.current?.off("userTyping", handleTyping);
      socketRef.current?.off("userStopTyping", handleStopTyping);
    };
  }, []);


  useEffect(() => {
    const handleReceiveMessage = (message: {
      senderId: string;
      receiverId: string;
      text?: string;
      attachment?: string;
      timestamp: string | Date;
    }) => {
      // ❌ Ignore messages not meant for this user

      if (message.senderId === userId) {
      return;
    }

      // console.log("message recieved to chat list");


      if (
        message.senderId !== userId &&
        message.receiverId !== userId
      ) {
        return;
      }

      const otherPartyId =
        message.senderId === userId
          ? message.receiverId
          : message.senderId;

      // ✅ Update unread count
      if (!selected || selected.id !== otherPartyId) {
        handleUnreadIncrease(otherPartyId);
      } else {
        resetUnread(otherPartyId);
      }

      // ✅ Update last message + move to top
      setInstructors(prev => {
        const updated = prev.map(inst => {
          if (inst.id === otherPartyId) {
            let displayMessage = "";

            if (message.text?.trim()) {
              displayMessage = message.text;
            } else if (message.attachment) {
              displayMessage = /\.(jpg|jpeg|png|gif|webp)$/i.test(message.attachment)
                ? "📷 Image"
                : "📄 Document";
            }

            return {
              ...inst,
              lastMessage: displayMessage || inst.lastMessage,
              time: message.timestamp,
            };
          }
          return inst;
        });

        return sortInstructors(updated);
      });
    };

    socketRef.current?.on("receiveMessage", handleReceiveMessage);

    return () => {
      socketRef.current?.off("receiveMessage", handleReceiveMessage);
    };
  }, [userId]);


  useEffect(()=>{

  },[userId])


  
  

  useEffect(() => {
    if (!userId) return;

    socketRef.current  = io(import.meta.env.VITE_API_URL)

    console.log("🟢 User joined personal room:", userId);
    socketRef.current.emit("joinPersonalRoom", { userId });

    console.log('user online',userId);

    return () => {
    console.log("🔴user offline:", userId);
    socketRef.current?.disconnect();
    socketRef.current = null;
  };

  }, [userId]);




  



  if (!instructors.length) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="user-chat-container">
        {/* Left sidebar */}
        <div className="chat-sidebar">
          <h2 className="sidebar-title">Instructors</h2>
          {instructors.map((inst) => (
            <div
              key={inst.id}
              className={`sidebar-instructor ${selected?.id === inst.id ? "active" : ""}`}
              onClick={() => {
                // ✅ Load messages ONLY when user clicks
                setSelected(inst);
                resetUnread(inst.id);
              }}
            >
              <img
                src={inst.avatar || profileImage}
                alt={inst.name}
                className="sidebar-avatar"
              />
              <div>
                <p className="instructor-name">{inst.name}</p>
                <div className="message-and-time">

                  <p className="last-message">
                    {typingInstructors[inst.id] ? "Typing..." : inst.lastMessage || "No messages yet"}
                  </p>

                  <p className="message-time">
                    {inst.time
                      ? new Date(inst.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      : ""}
                  </p>
                </div>
                {inst.unreadCount > 0 && (
                  <span className="unread-badge">{inst.unreadCount}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right chat window */}
        <div className="chat-main">
          {selected && userId ? (
            <ChatWindow
              userId={userId}
              receiverId={selected.id}
              receiverName={selected.name}
              receiverAvatar={selected.avatar || profileImage}
              onMessageSent={handleMessageSent}
              unreadIncrease={handleUnreadIncrease}
              resetUnread={resetUnread}
            />
          ) : (
            <p>Select an instructor to start chatting</p>
          )}
        </div>
      </div>
    </>
  );
};

export default UserChat;
