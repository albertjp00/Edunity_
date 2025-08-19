import React, { useEffect, useState } from "react";
import "./myCourses.css";
import { useNavigate } from "react-router-dom";
import api from "../../../api/userApi";

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
      const res = await api.get(`/user/myCourses`);
      if (res.data.success) {
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
    <div className="course-container">
      <h2>My Courses</h2>
      {courses.length === 0 ? (
        <p>No courses yet.</p>
      ) : (
        <div className="course-list">
          {courses.map((myCourse) => (
            <div
              key={myCourse._id}
              className="course-card"
              onClick={() => selectCourse(myCourse._id)}
            >
              {myCourse.course.thumbnail && (
                <img
                  src={`http://localhost:5000/assets/${myCourse.course.thumbnail}`}
                  alt="Thumbnail"
                  className="course-thumbnail"
                />
              )}

              <div className="course-details">
                <h3 className="course-title">{myCourse.course.title}</h3>
                <p className="course-description">{myCourse.course.description}</p>
                <p className="course-price">₹{myCourse.course.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserMyCourses;
