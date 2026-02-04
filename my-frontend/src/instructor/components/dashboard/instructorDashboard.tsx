import React, { useEffect, useState } from "react";
import "./instructorDashboard.css";

import EarningsChart from "./earningsChart";
import RecentStudents from "./recentStudents";
import StatsCard from "./statsCard";
// import CourseList from "./courseList";
import InstructorNavbar from "../navbar/navbar";
import { getStats } from "../../services/instructorServices";
import type { Stats } from "../../interterfaces/instructorInterfaces";



const InstructorDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getStats()
        if(!res) return
        
        setStats(res.data.dashboard);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      <InstructorNavbar />
      <div className="instructor-dashboard">
        <h2>Instructor Dashboard</h2>

        {/* Stats Overview */}
        <div className="stats-grid">
          <StatsCard title="Total Courses" value={stats?.totalCourses || 0} />
          <StatsCard title="Total Students" value={stats?.totalStudents || 0} />

          
        </div>

        {/* Chart and Recent Students */}
        <div className="dashboard-grid">
          <EarningsChart />
          <RecentStudents students={stats?.recentStudents || []} />
        </div>

        {/* Course List */}
        {/* <CourseList /> */}
      </div>
    </>
  );
};

export default InstructorDashboard;
