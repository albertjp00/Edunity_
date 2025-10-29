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

const ITEMS_PER_PAGE = 6; // you can change this

const MyCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
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
    navigate("/instructor/addCourse");
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCourses = courses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // optional: scroll to top on page change
  };

  return (
    <div className="my-courses-page">
      <div className="mycourses-banner">
        <h1>MY COURSES</h1>
        <p className="breadcrumb">Home / Instructor</p>
      </div>

      <div className="my-courses-container">
        <div className="courses-header">
          <div className="left-section">
            <span className="provides-label">PROVIDES</span>
            <h2>Courses</h2>
          </div>

          <button className="create-course-btn" onClick={addCourse}>
            Create Course
          </button>
        </div>

        {courses.length === 0 ? (
          <p>No courses yet.</p>
        ) : (
          <>
            <div className="course-grid">
              {currentCourses.map((course) => (
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="page-btn"
                >
                  ⬅ Prev
                </button>

                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    className={`page-number ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="page-btn"
                >
                  Next ➡
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
