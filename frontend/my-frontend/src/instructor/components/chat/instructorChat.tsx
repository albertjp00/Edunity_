import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import instructorApi from "../../../api/instructorApi";
import profileImage from "../../../assets/profilePic.png";
import "./instructorChat.css";
import InstructorChatWindow from "./instChatWindow";

interface IStudent {
  id: string;
  name: string;
  avatar?: string;
}

const InstructorChat = () => {
  const { id: userId } = useParams(); // optional userId from route (like /instructor/chat/:id)
  const [students, setStudents] = useState<IStudent[]>([]);
  const [selected, setSelected] = useState<IStudent | null>(null);
  const [instructorId, setInstructorId] = useState<string | null>(null);

  const getMessagedStudents = async () => {
    try {
      const response = await instructorApi.get(`/instructor/getMessagedStudents`);
      if (response.data.success) {
        // ✅ backend should send instructorId after decoding the token
        setInstructorId(response.data.instructorId);

        const normalized = response.data.students.map((stu: any) => ({
          id: stu._id,
          name: stu.name,
          avatar: stu.avatar || profileImage,
        }));
        setStudents(normalized);

        // auto-select if URL has userId
        if (userId) {
          const found = normalized.find((s: IStudent) => s.id === userId);
          if (found) setSelected(found);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMessagedStudents();
  }, []);

  return (
    <div className="instructor-chat-container">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <h2 className="sidebar-title">Students</h2>
        {students.map((stu) => (
          <div
            key={stu.id}
            className={`sidebar-user ${selected?.id === stu.id ? "active" : ""}`}
            onClick={() => setSelected(stu)}
          >
            <img
              src={stu.avatar || profileImage}
              alt={stu.name}
              className="sidebar-avatar"
            />
            <div>
              <p className="user-name">{stu.name}</p>
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
              />
            </div>
          </>
        ) : (
          <p>Select a student to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default InstructorChat;
