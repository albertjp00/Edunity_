import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { getSubscriptionCourses } from "../../services/courseServices";


interface IModule {
  title: string;
  videoUrl: string;
  content: string;
}

interface ICourse {
  _id: string;
  title: string;
  description: string;
  price: string;
  thumbnail: string;
  modules?: IModule[];
}

interface IMyCourse {
  _id: string;
  userId: string;
  courseId: string;
  course: ICourse | null; 
  progress: {
    completedModules: string[];
  };
  createdAt: string;
}

const UserMyCourses: React.FC = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const navigate = useNavigate();

  const fetchCourses = async (page: number = 1): Promise<void> => {
    try {
      const res = await getSubscriptionCourses(page);
      if (res?.data.success) {
        const rawCourses =
          res.data.courses ;

        const validCourses = rawCourses.filter(
          (item: IMyCourse) => item.course !== null
        );

        setCourses(validCourses);
        setCurrentPage(res.data.currentPage || 1);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const selectCourse = (courseId: string): void => {
    navigate(`/user/courseDetails/${courseId}`);
  };

  useEffect(() => {
    fetchCourses(currentPage);
  }, [currentPage]);

 return (
  <div className="max-w-7xl mx-auto px-6 py-12">
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
      <div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">My Courses</h2>
        <p className="text-slate-500 text-lg mt-2">Continue your learning journey.</p>
      </div>
      <div className="inline-flex items-center bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold">
        {courses.length} Courses Enrolled
      </div>
    </div>

    {courses.length === 0 ? (
      <div className="text-center py-32 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
        <span className="text-6xl mb-6 block">📚</span>
        <h3 className="text-xl font-bold text-slate-800">Your library is empty</h3>
        <p className="text-slate-500 mt-2">Explore our catalog to start learning.</p>
      </div>
    ) : (
      <>
        {/* Adjusted Grid: max 3 columns for larger cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.map((myCourse) => {
            const { _id, title, description, thumbnail, modules = [] } = myCourse;
            
            // Example progress calculation
            const progressPercent = 45; 

            return (
              <div
                key={_id}
                className="group bg-white rounded-[1.5rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col"
                onClick={() => selectCourse(_id)}
              >
                {/* LARGER THUMBNAIL */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  {thumbnail ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}/assets/${thumbnail}`}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Glassmorphism Badge */}
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    Premium Content
                  </div>
                </div>

                {/* MORE SPACIOUS DETAILS */}
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-slate-900 line-clamp-2 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">
                    {title}
                  </h3>
                  
                  <p className="text-slate-500 text-base line-clamp-3 mb-8 flex-1 leading-relaxed">
                    {description || "Master the core concepts of this subject with our expert-led comprehensive curriculum."}
                  </p>

                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-tighter mb-1">Your Progress</p>
                        <p className="text-indigo-600 font-bold">{modules.length} Modules</p>
                      </div>
                      <span className="text-2xl font-black text-slate-900">{progressPercent}%</span>
                    </div>
                    
                    {/* Thicker Progress Bar */}
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* PAGINATION */}
        <div className="mt-20 flex justify-center items-center gap-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-600 transition-all"
          >
            ← Previous
          </button>

          <div className="hidden sm:flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-12 h-12 rounded-xl font-bold transition-all ${
                  currentPage === i + 1
                    ? "bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-200"
                    : "text-slate-400 hover:bg-slate-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 disabled:opacity-30 transition-all"
          >
            Next →
          </button>
        </div>
      </>
    )}
  </div>
);
};

export default UserMyCourses;
