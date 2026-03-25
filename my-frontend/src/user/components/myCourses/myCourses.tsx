import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyCourses } from "../../services/courseServices";

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
  blocked: boolean;
}

const UserMyCourses: React.FC = () => {
  const [courses, setCourses] = useState<IMyCourse[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const navigate = useNavigate();

  const fetchCourses = async (page: number = 1): Promise<void> => {
    try {
      const res = await getMyCourses(page);
      if (res?.data.success) {
        const rawCourses = res.data.courses || res.data.populatedCourses || [];
        const validCourses = rawCourses.filter(
          (item: IMyCourse) => item.course !== null && !item.blocked
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
    navigate(`/user/viewMyCourse/${courseId}`);
  };

  useEffect(() => {
    fetchCourses(currentPage);
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            My Learning Journey
          </h2>
          <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
            {courses.length} Courses
          </span>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
            <i className="fas fa-graduation-cap text-5xl text-gray-300 mb-4"></i>
            <p className="text-gray-500 text-lg font-medium">No courses found in your library.</p>
            <button 
              onClick={() => navigate('/courses')} 
              className="mt-4 text-indigo-600 font-semibold hover:underline"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((myCourse) => {
                if (!myCourse.course) {
                  return (
                    <div key={myCourse._id} className="bg-red-50 border border-red-100 p-6 rounded-xl flex items-center gap-3">
                      <i className="fas fa-exclamation-triangle text-red-500"></i>
                      <p className="text-red-700 font-medium text-sm">Course no longer available.</p>
                    </div>
                  );
                }

                const { _id, title, description, thumbnail, modules = [] } = myCourse.course;
                const completedCount = myCourse.progress?.completedModules?.length || 0;
                const totalModules = modules.length;
                // const progressPercentage = totalModules > 0 ? (completedCount / totalModules) * 100 : 0;

                return (
                  <div
                    key={myCourse._id}
                    onClick={() => selectCourse(_id)}
                    className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={`${import.meta.env.VITE_API_URL}/assets/${thumbnail}`}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2 h-10">
                        {description}
                      </p>

                      <div className="mt-6">
                        {/* <div className="flex justify-between text-xs font-semibold text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div 
                            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-1000" 
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div> */}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <i className="far fa-calendar-alt"></i>
                          {new Date(myCourse.createdAt).toLocaleDateString()}
                        </span>
                        <span className="font-medium text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">
                          {completedCount}/{totalModules} Modules
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <i className="fas fa-chevron-left mr-2 text-xs"></i> Prev
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-lg font-bold transition ${
                        currentPage === i + 1
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next <i className="fas fa-chevron-right ml-2 text-xs"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserMyCourses;