import  { useEffect, useState } from "react";
import './adminCourse.css'
import { blockCourse, getAdminCourses } from "../../services/adminServices";
import useDebounce from "../debounce/debounce";
import { useNavigate } from "react-router-dom";
import type { Course } from "../../adminInterfaces";
import ConfirmModal from "../adminUsers/modal";
import { toast } from "react-toastify";



const CoursesAdmin: React.FC = () => {
  const navigate = useNavigate()
  const [courses, setCourses] = useState<Course[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('')


  const [isBlocking, setIsBlocking] = useState<boolean>()
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const coursesPerPage = 5;



  const loadCourses = async (page: number, search: string): Promise<void> => {
    try {
      const { data } = await getAdminCourses(page, search, coursesPerPage);
      if (!data) return;
      console.log('courses',data);

      setCourses(data.courses);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const debouncedSearchTerm = useDebounce(searchQuery, 500)

  useEffect(() => {
    loadCourses(currentPage, debouncedSearchTerm);
  }, [currentPage, debouncedSearchTerm]);


  useEffect(() => {
    if (currentPage == 1) {
      loadCourses(1, debouncedSearchTerm)
    } else {
      setCurrentPage(1)
    }
  }, [debouncedSearchTerm])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page); // triggers loadCourses
    }
  };

  const gotoCourseDetails = (id: string) => {
    navigate(`/admin/courseDetails/${id}`)
  }

  const handleBlock = (id: string): void => {
    setSelectedId(id);
    setIsBlocking(true);
    setShowModal(true);
  };


  const handleUnblock = (id: string): void => {
    setSelectedId(id);
    setIsBlocking(false);
    setShowModal(true);
  };


  // const courseBlock = async (id:string)=>{
  //   try {
  //     const res = await blockCourse(id)
  //     if()
  //     navigate(`/admin/${id}`)
  //   } catch (error) {
  //     console.log(error);

  //   }
  // }


  const confirmAction = async () => {
    try {
      if (!selectedId) return;

      const res = await blockCourse(selectedId);

      if (res.data.success) {
        setCourses(prev =>
          prev.map(course =>
            course.id === selectedId
              ? { ...course, blocked: !course.blocked }
              : course
          )
        );

        toast.success(
          isBlocking ? "Course Blocked" : "Course Unblocked",
          { autoClose: 1500 }
        );
      }
    } catch (error) {
      console.error("Error updating course status:", error);
    } finally {
      setShowModal(false);
      setSelectedId(null);
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
        onChange={(e) => setSearchQuery(e.target.value)}
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody >
          {courses.length > 0 ? (
            courses.map((course) => (
              <tr key={course.id} >
                <td>
                  <img
                    src={

                      `${import.meta.env.VITE_API_URL}/assets/${course.thumbnail}`

                    }
                    onClick={() => gotoCourseDetails(course.id)}
                    alt={course.title}
                    className="thumbnail"
                  />
                </td>
                <td onClick={() => gotoCourseDetails(course.id)}>{course.title}</td>
                <td>{course.category}</td>
                <td>{course.instructorName}</td>
                <td>₹{course.price}</td>
                <td>
                  <button
                    onClick={() =>
                      course.blocked
                        ? handleUnblock(course.id)
                        : handleBlock(course.id)
                    }
                    className={course.blocked ? "btn-unblock" : "btn-block"}
                  >
                    {course.blocked ? "Unblock" : "Block"}
                  </button>
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

      <ConfirmModal
        isOpen={showModal}
        title={isBlocking ? "Block Course" : "Unblock Course"}
        message={`Are you sure you want to ${isBlocking ? "block" : "unblock"} this course?`}
        onConfirm={confirmAction}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
};


export default CoursesAdmin;
