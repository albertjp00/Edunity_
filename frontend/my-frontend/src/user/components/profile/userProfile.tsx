// pages/ProfilePage.tsx
import React, { useEffect, useState } from "react";
import profilePic from "../../../assets/profilePic.png";
import { Link, useNavigate } from "react-router-dom";
import "./userProfile.css";
import api from "../../../api/userApi";

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
}

interface Course {
  id: string;
  title: string;
  price: number;
  description: string;
  thumbnail: string;
  modules: { id: string; title: string }[];
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User>({});
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  // const token = localStorage.getItem("token");

  const getProfile = async () => {
    try {
      const response = await api.get("/user/profile");
      console.log(response.data);

      setUser(response.data.data);

      if (response.data.data.blocked) {
        localStorage.removeItem("token");
        navigate("/user/login");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);

    }
  };

  const fetchCourses = async () => {
    try {
      const res = await api.get(`/user/myCourses`);


      if (res.data.success) {
        setCourses(res.data.course);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const gotoCourse = (id: string) => {
    navigate(`/user/viewMyCourse/${id}`);
  };

  useEffect(() => {
    getProfile();
    fetchCourses();
  }, []);

  return (
    <>
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
              <p>{user.bio}</p>
            </div>

            <div className="user-details-box">
              <p>
                <i className="fas fa-user-tag"></i> <strong>Role:</strong>{" "}
                Student
              </p>
              <p>
                <i className="fas fa-venus-mars"></i> <strong>Gender:</strong>{" "}
                {user.gender}
              </p>
              <p>
                <i className="fas fa-birthday-cake"></i> <strong>DOB:</strong>{" "}
                {user.dob}
              </p>
              <p>
                <i className="fas fa-map-marker-alt"></i>{" "}
                <strong>Location:</strong> {user.location}
              </p>
              <p>
                <i className="fas fa-phone"></i> <strong>Phone:</strong>{" "}
                {user.phone}
              </p>
            </div>

            <div className="btn-edit">
              <Link to="/user/editProfile">
                <button>Edit</button>
              </Link>
              <Link to="/user/changePassword">
                <button className="change-password-btn">Change Password</button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Purchased Courses */}
        <div className="profile-right">
          <h3 className="enrolled-title">Purchased Courses</h3>
          <div className="enrolled-courses">
            {courses.length > 0 ? (
              courses.map((course) => (
                <div
                  className="course-card-mini"
                  key={course.id}
                  onClick={() => gotoCourse(course.id)}
                >
                  <img
                    src={`http://localhost:4000/assets/${course.thumbnail}`}
                    alt={course.title}
                    className="course-thumb-mini"
                  />
                  <div className="course-details-mini">
                    <h4>{course.title}</h4>
                    <p>
                      <strong>Price:</strong> ₹{course.price}
                    </p>
                    <p>
                      <strong>Description:</strong>{" "}
                      {course.description ? course.description.slice(0, 80) : "No description"}...
                    </p>

                    <p>
                      <strong>Modules:</strong> {course.modules.length}
                    </p>
                    <button
                      className="view-course-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        gotoCourse(course.id);
                      }}
                    >
                      View Course
                    </button>
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
