import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import instructorApi from "../../../api/instructorApi";
import profileImage from "../../../assets/profilePic.png";
import "./instructorChat.css";
import InstructorChatWindow from "./instChatWindow";
import InstructorNavbar from "../navbar/navbar";
import type { ApiStudent, IStudent } from "../../interterfaces/chat";



const InstructorChat: React.FC = () => {
  const { id: userId } = useParams<{ id?: string }>();
  const [students, setStudents] = useState<IStudent[]>([]);
  const [selected, setSelected] = useState<IStudent | null>(null);
  const [instructorId, setInstructorId] = useState<string | null>(null);

  const getMessagedStudents = async () => {
    try {
      const response = await instructorApi.get("/instructor/getMessagedStudents");

      if (response.data.success) {
        // assuming the backend also returns instructorId
        setInstructorId(response.data.instructorId);


        


       const normalized: IStudent[] = response.data.students.map(
  (item: ApiStudent) => ({
    id: item.instructor._id,
    name: item.instructor.name,
    avatar: item.instructor.avatar
      ? `http://localhost:5000/assets/${item.instructor.avatar}`
      : profileImage,
    hasAttachment: !!item.lastMessage.attachment,
    lastMessage: item.lastMessage.text
      ? item.lastMessage.text
      : item.lastMessage.attachment
      ? "📎 Attachment"
      : "No messages yet",
    timestamp: item.lastMessage.timestamp, 
  })
);


        setStudents(normalized);

        // Auto-select if userId exists in route
        if (userId) {
          const found = normalized.find((s) => s.id === userId);
          if (found) setSelected(found);
        }
      }
    } catch (error) {
      console.error("Error fetching messaged students:", error);
    }
  };

  useEffect(() => {
    getMessagedStudents();
  }, []);

  return (
    <>
      <InstructorNavbar />
      <div className="instructor-chat-container">
        {/* Sidebar */}
        <div className="chat-sidebar">
          <h2 className="sidebar-title">Students</h2>

          {students.length > 0 ? (
            students.map((stu) => (
              <div
                key={stu.id}
                className={`sidebar-user ${selected?.id === stu.id ? "active" : ""
                  }`}
                onClick={() => setSelected(stu)}
              >
                <img
                  src={stu.avatar || profileImage}
                  alt={stu.name}
                  className="sidebar-avatar"
                />
                <div className="sidebar-user-info">
                  <p className="user-name">{stu.name}</p>
                  <p className="last-message">
  {stu.lastMessage?.length ? stu.lastMessage : "No messages yet"}
  <span className="message-time">
    {stu.timestamp
      ? new Date(stu.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : ""}
  </span>
</p>


                </div>
              </div>
            ))
          ) : (
            <p className="no-students">No students yet</p>
          )}
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
            <p className="chat-placeholder">Select a student to start chatting</p>
          )}
        </div>
      </div>
    </>
  );
};

export default InstructorChat;
