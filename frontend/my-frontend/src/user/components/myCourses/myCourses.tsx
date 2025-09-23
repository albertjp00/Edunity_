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



const UserMyCourses: React.FC = () => {
  const [courses, setCourses] = useState<IMyCourse[]>([]);
  const navigate = useNavigate();

  const fetchCourses = async (): Promise<void> => {
    try {
      const res = await getMyCourses();
      if (res?.data.success) {
        setCourses(res.data.course);
        console.log("courses", res.data);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const selectCourse = (courseId: string): void => {
    console.log("Selected course:", courseId);
    navigate(`/user/viewMyCourse/${courseId}`);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="my-course-container">
      <h2>My Courses</h2>
      {courses.length === 0 ? (
        <p>No courses yet.</p>
      ) : (
        <div className="my-courseList">
          {courses.map((myCourse) => {
            const totalModules = myCourse.course.modules?.length || 0;
            const completedModules = myCourse.progress.completedModules.length;

            const progressPercent = totalModules
              ? Math.round((completedModules / totalModules) * 100)
              : 0;

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
                  <p className="course-description">{myCourse.course.description}</p>
                  <p className="course-modules">
                    Modules: {completedModules}/{totalModules}
                  </p>
                  <p className="course-progress">Progress: {progressPercent}%</p>
                  <p className="course-enrolled">
                    Enrolled: {new Date(myCourse.createdAt).toLocaleDateString()}
                  </p>
                </div>

              </div>
            );
          })}

        </div>
      )}
    </div>
  );
};

export default UserMyCourses;
