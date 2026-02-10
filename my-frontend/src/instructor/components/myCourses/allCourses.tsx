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

                    <form className="search-form" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="search-bttn">
                            🔍 
                        </button>
                    </form>

                    {/* <button className="create-course-btn" onClick={addCourse}> */}
                    {/* Create Course */}
                    {/* </button> */}
                </div>

                {courses.length === 0 ? (
                    <p>No courses yet.</p>
                ) : (
                    <>
                        <div className="course-grid">
                            {courses.map((course) => (
                                <div
                                    key={course._id}
                                    className="course-card"
                                    onClick={() => selectCourse(course.id)}
                                >
                                    <div className="course-image-container">
                                        <img
                                            src={`${import.meta.env.VITE_API_URL}/assets/${course.thumbnail}`}
                                            alt={course.title}
                                            className="course-image"
                                        />
                                        <div className="course-top-info">
                                            <span className="course-category">{course.category || "Digital Marketing"}</span>
                                            <span className="course-price">
                                                ₹{course.price?.toFixed(2) || "Free"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="course-body">
                                        <h3 className="course-title">{course.title}</h3>

                                        <div className="course-meta">
                                            <span>📘 Lesson 10</span>
                                            <span>⏱ 19h 30m</span>
                                            <span>👥 {course.totalEnrolled || 0}+ Students</span>
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
                                        className={`page-number-show ${currentPage === index + 1 ? "active" : ""
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

export default InstructorAllCourses;
