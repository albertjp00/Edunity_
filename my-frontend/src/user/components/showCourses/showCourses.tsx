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
  <div className="max-w-7xl mx-auto px-6 py-20 bg-white">
    <section className="courses-section">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="max-w-2xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest mb-4">
            Top Popular Courses
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
            Edunity Courses <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Students</span> Can Join With Us.
          </h2>
        </div>
        <button 
          className="group flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all duration-300 shadow-lg shadow-slate-200"
          onClick={gotoAllCourses}
        >
          Explore All Courses
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {courses.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
             <p className="text-slate-500 font-bold text-lg">No courses available right now.</p>
          </div>
        ) : (
          courses.map((course) => (
            <div 
              key={course._id} 
              className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col overflow-hidden"
            >
              {/* THUMBNAIL WRAPPER */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={`${import.meta.env.VITE_API_URL}/assets/${course.thumbnail}`}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-900 shadow-sm">
                    {course.category || "Web Development"}
                  </span>
                </div>
                {/* Floating Price Tag */}
                <div className="absolute bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-xl font-black text-lg shadow-lg">
                  ₹{course.price}
                </div>
              </div>

              {/* DETAILS */}
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-4 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                  {course.title}
                </h3>

                <div className="flex items-center gap-4 text-slate-400 text-sm font-bold mb-8">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">📚</span> 10 Lessons
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">⏰</span> 6h
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">👨‍🎓</span> 20+
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/assets/${course.instructorImage}`}
                      alt="instructor"
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-50"
                    />
                    <span className="text-sm font-bold text-slate-700">{course.instructorName}</span>
                  </div>

                  <button
                    className="flex items-center justify-center w-12 h-12 bg-slate-50 text-slate-900 rounded-full hover:bg-indigo-600 hover:text-white transition-all duration-300 group-last:bg-indigo-600"
                    onClick={() => selectCourse(course._id)}
                  >
                    <span className="text-xl font-bold">→</span>
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
