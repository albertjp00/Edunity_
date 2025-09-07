// pages/AdminUserDetails.tsx
import React, { useEffect, useState } from "react";
import profilePic from "../../../assets/profilePic.png";
import { useNavigate, useParams } from "react-router-dom";
import "./userDetails.css";
import adminApi from "../../../api/adminApi";
import type { EnrolledCourse, User } from "../../adminInterfaces";
import { getUserCourses, getUserDetails } from "../../services/adminServices";



const AdminUserDetails: React.FC = () => {
  const [user, setUser] = useState<User>({});
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Get user profile
  const fetchUser = async () => {
    try {
      if(!id) return
      const response = await getUserDetails(id);
      setUser(response?.data.user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Get user enrolled courses
  const fetchCourses = async () => {
    try {
      if(!id) return 
      const res = await getUserCourses(id);
      if (res?.data.success) {
        setCourses(res.data.courses);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const gotoCourse = (courseId: string) => {
    navigate(`/admin/courseDetails/${courseId}`);
  };

  const toggleBlockUser = async () => {
    try {
      await adminApi.put(`/admin/blockUser/${id}`, {
        blocked: !user.blocked,
      });
      setUser({ ...user, blocked: !user.blocked });
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUser();
      fetchCourses();
    }
  }, [id]);

  return (
    <div className="profile-container1">
      {/* Left Side - Profile Info */}
      <div className="profile-left">
        <div className="profile-card1">
          <div className="user-name-card">
            <img
              src={
                user.profileImage
                  ? `http://localhost:5000/assets/${user.profileImage}`
                  : profilePic
              }
              alt="Profile"
              className="profile-avatar"
            />
            <div className="details">
              <h2>{user.name}</h2>
              <h5>Email: {user.email}</h5>
            </div>
          </div>

          <div className="about-me">
            <h4>About me</h4>
            <p>{user.bio || "No bio available"}</p>
          </div>

          <div className="user-details-box">
            <p>
              <i className="fas fa-user-tag"></i> <strong>Role:</strong> Student
            </p>
            <p>
              <i className="fas fa-venus-mars"></i> <strong>Gender:</strong>{" "}
              {user.gender || "Not specified"}
            </p>
            <p>
              <i className="fas fa-birthday-cake"></i> <strong>DOB:</strong>{" "}
              {user.dob || "Not specified"}
            </p>
            <p>
              <i className="fas fa-map-marker-alt"></i>{" "}
              <strong>Location:</strong> {user.location || "Not specified"}
            </p>
            <p>
              <i className="fas fa-phone"></i> <strong>Phone:</strong>{" "}
              {user.phone || "Not specified"}
            </p>
            <p>
              <i className="fas fa-ban"></i> <strong>Status:</strong>{" "}
              {user.blocked ? (
                <span style={{ color: "red", fontWeight: "bold" }}>
                  Blocked
                </span>
              ) : (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  Active
                </span>
              )}
            </p>
          </div>

          <div className="btn-edit">
            <button
              onClick={toggleBlockUser}
              style={{
                backgroundColor: user.blocked ? "green" : "red",
                color: "#fff",
              }}
            >
              {user.blocked ? "Unblock User" : "Block User"}
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Purchased Courses */}
      <div className="profile-right">
        <h3 className="enrolled-title">Enrolled Courses</h3>
        <div className="enrolled-courses">
          {courses.length > 0 ? (
            courses.map((enrolled) => (
              <div
                className="course-card-mini"
                key={enrolled.course._id}
                onClick={() => gotoCourse(enrolled.course._id)}
              >
                <img
                  src={`http://localhost:5000/assets/${enrolled.course.thumbnail}`}
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
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetails;
