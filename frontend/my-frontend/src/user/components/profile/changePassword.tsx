import React, { useState, type FormEvent, type ChangeEvent } from 'react';
import './changePassword.css'; 
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/userApi';
import { userPasswordChange } from '../../services/profileServices';



const UserPasswordChange: React.FC = () => {
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  
  const navigate = useNavigate();


  const validate = (): boolean => {
    if (!oldPassword.trim()) {
      toast.error('Old password is required', { autoClose: 1500 });
      return false;
    }

    if (!newPassword.trim()) {
      toast.error('New password is required', { autoClose: 1500 });
      return false;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters', { autoClose: 1500 });
      return false;
    }

    if (!confirmPassword.trim()) {
      toast.error('Please confirm your new password', { autoClose: 1500 });
      return false;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match', { autoClose: 1500 });
      return false;
    }

    return true;
  };

  const handleChangePassword = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    try {
      const response = await api.put('/user/passwordChange',
        { oldPassword, newPassword })
      console.log(response);
      

      if (response?.data.success) {
        toast.success('Password updated successfully!', { autoClose: 1500 });

        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');

        navigate('/user/login');
      } else {
        toast.error(response?.data.message);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="profile-container">
      <form className="profile-card" onSubmit={handleChangePassword}>
        <h2>Change Password</h2>

        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setOldPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
        />

        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default UserPasswordChange;
