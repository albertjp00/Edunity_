import React, { useEffect, useState } from "react";
import { getCourse } from "../../services/Instructor/instructorServices";

interface Course {
  _id: string;
  id:string;
  title: string;
  totalEnrolled: number;
  status: string;
}

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await getCourse()
      if(!res) return
      setCourses(res.data.course);
    };
    fetchCourses();
  }, []);

  return (
    <div className="course-list">
      <h4>My Courses</h4>
      <table>
        <thead>
          <tr>
            <th>Course</th>
            <th>Students</th>
            
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.id}>
              <td>{c.title}</td>
              <td>{c.totalEnrolled}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseList;
