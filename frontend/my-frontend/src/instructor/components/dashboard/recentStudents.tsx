import React from "react";
import type { DashStudent } from "../../interterfaces/instructorInterfaces";

// const recentStudents = [
//   { name: "Aarav Mehta", course: "React Basics" },
//   { name: "Priya Sharma", course: "Node.js Mastery" },
//   { name: "John Doe", course: "UI Design" },
// ];



interface RecentStudentsProps {
  students: DashStudent[];
}

const RecentStudents: React.FC<RecentStudentsProps> = ({students}) => (
  <div className="recent-students">
    <h4>Recent Students</h4>
    {students.length === 0 ? (
      <p>No recent students</p>
    ) : (
      <ul>
        {students.map((s, i) => (
          <li key={i}>
            <strong>{s.name}</strong> – {s.course} <br />
            <small>{new Date(s.date).toLocaleDateString()}</small>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default RecentStudents;
