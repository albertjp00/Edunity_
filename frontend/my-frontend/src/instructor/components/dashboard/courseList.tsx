import React, { useEffect, useState } from "react";
import instructorApi from "../../../api/instructorApi";

interface Course {
  _id: string;
  title: string;
  totalEnrolled: number;
  status: string;
}

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await instructorApi.get("/instructor/getCourse");
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
            <tr key={c._id}>
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
