import React, { useEffect, useState, type ChangeEvent } from "react";
import "./adminUsers.css";
import { toast } from "react-toastify";
import profilePic from "../../../assets/profilePic.png";
import { getUsers, blockUser, unblockUser } from "../../../services/admin/adminService";
import { Link } from "react-router-dom";

interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  blocked: boolean;
}

const UsersAdmin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 4;

  const loadUsers = async (): Promise<void> => {
    try {
      const data = await getUsers();
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleBlock = async (userId: string): Promise<void> => {
    try {
      const res = await blockUser(userId);
      if (res.success) {
        toast.success("User Blocked", { autoClose: 1500 });
        loadUsers();
      }
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const handleUnblock = async (userId: string): Promise<void> => {
    try {
      const res = await unblockUser(userId);
      if (res.success) {
        toast.success("User Unblocked", { autoClose: 1500 });
        loadUsers();
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users by search
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="user-list">
      <h2>👥 Users Management</h2>

      <input
        type="text"
        name="search"
        placeholder="🔍 Search by name or email"
        value={searchTerm}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearchTerm(e.target.value)
        }
        className="search-box"
      />

      <table className="styled-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Picture</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user._id}>
              <td>
                <Link to={`/admin/user/${user._id}`} className="user-link">
                  {user.name}
                </Link>
              </td>
              <td>{user.email}</td>
              <td>
                <img
                  src={
                    user.profileImage
                      ? `http://localhost:5000/assets/${user.profileImage}`
                      : profilePic
                  }
                  alt={user.name}
                  className="profile-pic"
                />
              </td>
              <td>
                {user.blocked ? (
                  <button className="btn-unblock" onClick={() => handleUnblock(user._id)}>Unblock</button>
                ) : (
                  <button className="btn-block" onClick={() => handleBlock(user._id)}>Block</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ⬅ Prev
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default UsersAdmin;
