import React, { useState, type FormEvent, type ChangeEvent } from 'react';
import './resetPassword.css';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../../api/userApi';
import publicApi from '../../../api/publicApi';


interface LocationState {
  email: string;
}


const UserResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state as LocationState;  



  const validate = (): boolean => {


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
      const response = await publicApi.put('/user/resetPassword',
        { email, newPassword })
      console.log(response);


      if (response?.data.success) {
        toast.success('Password updated successfully!', { autoClose: 1500 });

        setNewPassword('');
        setConfirmPassword('');

        // navigate('/user/login');
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

export default UserResetPassword;
