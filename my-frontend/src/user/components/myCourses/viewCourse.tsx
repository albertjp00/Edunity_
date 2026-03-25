import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./viewMyCourse.css";
import {
  cancelCourse,
  getCertificate,
  submitReport,
  submitReview,
  updateProgress,
  viewMyCourse,
} from "../../services/courseServices";
import VideoPlayerUser from "../videoPlayer/videoPlayer";
import { toast } from "react-toastify";
import ConfirmModal from "../modal/modal";
import type {
  ICourse,
  IInstructor,
  IMyCourse,
  IReport,
  IReview,
  User,
} from "../../interfaces";
import { getUserProfile } from "../../services/profileServices";

const ViewMyCourse: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [instructor, setInstructor] = useState<IInstructor | null>(null);
  const [quiz, setQuiz] = useState<boolean>();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [showModal, setShowModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [review, setReview] = useState<IReview[] | null>();
  const [user, setUser] = useState<User | null>();
  const [myReview, setMyReview] = useState<IReview | null>(null);
  // const [myReviewRating, setReviewRating] = useState<number | null>(null)
  // const [myReviewText, setReviewText] = useState<string | null>("")
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  // const [loadingReview, setLoadingReview] = useState<boolean>(false);
  const [report, setReport] = useState<IReport>({
    reason: "",
    message: "",
  });

  const navigate = useNavigate();

  const [canCancel, setCanCancel] = useState<boolean>(false);

  const fetchCourse = async (): Promise<void> => {
    try {
      if (!id) {
        console.error("Course ID is missing");
        return;
      }
      const res = await viewMyCourse(id);
      if (!res) return;

      console.log("course", res);

      const fetchedMyCourse: IMyCourse = res.data.course;
      const fetchedInstructor: IInstructor = res.data.instructor;
      setCourse(fetchedMyCourse.course);
      setInstructor(fetchedInstructor);
      setCompletedModules(fetchedMyCourse.progress?.completedModules || []);
      setQuiz(res.data.quiz);
      setReview(res.data.review);

      const reviews = res.data.review || [];
      if (!user) return;
      const hasMyReview = reviews.find((r: IReview) => r.userId === user.id);

      if (hasMyReview) {
        setMyReview(hasMyReview);
      }
      console.log(hasMyReview);

      setCanCancel(res.data.course.cancelCourse);
    } catch (err) {
      console.error("Error fetching course:", err);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await getUserProfile();
      if (!res) return;
      console.log("user", res);

      setUser(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchCourse();
    }
  }, [user]);

  const toggleModule = (index: number): void => {
    setExpandedModule(expandedModule === index ? null : index);
  };

  const markAsCompleted = async (moduleTitle: string): Promise<void> => {
    if (completedModules.includes(moduleTitle)) return;
    try {
      console.log("marked as completed");

      if (!id) return;
      await updateProgress(id, moduleTitle);
      setCompletedModules((prev) => [...prev, moduleTitle]);
      setCanCancel(false);
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  // const handleCancelClick = (courseId: string | null) => {
  //   setSelectedCourseId(courseId);
  //   setShowModal(true);
  // };

  const confirmCancel = async () => {
    try {
      if (!selectedCourseId) return;
      const res = await cancelCourse(selectedCourseId);
      if (!res) return;
      if (res.data.success) {
        toast.success("Course cancelled successfully!");
        navigate("/user/myCourses");
      }
    } catch (err) {
      console.error("Error cancelling course:", err);
      toast.error("Unable to cancel course.");
    } finally {
      setShowModal(false);
      setSelectedCourseId(null);
    }
  };

  const cancelAction = () => {
    setShowModal(false);
    setSelectedCourseId(null);
  };

  const gotoQuiz = (myCourseId: string) => {    
    navigate(`/user/quiz/${myCourseId}`);
  };

  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);

  const handleViewCertificate = async (id: string) => {
    try {
      const response = await getCertificate(id);
      console.log(response);

      if (!response?.data.certificate?.filePath) return;

      // Save the file name directly
      setCertificateUrl(response.data.certificate?.filePath);
      setShowCertificate(true);
    } catch (error) {
      console.error("Error showing certificate:", error);
      toast.error("Unable to show certificate.");
    }
  };

  //reviews

  const handleSubmitReview = async () => {
    if (rating === 0 || !reviewText.trim()) {
      toast.error("Please provide both rating and review text.");
      return;
    }

    try {
      const courseId = course?._id;
      if (!courseId) return;
      const res = await submitReview(courseId, rating, reviewText);

      if (!res) return;
      console.log(res);

      if (res.data.success) {
        toast.success("Review submitted successfully!");
        setRating(0);
        setReviewText("");
        setMyReview(res.data.result);

        const newReview = res.data.review;

        setReview((prev) => {
          if (isEditingReview) {
            return prev
              ? prev.map((r) => (r.userId === newReview.userId ? newReview : r))
              : newReview;
          }

          return prev ? [...prev, newReview] : [newReview];
        });
        setIsEditingReview(false);
        setMyReview(newReview);
      } else if (!res.data.success) {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review.");
    } finally {
      // setLoadingReview(false);
    }
  };

  const reportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!id || !report.reason) return;
      await submitReport(id, report);

      toast.success("report submitted");
      setReport({ reason: "", message: "" });
    } catch (error) {
      console.log(error);
    }
  };

  if (!course) return <p>Loading...</p>;

  const totalModules = course.modules.length;
  const completedCount = completedModules.length;
  const progressPercent = Math.round((completedCount / totalModules) * 100);

