import React, { useEffect, useState } from "react";
import "./myCourses.css";
import { useNavigate } from "react-router-dom";
import { getMyCourses } from "../../services/courseServices";

const API_URL = import.meta.env.VITE_API_URL || "";

interface IModule {
  title: string;
  videoUrl: string;
  content: string;
}

interface ICourse {
  _id: string;
  title: string;
  description: string;
  price: string;
  thumbnail: string;
  modules: IModule[];
}

interface IMyCourse {
  _id: string;
  userId: string;
  courseId: string;
  course: ICourse;
  progress: {
    completedModules: string[];
  };
  createdAt: string;
}

// interface IApiResponse {
//   success: boolean;
//   course: IMyCourse[];
//   currentPage: number;
//   totalPages: number;
// }

const UserMyCourses: React.FC = () => {
  const [courses, setCourses] = useState<IMyCourse[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const navigate = useNavigate();

  const fetchCourses = async (page: number = 1): Promise<void> => {
    try {
      const res = await getMyCourses(page);
      if (res?.data.success) {
        setCourses(res.data.courses);
        setCurrentPage(res.data.currentPage);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const selectCourse = (courseId: string): void => {
    navigate(`/user/viewMyCourse/${courseId}`);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="my-course-container">

      <h2 className="course-header">My Courses</h2>

      {courses.length === 0 ? (
        <p>No courses yet.</p>
      ) : (
        <>
          <div className="my-courseList">
            {courses.map((myCourse) => {
              const totalModules = myCourse.course.modules?.length || 0;
              const completedModules = myCourse.progress.completedModules.length;

              return (
                <div
                  key={myCourse._id}
                  className="course-card"
                  onClick={() => selectCourse(myCourse._id)}
                >
                  {myCourse.course.thumbnail && (
                    <img
                      src={`${API_URL}/assets/${myCourse.course.thumbnail}`}
                      alt="Thumbnail"
                      className="course-thumbnail"
                    />
                  )}

                  <div className="course-details">
                    <h3 className="course-title">{myCourse.course.title}</h3>
                    <p className="course-description">
                      {myCourse.course.description}
                    </p>
                    <p className="course-modules">
                      Modules: {completedModules}/{totalModules}
                    </p>
                    <p className="course-enrolled">
                      Enrolled:{" "}
                      {new Date(myCourse.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
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
        </>
      )}
    </div>
  );
};

export default UserMyCourses;
