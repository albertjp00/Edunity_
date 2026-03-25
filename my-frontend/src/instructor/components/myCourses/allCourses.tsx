import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses } from "../../services/instructorServices";
import useDebounce from "../../../admin/components/debounce/debounce";

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


const InstructorAllCourses: React.FC = () => {

    const navigate = useNavigate()
    const [courses, setCourses] = useState<Course[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [totalPages, setTotalPages] = useState(1);

    const debouncedSearchTerm = useDebounce(searchQuery,500)

    const fetchCourses = async (query: string, page: number = 1) => {
        try {
            const res = await getCourses(query, page);
            if (!res) return;
            // console.log(res);
            

            if (res.data.success) {
                setCourses(res.data.course);
                setTotalPages(res.data.totalPages);
            }
        } catch (err) {
            console.error("Error fetching courses:", err);
        }
    };

    useEffect(() => {
        fetchCourses(searchQuery, currentPage);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);   
        fetchCourses(searchQuery, 1);
    };

    const handlePageChange = (page: number) => {
  setCurrentPage(page);
  fetchCourses(searchQuery, page);
};



    const selectCourse = (id: string) => {
        navigate(`/instructor/courseDetails/${id}`);
    };

    //   const addCourse = () => {
    //     navigate("/instructor/addCourse");
    //   };

    useEffect(() => {
        fetchCourses(searchQuery);
    }, []);

    useEffect(()=>{
        if(currentPage ===1){
            fetchCourses(debouncedSearchTerm,1)
        }else{
            setCurrentPage(1)
        }
    },[debouncedSearchTerm])


 return (
  <div className="min-h-screen bg-gray-50">
    {/* Banner Section */}
    <div className="bg-slate-900 py-12 px-6 text-center text-white">
      <h1 className="text-3xl font-bold tracking-tight uppercase">MY COURSES</h1>
      <p className="mt-1 text-xs text-slate-400 uppercase tracking-widest">Home / Instructor</p>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header & Search Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
        <div>
          <span className="text-blue-600 font-bold text-[10px] tracking-[0.2em] uppercase">PROVIDES</span>
          <h2 className="text-2xl font-bold text-gray-800">Courses</h2>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex items-center w-full md:w-80 relative">
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full pl-4 pr-12 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="absolute right-2 p-1.5 text-gray-400 hover:text-blue-600 transition-colors">
            🔍
          </button>
        </form>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-400">No courses yet.</p>
        </div>
      ) : (
        <>
          {/* Refined Smaller Grid: 4 columns on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {courses.map((course) => (
              <div
                key={course._id}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 flex flex-col"
                onClick={() => selectCourse(course.id)}
              >
                {/* Compact Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-200">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/assets/${course.thumbnail}`}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className="px-2 py-0.5 bg-white/95 backdrop-blur-sm text-blue-600 text-[10px] font-bold rounded shadow-sm w-fit">
                      {course.category || "Digital Marketing"}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <span className="px-2 py-0.5 bg-blue-600 text-white text-[11px] font-bold rounded shadow-md">
                      ₹{course.price?.toFixed(0) || "Free"}
                    </span>
                  </div>
                </div>

                {/* Compact Body */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-sm font-bold text-gray-800 mb-3 line-clamp-2 leading-tight">
                    {course.title}
                  </h3>

                  <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-500 font-medium">
                    <span className="flex items-center gap-1">📘 10</span>
                    <span className="flex items-center gap-1">⏱ 19h</span>
                    <span className="text-blue-600 font-semibold">{course.totalEnrolled || 0}+ Students</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-3 py-1.5 text-xs border rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Prev
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    className={`w-8 h-8 rounded-md text-xs font-medium transition-all ${
                      currentPage === index + 1
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100 text-gray-500"
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
                className="px-3 py-1.5 text-xs border rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  </div>
);
};

export default InstructorAllCourses;
