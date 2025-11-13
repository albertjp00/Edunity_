import React from "react";

const recentStudents = [
  { name: "Aarav Mehta", course: "React Basics" },
  { name: "Priya Sharma", course: "Node.js Mastery" },
  { name: "John Doe", course: "UI Design" },
];

interface Student {
  name: string;
  email: string;
  course: string;
  date: string;
}

interface RecentStudentsProps {
  students: Student[];
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
