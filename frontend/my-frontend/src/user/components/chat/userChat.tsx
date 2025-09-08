// src/pages/UserChat.jsx
import React from "react";
import ChatWindow from "./chatWindow";

const UserChat = () => {
  const userId = "user123";        // Replace with logged-in user ID
  const instructorId = "instructor456"; // Replace with selected instructor ID

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Chat with Instructor</h1>
      <ChatWindow userId={userId} receiverId={instructorId} />
    </div>
  );
};

export default UserChat;
