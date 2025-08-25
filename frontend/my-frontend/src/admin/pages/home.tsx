import React, { useState, useEffect } from "react";

import { Route, Routes } from "react-router-dom";
import "./home.css";
import Dashboard from "./dashboard/dashboard";
import UsersAdmin from "./adminUsers/adminUsers";
import InstructorsAdmin from "./adminInstructors/adminInstructors";
import Sidebar from "../components/sidebar/sidebar";
import AdminNavbar from "../components/navbar/navbar";

const AdminHome: React.FC = () => {
  // Explicit union type for selected tab
  const [select, setSelect] = useState<"dashboard" | "users" | "instructors">(
    "dashboard"
  );

  useEffect(() => {
    // Example effect: you can add logic to persist tab selection here
    console.log("Current selected:", select);
  }, [select]);

  return (
    <div className="home">
      <AdminNavbar />
      <div className="admin-container">
        <Sidebar />

        <div className="a">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UsersAdmin />} />
            <Route path="instructors" element={<InstructorsAdmin />} />
            {/* <Route path='courses' element={<CourseAdmin />}/> */}
          </Routes>
        </div>

        {/* Alternative conditional rendering (kept as reference)
        <div className="main-content">
          {select === "dashboard" && <Dashboard />}
          {select === "users" && <UsersAdmin />}
          {select === "instructors" && <InstructorsAdmin />}
        </div> 
        */}
      </div>
    </div>
  );
};

export default AdminHome;
