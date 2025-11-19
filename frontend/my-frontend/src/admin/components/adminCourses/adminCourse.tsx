import React, { useEffect, useState} from "react";
import './adminCourse.css'
import { getAdminCourses } from "../../services/adminServices";
import useDebounce from "../debounce/debounce";

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

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery , setSearchQuery] = useState<string>('')
  const coursesPerPage = 5;

  

  const loadCourses = async (page: number , search : string): Promise<void> => {
    try {
      const { data } = await getAdminCourses(page, search, coursesPerPage); 
      if (!data) return;

      setCourses(data.courses);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const debouncedSearchTerm = useDebounce(searchQuery , 500)

  useEffect(() => {
    loadCourses(currentPage,debouncedSearchTerm);
  }, [currentPage,debouncedSearchTerm]);


  useEffect(()=>{
    if(currentPage == 1){
      loadCourses(1 , debouncedSearchTerm)
    }else{
      setCurrentPage(1)
    }
  },[debouncedSearchTerm])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page); // triggers loadCourses
    }
  };






  return (
    <div className="course-list">
      <h2>📚 Courses Management</h2>

      <input
        type="text"
        name="search"
        placeholder="🔍 Search by title or instructor"
        value={searchQuery}
        onChange={(e) =>setSearchQuery(e.target.value)}
        className="search-box"
      />

      <table className="styled-table">
        <thead>
          <tr>
            <th>Thumbnail</th>
            <th>Title</th>
            <th>Category</th>
            <th>Instructor</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {courses.length > 0 ? (
            courses.map((course) => (
              <tr key={course._id}>
                <td>
                  <img
                    src={
                      course.thumbnail
                        ? `${import.meta.env.VITE_API_URL}/assets/${course.thumbnail}`
                        : "https://via.placeholder.com/80x50"
                    }
                    alt={course.title}
                    className="thumbnail"
                  />
                </td>
                <td>{course.title}</td>
                <td>{course.category}</td>
                <td>{course.instructorName}</td>
                <td>₹{course.price}</td>
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
