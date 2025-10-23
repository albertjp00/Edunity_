import React, { useEffect, useState } from "react";
import profilePic from "../../../assets/profilePic.png";
import { Link, useNavigate } from "react-router-dom";
import "./userProfile.css";
import { getUserMyCourses, getUserProfile } from "../../services/profileServices";

interface User {
  name?: string;
  email?: string;
  profileImage?: string;
  bio?: string;
  gender?: string;
  dob?: string;
  location?: string;
  phone?: string;
  blocked?: boolean;
  googleId?: string;
}

interface CourseData {
  id:string;
  _id?: string;
  title: string;
  price: number | string;
  description?: string;
  thumbnail: string;
  modules?: { id: string; title: string }[];
}

interface EnrolledCourse {
  course: CourseData;
  progress: { completedModules: string[] };
  userId: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User>({});
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const response = await getUserProfile();
      setUser(response?.data.data);

      if (response?.data.data.blocked) {
        localStorage.removeItem("token");
        navigate("/user/login");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await getUserMyCourses();
      if (res?.data.success) {
        setCourses(res.data.courses);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const gotoCourse = (id: string) => {
    navigate(`/user/courseDetails/${id}`);
  };

  useEffect(() => {
    fetchProfile();
    fetchCourses();
  }, []);

  return (
    <>
      <div className="profile-container1">
        {/* Left Side - Profile Info */}
        <div className="profile-left">
          <div className="profile-card1">
            <div className="user-name-card-image">
              <img
                src={
                  user.profileImage
                    ? `http://localhost:5000/assets/${user.profileImage}`
                    : profilePic
                }
                alt="Profile"
                className="profile-avatar"
              />
              <div className="user-name-card">
                <h2>{user.name}</h2>
                <h5>Email: {user.email}</h5>
              </div>
            </div>

            {/* About Me Box */}
            <div className="about-me-box">
              <h4>About Me</h4>
              <p>{user.bio || "No bio available."}</p>
            </div>

            {/* User Details Box */}
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
                {user.dob || "Not provided"}
              </p>
              <p>
                <i className="fas fa-map-marker-alt"></i> <strong>Location:</strong>{" "}
                {user.location || "Not specified"}
              </p>
              <p>
                <i className="fas fa-phone"></i> <strong>Phone:</strong>{" "}
                {user.phone || "Not provided"}
              </p>
            </div>

            {/* Buttons */}
            <div className="btn-edit">
              <Link to="/user/editProfile">
                <button>Edit</button>
              </Link>

              {!user.googleId && (
                <Link to="/user/changePassword">
                  <button className="change-password-btn">Change Password</button>
                </Link>
              )}

              {/* 🟢 New Go to Wallet Button */}
              <Link to="/user/wallet">
                <button className="wallet-btn">Go to Wallet</button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Purchased Courses */}
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
    </>
  );
};

export default Profile;
