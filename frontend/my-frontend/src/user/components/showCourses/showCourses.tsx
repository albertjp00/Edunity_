import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./showCourses.css";
import api from "../../../api/userApi";


interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  level: string;
  thumbnail: string;
  skills: string[];
}

interface ApiResponse {
  success: boolean;
  course: Course[];
  skills: string[];
  totalPages: number;
  currentPage: number;
}


const ShowCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [levelFilter, setLevelFilter] = useState<string>("");
  const [skillFilter, setSkillFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const navigate = useNavigate();


  const fetchCourses = async (page: number = 1): Promise<void> => {
    try {
      const res = await api.get(
        `/user/getCourses?page=${page}&limit=6`
      );
      if (res.data.success) {
        setCourses(res.data.course);
        setSkills(res.data.skills?.uniqueSkills || []);
        setTotalPages(res.data.totalPages);
        setCurrentPage(res.data.currentPage);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);


  const selectCourse = (id: string): void => {
    navigate(`/user/courseDetails/${id}`);
  };

  const filteredCourses = courses.filter((course) => {
    const matchesLevel = levelFilter ? course.level === levelFilter : true;
    const matchesSkill = skillFilter
      ? course.skills?.includes(skillFilter)
      : true;
    const matchesSearch = searchQuery
      ? course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesLevel && matchesSkill && matchesSearch;
  });


  return (
    <div className="course-container">
      <h2>Available Courses</h2>

      <div className="search-bar-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="filter-controls">
        <div className="filter-group">
          <span>Level:</span>
          {["Beginner", "Intermediate", "Advanced"].map((level) => (
            <button
              key={level}
              className={`filter-btn ${levelFilter === level ? "active" : ""
                }`}
              onClick={() =>
                setLevelFilter(levelFilter === level ? "" : level)
              }
            >
              {level}
            </button>
          ))}
        </div>

        <div className="filter-group">
          <span>Skill:</span>
          {skills.map((skill) => (
            <button
              key={skill}
              className={`filter-btn ${skillFilter === skill ? "active" : ""
                }`}
              onClick={() =>
                setSkillFilter(skillFilter === skill ? "" : skill)
              }
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <p className="no-courses">No matching courses found.</p>
      ) : (
        <section className="courses-section">
      {/* Section Header */}
      <div className="section-header">
        <div className="section-text">
          <span className="tag">TOP POPULAR COURSE</span>
          <h2>
            Edunity Course <span className="highlight">Student</span> Can Join
            With Us.
          </h2>
        </div>
        <button
          className="load-more-btn"
          onClick={() => fetchCourses(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Load More Course →
        </button>
      </div>

      {/* Courses Grid */}
      <div className="course-grid">
        {courses.map((course) => (
          <div key={course._id} className="course-card">
            <div className="course-thumbnail-wrapper">
              <img
                src={`http://localhost:5000/assets/${course.thumbnail}`}
                alt={course.title}
                className="course-thumbnail"
              />
              <span className="course-category">Digital Marketing</span>
            </div>

            <div className="course-details">
              <h3 className="course-title">{course.title}</h3>

              <div className="course-meta">
                <span>📚 Lesson 10</span>
                <span>⏰ 19h 30m</span>
                <span>👨‍🎓 Students 20+</span>
              </div>

              <div className="course-footer">
                <div className="instructor">
                  <img
                    src="/default-profile.png"
                    alt="instructor"
                    className="instructor-img"
                  />
                  <span>Instructor</span>
                </div>
                <span className="price">₹{course.price}</span>
              </div>

              <button
                className="enroll-btn"
                onClick={() => selectCourse(course._id)}
              >
                Enroll →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
      

      <div className="pagination-controls">
        <button
          disabled={currentPage === 1}
          onClick={() => fetchCourses(currentPage - 1)}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => fetchCourses(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => fetchCourses(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ShowCourses;
