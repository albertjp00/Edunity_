import { useEffect, useState } from "react";
import ChatWindow from "./chatWindow";
import { useParams } from "react-router-dom";
import profileImage from "../../../assets/profilePic.png";
import "./userChat.css";
import api from "../../../api/userApi";
import Navbar from "../navbar/navbar";

interface IInstructorChat {
  id: string;
  _id?: string
  name: string;
  avatar?: string;
  lastMessage?: string
  time?: Date | string
}


const UserChat = () => {
  // const userId = "user123";
  const { instructorId } = useParams();

  const [instructors, setInstructors] = useState<IInstructorChat[]>([]);
  const [selected, setSelected] = useState<IInstructorChat | null>(null);
  const [userId, setUserId] = useState<string | null>(null)

  const getInstructors = async () => {
    try {
      const response = await api.get("/user/messagedInstructors");
      setUserId(response.data.userId);

      console.log(response.data);



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
          };
        }
      );



      if (instructorId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const exists = normalized.find((i: any) => i.id === instructorId);
        if (!exists) {
          const instRes = await api.get(`/user/instructor/${instructorId}`);
          if (instRes.data.success) {
            normalized.unshift(instRes.data.instructor); // add at top
          }
        }
      }



      setInstructors(normalized);

      // auto-select instructor
      if (instructorId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const found = normalized.find((i: any) => i.id === instructorId);
        if (found) setSelected(found);
      }
    } catch (error) {
      console.log(error);
    }
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
              className={`sidebar-instructor ${selected?.id === inst.id ? "active" : ""
                }`}
              onClick={() => setSelected(inst)}
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
                    {inst.lastMessage || "No messages yet"}

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

                {/* <p className="instructor-status">Online</p> */}
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
