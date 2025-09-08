import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./viewMyCourse.css";
import api from "../../../api/userApi";
import { viewMyCourse } from "../../services/courseServices";
const API_URL = import.meta.env.VITE_API_URL



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


// Interfaces
interface IModule {
  title: string;
  videoUrl: string;
  content: string;
}

interface ICourse {
  id: string;
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


  const fetchCourse = async (): Promise<void> => {
    try {
      if (!id) {
        console.error("Course ID is missing");
        return;
      }
      const res: any = await viewMyCourse(id)

      if (!res) return
      const fetchedMyCourse: IMyCourse = res.data.course;
      const fetchedInstructor: IInstructor = res.data.instructor;
      setCourse(fetchedMyCourse.course);
      setInstructor(fetchedInstructor)
      setCompletedModules(fetchedMyCourse.progress?.completedModules || []);
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

  const convertToEmbedUrl = (url: string): string => {
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/"))
      return url.replace("youtu.be/", "www.youtube.com/embed/");
    return url;
  };

  const markAsCompleted = async (moduleTitle: string): Promise<void> => {
    try {
      await api.post(
        "/user/updateProgress",
        { courseId: id, moduleTitle },

      );
      setCompletedModules((prev) => [...prev, moduleTitle]);
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  if (!course) return <p>Loading...</p>;

  const totalModules = course.modules.length;
  const completedCount = completedModules.length;
  const progressPercent = Math.round((completedCount / totalModules) * 100);

  return (
    <div>

      <div className="course-detail-page">
        <h2>{course.title}</h2>

        {course.thumbnail && (
          <img
            src={`${API_URL}/assets/${course.thumbnail}`}
            alt="Course Thumbnail"
            className="detail-thumbnail"
          />
        )}

        {/* Progress Bar */}
        <div className="progress-bar" style={{ marginBottom: "20px" }}>
          <p>
            <strong>Progress:</strong> {progressPercent}%
          </p>
          <div
            style={{
              height: "10px",
              background: "#eee",
              borderRadius: "5px",
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: "10px",
                background: "#4caf50",
                borderRadius: "5px",
              }}
            ></div>
          </div>
        </div>

        {/* Modules */}
        <div className="modules">
          <h3>Modules:</h3>
          {course.modules.map((module, idx) => {
            const isCompleted = completedModules.includes(module.title);
            return (
              <div key={idx} className="module">
                <div
                  className="module-header"
                  onClick={() => toggleModule(idx)}
                  style={{
                    cursor: "pointer",
                    background: "#f0f0f0",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                >
                  <h4>📘 {module.title || `Module ${idx + 1}`}</h4>
                </div>

                {expandedModule === idx && (
                  <div className="module-body" style={{ padding: "10px 20px" }}>
                    {/* Video */}
                    {module.videoUrl.includes("youtube.com") ||
                      module.videoUrl.includes("youtu.be") ? (
                      <iframe
                        width="100%"
                        height="315"
                        src={convertToEmbedUrl(module.videoUrl)}
                        title="Lesson Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ marginTop: "10px" }}
                      ></iframe>
                    ) : (
                      <video
                        width="100%"
                        height="auto"
                        controls
                        style={{ marginTop: "10px" }}
                      >
                        <source src={module.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}

                    <p style={{ marginTop: "10px" }}>
                      <strong>📝 Content:</strong> {module.content}
                    </p>

                    {/* Progress Button */}
                    {!isCompleted ? (
                      <button
                        onClick={() => markAsCompleted(module.title)}
                        style={{
                          marginTop: "10px",
                          padding: "8px 16px",
                          backgroundColor: "#1976d2",
                          color: "#fff",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        Mark as Completed
                      </button>
                    ) : (
                      <p style={{ color: "green", marginTop: "10px" }}>
                        ✅ Completed
                      </p>
                    )}
                  </div>




                )}
              </div>
            );
          })}
        </div>

        {instructor && (
  <div className="instructor-card">
    <h3>👨‍🏫 Instructor</h3>
    <div className="instructor-info">
      <img
        src={
          instructor.profileImage
            ? `${API_URL}/assets/${instructor.profileImage}`
            : "https://via.placeholder.com/100"
        }
        alt="Instructor"
        className="instructor-img"
      />
      <div className="instructor-details">
        <p><strong>{instructor.name}</strong></p>
        <p>{instructor.expertise || "Expert in teaching"}</p>
        <p>{instructor.bio || "No bio available"}</p>

        <button
          className="chat-btn"
          onClick={() =>
            window.location.href = `/user/chat/${instructor._id}`
          }
        >
          💬 Chat with Instructor
        </button>
      </div>
    </div>
  </div>
)}


        
      </div>
    </div>
  );
};

export default ViewMyCourse;
