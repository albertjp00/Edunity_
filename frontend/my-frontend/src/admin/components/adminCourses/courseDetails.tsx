import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./courseDetails.css";
import { viewCourseDetails } from "../../services/adminServices";

interface Module {
  title: string;
  videoUrl?: string;
  content?: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  level: string;
  thumbnail?: string;
  skills?: string[];
  modules: Module[];
  category?: string;
  totalEnrolled?: number;
}

interface Instructor {
  name: string;
  email: string;
  expertise?: string;
  bio?: string;
  education?: string;
  work?: string;
  profileImage?: string;
}

const AdminCourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [instructor, setInstructor] = useState<Instructor | null>(null);

  const fetchCourse = async () => {
    try {
      const res = await viewCourseDetails(id);
      if (!res) return;

      const courseData = res.data.course;
      const instructorData = res.data.instructor;

      setCourse(courseData);
      setInstructor(instructorData);
    } catch (err) {
      console.error("Error fetching course:", err);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  if (!course) return <p>Loading...</p>;

  return (
    <div className="details">
      <div className="course-detail-page">

        {/* Title */}
        <h2 className="course-title">{course.title}</h2>

        {/* Thumbnail */}
        {course.thumbnail && (
          <img
            src={`${import.meta.env.VITE_API_URL}/assets/${course.thumbnail}`}
            alt="Course Thumbnail"
            className="detail-thumbnail"
          />
        )}

        {/* Basic Info */}
        <p><strong>Description:</strong> {course.description}</p>
        <p><strong>Price:</strong> ₹{course.price}</p>
        <p><strong>Level:</strong> {course.level}</p>
        <p><strong>Category:</strong> {course.category}</p>
        <p><strong>Total Enrolled:</strong> {course.totalEnrolled}</p>

        {/* Skills */}
        {course.skills && course.skills.length > 0 && (
          <div className="skills-box">
            <p className="skills-title">Skills Included</p>
            <div className="skills-list">
              {course.skills.map((skill, index) => (
                <button key={index} className="skill-button">
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Instructor */}
        <h3>Instructor Details</h3>
        {instructor ? (
          <div className="instructor-box">
            {instructor.profileImage && (
              <img
                src={`${import.meta.env.VITE_API_URL}/assets/${instructor.profileImage}`}
                alt="Instructor"
                className="instructor-img"
              />
            )}

            <p><strong>Name:</strong> {instructor.name}</p>
            <p><strong>Email:</strong> {instructor.email}</p>
            <p><strong>Expertise:</strong> {instructor.expertise}</p>
            <p><strong>Education:</strong> {instructor.education}</p>
            <p><strong>Work Experience:</strong> {instructor.work}</p>
            <p><strong>Bio:</strong> {instructor.bio}</p>
          </div>
        ) : (
          <p>No instructor info.</p>
        )}

        {/* Modules */}
        <h3>Modules</h3>
        {course.modules.length > 0 ? (
          <ul className="modules-list">
            {course.modules.map((module, index) => (
              <li key={index} className="module-item">
                <strong>📘 {module.title}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p>No modules found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminCourseDetails;
