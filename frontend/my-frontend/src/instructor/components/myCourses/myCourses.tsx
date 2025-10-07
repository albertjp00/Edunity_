import React, { useEffect, useState } from "react";
import "./myCourses.css";
import { useNavigate } from "react-router-dom";
import instructorApi from "../../../api/instructorApi";

interface Course {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  price?: number;
  totalEnrolled?: number;
  category?: string;
  instructorName?: string;
  instructorAvatar?: string;
}

const MyCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const res = await instructorApi.get(`/instructor/getCourse`);
      if (res.data.success) {
        setCourses(res.data.course);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const selectCourse = (id: string) => {
    navigate(`/instructor/courseDetails/${id}`);
  };

  const addCourse = () => {
    navigate('/instructor/addCourse')
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="my-courses-page">
      {/* ======= Banner Section ======= */}
      
      <div className="mycourses-banner">
        <h1>MY COURSES</h1>
        <p className="breadcrumb">Home / Instructor</p>
      </div>


      {/* ======= Courses Section ======= */}
      <div className="my-courses-container">
        <div className="courses-header">
          <div className="left-section">
            <span className="provides-label">PROVIDES</span>
            <h2>Courses</h2>
          </div>

          <button className="create-course-btn" onClick={addCourse}>Create Course</button>
        </div>

        {courses.length === 0 ? (
          <p>No courses yet.</p>
        ) : (
          <div className="course-grid">
            {courses.map((course) => (
              <div
                key={course._id}
                className="course-card"
                onClick={() => selectCourse(course._id)}
              >
                <div className="course-image-container">
                  <img
                    src={`http://localhost:5000/assets/${course.thumbnail}`}
                    alt={course.title}
                    className="course-image"
                  />
                  <span className="course-category">
                    {course.category || "Digital Marketing"}
                  </span>
                  <span className="course-price">
                    ₹{course.price?.toFixed(2) || "Free"}
                  </span>
                </div>

                <div className="course-content">
                  <h3 className="course-title">{course.title}</h3>

                  <div className="course-meta">
                    <span>Lesson 10</span>
                    <span>🕒 1h 30m</span>
                    <span>👥 {course.totalEnrolled || 0} Students</span>
                  </div>

                  <div className="course-footer">
                    

                    <button className="edit-btn">Edit →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
