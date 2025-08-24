import React, { useEffect, useState } from 'react';
import profilePic from './../../../assets/profilePic.png';
import { useParams, useNavigate } from 'react-router-dom';
// import './instructorDetails';
import adminApi from '../../../api/adminApi';
import Navbar from '../../components/navbar/navbar';
import type { ICourse, IUser } from '../../adminInterfaces';



const AdminInstructorDetails: React.FC = () => {
  const [user, setUser] = useState<IUser>({});
  const [courses, setCourses] = useState<ICourse[]>([]);

  const { id } = useParams<{ id: string }>(); // ✅ get instructorId from route params
  const navigate = useNavigate();

  const getProfile = async () => {
    try {
      const response = await adminApi.get(`/admin/instructors/${id}`);
      console.log(response);
      
      setUser(response.data.instructor);
    } catch (error) {
      console.error('Error fetching instructor profile:', error);
    }
  };

  const getCourses = async () => {
    try {
      const res = await adminApi.get<{ success: boolean; courses: ICourse[] }>(
        `/admin/instructors/${id}/courses`
      );
      if (res.data.success) {
        setCourses(res.data.courses);
      }
    } catch (error) {
      console.error('Error fetching instructor courses:', error);
    }
  };

  const courseDetails = (courseId: string) => {
    navigate(`/admin/courseDetails/${courseId}`);
  };

  useEffect(() => {
    if (id) {
      getProfile();
      getCourses();
    }
  }, [id]);

  return (
    <div className="profile">
      <Navbar />
      <div className="profile-container1">
        {/* LEFT */}
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
              <div>
                <h2>{user.name}</h2>
                <h5>Email: {user.email}</h5>
              </div>
            </div>

            <div className="about-me">
              <h4>Bio</h4>
              <p>{user.bio || 'No bio available'}</p>
            </div>

            <div className="user-details-box">
              <p>
                <i className="fas fa-user"></i> <strong>Role:</strong> Instructor
              </p>
              <p>
                <i className="fas fa-certificate"></i>{' '}
                <strong>Expertise:</strong> {user.expertise || 'Not added'}
              </p>
              <p>
                <i className="fas fa-check-circle"></i> <strong>KYC:</strong>
                {user.KYCstatus === 'verified' ? (
                  <span style={{ color: 'green', fontWeight: 'bold' }}> Verified</span>
                ) : user.KYCstatus === 'pending' ? (
                  <span style={{ color: 'orange', fontWeight: 'bold' }}> Pending</span>
                ) : user.KYCstatus === 'rejected' ? (
                  <span style={{ color: 'red', fontWeight: 'bold' }}> Rejected</span>
                ) : (
                  <span> Not submitted</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="profile-right">
          <div className="education-box">
            <h3>Education</h3>
            <p>{user.education || 'Not added yet'}</p>

            <h3>Experience</h3>
            <p>{user.work || 'Not added yet'}</p>
          </div>

          <div className="enrolled-courses">
            <h3>Courses by {user.name}</h3>
            {courses.length === 0 ? (
              <p>No courses yet.</p>
            ) : (
              courses.map((course) => (
                <div
                  className="course-card-mini"
                  key={course._id}
                  onClick={() => courseDetails(course._id)}
                >
                  <img
                    src={`http://localhost:5000/assets/${course.thumbnail}`}
                    alt={course.title}
                    className="course-thumb-mini"
                  />
                  <div>
                    <h4>{course.title}</h4>
                    <p>
                      {course.level} | ₹{course.price}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInstructorDetails;
