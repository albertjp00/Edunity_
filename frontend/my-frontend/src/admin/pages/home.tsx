import React, { useState, useEffect } from "react";

import { Route, Routes } from "react-router-dom";
import "./home.css";
import Dashboard from "./dashboardPage/dashboardPage";
import UsersAdmin from "./adminUsers/adminUsers";
import InstructorsAdmin from "./adminInstructors/adminInstructors";
import Sidebar from "../components/sidebar/sidebar";
import AdminNavbar from "../components/navbar/navbar";
import PurchasesAdmin from "./purchases/purchasesAdmin";
import AdminEarnings from "../components/earnings/earnings";
import Category from "../components/category/category";

const AdminHome: React.FC = () => {
  const [select] = useState<"dashboard" | "users" | "instructors">(
    "dashboard"
  );

  useEffect(() => {
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
            <Route path="purchases" element={<PurchasesAdmin />} />
            <Route path="earnings" element={<AdminEarnings />} />
            <Route path="category" element={<Category />} />

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
