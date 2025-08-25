// src/pages/admin/CourseDetailsAdmin.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminApi from "../../../api/adminApi";

interface Instructor {
  _id: string;
  name: string;
  email: string;
}

interface EnrolledUser {
  _id: string;
  name: string;
  email: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  price: string;
  thumbnail: string;
  instructor: Instructor;
  enrolledUsers: EnrolledUser[];
}

const CourseDetailsAdmin: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await adminApi.get(`admin/courseDetails/${id}`);
        setCourse(res.data.course); // ✅ match backend response
      } catch (err) {
        console.error("Error fetching course details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!course) return <p>No course found</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
      <p className="mb-4">{course.description}</p>
      <p className="mb-4 font-semibold">Price: ${course.price}</p>

      {course.thumbnail && (
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-64 h-40 object-cover rounded mb-6"
        />
      )}

      {/* Instructor Info */}
      <div className="mb-6">
        <h2 className="text-xl font-bold">Instructor</h2>
        <p>Name: {course.instructor?.name}</p>
        <p>Email: {course.instructor?.email}</p>
      </div>

      {/* Enrolled Users */}
      <div>
        <h2 className="text-xl font-bold">Enrolled Users</h2>
        {course.enrolledUsers && course.enrolledUsers.length > 0 ? (
          <ul className="list-disc pl-6">
            {course.enrolledUsers.map((user) => (
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
