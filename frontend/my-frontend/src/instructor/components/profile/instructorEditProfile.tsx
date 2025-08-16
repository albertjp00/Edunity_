import React, { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import './instructorEditProfile.css';
import { toast } from 'react-toastify';
import profilePic from './../../../assets/profilePic.png';
import { useNavigate } from 'react-router-dom';
import instructorApi from '../../../api/instructorApi';

interface InstructorProfile {
  name: string;
  email: string;
  expertise: string;
  bio: string;
  image?: string;
  work: string;
  education: string;
  profileImage?: string;
}


const InstructorProfileEdit: React.FC = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<InstructorProfile>({
    name: '',
    email: '',
    expertise: '',
    bio: '',
    image: '',
    work: '',
    education: '',
    profileImage: '',
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

    if (selectedFile) {
      formData.append('profileImage', selectedFile);
    }

    try {
      const response = await instructorApi.put('/instructor/profile', formData,{
        headers: {
    "Content-Type": "multipart/form-data",
  },
      });
console.log(response);

      if (response.data.success) {
        toast.success('Profile updated', { autoClose: 1500 });
        navigate('/instructor/profile');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile');
    }
  };

  const getProfile = async () => {
    try {
      const token = localStorage.getItem('instructor');
      if (!token) return;

      const response = await instructorApi.get<{ data: InstructorProfile }>('/instructor/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="editProfile">
      <div className="edit">
        <div className="edit-container">
          <h2 className="edit-title">Edit Profile</h2>

          <img
            src={
              selectedFile
                ? URL.createObjectURL(selectedFile)
                : data.profileImage
                ? `http://localhost:5000/assets/${data.profileImage}`
                : profilePic
            }
            alt="Profile"
            className="profile-avatar"
          />

          <form onSubmit={handleSubmit} className="edit-form">
            <div className="edit-inputs">
              <input type="file" name="profileImage" accept="image/*" onChange={handleImage} />

              <label>Enter Name</label>
              <input type="text" name="name" value={data.name} onChange={handleChange} placeholder="Enter Name" />

              <label>Enter Bio</label>
              <textarea
                name="bio"
                value={data.bio}
                onChange={handleChange}
                placeholder="Enter your bio"
                rows={4}
                className="textarea"
              />

              <label>Work Experience</label>
              <input
                type="text"
                name="work"
                value={data.work}
                onChange={handleChange}
                placeholder="e.g. 5 years in web development"
              />

              <label>Education</label>
              <input
                type="text"
                name="education"
                value={data.education}
                onChange={handleChange}
                placeholder="e.g. B.Tech in Computer Science"
              />

              <label>Select Expertise</label>
              <select name="expertise" value={data.expertise} onChange={handleChange}>
                <option value="">Select expertise</option>
                <option value="Web Development">Web Development</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Data Science">Data Science</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <div className="submit-btn">
              <button type="submit">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InstructorProfileEdit;
