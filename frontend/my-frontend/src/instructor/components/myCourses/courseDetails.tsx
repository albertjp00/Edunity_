import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CourseDetails.css';
import Navbar from '../../components/navbar/navbar';
import instructorApi from '../../../api/instructorApi';

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

  const navigate = useNavigate();

  const fetchCourse = async (): Promise<void> => {
    try {
      const res = await instructorApi.get(`/instructor/courseDetails/${id}`);
      console.log(res.data);
      if(res.data.success){
      setCourse(res.data.course as Course);
    }
    } catch (err) {
      console.error('Error fetching course:', err);
    }
  };



  const handleEdit = (id: string): void => {
    navigate(`/instructor/editCourse/${id}`);
  };

  const convertToEmbedUrl = (url: string): string => {
    if (url.includes('watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'www.youtube.com/embed/');
    }
    return url;
  };

  useEffect(() => {
    fetchCourse();
  }, []);

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
          <button onClick={() => handleEdit(course._id)} className="edit-button">
            ✏️ Edit Course
          </button>
        </div>

        {course.thumbnail && (
          <img
            src={`http://localhost:5000/assets/${course.thumbnail}`}
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
                        {module.videoUrl && (module.videoUrl.includes('youtube.com') || module.videoUrl.includes('youtu.be')) ? (
                          <iframe
                            width="100%"
                            height="315"
                            src={convertToEmbedUrl(module.videoUrl)}
                            title="Lesson Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ marginTop: '10px' }}
                          ></iframe>
                        ) : (
                          module.videoUrl && (
                            <video width="100%" height="auto" controls style={{ marginTop: '10px' }}>
                              <source src={module.videoUrl} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          )
                        )}
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
