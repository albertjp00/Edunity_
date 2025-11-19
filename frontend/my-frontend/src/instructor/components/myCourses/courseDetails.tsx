import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './courseDetails.css';
import Navbar from '../../components/navbar/navbar';
import VideoPlayer from '../videoPlayer/videoPlayer';
import { getCourseDetails } from '../../services/Instructor/instructorServices';

// Define types for Module and Course
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

}

const InstructorCourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [quizExists, setQuizExists] = useState<boolean>(false)

  const navigate = useNavigate();

  const fetchCourse = async (): Promise<void> => {
    try {
      const res = await getCourseDetails(id)
      if(!res) return
      console.log(res.data.course);
      if (res.data.success) {
        setCourse(res.data.course.course as Course);
        setQuizExists(res.data.course.quizExists);
      }
    } catch (err) {
      console.error('Error fetching course:', err);
    }
  };



  const handleEdit = (id: string): void => {
    navigate(`/instructor/editCourse/${id}`);
  };

  const addQuiz = (id: string): void => {
    navigate(`/instructor/addQuiz/${id}`);
  };

  //   const editQuiz = (id: string): void => {
  //   navigate(`/instructor/editQuiz/${id}`);
  // };




  useEffect(() => {
    fetchCourse();
  }, []);


  const purchaseDetails = (id: string) => {
    navigate(`/instructor/purchaseDetails/${id}`)
  }

  const toggleModule = (index: number): void => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (!course) return <p>Loading...</p>;

  return (
    <div className="details">
      <Navbar />
      <div className="course-detail-page">
        <div className="course-title">
          <h2>{course.title}</h2>

          {!quizExists ? (
            <button onClick={() => addQuiz(course._id)} className="edit-button">
              📑 Add Quiz
            </button>
          ) : (
            <>
              <button onClick={() => navigate(`/instructor/quiz/${course._id}`)} className="edit-button">
                📘 View Quiz
              </button>
              {/* <button onClick={() => editQuiz(course._id)} className="edit-button">
                ✏️ Edit Quiz
              </button> */}
            </>
          )}

          <button onClick={() => purchaseDetails(course._id)} className='edit-button'>
            📚Purchase Details</button>

          <button onClick={() => handleEdit(course._id)} className="edit-button">
            ✏️ Edit Course
          </button>
        </div>


        {course.thumbnail && (
          <img
            src={`${import.meta.env.VITE_API_URL}/assets/${course.thumbnail}`}
            alt="Course Thumbnail"
            className="detail-thumbnail"
          />
        )}

        <p><strong>Description:</strong> {course.description}</p>
        <p><strong>Price:</strong> ₹{course.price}</p>

        <div className="course-highlights">
          <div className="highlight-row">
            <div className="highlight-item">
              <p>🧑‍🎓 <strong>{course.level} level</strong></p>
              <span>No prior experience required</span>
            </div>
            <div className="highlight-item">
              <p>⏱️ <strong>Estimated Time</strong></p>
              <span>12 hours</span>
            </div>
            <div className="highlight-item">
              <p>🎯 <strong>Learn at your own pace</strong></p>
            </div>
          </div>
        </div>

        {/* Skills Box */}
        {course.skills && course.skills.length > 0 && (
          <div className="skills-box">
            <p className="skills-title">Skills you'll gain</p>
            <div className="skills-list">
              {course.skills.map((skill, index) => (
                <button key={index} className="skill-button">{skill}</button>
              ))}
            </div>
          </div>
        )}

        {/* Modules */}
        <div className="modules">
          <h3>Modules:</h3>
          {course.modules.length > 0 ? (
            <div className="modules-list">
              {course.modules.map((module, idx) => (
                <div key={idx} className="module">
                  <div
                    className="module-header"
                    onClick={() => toggleModule(idx)}
                    style={{
                      cursor: 'pointer',
                      background: '#f0f0f0',
                      padding: '10px',
                      borderRadius: '5px',
                    }}
                  >
                    <h4>📘 {module.title || `Module ${idx + 1}`}</h4>
                  </div>
                  {expandedIndex === idx && (
                    <div className="module-body" style={{ padding: '10px 20px' }}>
                      <div>
                        <strong>🎥 Video:</strong>
                        {module.videoUrl && <VideoPlayer initialUrl={module.videoUrl} />}


                      </div>
                      <p><strong>📝 Content:</strong> {module.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No modules found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorCourseDetails;
