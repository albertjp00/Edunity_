import React, { useEffect, useState, type ChangeEvent } from "react";
import './adminCourse.css'
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getAdminCourses } from "../../services/adminServices";

interface Course {
  _id: string;
  title: string;
  instructorName: string;
  category: string;
  price: number;
  thumbnail?: string;
  blocked: boolean; 
}

const CoursesAdmin: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const coursesPerPage = 5;

  const loadCourses = async (): Promise<void> => {
    try {
      const data = await getAdminCourses();
      if (!data) return;
      setCourses(data?.data.courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleBlock = async (courseId: string): Promise<void> => {
    // try {
    //   const res = await blockCourse(courseId);
    //   if (res.success) {
    //     toast.success("Course Blocked", { autoClose: 1500 });
    //     loadCourses();
    //   }
    // } catch (error) {
    //   console.error("Error blocking course:", error);
    //   toast.error("Failed to block course");
    // }
  };

  const handleUnblock = async (courseId: string): Promise<void> => {
    // try {
    //   const res = await unblockCourse(courseId);
    //   if (res.success) {
    //     toast.success("Course Unblocked", { autoClose: 1500 });
    //     loadCourses();
    //   }
    // } catch (error) {
    //   console.error("Error unblocking course:", error);
    //   toast.error("Failed to unblock course");
    // }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // Filter courses by search
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="course-list">
      <h2>📚 Courses Management</h2>

      <input
        type="text"
        name="search"
        placeholder="🔍 Search by title or instructor"
        value={searchTerm}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearchTerm(e.target.value)
        }
        className="search-box"
      />

      <table className="styled-table">
        <thead>
          <tr>
            <th>Thumbnail</th>
            <th>Title</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentCourses.length > 0 ? (
            currentCourses.map((course) => (
              <tr key={course._id}>
                <td>
                  <img
                    src={
                      course.thumbnail
                        ? `http://localhost:5000/assets/${course.thumbnail}`
                        : "https://via.placeholder.com/80x50"
                    }
                    alt={course.title}
                    className="thumbnail"
                  />
                </td>
                <td>
                  <Link to={`/admin/courseDetails/${course._id}`} className="course-link">
                    {course.title}
                  </Link>
                </td>
                {/* <td>{course.instructorName}</td> */}
                {/* <td>{course.category}</td> */}
                <td>₹{course.price}</td>
                <td>
                  {course.blocked ? (
                    <button
                      className="btn-unblock"
                      onClick={() => handleUnblock(course._id)}
                    >
                      Unblock
                    </button>
                  ) : (
                    <button
                      className="btn-block"
                      onClick={() => handleBlock(course._id)}
                    >
                      Block
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                🚫 No courses found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ⬅ Prev
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default CoursesAdmin;
