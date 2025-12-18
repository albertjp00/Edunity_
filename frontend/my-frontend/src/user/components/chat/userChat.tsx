import { useEffect, useState } from "react";
import ChatWindow from "./chatWindow";
// import { useParams } from "react-router-dom";
import profileImage from "../../../assets/profilePic.png";
import "./userChat.css";
import Navbar from "../navbar/navbar";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { getMessagedInstructors, toMessageInstructor } from "../../services/instructorServices";


const socket = io(import.meta.env.VITE_API_URL)

interface IInstructorChat {
  id: string;
  _id?: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  time?: Date | string | null;
  unreadCount: number;
}

const UserChat = () => {
  const { instructorId } = useParams();
  const [instructors, setInstructors] = useState<IInstructorChat[]>([]);
  const [selected, setSelected] = useState<IInstructorChat | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [typingInstructors, setTypingInstructors] = useState<Record<string, boolean>>({});


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
      if(!response) return
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
      console.log(sorted);
      
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
    if(!response) return 
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
      socket.emit("joinRoom", { userId, receiverId: selected.id });
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

    socket.on("userTyping", handleTyping);
    socket.on("userStopTyping", handleStopTyping);

    return () => {
      socket.off("userTyping", handleTyping);
      socket.off("userStopTyping", handleStopTyping);
    };
  }, []);


  useEffect(() => {
  const handleReceiveMessage = ({
    senderId,
    messageText,
    attachment,
  }: {
    senderId: string;
    messageText?: string;
    attachment?: string;
  }) => {
    console.log("📩 Message received from:", senderId);

    // ✅ If the currently selected chat is NOT the sender, increase unread count
    if (!selected || selected.id !== senderId) {
      handleUnreadIncrease(senderId);
    } else {
      // If user is chatting with the sender, reset unread count
      resetUnread(senderId);
    }

    // ✅ Update the last message & bring the instructor to top
    handleMessageSent(senderId, messageText, attachment);
  };

  socket.on("receiveMessage", handleReceiveMessage);

  return () => {
    socket.off("receiveMessage", handleReceiveMessage);
  };
}, [selected]);




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
