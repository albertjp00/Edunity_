import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./showCourses.css";
import { showCourses } from "../../services/courseServices";

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  level: string;
  thumbnail: string;
  skills: string[];
  instructorName: string;
  instructorImage: string;
  category:string
}

const ShowCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  const fetchCourses = async (): Promise<void> => {
    try {
      const res = await showCourses()
      if(!res) return
      if (res.data.success) {
        console.log(res);
        
        setCourses(res.data.course);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const gotoAllCourses = (): void => {
    navigate("/user/allCourses");
  };

  const selectCourse = (id: string): void => {
    navigate(`/user/courseDetails/${id}`);
  };

  return (
    <div className="course-container">
      <section className="courses-section">
        {/* Header */}
        <div className="section-header">
          <div className="section-text">
            <span className="tag">TOP POPULAR COURSE</span>
            <h2>
              Edunity Course <span className="highlight">Students</span> Can Join
              With Us.
            </h2>
          </div>
          <button className="load-more-btn" onClick={gotoAllCourses}>
            Load More Courses →
          </button>
        </div>

        {/* Course Grid */}
        <div className="course-structure">
          
          {courses.length === 0 ? (
            <p className="no-courses">No courses available right now.</p>
          ) : (
            courses.map((course) => (
              <div key={course._id} className="course-card">
  <div className="course-thumbnail-wrapper">
    <img
      src={`${import.meta.env.VITE_API_URL}/assets/${course.thumbnail}`}
      alt={course.title}
      className="course-thumbnail"
    />
    <span className="course-category">{course.category || "web Development"}</span>
  </div>

  <div className="course-details">
    <span className="price">₹{course.price}</span>

    <h3 className="course-title">{course.title}</h3>

    <div className="course-meta">
      <span>📚 Lesson 10</span>
      <span>⏰ 6h</span>
      <span>👨‍🎓 Students 20+</span>
    </div>

    <div className="course-footer">
      <div className="instructor">
        <img
          src={`${import.meta.env.VITE_API_URL}/assets/${course.instructorImage}`}
          alt="instructor"
          className="instructor-img"
        />
        <span>{course.instructorName}</span>
      </div>

      <button
        className="enroll-btn"
        onClick={() => selectCourse(course._id)}
      >
        Enroll →
      </button>
    </div>
  </div>
</div>

            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default ShowCourses;
