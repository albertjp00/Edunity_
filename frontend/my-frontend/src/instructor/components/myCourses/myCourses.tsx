import React, { useEffect, useState } from 'react';
import './MyCourses.css'
import { useNavigate } from 'react-router-dom';
import instructorApi from '../../../api/instructorApi';
import axios from 'axios';

interface Course {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  price?: number;
}

const MyCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  const navigate = useNavigate()


  const fetchCourses = async () => {
    try {
      const res = await instructorApi.get(`/instructor/getCourse`,{
        
      });
      if (res.data.success) {
        setCourses(res.data.course);
        console.log(res.data.course);
        
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const selectCourse = (id:string)=>{
    navigate(`/instructor/courseDetails/${id}`)

  }

  useEffect(() => {
    fetchCourses();
  }, []);

 return (
  <div>
    <div className="course-container">
      <h2>Your Courses</h2>
      {courses.length === 0 ? (
        <p>No courses yet.</p>
      ) : (
        <div className="course-list">
          {courses.map(course => (
            <div key={course._id} className="course-card" onClick={()=>selectCourse(course._id)}>
              {course.thumbnail && (
                <img
                  src={`http://localhost:5000/assets/${course.thumbnail}`}
                  alt="Thumbnail"
                  className="course-thumbnail"
                />
              )}

              <div className="course-details">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">{course.description}</p>
                <p className="course-price">₹{course.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);


};

export default MyCourses;
