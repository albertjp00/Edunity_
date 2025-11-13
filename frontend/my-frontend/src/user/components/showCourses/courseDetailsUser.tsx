import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./courseDetailsUser.css";
import api from "../../../api/userApi";
import { toast } from "react-toastify";
import buyNowImage from '../../../assets/buyCourse.png'
import VideoPlayerUser from "../videoPlayer/videoPlayer";

interface Module {
  title: string;
  videoUrl: string;
  content: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  level: string;
  thumbnail: string;
  skills: string[];
  modules: Module[];
  enrolled?: number;
  lectures?: number;
  language?: string;
}

interface Instructor {
  name: string;
  profileImage: string;
  bio?: string;
  expertise?: string;
}

interface IReview {
  userId : string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  createdAt: string;
}


interface RazorpayInstance {
  open: () => void;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  modal?: { ondismiss?: () => void };
  theme?: { color?: string };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const CourseDetailsUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [activePayment, setActivePayment] = useState<string | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  // const [rating, setRating] = useState<number>(0);
  // const [comment, setComment] = useState<string>("");
  // const [loadingReview, setLoadingReview] = useState<boolean>(false);


  const navigate = useNavigate();

  const fetchCourse = async () => {
    try {
      const res = await api.get(`/user/courseDetails?id=${id}`);
      console.log(res);
      
      setCourse(res.data.course);
      setInstructor(res.data.course.instructor);
      setHasAccess(res.data.course.hasAccess);
      setReviews(res.data.course.review || []);

    } catch (err) {
      console.error("Error fetching course:", err);
    }
  };

