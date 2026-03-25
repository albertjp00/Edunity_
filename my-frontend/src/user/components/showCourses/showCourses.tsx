import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./showCourses.css";
import { showCourses } from "../../services/courseServices";

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  level: string;
  thumbnail: string;
  skills: string[];
  instructorName: string;
  instructorImage: string;
  category:string
}

const ShowCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  const fetchCourses = async (): Promise<void> => {
    try {
      const res = await showCourses()
      if(!res) return
      if (res.data.success) {
        console.log(res);
        
        setCourses(res.data.course);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const gotoAllCourses = (): void => {
    navigate("/user/allCourses");
  };

  const selectCourse = (id: string): void => {
    navigate(`/user/courseDetails/${id}`);
  };

  return (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 bg-white"> {/* Reduced py-20 to py-12 */}
    <section className="courses-section">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4"> {/* Reduced mb-12 and gap */}
        <div className="max-w-xl">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-3">
            Top Popular Courses
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight"> {/* Reduced text sizes */}
            Edunity Courses <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Students</span> Can Join.
          </h2>
        </div>
        <button 
          className="group flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-indigo-600 transition-all duration-300 shadow-md shadow-slate-200"
          onClick={gotoAllCourses}
        >
          Explore All
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Reduced gap from 10 to 6 */}
        {courses.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
             <p className="text-slate-500 font-bold text-base">No courses available right now.</p>
          </div>
        ) : (
          courses.map((course) => (
            <div 
              key={course._id} 
              className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col overflow-hidden"
            >
              {/* THUMBNAIL WRAPPER */}
              <div className="relative aspect-[16/9] overflow-hidden"> {/* Adjusted aspect ratio slightly */}
                <img
                  src={`${import.meta.env.VITE_API_URL}/assets/${course.thumbnail}`}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[9px] font-black uppercase tracking-wider text-slate-900 shadow-sm">
                    {course.category || "Web Development"}
                  </span>
                </div>
                {/* Floating Price Tag */}
                <div className="absolute bottom-3 right-3 bg-indigo-600 text-white px-3 py-1 rounded-lg font-black text-base shadow-lg">
                  ₹{course.price}
                </div>
              </div>

              {/* DETAILS */}
              <div className="p-5 flex flex-col flex-1"> {/* Reduced padding from p-8 to p-5 */}
                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                  {course.title}
                </h3>

                <div className="flex items-center gap-3 text-slate-400 text-[11px] font-bold mb-6">
                  <div className="flex items-center gap-1">
                    <span className="text-sm">📚</span> 10 Lessons
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">⏰</span> 6h
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">👨‍🎓</span> 20+
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/assets/${course.instructorImage}`}
                      alt="instructor"
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-indigo-50"
                    />
                    <span className="text-xs font-bold text-slate-700">{course.instructorName}</span>
                  </div>

                  <button
                    className="flex items-center justify-center w-9 h-9 bg-slate-50 text-slate-900 rounded-full hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm"
                    onClick={() => selectCourse(course._id)}
                  >
                    <span className="text-base font-bold">→</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  </div>
);
};

export default ShowCourses;
