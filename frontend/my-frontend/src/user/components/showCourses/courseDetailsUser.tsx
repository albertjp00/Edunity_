import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./courseDetailsUser.css";
import { toast } from "react-toastify";
import buyNowImage from '../../../assets/buyCourse.png'
import VideoPlayerUser from "../videoPlayer/videoPlayer";
import { addToFavourites, buyCourseService, courseDetails, fetchFavourites, paymentCancel, verifyPayment } from "../../services/courseServices";
import type {  IInstructor, IModule, IReview, RazorpayInstance, RazorpayOptions } from "../../interfaces";


declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export interface ICourse {
  _id: string;
  title: string;
  description: string;
  price?: number;
  level: string;
  thumbnail?: string;
  skills: string[];
  modules: IModule[];
  enrolled?: number;
  lectures?: number;
  language?: string;
  accessType: string;
}

const CourseDetailsUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [instructor, setInstructor] = useState<IInstructor | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [activePayment, setActivePayment] = useState<string | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [fav , setFavourites] = useState<boolean>(false)
  // const [rating, setRating] = useState<number>(0);
  // const [comment, setComment] = useState<string>("");
  // const [loadingReview, setLoadingReview] = useState<boolean>(false);


  const navigate = useNavigate();

  const fetchCourse = async () => {
    try {
      if(!id) return
      const res = await courseDetails(id)
      console.log('res detauls',res);
      if(!res) return
      if(res.data.success=='exists'){
        navigate(`/user/viewMyCourse/${id}`,{replace:true})
        return
      }
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
      const res = await buyCourseService(courseId)
      console.log(res);
      if (!res) return
      const { data } = res

      const options: RazorpayOptions = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Edunity",
        description: "Course Purchase",
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const res = await verifyPayment(response  , courseId)
            if(!res) return
            console.log('respionse ', res);
            
            if(res.data.success){
            toast.success("Payment Successful! Course Unlocked.");
            navigate("/user/myCourses");
            }
          } finally {
            setActivePayment(null);
            localStorage.removeItem("payment_in_progress");
            navigate('/user/paymentSuccess')
          }
        },
        modal: {
          ondismiss: async function () {
            try {
              await paymentCancel(courseId);
            } finally {
              setActivePayment(null);
              localStorage.removeItem("payment_in_progress");
              navigate('/user/paymentFailed')
            }
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
  }


  useEffect(()=>{
    const getFavourites = async()=>{
    try {
      if(!id) return
      const res = await fetchFavourites(id)
      if(!res) return
      console.log('favvv',res);
      
      if(res.data.success){
        setFavourites(res.data.success)
      }
    } catch (error) {
      console.log(error);
      
    }
  }
  getFavourites()
  },[])


  const handleAddtofavourites = async (id:string)=>{
    try {
      const res = await addToFavourites(id)
      if(!res) return
      console.log('added fav ', res);
      
    if(res.data.success){
      if(res.data.fav == 'added'){
        setFavourites(true)
          toast.success('Added to favourites')
      }else if(res.data.fav=='removed'){
          setFavourites(false)
          toast.success('Removed from favourites') 
        }
    }
      
    } catch (error) {
      console.log(error);
    }
  }







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
            src={`${import.meta.env.VITE_API_URL}/assets/${course.thumbnail}`}
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

            {/* <button
              className={activeTab === "report" ? "active" : ""}
              onClick={() => setActiveTab("report")}
            >
              Report
            </button> */}
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
                src={`${import.meta.env.VITE_API_URL}/assets/${instructor.profileImage}`}
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
                        src={`${import.meta.env.VITE_API_URL}/assets/${rev.userImage || "default.png"}`}
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
                <p className="guarantee-text">7-Day Money-Back Guarantee</p>
              </div>
            }

            {/* If course is subscription-only → show Subscribe message */}

            {course.accessType === "subscription" ? (
              !hasAccess ? (
                <button
                  className="buy-btn"
                  onClick={() => navigate("/user/subscription")}
                >
                  Subscribe to Unlock
                </button>
              ) : (
                <button className="buy-btn" disabled>
                  Included in Your Subscription
                </button>
              )
            ) : (
              /* One-time purchase button */
              !hasAccess && (
                <button
                  onClick={() => buyCourse(course._id)}
                  className="buy-btn"
                  disabled={activePayment === course._id}
                >
                  {activePayment === course._id ? "Processing..." : "BUY NOW"}
                </button>
              )
            )}

            <button className="buy-btn" onClick={()=>handleAddtofavourites(course._id)}>
              {fav ?  "Remove from favourites" : "Add to Favourites"}
            </button>


            <ul className="course-info">
              <li><strong>Enrolled:</strong> {course.enrolled || 100}</li>
              <li><strong>Lectures:</strong> {course.lectures || 80}</li>
              <li><strong>Skill Level:</strong> {course.level}</li>
              <li><strong>Language:</strong> {course.language || "English"}</li>

              {/* New field */}
              <li>
                <strong>Access Type:</strong>{" "}
                {course.accessType === "subscription"
                  ? "Subscription Required"
                  : "One-Time Purchase"}
              </li>
            </ul>

          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default CourseDetailsUser;
