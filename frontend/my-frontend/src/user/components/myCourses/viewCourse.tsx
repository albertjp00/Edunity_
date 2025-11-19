import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./viewMyCourse.css";
import api from "../../../api/userApi";
import { viewMyCourse } from "../../services/courseServices";
import VideoPlayerUser from "../videoPlayer/videoPlayer";
import { toast } from "react-toastify";
import ConfirmModal from "../modal/modal";
import { getCertificate } from "../../../services/user/userServices";


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
  review: IReview[]
}



interface IMyCourse {
  _id: string;
  userId: string;
  course: ICourse;
  progress: {
    completedModules: string[];
  };
  enrolledAt: string;
}

interface IReview {
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
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
  const [showModal, setShowModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [review, setReview] = useState<IReview[] | null>()
  const navigate = useNavigate();

  const [canCancel, setCanCancel] = useState<boolean>(false);

  const fetchCourse = async (): Promise<void> => {
    try {
      if (!id) {
        console.error("Course ID is missing");
        return;
      }
      const res = await viewMyCourse(id);
      if (!res) return;

      console.log(res);

      const fetchedMyCourse: IMyCourse = res.data.course;
      const fetchedInstructor: IInstructor = res.data.instructor;
      setCourse(fetchedMyCourse.course);
      setInstructor(fetchedInstructor);
      setCompletedModules(fetchedMyCourse.progress?.completedModules || []);
      setQuiz(res.data.quiz);
      setReview(fetchedMyCourse.course?.review)


      const enrolledDate = new Date(fetchedMyCourse.enrolledAt);
      const now = new Date();
      const diffDays =
        (now.getTime() - enrolledDate.getTime()) / (1000 * 60 * 60 * 24);

      const hasViewedMoreThanOne =
        fetchedMyCourse.progress.completedModules.length > 1;

      setCanCancel(diffDays <= 10 && !hasViewedMoreThanOne);
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
    if (completedModules.includes(moduleTitle)) return;
    try {
      console.log('marked as completed');

      await api.post("/user/updateProgress", { courseId: id, moduleTitle });
      setCompletedModules((prev) => [...prev, moduleTitle]);
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };


  const handleCancelClick = (courseId: string | null) => {
    setSelectedCourseId(courseId);
    setShowModal(true);
  };


  const confirmCancel = async () => {
    try {
      const res = await api.delete(`/user/cancelCourse/${selectedCourseId}`);
      if (res.data.success) {
        toast.success("Course cancelled successfully!");
        navigate("/user/myCourses");
      }
    } catch (err) {
      console.error("Error cancelling course:", err);
      toast.error("Unable to cancel course.");
    } finally {
      setShowModal(false);
      setSelectedCourseId(null);
    }
  };

  const cancelAction = () => {
    setShowModal(false);
    setSelectedCourseId(null);
  };




  const gotoQuiz = (myCourseId: string) => {
    navigate(`/user/quiz/${myCourseId}`);
  };


  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);


  const handleViewCertificate = async (id: string) => {
    try {
      const response = await getCertificate(id);
      console.log(response);

      if (!response?.data.certificate?.filePath) return;

      // Save the file name directly
      setCertificateUrl(response.data.certificate?.filePath);
      setShowCertificate(true);
    } catch (error) {
      console.error("Error showing certificate:", error);
      toast.error("Unable to show certificate.");
    }
  };


  //reviews 

  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  // const [loadingReview, setLoadingReview] = useState<boolean>(false);


  const handleSubmitReview = async () => {
    if (rating === 0 || !reviewText.trim()) {
      toast.error("Please provide both rating and review text.");
      return;
    }

    try {
      // setLoadingReview(true);
      const res = await api.post("/user/review", {
        courseId: course?._id,
        rating,
        review: reviewText,
      });

      if (res.data.success) {
        toast.success("Review submitted successfully!");
        setRating(0);
        setReviewText("");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review.");
    } finally {
      // setLoadingReview(false);
    }
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
            src={`${import.meta.env.VITE_API_URL}/assets/${course.thumbnail}`}
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
            <>
              <div className="tab-content">
                <h4>Course Description</h4>
                <p>{course.description}</p>

                <h4>What Will I Learn?</h4>
                <p>
                  You’ll learn everything from frontend to backend development including
                  real-world projects and best practices to become a professional web
                  developer.
                </p>
              </div>

              {/* REVIEWS TAB */}
              {review && (
                <div className="tab-content reviews-tab">
                  <h4>Student Reviews</h4>

                  {review && review.length > 0 ? (
                    review.map((r, index) => (
                      <div key={index} className="review-card">
                        <div className="review-header">
                          <img
                            src={
                              r.userImage
                                ? `${import.meta.env.VITE_API_URL}/assets/${r.userImage}`
                                : "https://via.placeholder.com/50"
                            }
                            alt={r.userName}
                            className="review-user-img"
                          />
                          <small className="review-date">
                              {new Date(r.createdAt).toLocaleDateString()}
                            </small>
                          <div>
                            <p className="review-user-name">{r.userName}</p>
                            <div className="review-stars">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={star <= r.rating ? "star filled" : "star"}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            
                          </div>
                        </div>

                        <p className="review-comment">"{r.comment}"</p>
                      </div>
                    ))
                  ) : (
                    <p>No reviews yet for this course.</p>
                  )}
                </div>
              )}


              {progressPercent === 100 && (
                <div className="review-section">
                  <h4>Leave a Review</h4>
                  {!showCertificate && (
                    <>
                      <label>Rating:</label>
                      <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            onClick={() => setRating(star)}
                            className={star <= rating ? "star filled" : "star"}
                          >
                            ★
                          </span>
                        ))}
                      </div>

                      <textarea
                        placeholder="Write your review..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="review-textarea"
                      />

                      <button className="submit-review-btn" onClick={handleSubmitReview}>
                        Submit Review
                      </button>
                    </>
                  )}
                </div>
              )}
            </>
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
                          <VideoPlayerUser
                            initialUrl={module.videoUrl}
                            onComplete={() => markAsCompleted(module.title)} 
                          />

                          <p>{module.content}</p>

                          {/* {!isCompleted && (
                            <button
                              onClick={() => markAsCompleted(module.title)}
                              className="mark-complete-btn"
                            >
                              Mark as Completed
                            </button>
                          )} */}
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

              {progressPercent === 100 && (
                <button
                  className="certificate-btn"
                  onClick={() => handleViewCertificate(course._id)}
                >
                  🎓 View Certificate
                </button>
              )}

            </div>
          )}


          {showCertificate && (
            <div className="certificate-modal-overlay">
              <div className="certificate-modal">
                <button
                  className="close-certificate"
                  onClick={() => setShowCertificate(false)}
                >
                  ✖
                </button>
                <iframe
                  src={`${import.meta.env.VITE_API_URL}/assets/${certificateUrl}`}
                  title="Course Certificate"
                  className="certificate-frame"
                />

              </div>
            </div>
          )}


          {/* INSTRUCTOR TAB */}
          {activeTab === "instructor" && instructor && (
            <div className="tab-content instructor-tab">
              <img
                src={
                  instructor.profileImage
                    ? `${import.meta.env.VITE_API_URL}/assets/${instructor.profileImage}`
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
              src={`${import.meta.env.VITE_API_URL}/assets/${course.thumbnail}`}
              alt="Course"
              className="sidebar-thumbnail"
            />
            <div className="sidebar-info">
              <p className="price">
                {/* <span className="current-price">${course.price}</span> */}
                {/* <span className="old-price">$120</span> */}
              </p>
              <button className="buy-btn">Continue Course</button>

              {canCancel && (
                <button
                  className="cancel-btn"
                  onClick={() => handleCancelClick(id!)}
                >
                  ❌ Cancel Course
                </button>
              )}

              <ConfirmModal
                show={showModal}
                title="Cancel Course"
                message="Are you sure you want to cancel this course? This action cannot be undone."
                onConfirm={confirmCancel}
                onCancel={cancelAction}
              />


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
