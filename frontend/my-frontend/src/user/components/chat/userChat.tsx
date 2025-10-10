import { useEffect, useState } from "react";
import ChatWindow from "./chatWindow";
import { useParams } from "react-router-dom";
import profileImage from "../../../assets/profilePic.png";
import "./userChat.css";
import api from "../../../api/userApi";
import Navbar from "../navbar/navbar";

interface IInstructorChat {
  id: string;
  _id?: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  time?: Date | string;
  unreadCount: number
}

const UserChat = () => {
  const { instructorId } = useParams();

  const [instructors, setInstructors] = useState<IInstructorChat[]>([]);
  const [selected, setSelected] = useState<IInstructorChat | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  // const [count, setUnreadCount] = useState<number | null>(null)


  const sortInstructors = (list: IInstructorChat[]) => {
    return [...list].sort((a, b) => {
      const timeA = a.time ? new Date(a.time).getTime() : 0;
      const timeB = b.time ? new Date(b.time).getTime() : 0;
      return timeB - timeA; // latest first
    });
  };

  const getInstructors = async () => {
    try {
      const response = await api.get("/user/messagedInstructors");
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
            if (/\.(jpg|jpeg|png|gif|webp)$/i.test(item.lastMessage.attachment)) {
              displayMessage = "📷 Image";
            } else {
              displayMessage = "📄 Document";
            }
          }

          return {
            id: item.instructor._id,
            name: item.instructor.name,
            avatar: item.instructor.avatar || profileImage,
            lastMessage: displayMessage || "No messages yet",
            time: item.lastMessage?.timeStamp || item.lastMessage?.createdAt || null,
            unreadCount: 0
          };
        }
      );

      const sorted = sortInstructors(normalized);

      // ✅ Add instructor if route param provided


      if (instructorId) {
        const exists = sorted.find((i) => i.id === instructorId);
        if (!exists) {
          const instRes = await api.get(`/user/instructor/${instructorId}`);
          if (instRes.data.success) {
            sorted.unshift(instRes.data.instructor);
          }
        }
      }

      setInstructors(sorted);

      if (instructorId) {
        const found = sorted.find((i) => i.id === instructorId);
        if (found) setSelected(found);
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    const fetchUnreadAndLastMessage = async () => {
      try {
        if (!instructorId) return;

        const res = await api.get(`/user/getUnreadMessages/${instructorId}`);
        if (res.data.success) {
          const { lastMessage, unreadCount } = res.data.data;

          setInstructors((prev) =>
            prev.map((inst) =>
              inst.id === instructorId
                ? {
                  ...inst,
                  lastMessage: lastMessage?.text
                    ? lastMessage.text
                    : lastMessage?.attachment
                      ? /\.(jpg|jpeg|png|gif|webp)$/i.test(lastMessage.attachment)
                        ? "📷 Image"
                        : "📄 Document"
                      : "No messages yet",
                  time: lastMessage?.timestamp || new Date().toISOString(),
                  unreadCount: unreadCount || 0,
                }
                : inst
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUnreadAndLastMessage();
  }, [instructorId]);


  const handleMessageSent = (receiverId: string) => {
    setInstructors((prev) => {
      const updated = prev.map((inst) =>
        inst.id === receiverId
          ? { ...inst, time: new Date().toISOString() } // update last message time
          : inst
      );
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





  useEffect(() => {
    getInstructors();
  }, []);

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
              onClick={() => setSelected(inst)}
            >
              <img src={inst.avatar || profileImage} alt={inst.name} className="sidebar-avatar" />
              <div>
                <p className="instructor-name">{inst.name}</p>
                <div className="message-and-time">
                  <p className="last-message">{inst.lastMessage || "No messages yet"}</p>
                  <p className="message-time">
                    {inst.time
                      ? new Date(inst.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      : ""}
                  </p>


                  {inst.unreadCount > 0 && (
                    <span className="unread-badge">{inst.unreadCount}</span>
                  )}



                </div>
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
              onMessageSent={() => handleMessageSent(selected.id)}
              unreadIncrease={handleUnreadIncrease}
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
