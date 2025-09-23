import { useEffect, useState } from "react";
import ChatWindow from "./chatWindow";
import { useParams } from "react-router-dom";
import profileImage from "../../../assets/profilePic.png";
import "./userChat.css";
import api from "../../../api/userApi";
import Navbar from "../navbar/navbar";

interface IInstructor {
  id: string;
  name: string;
  avatar?: string;
}

const UserChat = () => {
  // const userId = "user123";
  const { instructorId } = useParams();

  const [instructors, setInstructors] = useState<IInstructor[]>([]);
  const [selected, setSelected] = useState<IInstructor | null>(null);
  const [userId , setUserId] = useState<string | null>(null)

const getInstructors = async () => {
  try {
    const response = await api.get("/user/messagedInstructors");
    setUserId(response.data.userId);

    const normalized = response.data.instructors.map((inst: any) => ({
      id: inst._id,
      name: inst.name,
      avatar: inst.avatar || profileImage,
    }));

    // first-time chat
    if (instructorId) {
      const exists = normalized.find((i:any) => i.id === instructorId);
      if (!exists) {
        // fetch instructor details
        const instRes = await api.get(`/user/instructor/${instructorId}`);
        if (instRes.data.success) {
          normalized.unshift(instRes.data.instructor); // add at top
        }
      }
    }

    setInstructors(normalized);

    // auto-select instructor
    if (instructorId) {
      const found = normalized.find((i:any) => i.id === instructorId);
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
            className={`sidebar-instructor ${
              selected?.id === inst.id ? "active" : ""
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