return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-indigo-600 text-sm font-semibold tracking-wide uppercase">My Learning</p>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-1">{course.title}</h2>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <img
                src={`${import.meta.env.VITE_API_URL}/assets/${course.thumbnail}`}
                alt="Course Thumbnail"
                className="w-full h-64 sm:h-96 object-cover"
              />
              
              {/* Tabs Navigation */}
              <div className="flex border-b border-gray-100 px-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
                {['overview', 'curriculum', 'instructor', 'report'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 text-sm font-bold capitalize transition-all border-b-2 ${
                      activeTab === tab 
                      ? "border-indigo-600 text-indigo-600" 
                      : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-6 animate-fadeIn">
                    <section>
                      <h4 className="text-lg font-bold text-gray-800 mb-2">Description</h4>
                      <p className="text-gray-600 leading-relaxed">{course.description}</p>
                    </section>
                    
                    <div className="bg-indigo-50 p-4 rounded-xl">
                      <h4 className="text-indigo-900 font-bold mb-2">What you'll learn</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-indigo-800">
                        <li className="flex items-center"><i className="fas fa-check-circle mr-2"></i> Professional industry practices</li>
                        <li className="flex items-center"><i className="fas fa-check-circle mr-2"></i> Real-world project building</li>
                        <li className="flex items-center"><i className="fas fa-check-circle mr-2"></i> End-to-end development</li>
                      </ul>
                    </div>

                    {/* Reviews inside Overview */}
                    <section className="pt-6 border-t border-gray-100">
                      <h4 className="text-lg font-bold text-gray-800 mb-4">Student Reviews</h4>
                      <div className="space-y-4">
                        {review?.map((r, index) => (
                          <div key={index} className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center space-x-3">
                                <img src={r.userImage ? `${import.meta.env.VITE_API_URL}/assets/${r.userImage}` : "https://via.placeholder.com/40"} className="w-10 h-10 rounded-full border border-white shadow-sm" alt="" />
                                <div>
                                  <p className="text-sm font-bold text-gray-800">{r.userName}</p>
                                  <div className="flex text-amber-400 text-xs">
                                    {[...Array(5)].map((_, i) => <i key={i} className={`fas fa-star ${i < r.rating ? 'text-amber-400' : 'text-gray-200'}`}></i>)}
                                  </div>
                                </div>
                              </div>
                              {myReview && r.userId === user?.id && !isEditingReview && (
                                <button onClick={() => { setIsEditingReview(true); setRating(r.rating); setReviewText(r.comment); }} className="text-xs text-indigo-600 font-bold hover:underline">Edit</button>
                              )}
                            </div>
                            <p className="mt-3 text-sm text-gray-600 italic">"{r.comment}"</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                )}

                {/* Curriculum Tab */}
                {activeTab === "curriculum" && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-700">Course Progress</span>
                      <span className="text-sm font-bold text-indigo-600">{progressPercent}%</span>
                    </div>
                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 transition-all duration-700" style={{ width: `${progressPercent}%` }}></div>
                    </div>

                    <div className="mt-8 space-y-3">
                      {course.modules.map((module, idx) => {
                        const isCompleted = completedModules.includes(module.title);
                        const isOpen = expandedModule === idx;
                        return (
                          <div key={idx} className={`border rounded-xl transition-all ${isOpen ? 'border-indigo-200 shadow-md' : 'border-gray-200'}`}>
                            <button onClick={() => toggleModule(idx)} className="w-full flex items-center justify-between p-4 text-left">
                              <div className="flex items-center space-x-3">
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                  {isCompleted ? <i className="fas fa-check"></i> : idx + 1}
                                </span>
                                <span className={`font-semibold ${isOpen ? 'text-indigo-600' : 'text-gray-700'}`}>{module.title}</span>
                              </div>
                              <i className={`fas fa-chevron-down transition-transform text-gray-400 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`}></i>
                            </button>
                            
                            {isOpen && (
                              <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                                <VideoPlayerUser initialUrl={module.videoUrl} onComplete={() => markAsCompleted(module.title)} />
                                <div className="mt-4 prose prose-sm max-w-none text-gray-600">{module.content}</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Instructor Tab */}
                {activeTab === "instructor" && instructor && (
                  <div className="text-center py-8 animate-fadeIn">
                    <img src={instructor.profileImage ? `${import.meta.env.VITE_API_URL}/assets/${instructor.profileImage}` : "https://via.placeholder.com/120"} className="w-32 h-32 rounded-full mx-auto border-4 border-indigo-50 shadow-lg mb-4" alt="" />
                    <h4 className="text-2xl font-bold text-gray-800">{instructor.name}</h4>
                    <p className="text-indigo-600 font-medium mb-4">{instructor.expertise}</p>
                    <p className="max-w-md mx-auto text-gray-600 mb-8">{instructor.bio}</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                      <button onClick={() => window.location.href = `/user/chat/${instructor._id}`} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition"><i className="far fa-comments mr-2"></i> Chat with Instructor</button>
                      <button onClick={() => navigate(`/user/instructorDetails/${instructor._id}`)} className="px-6 py-2 border border-gray-200 rounded-lg font-bold hover:bg-gray-50 transition">View Profile</button>
                    </div>
                  </div>
                )}

                {/* Report Tab */}
                {activeTab === "report" && (
                  <div className="max-w-lg mx-auto py-4 animate-fadeIn">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Report this course</h3>
                    <p className="text-sm text-gray-500 mb-6">If you find this course content misleading or inappropriate, let us know.</p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Reason</label>
                        <select value={report.reason} onChange={(e) => setReport({ ...report, reason: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                          <option value="">Select a reason</option>
                          <option value="misleading">Misleading course description</option>
                          <option value="scam">Scam or fake course</option>
                          <option value="inappropriate">Inappropriate content</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Details</label>
                        <textarea rows={4} value={report.message} onChange={(e) => setReport({ ...report, message: e.target.value })} placeholder="Tell us more..." className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                      </div>
                      <button onClick={reportSubmit} className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition">Submit Report</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Review Section (Post-Completion) */}
            {progressPercent === 100 && (!myReview || isEditingReview) && (
              <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm">
                <h4 className="text-lg font-bold text-gray-800 mb-4">{isEditingReview ? "Update your feedback" : "How was the course?"}</h4>
                <div className="flex items-center space-x-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)} className={`text-2xl transition-colors ${star <= rating ? 'text-amber-400' : 'text-gray-200'}`}>★</button>
                  ))}
                </div>
                <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Share your experience..." className="w-full p-4 border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-indigo-500 outline-none" />
                <div className="flex gap-2">
                  <button onClick={handleSubmitReview} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700">Submit</button>
                  {isEditingReview && <button onClick={() => setIsEditingReview(false)} className="px-6 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg">Cancel</button>}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (Right) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
              <h4 className="text-lg font-bold text-gray-800 mb-4">Course Info</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50">
                  <span className="text-gray-500"><i className="fas fa-users mr-2"></i> Enrolled</span>
                  <span className="font-bold text-gray-800">100+ Students</span>
                </div>
                <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50">
                  <span className="text-gray-500"><i className="fas fa-video mr-2"></i> Lectures</span>
                  <span className="font-bold text-gray-800">{totalModules}</span>
                </div>
                <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50">
                  <span className="text-gray-500"><i className="fas fa-signal mr-2"></i> Level</span>
                  <span className="font-bold text-gray-800">Beginner</span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                {progressPercent === 100 && (
                  <>
                    {quiz && (
                      <button onClick={() => gotoQuiz(course._id)} className="w-full py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 shadow-md transition transform hover:scale-[1.02]">
                        <i className="fas fa-trophy mr-2"></i> Take Course Quiz
                      </button>
                    )}
                    <button onClick={() => handleViewCertificate(course._id)} className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md transition transform hover:scale-[1.02]">
                      <i className="fas fa-graduation-cap mr-2"></i> View Certificate
                    </button>
                  </>
                )}

                {canCancel && (
                  <button onClick={() => { setSelectedCourseId(id!); setShowModal(true); }} className="w-full py-3 text-red-500 font-bold border border-red-100 rounded-xl hover:bg-red-50 transition">
                    Cancel Enrollment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative bg-white w-full max-w-4xl h-[80vh] rounded-2xl overflow-hidden shadow-2xl">
            <button onClick={() => setShowCertificate(false)} className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition">
              <i className="fas fa-times"></i>
            </button>
            <iframe
              src={`${import.meta.env.VITE_API_URL}/assets/${certificateUrl}`}
              title="Course Certificate"
              className="w-full h-full border-none"
            />
          </div>
        </div>
      )}

      <ConfirmModal
        show={showModal}
        title="Cancel Course"
        message="Are you sure you want to cancel? You will lose access to all modules and your progress will be deleted."
        onConfirm={confirmCancel}
        onCancel={cancelAction}
      />
    </div>
  );
};

export default ViewMyCourse;
