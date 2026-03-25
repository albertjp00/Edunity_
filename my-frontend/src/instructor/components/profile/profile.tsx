import profilePic from './../../../assets/profilePic.png';
import { Link } from 'react-router-dom';
import './profile.css'
import type { IInstructor } from '../../interterfaces/instructorInterfaces';
import { useAppSelector } from '../../../redux/hooks';


const InstructorProfile: React.FC = () => {


  const user = useAppSelector((state)=>
    state.auth.role === 'instructor' ? state.auth.user  : null
  ) as IInstructor | null
  
  return (
  <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
      
      {/* LEFT COLUMN: Main Profile Identity */}
      <div className="lg:w-1/3 space-y-6">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Cover / Header Accent */}
          <div className="h-24 bg-gradient-to-r from-slate-900 to-blue-900" />
          
          <div className="px-6 pb-8">
            <div className="relative -mt-12 mb-4 flex justify-center lg:justify-start lg:ml-4">
              <img
                src={
                  user?.profileImage
                    ? `${import.meta.env.VITE_API_URL}/assets/${user.profileImage}`
                    : profilePic
                }
                alt="Profile"
                className="w-24 h-24 rounded-2xl border-4 border-white object-cover shadow-md bg-white"
              />
            </div>

            <div className="text-center lg:text-left space-y-1">
              <h2 className="text-2xl font-black text-slate-900 leading-tight">{user?.name}</h2>
              <p className="text-sm text-slate-500 font-medium">{user?.email}</p>
              
              <div className="pt-4 flex flex-wrap justify-center lg:justify-start gap-2">
                <Link to="/instructor/editProfile">
                  <button className="px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-full hover:bg-black transition-all">
                    Edit Profile
                  </button>
                </Link>
                <Link to="/instrcutor/passwordChange">
                  <button className="px-4 py-1.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-full hover:bg-slate-50 transition-all">
                    Key Settings
                  </button>
                </Link>
              </div>
            </div>

            <hr className="my-6 border-slate-100" />

            {/* Bio Section */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">About Me</h4>
              <p className="text-sm text-slate-600 leading-relaxed italic">
                "{user?.bio || "No bio added yet."}"
              </p>
            </div>

            {/* Expertise & KYC */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🎓</span>
                  <span className="text-xs font-bold text-slate-700">{user?.expertise || 'Expert'}</span>
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase">Expertise</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🛡️</span>
                  <div className="text-xs font-bold">
                    {user?.KYCstatus === 'verified' ? (
                      <span className="text-emerald-600 flex items-center gap-1">Verified <i className="fas fa-check-circle text-[10px]" /></span>
                    ) : user?.KYCstatus === 'pending' ? (
                      <span className="text-amber-500">Pending Review</span>
                    ) : user?.KYCstatus === 'rejected' ? (
                      <span className="text-red-500">Rejected</span>
                    ) : (
                      <span className="text-slate-400">Unverified</span>
                    )}
                  </div>
                </div>
                {user?.KYCstatus === 'rejected' || !user?.KYCstatus ? (
                  <Link to="/instructor/kyc">
                    <button className="text-[10px] bg-blue-600 text-white px-3 py-1 rounded-md font-bold">Verify</button>
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Core Skills</h4>
          <div className="flex flex-wrap gap-2">
            {user?.skills ? user.skills.map((skill, i) => (
              <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-lg border border-blue-100">
                {skill}
              </span>
            )) : <p className="text-xs text-slate-400">No skills added</p>}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Professional Details & Actions */}
      <div className="lg:w-2/3 space-y-8">
        
        {/* Education & Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="text-6xl text-slate-900 font-black italic">Edu</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <span className="p-2 bg-slate-100 rounded-lg text-sm">🏛️</span> Education
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {user?.education || 'Not added yet'}
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="text-6xl text-slate-900 font-black italic">Work</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <span className="p-2 bg-slate-100 rounded-lg text-sm">💼</span> Experience
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {user?.work || 'Not added yet'}
            </p>
          </div>
        </div>

        {/* Actions Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white-900 p-8 rounded-3xl text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Instructor Dashboard</h3>
              <p className="text-slate-400 text-sm mb-6 max-w-[200px]">View your earnings, courses, and student analytics.</p>
              <Link to="/instructor/dashboard">
                <button className="bg-slate-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl text-xs font-black transition-all">
                  Launch Dashboard
                </button>
              </Link>
            </div>
            <div className="absolute -bottom-6 -right-6 text-9xl font-black text-white/5 select-none rotate-12 group-hover:rotate-0 transition-transform duration-500">
              📈
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Your Wallet</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-[200px]">Manage your balance and request payouts.</p>
              <Link to="/instructor/wallet">
                <button className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-8 py-2 rounded-xl text-xs font-black transition-all">
                  Open Wallet
                </button>
              </Link>
            </div>
            <div className="absolute -bottom-6 -right-6 text-9xl font-black text-slate-900/5 select-none group-hover:-translate-y-2 transition-transform duration-500">
              💳
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
);
};

export default InstructorProfile;
