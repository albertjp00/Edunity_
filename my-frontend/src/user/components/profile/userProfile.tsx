import { useEffect, useState } from "react";
import profilePic from "../../../assets/profilePic.png";
import { Link, useNavigate } from "react-router-dom";
import {
  getPaymentHistory,
  getUserMyCourses,
} from "../../services/profileServices";
import type { EnrolledCourse, IPayment, User } from "../../interfaces";
import { useAppSelector } from "../../../redux/hooks";

const Profile: React.FC = () => {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const navigate = useNavigate();

  const user = useAppSelector((state) =>
    state.auth.role === "user" ? state.auth.user : null
  ) as User | null;

  const fetchCourses = async () => {
    try {
      const res = await getUserMyCourses();
      if (res?.data.success) {
        const courses = res.data.courses.slice(0, 3);
        setCourses(courses);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await getPaymentHistory(1);
      if (!res) return;

      if (res.data.success) {
        const paymentsData = res.data.payments.pay;
        const normalizedPayments = Array.isArray(paymentsData)
          ? paymentsData
          : [paymentsData];
        const norm = normalizedPayments.slice(0, 2);
        setPayments(norm);
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoadingPayments(false);
    }
  };

  const gotoCourse = (id: string) => navigate(`/user/courseDetails/${id}`);
  const myCourses = () => navigate('/user/myCourses');
  const allPayments = () => navigate('/user/allPayments');

  useEffect(() => {
    fetchCourses();
    fetchPayments();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-gray-50 min-h-screen">
      
      {/* Left Side - Profile Info */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <img
              src={
                user?.profileImage
                  ? `${import.meta.env.VITE_API_URL}/assets/${user.profileImage}`
                  : profilePic
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-50 shadow-md"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
              <p className="text-gray-500 text-sm font-medium">{user?.email}</p>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-2">About Me</h4>
            <p className="text-gray-600 leading-relaxed text-sm bg-gray-50 p-3 rounded-lg">
              {user?.bio || "No bio available."}
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {[
              { icon: "fa-user-tag", label: "Role", value: "Student" },
              { icon: "fa-venus-mars", label: "Gender", value: user?.gender || "Not specified" },
              { icon: "fa-birthday-cake", label: "DOB", value: user?.dob || "Not provided" },
              { icon: "fa-map-marker-alt", label: "Location", value: user?.location || "Not specified" },
              { icon: "fa-phone", label: "Phone", value: user?.phone || "Not provided" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center text-sm text-gray-600">
                <i className={`fas ${item.icon} w-6 text-indigo-500`}></i>
                <span className="font-semibold mr-2">{item.label}:</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Link to="/user/editProfile" className="w-full">
              <button className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
                Edit Profile
              </button>
            </Link>

            {user?.provider !== 'google' && (
              <Link to="/user/changePassword">
                <button className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
                  Change Password
                </button>
              </Link>
            )}

            <Link to="/user/wallet">
              <button className="w-full py-2.5 bg-emerald-50 text-emerald-700 rounded-lg font-medium hover:bg-emerald-100 transition border border-emerald-100">
                Go to Wallet
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Courses & Payments */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Purchased Courses */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Purchased Courses</h3>
            <button 
              onClick={myCourses}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold transition"
            >
              See all
            </button>
          </div>

          <div className="grid gap-4">
            {courses.length > 0 ? (
              courses.map((enrolled) => (
                <div
                  key={enrolled.course._id}
                  onClick={() => gotoCourse(enrolled.course._id ?? "")}
                  className="group flex flex-col sm:flex-row bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer"
                >
                  <img
                    src={`${import.meta.env.VITE_API_URL}/assets/${enrolled.course.thumbnail}`}
                    alt={enrolled.course.title}
                    className="w-full sm:w-48 h-32 object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="p-4 flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-800 group-hover:text-indigo-600 transition">{enrolled.course.title}</h4>
                      <span className="text-emerald-600 font-bold">₹{enrolled.course.price}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {enrolled.course.description || "No description available."}
                    </p>
                    <div className="mt-3 flex items-center text-xs text-gray-400">
                      <i className="fas fa-book-open mr-1"></i>
                      {enrolled.course.modules?.length ?? 0} Modules
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-8 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
                No enrolled courses yet.
              </div>
            )}
          </div>
        </section>

        {/* Payment History */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Payment History</h3>
            <button 
              onClick={allPayments}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold transition"
            >
              Full History
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {loadingPayments ? (
              <div className="p-8 text-center text-gray-500 italic">Loading records...</div>
            ) : payments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                    <tr>
                      <th className="px-6 py-4">Course</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payments.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-medium text-gray-800">{p.courseName || "N/A"}</td>
                        <td className="px-6 py-4 text-gray-600 font-semibold">₹{p.amount}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            p.status.toLowerCase() === 'success' || p.status.toLowerCase() === 'completed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{new Date(p.paymentDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">No payment records found.</div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Profile;