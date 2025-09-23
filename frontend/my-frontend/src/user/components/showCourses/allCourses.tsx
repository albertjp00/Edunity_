import React, { useEffect, useState } from "react";
import "./allCourses.css";
import api from "../../../api/userApi";
import { useNavigate } from "react-router-dom";

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  price?: number;
  totalEnrolled?: number;
  duration?: string;
  instructorName?: string;
  instructorImage: string;
  category?: string;
  level?: string;
  moduleCount: number;
}

const AllCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const coursesPerPage = 4; // backend limit

  // ✅ filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [sortBy, setSortBy] = useState("");
  const [searchQuery, setSearchQuery] = useState<string>(""); 

  const navigate = useNavigate();

  const fetchCourses = async (page: number = 1) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: coursesPerPage.toString(),
      });

      if (selectedCategories.length > 0) {
        queryParams.append("categories", selectedCategories.join(","));
      }
      if (selectedInstructors.length > 0) {
        queryParams.append("instructors", selectedInstructors.join(","));
      }
      if (selectedPrice) {
        queryParams.append("price", selectedPrice);
      }
      if (selectedLevel) {
        queryParams.append("level", selectedLevel);
      }
      if (sortBy) {
        queryParams.append("sortBy", sortBy);
      }
      if (searchQuery.trim() !== "") {        
        queryParams.append("search", searchQuery.trim());
      }

      const response = await api.get(
        `/user/getAllCourses?${queryParams.toString()}`
      );

      setCourses(response.data.courses);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();
  setCurrentPage(1);
  fetchCourses(1);
};

  const gotoCourse = (id: string): void => {
    navigate(`/user/courseDetails/${id}`);
  };

  // 🔎 Trigger fetch on search + filters
  useEffect(() => {
    fetchCourses(currentPage);
  }, [
    currentPage,
    selectedCategories,
    selectedInstructors,
    selectedPrice,
    selectedLevel,
    sortBy,
    // searchQuery,
  ]);



  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  const handlePriceChange = (price: string) => {
    setSelectedPrice((prev) => (prev === price ? "" : price));
    setCurrentPage(1);
  };

  const handleLevelChange = (level: string) => {
    setSelectedLevel((prev) => (prev === level ? "" : level));
    setCurrentPage(1);
  };

  return (
    <div className="course-page">
      {/* Left Side - Courses */}
      <div className="course-list">
        {/* ✅ Search Input */}
        <form
          className="search-form"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-bttn">
            🔍 Search
          </button>
        </form>



        <h2 className="course-header">All Courses</h2>
        <div className="course-grid">
          {courses.map((course) => (
            <div className="courses-card" key={course._id}>
              <div className="course-thumbnail-wrapper">
                <img
                  src={`http://localhost:5000/assets/${course.thumbnail}`}
                  alt={course.title}
                  className="course-thumbnail"
                />
                <span className="course-category">
                  {course.category || "General"}
                </span>
                <span className="course-price">
                  {course.price && course.price > 0
                    ? `$${course.price}`
                    : "Free"}
                </span>
              </div>

              <div className="course-body">
                <h3 className="course-title">{course.title}</h3>
                <div className="course-meta">
                  <span>Modules {course.moduleCount}</span>
                  <span>{course.duration || "2h 30m"}</span>
                  <span>Students {course.totalEnrolled || "20+"}</span>
                </div>

                <div className="course-footer">
                  <div className="instructor">
                    <img
                      src={`http://localhost:5000/assets/${course.instructorImage}`}
                      alt={course.instructorName || "Unknown"}
                      className="instructor-img"
                    />
                    <span>{course.instructorName || "Unknown"}</span>
                  </div>
                  <button
                    className="enroll-btn"
                    onClick={() => gotoCourse(course._id)}
                  >
                    Enroll →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="page-btn"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Right Side - Filters */}
      <aside className="course-filters">
        <h3>Course Category</h3>
        <ul>
          {[
            "Web Development",
            "Mobile Development",
            "Data Science",
            "Cyber Security",
            "Design",
            "Language",
          ].map((cat) => (
            <li key={cat}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                />
                {cat}
              </label>
            </li>
          ))}
        </ul>

        <h3>Sort By Price</h3>
        <ul>
          <li>
            <label>
              <input
                type="radio"
                name="sortPrice"
                value=""
                checked={sortBy === ""}
                onChange={() => setSortBy("")}
              />
              None
            </label>
          </li>
          <li>
            <label>
              <input
                type="radio"
                name="sortPrice"
                value="priceLowToHigh"
                checked={sortBy === "priceLowToHigh"}
                onChange={(e) => setSortBy(e.target.value)}
              />
              Price: Low to High
            </label>
          </li>
          <li>
            <label>
              <input
                type="radio"
                name="sortPrice"
                value="priceHighToLow"
                checked={sortBy === "priceHighToLow"}
                onChange={(e) => setSortBy(e.target.value)}
              />
              Price: High to Low
            </label>
          </li>
        </ul>

        <h3>Price</h3>
        <ul>
          {["Free", "Paid"].map((p) => (
            <li key={p}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedPrice === p.toLowerCase()}
                  onChange={() => handlePriceChange(p.toLowerCase())}
                />
                {p}
              </label>
            </li>
          ))}
        </ul>

        <h3>Level</h3>
        <ul>
          {["Beginner", "Intermediate", "Expert"].map((lvl) => (
            <li key={lvl}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedLevel === lvl}
                  onChange={() => handleLevelChange(lvl)}
                />
                {lvl}
              </label>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default AllCourses;
