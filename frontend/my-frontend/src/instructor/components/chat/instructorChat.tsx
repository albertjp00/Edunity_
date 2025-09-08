// src/pages/InstructorChat.jsx
import React from "react";
import ChatWindow from "../../../user/components/chat/chatWindow";

const InstructorChat = () => {
  const instructorId = "instructor456"; // Replace with logged-in instructor ID
  const userId = "user123";             // Replace with selected user ID

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Chat with User</h1>
      <ChatWindow userId={instructorId} receiverId={userId} />
    </div>
  );
};

export default InstructorChat;
