import React, { useEffect, useState, type ChangeEvent } from "react";
import "./adminUsers.css";
import { toast } from "react-toastify";
import profilePic from "../../../assets/profilePic.png";
import { getUsers, blockUser, unblockUser } from "../../../services/admin/adminService";
import { Link } from "react-router-dom";
import ConfirmModal from "../../components/adminUsers/modal";

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
  const [totalPages, setTotalPages] = useState<number>(1);
  const usersPerPage = 4;

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isBlocking, setIsBlocking] = useState<boolean>(true);

  const loadUsers = async (page: number = 1, search: string = ""): Promise<void> => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: usersPerPage.toString(),
        search,
      });

      const res = await getUsers(queryParams);

      setUsers(res.users);
      setTotalPages(res.totalPages)

      // setTotalPages(Math.ceil(res.total / usersPerPage)); // ✅ backend must return total count
      setCurrentPage(res.currentPage);

    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // const debounce = (func, delay) => {
  //   let timer;
  //   return function (…args) {
  //     clearTimeout(timer);
  //     timer = setTimeout(() => {
  //       func.apply(this, args);
  //     }, delay);
  //   }
  // }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);

    // const debounceSearch = debounce(loadUsers(1, searchTerm) , 200);
  };


  const handleBlock = (userId: string): void => {
    setSelectedUserId(userId);
    setIsBlocking(true);
    setShowModal(true);
  };


  const handleUnblock = (userId: string): void => {
    setSelectedUserId(userId);
    setIsBlocking(false);
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (!selectedUserId) return;


    try {
      if (isBlocking) {
        const res = await blockUser(selectedUserId);
        if (res.success) toast.success("User Blocked", { autoClose: 1500 });
      } else {
        const res = await unblockUser(selectedUserId);
        if (res.success) toast.success("User Unblocked", { autoClose: 1500 });
      }
      loadUsers(currentPage, searchTerm);
    } catch (error) {
      console.error("Error updating user status:", error);
    } finally {
      setShowModal(false);
      setSelectedUserId(null);
    }
  };


  useEffect(() => {
    loadUsers(currentPage, searchTerm);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      loadUsers(page, searchTerm);
    }
  };

  return (
    <div className="user-list">
      <h2>👥 Users Management</h2>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          name="search"
          placeholder="🔍 Search by name or email"
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          className="search-box"
        />
        <button type="submit">Search</button>
      </form>

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
          {users.map((user) => (
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
                  <button className="btn-unblock" onClick={() => handleUnblock(user._id)}>
                    Unblock
                  </button>
                ) : (
                  <button className="btn-block" onClick={() => handleBlock(user._id)}>
                    Block
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          ⬅ Prev
        </button>

        {totalPages > 0 &&
          [...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))
        }



        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next ➡
        </button>
      </div>

      <ConfirmModal
        isOpen={showModal}
        title={isBlocking ? "Block User" : "Unblock User"}
        message={`Are you sure you want to ${isBlocking ? "block" : "unblock"} this user?`}
        onConfirm={confirmAction}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
};

export default UsersAdmin;
