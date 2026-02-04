// pages/AdminUserDetails.tsx
import React, { useEffect, useState } from "react";
import profilePic from "../../../assets/profilePic.png";
import { useNavigate, useParams } from "react-router-dom";
import "./userDetails.css";
import type { AdminUserCourses, User } from "../../adminInterfaces";
import { getUserCourses, getUserDetails, toggleBlockUserApi } from "../../services/adminServices";



const AdminUserDetails: React.FC = () => {
  const [user, setUser] = useState<User>({});
  const [courses, setCourses] = useState<AdminUserCourses[]>([]);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  // Get user profile
  const fetchUser = async () => {
    try {
      if (!id) return
      const response = await getUserDetails(id);
      console.log(response);

      setUser(response?.data.user);
      setLoading(false)
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Get user enrolled courses
  const fetchCourses = async () => {
    try {
      if (!id) return
      const res = await getUserCourses(id);
      console.log(res);

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
      if(!id){ 
        console.log('id undefined') 
        return;
      }
       await toggleBlockUserApi(id, !user.blocked);
      setUser({ ...user, blocked: !user.blocked });
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUser();
      fetchCourses();
    }
  }, [id]);

  if (loading)
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="profile-container1">
      {/* Left Side - Profile Info */}
      <div className="profile-left">
        <div className="profile-card1">
          <div className="user-name-card">
            <img
              src={
                user.profileImage
                  ? `${import.meta.env.VITE_API_URL}/assets/${user.profileImage}`
                  : profilePic
              }
              alt="Profile"
              className="profile-avatar"
            />
            <div className="user-details">
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
            courses.map((c) => (
              <div
                className="course-card-mini"
                key={c.id}
                onClick={() => gotoCourse(c.id)}
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}/assets/${c.thumbnail}`}
                  alt={c.title}
                  className="course-thumb-mini"
                />
                <div className="course-details-mini">
                  <h4>{c.title}</h4>
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
