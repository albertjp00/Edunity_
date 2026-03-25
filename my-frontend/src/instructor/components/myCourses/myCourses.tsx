import { useEffect, useState } from "react";
import "./myCourses.css";
import { useNavigate } from "react-router-dom";
import { getCourses } from "../../services/instructorServices";

interface Course {
  _id: string;
  id:string;
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
      const res = await getCourses('',1)
      if(!res) return
      console.log(res);
      
      if (res.data.success) {
        const c = res.data.course
        const course = c.slice(0,4)
        setCourses(course);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const selectCourse = (id: string) => {
    navigate(`/instructor/courseDetails/${id}`);
  };

  const addCourse = () => {
    navigate("/instructor/allCourses");
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
  <div className="min-h-screen bg-gray-50">
    {/* Banner Section */}
    <div className="bg-blue-900 py-16 px-6 text-center text-white">
      <h1 className="text-4xl font-bold tracking-tight uppercase">MY COURSES</h1>
      <p className="mt-2 text-sm text-blue-200">Home / Instructor</p>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div className="left-section">
          <span className="text-blue-600 font-bold text-xs tracking-widest uppercase">PROVIDES</span>
          <h2 className="text-3xl font-extrabold text-gray-900">Courses</h2>
        </div>

        <button 
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200" 
          onClick={addCourse}
        >
          All Courses <span className="ml-2">→</span>
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No courses yet.</p>
        </div>
      ) : (
        <>
          {/* Course Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentCourses.map((course) => (
              <div
                key={course._id}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-100"
                onClick={() => selectCourse(course.id)}
              >
                {/* Image Container */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/assets/${course.thumbnail}`}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold rounded-full shadow-sm">
                      {course.category || "Digital Marketing"}
                    </span>
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-lg">
                      ₹{course.price?.toFixed(2) || "Free"}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 min-h-[3.5rem]">
                    {course.title}
                  </h3>

                  <div className="flex items-center justify-between text-gray-500 text-xs font-medium border-t pt-4">
                    <span className="flex items-center">📘 10 Lessons</span>
                    <span className="flex items-center">⏱ 19h 30m</span>
                    <span className="flex items-center text-blue-600">
                      👥 {course.totalEnrolled || 0}+
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                ⬅ Prev
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    className={`w-10 h-10 rounded-md font-medium transition-all ${
                      currentPage === index + 1
                        ? "bg-blue-600 text-white shadow-md"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
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
