import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './courseDetails.css';
import Navbar from '../../components/navbar/navbar';
import VideoPlayer from '../videoPlayer/videoPlayer';
import { getCourseDetails } from '../../services/instructorServices';

// Define types for Module and Course
interface Module {
  title: string;
  videoUrl?: string;
  content?: string;
}

interface Course {
  _id: string;
  id:string;
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
      if (res.data.success) {
        console.log(res);
        
        setCourse(res.data.course as Course);
        setQuizExists(res.data.quiz);
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
  <div className="min-h-screen bg-gray-50">
    <Navbar />

    {/* Header / Banner Section */}
    <div className="bg-slate-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold mb-4">{course.title}</h1>
            <p className="text-slate-300 text-lg max-w-2xl line-clamp-3">
              {course.description}
            </p>
            
            <div className="flex flex-wrap gap-3 mt-6">
              {!quizExists ? (
                <button onClick={() => addQuiz(course.id)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20">
                  📑 Add Quiz
                </button>
              ) : (
                <button onClick={() => navigate(`/instructor/editQuiz/${course.id}`)} className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 px-5 py-2.5 rounded-lg font-semibold transition-all">
                  📘 View Quiz
                </button>
              )}
              <button onClick={() => purchaseDetails(course.id)} className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 px-5 py-2.5 rounded-lg font-semibold transition-all">
                📚 Purchase Details
              </button>
              <button onClick={() => handleEdit(course.id)} className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-5 py-2.5 rounded-lg font-bold transition-all flex items-center gap-2">
                ✏️ Edit Course
              </button>
            </div>
          </div>
          
          {/* Main Card (Desktop Right) */}
          <div className="w-full md:w-80 bg-white rounded-2xl shadow-xl overflow-hidden text-slate-900 border border-gray-100">
            {course.thumbnail && (
              <img
                src={`${import.meta.env.VITE_API_URL}/assets/${course.thumbnail}`}
                alt="Course Thumbnail"
                className="w-full aspect-video object-cover"
              />
            )}
            <div className="p-6">
              <div className="text-3xl font-bold mb-4">₹{course.price}</div>
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🧑‍🎓</span>
                  <div>
                    <p className="font-bold text-gray-900">{course.level} Level</p>
                    <p>No prior experience required</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">⏱️</span>
                  <div>
                    <p className="font-bold text-gray-900">12 Hours</p>
                    <p>Estimated total time</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">🎯</span>
                  <p className="font-bold text-gray-900">Self-paced learning</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Content Section */}
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          
          {/* Skills Section */}
          {course.skills && course.skills.length > 0 && (
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold mb-6 text-gray-900">Skills you'll gain</h3>
              <div className="flex flex-wrap gap-2">
                {course.skills.map((skill, index) => (
                  <span key={index} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-100">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Modules Section */}
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              Course Content 
              <span className="text-sm font-normal text-gray-500">• {course.modules.length} modules</span>
            </h3>
            
            {course.modules.length > 0 ? (
              <div className="space-y-4">
                {course.modules.map((module, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all hover:border-blue-300">
                    <button
                      className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 transition-colors text-left"
                      onClick={() => toggleModule(idx)}
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-gray-800">{module.title || `Module ${idx + 1}`}</h4>
                      </div>
                      <span className={`transform transition-transform ${expandedIndex === idx ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </button>
                    
                    {expandedIndex === idx && (
                      <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                        <div className="mb-6 rounded-lg overflow-hidden shadow-inner bg-black">
                           {module.videoUrl && <VideoPlayer initialUrl={module.videoUrl} />}
                        </div>
                        <div className="prose prose-slate max-w-none">
                          <h5 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Module Description</h5>
                          <p className="text-gray-700 leading-relaxed">{module.content}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                <p className="text-gray-500">No modules found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default InstructorCourseDetails;
