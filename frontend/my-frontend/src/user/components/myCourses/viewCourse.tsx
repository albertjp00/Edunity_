import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./viewMyCourse.css";
import api from "../../../api/userApi";
import { viewMyCourse } from "../../services/courseServices";

const API_URL = import.meta.env.VITE_API_URL;

interface IInstructor {
  _id: string;
  name: string;
  email: string;
  expertise?: string;
  bio?: string;
  profileImage?: string;
  work?: string;
  education?: string;
}

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

const ViewMyCourse: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [instructor, setInstructor] = useState<IInstructor | null>(null);
  const [quiz, setQuiz] = useState<boolean>();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const navigate = useNavigate();

  const fetchCourse = async (): Promise<void> => {
    try {
      if (!id) {
        console.error("Course ID is missing");
        return;
      }
      const res = await viewMyCourse(id)

      if (!res) return
      console.log(res);
      const fetchedMyCourse: IMyCourse = res.data.course;
      const fetchedInstructor: IInstructor = res.data.instructor;
      setCourse(fetchedMyCourse.course);
      setInstructor(fetchedInstructor);
      setCompletedModules(fetchedMyCourse.progress?.completedModules || []);
      setQuiz(res.data.quiz);
    } catch (err) {
      console.error("Error fetching course:", err);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  const toggleModule = (index: number): void => {
    setExpandedModule(expandedModule === index ? null : index);
  };

  const markAsCompleted = async (moduleTitle: string): Promise<void> => {
    try {
      await api.post("/user/updateProgress", { courseId: id, moduleTitle });
      setCompletedModules((prev) => [...prev, moduleTitle]);
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  const gotoQuiz = (myCourseId: string) => {
    navigate(`/user/quiz/${myCourseId}`);
  };

  if (!course) return <p>Loading...</p>;

  const totalModules = course.modules.length;
  const completedCount = completedModules.length;
  const progressPercent = Math.round((completedCount / totalModules) * 100);

  return (
    <div className="course-details-wrapper">
      <div className="course-header">
        <h2>Course Details</h2>
        <p className="breadcrumb">Home / My Course</p>
      </div>

      <div className="course-container">
        {/* LEFT SIDE */}
        <div className="course-main">
          <img
            src={`${API_URL}/assets/${course.thumbnail}`}
            alt="Course Thumbnail"
            className="course-banner"
          />

          <h3 className="course-title">{course.title}</h3>
          <p className="lesson-count">Lesson {totalModules}</p>

          {/* Tabs */}
          <div className="course-tabs">
            <button
              className={activeTab === "overview" ? "active" : ""}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={activeTab === "curriculum" ? "active" : ""}
              onClick={() => setActiveTab("curriculum")}
            >
              Curriculum
            </button>
            <button
              className={activeTab === "instructor" ? "active" : ""}
              onClick={() => setActiveTab("instructor")}
            >
              Instructor
            </button>
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="tab-content">
              <h4>Course Description</h4>
              <p>{course.description}</p>

              <h4>What Will I Learn?</h4>
              <p>
                You’ll learn everything from frontend to backend development
                including real-world projects and best practices to become a
                professional web developer.
              </p>
            </div>
          )}

          {/* CURRICULUM TAB */}
          {activeTab === "curriculum" && (
            <div className="tab-content">
              <h4>Course Progress: {progressPercent}%</h4>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              <div className="modules">
                {course.modules.map((module, idx) => {
                  const isCompleted = completedModules.includes(module.title);
                  return (
                    <div key={idx} className="module-card">
                      <div
                        className="module-header"
                        onClick={() => toggleModule(idx)}
                      >
                        <h5>
                          📘 {module.title || `Module ${idx + 1}`}
                          {isCompleted && (
                            <span className="completed-tag">Completed</span>
                          )}
                        </h5>
                      </div>
                      {expandedModule === idx && (
                        <div className="module-body">
                          {module.videoUrl && (
                            <video
                              width="100%"
                              height="auto"
                              controls
                              className="module-video"
                            >
                              <source
                                // src={`${API_URL}/assets/${module.videoUrl}`}
                                src = 'https://bucketedunity.s3.ap-south-1.amazonaws.com/tutorial.mp4'
                                type="video/mp4"
                              />
                            </video>
                          )}
                          <p>{module.content}</p>
                          {!isCompleted && (
                            <button
                              onClick={() => markAsCompleted(module.title)}
                              className="mark-complete-btn"
                            >
                              Mark as Completed
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {completedModules.length === totalModules && quiz && (
                <button
                  className="quiz-btn"
                  onClick={() => gotoQuiz(course._id)}
                >
                  🎯 Go to Quiz
                </button>
              )}
            </div>
          )}

          {/* INSTRUCTOR TAB */}
          {activeTab === "instructor" && instructor && (
            <div className="tab-content instructor-tab">
              <img
                src={
                  instructor.profileImage
                    ? `${API_URL}/assets/${instructor.profileImage}`
                    : "https://via.placeholder.com/100"
                }
                alt="Instructor"
                className="instructor-photo"
              />
              <h4>{instructor.name}</h4>
              <p className="instructor-role">
                {instructor.expertise || "Professional Instructor"}
              </p>
              <p>{instructor.bio || "No bio available."}</p>

              <button
                className="chat-btn"
                onClick={() =>
                  (window.location.href = `/user/chat/${instructor._id}`)
                }
              >
                💬 Chat with Instructor
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="course-sidebar">
          <div className="sidebar-card">
            <img
              src={`${API_URL}/assets/${course.thumbnail}`}
              alt="Course"
              className="sidebar-thumbnail"
            />
            <div className="sidebar-info">
              <p className="price">
                {/* <span className="current-price">${course.price}</span> */}
                {/* <span className="old-price">$120</span> */}
              </p>
              <button className="buy-btn">Continue Course</button>
              <div className="sidebar-stats">
                <p>
                  <strong>Enrolled:</strong> 100
                </p>
                <p>
                  <strong>Lectures:</strong> {totalModules}
                </p>
                <p>
                  <strong>Skill Level:</strong> Beginner
                </p>
                <p>
                  <strong>Language:</strong> English
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMyCourse;
