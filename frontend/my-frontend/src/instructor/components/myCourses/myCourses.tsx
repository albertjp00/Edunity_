import React, { useEffect, useState } from 'react';
import './myCourses.css'
import { useNavigate } from 'react-router-dom';
import instructorApi from '../../../api/instructorApi';

interface Course {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  price?: number;
  totalEnrolled?:number
}

const MyCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  // const [instructor ,setInstructor] = useState<IInstructor>()

  const navigate = useNavigate()


  const fetchCourses = async () => {
    try {
      const res = await instructorApi.get(`/instructor/getCourse`, {

      });
      if (res.data.success) {
        console.log(res.data.instructor);
        
        setCourses(res.data.course);
        // setInstructor(res.data.instrcutor)
        // console.log(res.data.course);

      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const selectCourse = (id: string) => {
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
          <div className="show-course-list">
            {courses.map(course => (
              <div key={course._id} className="course-card" onClick={() => selectCourse(course._id)}>
                {course.thumbnail && (
                  <img
                    src={`http://localhost:5000/assets/${course.thumbnail}`}
                    alt="Thumbnail"
                    className="course-thumbnail"
                  />
                )}

                <span className="course-price">₹{course.price}</span>

                <div className="course-details">
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-description">{course.description}</p>

                  {/* meta section */}
                  <div className="course-meta">
                    <span>Lessons: 10</span>
                    <span>2h 30m</span>
                    <span>Enrolled : {course.totalEnrolled}</span>
                  </div>

                  {/* footer */}
                  
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
