import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { getSubscriptionCourses } from "../../services/courseServices";


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
  modules?: IModule[];
}

interface IMyCourse {
  _id: string;
  userId: string;
  courseId: string;
  course: ICourse | null; 
  progress: {
    completedModules: string[];
  };
  createdAt: string;
}

const UserMyCourses: React.FC = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const navigate = useNavigate();

  const fetchCourses = async (page: number = 1): Promise<void> => {
    try {
      const res = await getSubscriptionCourses(page);
      if (res?.data.success) {
        // console.log("📦 My Courses Result:", res.data);

        const rawCourses =
          res.data.courses ;

        const validCourses = rawCourses.filter(
          (item: IMyCourse) => item.course !== null
        );

        setCourses(validCourses);
        setCurrentPage(res.data.currentPage || 1);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const selectCourse = (courseId: string): void => {
    navigate(`/user/courseDetails/${courseId}`);
  };

  useEffect(() => {
    fetchCourses(currentPage);
  }, [currentPage]);

  return (
    <div className="my-course-container">
      <h2 className="course-header">My Courses</h2>
      

      {courses.length === 0 ? (
        <p>No courses yet.</p>
      ) : (
        <>
          <div className="my-courseList">
            {courses.map((myCourse) => {
            //   if (!myCourse.course) {
            //     // ✅ Handle deleted/unavailable course
            //     return (
            //       <div key={myCourse._id} className="course-card unavailable">
            //         <p>⚠️ This course is no longer available.</p>
            //       </div>
            //     );
            //   }

              const { _id, title, description, thumbnail, modules = [] } =
                myCourse;
            //   const completedModules =
            //     myCourse.progress?.completedModules?.length || 0;

              return (
                <div
                  key={myCourse._id}
                  className="course-card"
                  onClick={() => selectCourse(_id)}
                >
                  {thumbnail && (
                    <img
                      src={`${import.meta.env.VITE_API_URL}/assets/${thumbnail}`}
                      alt="Thumbnail"
                      className="course-thumbnail"
                    />
                  )}

                  <div className="course-details">
                    <h3 className="course-title">{title}</h3>
                    <p className="course-description">{description}</p>
                    <p className="course-modules">
                      {/* Modules: {completedModules}/{modules.length} */}
                      Modules: {modules.length}
                    </p>
                    <p className="course-enrolled">
                      {/* Enrolled:{" "} */}
                      {/* {new Date(myCourse.createdAt).toLocaleDateString()} */}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

       
          <div className="pagination-controls">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
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
