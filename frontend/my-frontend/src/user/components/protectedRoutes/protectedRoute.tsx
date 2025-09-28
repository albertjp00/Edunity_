// ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../../../api/userApi";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem("token");
  const [blocked, setBlocked] = useState<boolean | null>(null);

  useEffect(() => {
    const checkBlocked = async () => {
      try {
        const res = await api.get("/user/isBlocked");
        setBlocked(res.data.blocked);
      } catch (error) {
        console.error("Error checking blocked status:", error);
        setBlocked(false);
      }
    };

    if (token) {
      checkBlocked();
    } else {
      setBlocked(false);
    }
  }, [token]);

  // ⏳ Don’t render children until check finishes
  if (blocked === null) {
    return <div>Loading...</div>;
  }

  // 🔒 If blocked or no token
  if (!token || blocked) {
    localStorage.removeItem("token");
    return <Navigate to="/user/login" replace />;
  }

  // ✅ Only render children when safe
  return <>{children}</>;
};


export default ProtectedRoute;
