import React, { useEffect, useState, type ChangeEvent } from 'react';
import './adminUsers.css';
import { toast } from 'react-toastify';
import adminApi from '../../../api/adminApi';
import profilePic from '../../../assets/profilePic.png'

interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  blocked: boolean;
}

const UsersAdmin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const getUsers = async (): Promise<void> => {
    try {
      const response = await adminApi.get('/admin/get-users');
      setUsers(response.data.users);
      console.log(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleBlock = async (userId: string): Promise<void> => {
    try {
      const response = await adminApi.put(
        `/admin/block-user/${userId}`
      );
      if (response.data.success) {
        toast.success('User Blocked', { autoClose: 1500 });
        getUsers();
      }
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const handleUnblock = async (userId: string): Promise<void> => {
    try {
      const response = await adminApi.put(
        `/admin/unblock-user/${userId}`
      );
      if (response.data.success) {
        toast.success('User Unblocked', { autoClose: 1500 });
        getUsers();
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="user-list">
      <h2>Users List</h2>

      <input
        type="text"
        name="search"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearchTerm(e.target.value)
        }
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '300px' }}
      />

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Picture</th>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {users
            .filter(
              (user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.profileImage && (
                    <img
                      src={user.profileImage 
                        ? `http://localhost:5000/assets/${user.profileImage}`
                        : profilePic}
                      alt={user.name}
                      width="40"
                      height="40"
                    />
                  )}
                </td>
                <td>
                  {user.blocked ? (
                    <button onClick={() => handleUnblock(user._id)}>
                      Unblock
                    </button>
                  ) : (
                    <button onClick={() => handleBlock(user._id)}>Block</button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersAdmin;
