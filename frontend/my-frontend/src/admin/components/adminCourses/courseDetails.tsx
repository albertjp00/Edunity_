import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminApi from "../../../api/adminApi";
import "./courseDetails.css";

interface IInstructor {
  _id: string;
  name: string;
  email: string;
  expertise?: string;
  bio?: string;
  profileImage?: string;
  work?: string;
  education?: string;
}

interface EnrolledUser {
  _id: string;
  name: string;
  email: string;
}

interface Module {
  title: string;
  videoUrl: string;
  content: string;
}

interface Course {
  _id: string;
  title: string;
  description?: string;
  price?: number;
  thumbnail?: string;
  skills?: string[];
  level?: string;
  modules?: Module[];
  createdAt?: string;
  totalEnrolled?: number;
}

const CourseDetailsAdmin: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  const [instructor, setInstructor] = useState<IInstructor | null>(null);
  const [enrolledUsers, setEnrolledUsers] = useState<EnrolledUser[]>([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await adminApi.get(`admin/courseDetails/${id}`); // only course info
        setCourse(res.data.course);
      } catch (err) {
        console.error("Error fetching course details:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchInstructor = async () => {
      try {
        const res = await adminApi.get(`admin/course/instructor/${id}`);
        setInstructor(res.data.instructor);
      } catch (err) {
        console.error("Error fetching instructor:", err);
      }
    };

    const fetchEnrolledUsers = async () => {
      try {
        const res = await adminApi.get(`admin/course/enrolledUsers/${id}`);
        setEnrolledUsers(res.data.users);
      } catch (err) {
        console.error("Error fetching enrolled users:", err);
      }
    };

    fetchCourse();
    fetchInstructor();
    fetchEnrolledUsers();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!course) return <p>No course found</p>;

  return (
    <div className="course-details-container">
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <p>
        <strong>Price:</strong> ${course.price}
      </p>
      <p>
        <strong>Level:</strong> {course.level || "Not specified"}
      </p>
      <p>
        <strong>Skills:</strong>{" "}
        {course.skills?.length ? course.skills.join(", ") : "N/A"}
      </p>

      {course.thumbnail && (
        <img
          src={course.thumbnail}
          alt={course.title}
          className="course-thumbnail"
        />
      )}

      {/* Instructor */}
      <div className="instructor-card">
        <h2>Instructor</h2>
        {instructor?.profileImage && (
          <img
            src={`http://localhost:5000/assets/${instructor.profileImage}`}
            alt={instructor.name}
          />
        )}
        <p>
          <strong>Name:</strong> {instructor?.name}
        </p>
        <p>
          <strong>Email:</strong> {instructor?.email}
        </p>
        <p>
          <strong>Expertise:</strong> {instructor?.expertise || "N/A"}
        </p>
        <p>
          <strong>Bio:</strong> {instructor?.bio || "N/A"}
        </p>
        <p>
          <strong>Work:</strong> {instructor?.work || "N/A"}
        </p>
        <p>
          <strong>Education:</strong> {instructor?.education || "N/A"}
        </p>
      </div>

      {/* Enrolled Users */}
      <div className="enrolled-users">
        <h2>Enrolled Users</h2>
        {enrolledUsers.length > 0 ? (
          <ul>
            {enrolledUsers.map((user) => (
              <li key={user._id}>
                {user.name} ({user.email})
              </li>
            ))}
          </ul>
        ) : (
          <p>No enrolled users yet</p>
        )}
      </div>
    </div>
  );
};

export default CourseDetailsAdmin;
