import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./courseDetailsUser.css";
import { toast } from "react-toastify";
import buyNowImage from "../../../assets/buyCourse.png";
import VideoPlayerUser from "../videoPlayer/videoPlayer";
import {
  addToFavourites,
  buyCourseService,
  buyFromWallet,
  courseDetails,
  fetchFavourites,
  paymentCancel,
  verifyPayment,
} from "../../services/courseServices";
import type {
  IInstructor,
  IModule,
  IReview,
  RazorpayInstance,
  RazorpayOptions,
} from "../../interfaces";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export interface ICourse {
  _id: string;
  title: string;
  description: string;
  price?: number;
  level: string;
  thumbnail?: string;
  skills: string[];
  modules: IModule[];
  enrolled?: number;
  lectures?: number;
  language?: string;
  accessType: string;
  category : string;
}

const CourseDetailsUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [instructor, setInstructor] = useState<IInstructor | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [activePayment, setActivePayment] = useState<string | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [fav, setFavourites] = useState<boolean>(false);
  const [walletModal, setWalletModal] = useState<boolean>(false);

  const navigate = useNavigate();

  const fetchCourse = async () => {
    try {
      if (!id) return;
      const res = await courseDetails(id);
      console.log("res detauls", res);
      if (!res) return;
      if (res.data.success == "exists") {
        navigate(`/user/viewMyCourse/${id}`, { replace: true });
        return;
      }
      setCourse(res.data.course);
      setInstructor(res.data.course.instructor);
      setHasAccess(res.data.course.hasAccess);
      setReviews(res.data.course.review || []);
    } catch (err) {
      console.error("Error fetching course:", err);
    }
  };

  const buyCourse = async (courseId: string) => {
    if (activePayment === courseId) {
      toast.warning("Payment window already open for this course!");
      return;
    }

    const isPaymentInProgress = localStorage.getItem("payment_in_progress");
    if (isPaymentInProgress === "true") {
      toast.warning("Payment already in progress in another tab!");
      return;
    }

    localStorage.setItem("payment_in_progress", "true");
    setActivePayment(courseId);

    try {
      const res = await buyCourseService(courseId);
      console.log(res);
      if (!res) return;
      const { data } = res;

      const options: RazorpayOptions = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Edunity",
        description: "Course Purchase",
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const res = await verifyPayment(response, courseId);
            if (!res) return;
            console.log("respionse ", res);

            if (res.data.success) {
              toast.success("Payment Successful! Course Unlocked.");
              navigate("/user/myCourses");
            }
          } finally {
            setActivePayment(null);
            localStorage.removeItem("payment_in_progress");
            navigate("/user/paymentSuccess");
          }
        },
        modal: {
          ondismiss: async function () {
            try {
              await paymentCancel(courseId);
            } finally {
              setActivePayment(null);
              localStorage.removeItem("payment_in_progress");
              navigate("/user/paymentFailed");
            }
          },
        },
        theme: { color: "#6a5af9" },
      };

      const rzp = new window.Razorpay(options);

      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Try again.");
      setActivePayment(null);
      localStorage.removeItem("payment_in_progress");
    }
  };

  useEffect(() => {
    const getFavourites = async () => {
      try {
        if (!id) return;
        const res = await fetchFavourites(id);
        if (!res) return;
        console.log("favvv", res);

        if (res.data.success) {
          setFavourites(res.data.success);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getFavourites();
  }, []);

  const handleAddtofavourites = async (id: string) => {
    try {
      const res = await addToFavourites(id);
      if (!res) return;
      console.log("added fav ", res);

      if (res.data.success) {
        if (res.data.fav == "added") {
          setFavourites(true);
          toast.success("Added to favourites");
        } else if (res.data.fav == "removed") {
          setFavourites(false);
          toast.success("Removed from favourites");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const walletBuy = async (id: string) => {
    try {
      const res = await buyFromWallet(id);
      if (res?.data.success) {
        setWalletModal(false);
        navigate("/user/paymentSuccess");
      } else {
        setWalletModal(false)
        toast.error("Insufficient wallet balance");
      }
    } catch (error) {
      console.log(error);
      toast.error("payment error");
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  if (!course) return <p>Loading...</p>;

  return (
  <div className="min-h-screen bg-slate-50">
    {/* PREMIUM HEADER / BREADCRUMBS */}
    <header className="bg-slate-900 pt-32 pb-20 px-6 text-center relative overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 italic uppercase">
          Course Details
        </h1>
        <nav className="flex justify-center items-center gap-3 text-slate-400 text-sm font-bold uppercase tracking-widest">
          <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/user/home')}>Home</span>
          <span className="text-slate-600">/</span>
          <span className="text-indigo-400">Course</span>
        </nav>
      </div>
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full -mr-48 -mt-48"></div>
    </header>

    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* LEFT COLUMN: CONTENT */}
        <div className="lg:w-2/3 space-y-10">
          <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100">
            <img
              src={`${import.meta.env.VITE_API_URL}/assets/${course.thumbnail}`}
              alt="Course Thumbnail"
              className="w-full aspect-video object-cover"
            />
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {course.level} Level
                </span>
                <span className="text-slate-400 font-bold text-sm">📚 10 Lessons</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-8">
                {course.title}
              </h2>

              {/* TABS NAVIGATION */}
              <div className="flex flex-wrap gap-2 p-1.5 bg-slate-50 rounded-2xl mb-10 border border-slate-100">
                {["overview", "curriculum", "instructor", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    className={`flex-1 py-3 px-6 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      activeTab === tab 
                        ? "bg-white text-indigo-600 shadow-sm" 
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* TAB CONTENT */}
              <div className="min-h-[300px] animate-in fade-in duration-500">
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4 italic">Description</h3>
                      <p className="text-slate-500 leading-relaxed text-lg">{course.description}</p>
                    </div>
                    <div className="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100/50">
                      <h3 className="text-xl font-bold text-indigo-900 mb-4">What Will I Learn?</h3>
                      <p className="text-indigo-700/80 leading-relaxed">
                        This course covers everything from basic fundamentals to advanced implementation. 
                        Learn at your own pace and become a professional in {course.category || "this field"}.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "curriculum" && (
                  <div className="space-y-4">
                    {course.modules.map((module, idx) => (
                      <details key={idx} className="group border border-slate-100 rounded-2xl overflow-hidden bg-white hover:border-indigo-200 transition-all">
                        <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-900 list-none group-open:bg-slate-50">
                          <div className="flex items-center gap-4">
                            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">0{idx + 1}</span>
                            {module.title || `Module ${idx + 1}`}
                          </div>
                          <span className="text-slate-400 transition-transform group-open:rotate-180">▼</span>
                        </summary>
                        <div className="p-6 bg-white border-t border-slate-50">
                          {hasAccess ? (
                            <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
                              {module.videoUrl && <VideoPlayerUser initialUrl={module.videoUrl} />}
                            </div>
                          ) : (
                            <div className="py-10 text-center space-y-4">
                              <span className="text-3xl">🔒</span>
                              <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Enroll to unlock this lesson</p>
                            </div>
                          )}
                        </div>
                      </details>
                    ))}
                  </div>
                )}

                {activeTab === "instructor" && instructor && (
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/assets/${instructor.profileImage}`}
                      alt={instructor.name}
                      className="w-32 h-32 rounded-3xl object-cover shadow-lg shrink-0"
                    />
                    <div className="space-y-4">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">{instructor.name}</h3>
                      <p className="text-slate-500 leading-relaxed">{instructor.bio}</p>
                      <div className="inline-block px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
                        Expertise: {instructor.expertise}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    {reviews.length > 0 ? (
                      reviews.map((rev, idx) => (
                        <div key={idx} className="p-8 rounded-3xl border border-slate-100 space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                              <img
                                src={`${import.meta.env.VITE_API_URL}/assets/${rev.userImage || "default.png"}`}
                                alt={rev.userName}
                                className="w-12 h-12 rounded-full border border-slate-200"
                              />
                              <div>
                                <h4 className="font-bold text-slate-900">{rev.userName}</h4>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-tighter">
                                  {new Date(rev.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-yellow-50 text-yellow-600 text-xs font-black rounded-lg">⭐ {rev.rating}/5</span>
                          </div>
                          <p className="text-slate-500 italic">"{rev.comment}"</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 italic text-slate-400">No reviews yet.</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY SIDEBAR */}
        <div className="lg:w-1/3">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 flex flex-col items-center text-center">
              <img src={buyNowImage} alt="Thumbnail" className="w-full h-48 rounded-3xl object-cover mb-8 shadow-inner" />

              {!hasAccess && (
                <div className="mb-8">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-4xl font-black text-slate-900">₹{course.price}</span>
                    <span className="text-lg text-slate-300 line-through font-bold">₹120</span>
                  </div>
                  <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mt-2">7-Day Money-Back Guarantee</p>
                </div>
              )}

              <div className="w-full space-y-3">
                {course.accessType === "subscription" ? (
                  !hasAccess ? (
                    <button className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100" onClick={() => navigate("/user/subscription")}>
                      SUBSCRIBE TO UNLOCK
                    </button>
                  ) : (
                    <div className="py-4 bg-slate-50 text-slate-400 font-bold rounded-2xl border-2 border-dashed border-slate-200">
                      Included in Subscription
                    </div>
                  )
                ) : (
                  !hasAccess && (
                    <>
                      <button
                        onClick={() => buyCourse(course._id)}
                        className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                        disabled={activePayment === course._id}
                      >
                        {activePayment === course._id ? "Processing..." : "BUY NOW"}
                      </button>

                      <button className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95" onClick={() => setWalletModal(true)}>
                        Buy with Wallet
                      </button>
                    </>
                  )
                )}

                <button className={`w-full py-4 font-black rounded-2xl transition-all border-2 ${fav ? "bg-red-50 text-red-500 border-red-100" : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"}`} onClick={() => handleAddtofavourites(course._id)}>
                  {fav ? "❤️ Remove Favourite" : "♡ Add to Favourites"}
                </button>
              </div>

              <div className="w-full mt-10 pt-8 border-t border-slate-50">
                <ul className="space-y-4 text-left">
                  {[
                    { label: "Enrolled", val: `${course.enrolled || 100} students` },
                    { label: "Lectures", val: `${course.lectures || 80} videos` },
                    { label: "Skill Level", val: course.level },
                    { label: "Language", val: course.language || "English" },
                    { label: "Access", val: course.accessType === "subscription" ? "Subscription" : "Lifetime" }
                  ].map((item, i) => (
                    <li key={i} className="flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-400 uppercase tracking-tighter">{item.label}</span>
                      <span className="font-black text-slate-700">{item.val}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* WALLET MODAL */}
    {walletModal && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setWalletModal(false)}></div>
        <div className="relative bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 text-center">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">💳</div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Wallet Payment</h2>
          <p className="text-slate-400 text-sm font-medium mb-8">Confirm purchase from your digital balance.</p>
          
          <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
            <div className="flex justify-between items-center font-bold">
              <span className="text-slate-400">Price</span>
              <span className="text-slate-900">₹{course?.price}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-lg hover:bg-indigo-600 transition-all" onClick={() => walletBuy(course._id)} disabled={activePayment === course._id}>
              {activePayment === course._id ? "Processing..." : "Confirm Purchase"}
            </button>
            <button className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-all" onClick={() => setWalletModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default CourseDetailsUser;
