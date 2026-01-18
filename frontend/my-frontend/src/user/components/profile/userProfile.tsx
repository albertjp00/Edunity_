import React, { useEffect, useState } from "react";
import profilePic from "../../../assets/profilePic.png";
import { Link, useNavigate } from "react-router-dom";
import "./userProfile.css";
import {
  getPaymentHistory,
  getUserMyCourses,
  // getUserProfile,
} from "../../services/profileServices";
import type { EnrolledCourse, IPayment, User } from "../../interfaces";
import { useAppSelector } from "../../../redux/hooks";
// import { getPaymentHistory } from "../../services/paymentServices";




const Profile: React.FC = () => {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const navigate = useNavigate();

  
  const user = useAppSelector((state) =>
  state.auth.role === "user" ? state.auth.user : null
) as User | null;


  const fetchCourses = async () => {
    try {
      const res = await getUserMyCourses();
      if (res?.data.success) {
        // console.log('courses',res);
        
        const courses = res.data.courses.slice(0,3)
        setCourses(courses);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

const fetchPayments = async () => {
  try {
    const res = await getPaymentHistory(1);
    // console.log(res);
    
    if (!res) return;

    if (res.data.success) {
      const paymentsData = res.data.payments.pay;

      // ✅ Convert to array if backend sends only one object
      const normalizedPayments = Array.isArray(paymentsData)
        ? paymentsData
        : [paymentsData];

      console.log("Normalized Payments:", normalizedPayments);
      const norm = normalizedPayments.slice(0,2)
      setPayments(norm);
    }
  } catch (err) {
    console.error("Error fetching payments:", err);
  } finally {
    setLoadingPayments(false);
  }
};


  const gotoCourse = (id: string) => {
    navigate(`/user/courseDetails/${id}`);
  };

  const myCourses = ()=>{
    navigate('/user/myCourses')
  }

  const allPayments = ()=>{
    navigate('/user/allPayments')
  }

  useEffect(() => {
    // fetchProfile();
    fetchCourses();
    fetchPayments();
  }, []);


  return (
    <div className="profile-container1">
      {/* Left Side - Profile Info */}
      <div className="profile-left1">
        <div className="profile-card-one">
          <div className="user-name-card-image">
            <img
              src={
                user?.profileImage
                  ? `${import.meta.env.VITE_API_URL}/assets/${user.profileImage}`
                  : profilePic
              }
              alt="Profile"
              className="profile-avatar"
            />
            <div className="user-name-card">
              <h2>{user?.name}</h2>
              <h5>Email: {user?.email}</h5>
            </div>
          </div>

          <div className="about-me-box">
            <h4>About Me</h4>
            <p>{user?.bio || "No bio available."}</p>
          </div>

          <div className="user-details-box">
            <p>
              <i className="fas fa-user-tag"></i> <strong>Role:</strong> Student
            </p>
            <p>
              <i className="fas fa-venus-mars"></i> <strong>Gender:</strong>{" "}
              {user?.gender || "Not specified"}
            </p>
            <p>
              <i className="fas fa-birthday-cake"></i> <strong>DOB:</strong>{" "}
              {user?.dob || "Not provided"}
            </p>
            <p>
              <i className="fas fa-map-marker-alt"></i>{" "}
              <strong>Location:</strong> {user?.location || "Not specified"}
            </p>
            <p>
              <i className="fas fa-phone"></i> <strong>Phone:</strong>{" "}
              {user?.phone || "Not provided"}
            </p>
          </div>

          <div className="btn-edit">
            <Link to="/user/editProfile">
              <button>Edit</button>
            </Link>

            {user?.provider!='google' && (
              <Link to="/user/changePassword">
                <button className="change-password-btn">Change Password</button>
              </Link>
            )}

            <Link to="/user/wallet">
              <button className="wallet-btn">Go to Wallet</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Purchased Courses + Payment History */}
      <div className="profile-right">
        <h3 className="enrolled-title">Purchased Courses</h3>
        <div className="enrolled-courses">
          {courses.length > 0 ? (
            courses.map((enrolled) => (
              <div
                className="course-card-mini"
                key={enrolled.course._id}
                onClick={() => gotoCourse(enrolled.course._id ?? "")}
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}/assets/${enrolled.course.thumbnail}`}
                  alt={enrolled.course.title}
                  className="course-thumb-mini"
                />
                <div className="course-details-mini">
                  <h4>{enrolled.course.title}</h4>
                  <p>
                    <strong>Price:</strong> ₹{enrolled.course.price}
                  </p>
                  <p>
                    <strong>Description:</strong>{" "}
                    {enrolled.course.description
                      ? enrolled.course.description.slice(0, 80)
                      : "No description"}
                    ...
                  </p>

                  <p>
                    <strong>Modules:</strong>{" "}
                    {enrolled.course.modules?.length ?? 0}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No enrolled courses.</p>
          )}
          <button onClick={()=>myCourses()}>Show all Courses</button>
        </div>

        {/* 💳 Payment History Section */}
        <h3 className="payment-history-title">Payment History</h3>
        <div className="payment-history-box">
          {loadingPayments ? (
            <p>Loading payment history...</p>
          ) : payments.length > 0 ? (
            <table className="payment-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id}>
                    <td>{p.courseName ||  "N/A"}</td>
                    <td>₹{p.amount}</td>
                    <td className={`status ${p.status.toLowerCase()}`}>
                      {p.status}
                    </td>
                    
                    <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No payment records found.</p>
          )}
        </div>
        <button onClick={()=>allPayments()}>All Payments</button>
      </div>
    </div>
  );
};

export default Profile;
