import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import './instructorEditProfile.css';
import { toast } from 'react-toastify';
import profilePic from './../../../assets/profilePic.png';
import { useNavigate } from 'react-router-dom';
import { fetchProfile, profileEdit } from '../../services/instructorServices';
import { fetchInstructorProfile } from '../../../redux/slices/authSlice';
import { useAppDispatch } from '../../../redux/hooks';

interface InstructorProfile {
  name: string;
  email: string;
  expertise: string;
  bio: string;
  image?: string;
  work: string;
  skills: string[]
  education: string;
  profileImage?: string;
}


const InstructorProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const [skillInput, setSkillInput] = useState('');

  const dispatch = useAppDispatch()

  const [data, setData] = useState<InstructorProfile>({
    name: '',
    email: '',
    expertise: '',
    bio: '',
    image: '',
    work: '',
    education: '',
    profileImage: '',
    skills: []
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();


    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('expertise', data.expertise);
    formData.append('bio', data.bio);
    formData.append('work', data.work);
    formData.append('education', data.education);
    formData.append('skills', JSON.stringify(data.skills));

    if (selectedFile) {
      formData.append('profileImage', selectedFile);
    }

    try {
      const response = await profileEdit(formData)
      if (!response) return

      if (response.data.success) {
        toast.success('Profile updated', { autoClose: 1500 });
        dispatch(fetchInstructorProfile()).unwrap()
        navigate('/instructor/profile');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile');
    }
  };

  const getProfile = async () => {
    try {


      const response = await fetchProfile()
      if (!response) return

      const profile = response.data.data;

      setData((prev) => ({
  ...prev,             
  ...profile,           
  skills: Array.isArray(profile.skills) ? profile.skills : [],
}));

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const addSkill = () => {
    if (!skillInput.trim()) return;

    if (data.skills.includes(skillInput.trim())) {
      toast.warning('Skill already added');
      return;
    }

    setData({
      ...data,
      skills: [...data.skills, skillInput.trim()],
    });

    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setData({
      ...data,
      skills: data.skills.filter((s) => s !== skill),
    });
  };


return (
  <div className="min-h-screen bg-slate-50 py-12 px-4">
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Header Section */}
      <div className="bg-slate-900 p-8 text-center">
        <h2 className="text-2xl font-bold text-white">Edit Professional Profile</h2>
        <p className="text-slate-400 text-sm mt-1">Keep your information up to date for your students</p>
      </div>

      <div className="p-8">
        {/* Profile Image Upload Circle */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative group">
            <img
              src={
                selectedFile
                  ? URL.createObjectURL(selectedFile)
                  : data.profileImage
                    ? `${import.meta.env.VITE_API_URL}/assets/${data.profileImage}`
                    : profilePic
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-slate-100 shadow-inner"
            />
            <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <input type="file" name="profileImage" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
          </div>
          <p className="text-xs text-slate-400 mt-3 font-medium uppercase tracking-wider">Click icon to change photo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={data.name} 
                onChange={handleChange} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                placeholder="Enter Name" 
              />
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Professional Bio</label>
              <textarea
                name="bio"
                value={data.bio}
                onChange={handleChange}
                placeholder="Write a brief overview of your professional journey..."
                rows={4}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all leading-relaxed"
              />
            </div>

            {/* Skills System */}
            <div className="md:col-span-2 space-y-3">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Skills & Tools</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add skill (e.g. React)"
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                />
                <button 
                  type="button" 
                  onClick={addSkill}
                  className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all text-sm"
                >
                  Add
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl min-h-[50px] border border-dashed border-slate-200">
                {data.skills.length > 0 ? data.skills.map((skill) => (
                  <span key={skill} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg shadow-sm">
                    {skill}
                    <button 
                      type="button" 
                      onClick={() => removeSkill(skill)}
                      className="text-slate-400 hover:text-red-500 text-lg leading-none"
                    >
                      ×
                    </button>
                  </span>
                )) : <span className="text-slate-400 text-xs italic p-1">No skills added yet...</span>}
              </div>
            </div>

            {/* Work & Education Row */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Work Experience</label>
              <input
                type="text"
                name="work"
                value={data.work}
                onChange={handleChange}
                placeholder="Years of experience"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Education</label>
              <input
                type="text"
                name="education"
                value={data.education}
                onChange={handleChange}
                placeholder="Highest qualification"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none text-sm"
              />
            </div>

            {/* Expertise Dropdown */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Primary Expertise</label>
              <select 
                name="expertise" 
                value={data.expertise} 
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none text-sm appearance-none cursor-pointer"
              >
                <option value="">Select expertise</option>
                {["Web Development", "UI/UX Design", "Data Science", "Machine Learning", "Cybersecurity", "Marketing"].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-8 border-t border-slate-100 flex items-center justify-end gap-4">
            <button 
              type="button" 
              className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
};

export default InstructorProfileEdit;
