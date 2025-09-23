import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./courseDetail.css";
import api from "../../../api/userApi";
import { toast } from "react-toastify";

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
}

interface Instructor {
  name: string;
  profileImage: string;
  bio?: string;
  expertise?: string;
}


// interface ApiResponse {
//   success: boolean;
//   course: Course & {
//     _id?: string;
//     instructor: Instructor;
//     hasAccess: boolean;
//     completedModules?: string[];
//   };
// }


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
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  modal?: {
    ondismiss?: () => void;
  };
  theme?: {
    color?: string;
  };
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
  // const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [activePayment, setActivePayment] = useState<string | null>(null); // 👈 track active payment

  const navigate = useNavigate();

  const fetchCourse = async () => {
    try {
      const res = await api.get(`/user/courseDetails?id=${id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setCourse(res.data.course);
      setInstructor(res.data.course.instructor);
      setHasAccess(res.data.course.hasAccess);
      // setCompletedModules(res.data.course.completedModules || []);
    } catch (err) {
      console.error("Error fetching course:", err);
    }
  };

  const buyCourse = async (courseId: string) => {
    if (activePayment === courseId) {
      toast.warning("Payment window already open for this course!");
      return;
    }

    setActivePayment(courseId);

    try {
      const { data } = await api.get(`/user/buyCourse/${courseId}`);

      // console.log('data',data.existingPurchase);
      

      // if (data.existingPurchase) {
      //   toast.info("You already purchased this course.");
      //   setActivePayment(null);
      //   return;
      // }

      // if (data.existingOrder) {
      //   toast.warning("You already have a pending payment for this course. Complete it before retrying.");
      //   setActivePayment(null);
      //   return;
      // }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Your App",
        description: "Course Purchase",
        order_id: data.orderId,
        handler: async function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
          try {
            await api.post("/user/payment/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              courseId,
            });
            toast.success("Payment Successful! Course Unlocked.");
            navigate("/user/myCourses");
          } finally {
            setActivePayment(null);
          }
        },
        modal: {
          ondismiss: function () {
            setActivePayment(null);
          },
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Try again.");
      setActivePayment(null);
    }
  };


  const addtoFavourites = async (id: string) => {
    try {
      const response = await api.get(`/user/addtoFavourites/${id}`);
      if (response.data.success) {
        toast.success("Added to Favourites");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  if (!course) return <p>Loading...</p>;

  return (
    <div className="course-navbar">
      <div className="course-detail-page">
        <h2>{course.title}</h2>

        {course.thumbnail && (
          <img
            src={`http://localhost:5000/assets/${course.thumbnail}`}
            alt="Course Thumbnail"
            className="detail-thumbnail"
          />
        )}

        <p>
          <strong>Description:</strong> {course.description}
        </p>

        {instructor && (
          <div className="instructor-info">
            <img
              src={`http://localhost:5000/assets/${instructor.profileImage}`}
              alt={instructor.name}
              className="instructor-image"
            />
            <div className="instructor-details">
              <p className="instructor-name">
                <strong>Instructor:</strong> {instructor.name}
              </p>
            </div>
          </div>
        )}

        {!hasAccess && (
          <div className="purchase-section">
            <p>
              <strong>Price:</strong> ₹{course.price}
            </p>
            <button
              onClick={() => buyCourse(course._id)}
              className="buy-button"
              disabled={activePayment === course._id} // 👈 disable button while active
            >
              {activePayment === course._id ? "Processing..." : "Buy Course"}
            </button>
            <button
              onClick={() => addtoFavourites(course._id)}
              className="fav-button"
            >
              Add to Favourites
            </button>
          </div>
        )}

        <div className="modules">
          <h3>Modules:</h3>
          {course.modules.map((module, idx) => (
            <div key={idx} className="module">
              <details>
                <summary className="module-title">
                  📘 {module.title || `Module ${idx + 1}`}
                </summary>

                {hasAccess ? (
                  <div className="module-content">
                    <video
                      width="100%"
                      height="400"
                      controls
                      src={module.videoUrl}
                    />
                    <p>{module.content}</p>
                  </div>
                ) : (
                  <p className="locked-message">
                    Purchase the course to unlock this video.
                  </p>
                )}
              </details>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsUser;
