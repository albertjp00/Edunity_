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

  const navigate = useNavigate();

  const fetchCourse = async () => {
    try {
      const res = await api.get(`/user/courseDetails?id=${id}`);
      setCourse(res.data.course);
      setInstructor(res.data.course.instructor);
      setHasAccess(res.data.course.hasAccess);
    } catch (err) {
      console.error("Error fetching course:", err);
    }
  };

const buyCourse = async (courseId: string) => {
  // 1️⃣ Prevent duplicate clicks in the same tab
  if (activePayment === courseId) {
    toast.warning("Payment window already open for this course!");
    return;
  }

  // 2️⃣ Prevent multiple tabs from triggering payment
  const isPaymentInProgress = localStorage.getItem("payment_in_progress");
  if (isPaymentInProgress === "true") {
    toast.warning("Payment already in progress in another tab!");
    return;
  }

  // 3️⃣ Lock the payment process globally
  localStorage.setItem("payment_in_progress", "true");
  setActivePayment(courseId);

  try {
    // 4️⃣ Fetch order details *after* locking
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
          // 5️⃣ Always clear lock
          setActivePayment(null);
          localStorage.removeItem("payment_in_progress");
        }
      },
      modal: {
        ondismiss: function () {
          // 6️⃣ Clear lock if user closes payment window
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