  const buyCourse = async (courseId: string) => {
    if (activePayment === courseId) {
      toast.warning("Payment window already open for this course!");
      return;
    }

    const isPaymentInProgress = localStorage.getItem("payment_in_progress");
    if (isPaymentInProgress === "true") {
      toast.warning("Payment already in progress in another tab!");
      return;
    }

    localStorage.setItem("payment_in_progress", "true");
    setActivePayment(courseId);

    try {
      const { data } = await api.get(`/user/buyCourse/${courseId}`);

      const options: RazorpayOptions = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Edunity",
        description: "Course Purchase",
        order_id: data.orderId,
        handler: async function (response) {
          try {
            await api.post("/user/payment/verify", {
              ...response,
              courseId,
            });
            toast.success("Payment Successful! Course Unlocked.");
            navigate("/user/myCourses");
          } finally {
            setActivePayment(null);
            localStorage.removeItem("payment_in_progress");
          }
        },
        modal: {
          ondismiss: function () {
            setActivePayment(null);
            localStorage.removeItem("payment_in_progress");
          },
        },
        theme: { color: "#6a5af9" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Try again.");
      setActivePayment(null);
      localStorage.removeItem("payment_in_progress");
    }
  };


  // const submitReview = async () => {
  //   if (!hasAccess) {
  //     toast.error("You must purchase the course before leaving a review!");
  //     return;
  //   }
  //   if (rating === 0 || !comment.trim()) {
  //     toast.warning("Please provide both a rating and comment.");
  //     return;
  //   }

  //   try {
  //     setLoadingReview(true);
  //     const res = await api.post(`/user/course/${course?._id}/review`, {
  //       rating,
  //       comment,
  //     });
  //     toast.success("Review added!");
  //     setReviews((prev) => [res.data.review, ...prev]);
  //     setRating(0);
  //     setComment("");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to submit review.");
  //   } finally {
  //     setLoadingReview(false);
  //   }
  // };






  useEffect(() => {
    fetchCourse();
  }, []);

  if (!course) return <p>Loading...</p>;

  return (
    <div className="contain">

      <header className="course-header">

        <h1>COURSE DETAILS</h1>
        <p>Home / Course</p>
      </header>

      <div className="course-content">
        <div className="course-left">
          <img
            src={`http://localhost:5000/assets/${course.thumbnail}`}
            alt="Course Thumbnail"
            className="course-banner"
          />

          <h2 className="course-title">{course.title}</h2>
          <p className="lesson-count">Lesson 10</p>

          {/* Tabs */}
          <div className="tabs">
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

            <button
              className={activeTab === "reviews" ? "active" : ""}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </button>
          </div>

          {/* Tab content */}
          {activeTab === "overview" && (
            <div className="tab-content">
              <h3>Course Description</h3>
              <p>{course.description}</p>

              <h3>What Will I Learn From This Course?</h3>
              <p>
                This course covers everything from basic HTML and CSS to advanced
                full-stack development topics. Learn at your own pace and become a
                professional web developer.
              </p>
            </div>
          )}

          {activeTab === "curriculum" && (
            <div className="tab-content">
              <h3>Curriculum</h3>
              {course.modules.map((module, idx) => (
                <details key={idx} className="module-item">
                  <summary>{module.title || `Module ${idx + 1}`}</summary>
                  {hasAccess ? (
                    <div className="video-wrapper">
                      {module.videoUrl && <VideoPlayerUser initialUrl={module.videoUrl} />}
                    </div>
                  ) : (
                    <p className="locked-message">
                      Purchase the course to unlock this video.
                    </p>
                  )}
                </details>
              ))}
            </div>
          )}


          {activeTab === "instructor" && instructor && (
            <div className="tab-content instructor-tab">
              <img
                src={`http://localhost:5000/assets/${instructor.profileImage}`}
                alt={instructor.name}
                className="instructor-photo"
              />
              <h3>{instructor.name}</h3>
              <p>{instructor.bio}</p>
              <p>
                <strong>Expertise:</strong> {instructor.expertise}
              </p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="tab-content reviews-tab">
              <h3>Student Reviews</h3>

              {/* Review List */}
              {reviews.length > 0 ? (
                reviews.map((rev, idx) => (
                  <div key={idx} className="review-item">
                    <div className="review-header">
                      <img
                        src={`http://localhost:5000/assets/${rev.userImage || "default.png"}`}
                        alt={rev.userName}
                        className="review-avatar"
                      />
                      <div className="date-rating">
                        <strong>{rev.userName}</strong>
                        <p className="review-date">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </p>
                        
                      </div>
                      
                    </div>
                    <p className="review-rating">⭐ {rev.rating}/5</p>
                    <p className="review-comment">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p>No reviews yet.</p>
              )}

              {/* Add Review Form */}
              {/* {hasAccess && (
                <div className="add-review">
                  <h4>Leave a Review</h4>
                  <div className="rating-input">
                    {[1, 2, 3, 4, 5].map((num) => ( 
                      <span
                        key={num}
                        className={`star ${rating >= num ? "filled" : ""}`}
                        onClick={() => setRating(num)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <textarea
                    placeholder="Write your review..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                  <button
                    onClick={submitReview}
                    disabled={loadingReview}
                    className="submit-review-btn"
                  >
                    {loadingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              )} */}
            </div>
          )}


        </div>

        {/* Right Sidebar */}
        <div className="course-right">
          <div className="course-card">
            <img
              src={buyNowImage}
              alt="Thumbnail"
              className="sidebar-img"
            />

            {!hasAccess &&
              <div className="price-section">
                <span className="discount-price">₹{course.price}</span>
                <span className="original-price">₹120</span>
                <p className="guarantee-text">30-Day Money-Back Guarantee</p>
              </div>
            }

            {!hasAccess && (
              <button
                onClick={() => buyCourse(course._id)}
                className="buy-btn"
                disabled={activePayment === course._id}
              >
                {activePayment === course._id ? "Processing..." : "BUY NOW"}
              </button>
            )}

            <ul className="course-info">
              <li><strong>Enrolled:</strong> {course.enrolled || 100}</li>
              <li><strong>Lectures:</strong> {course.lectures || 80}</li>
              <li><strong>Skill Level:</strong> {course.level}</li>
              <li><strong>Language:</strong> {course.language || "English"}</li>
            </ul>
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default CourseDetailsUser;
