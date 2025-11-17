import React, { useEffect, useState } from "react";
import "./adminUsers.css";
import { toast } from "react-toastify";
import profilePic from "../../../assets/profilePic.png";
import { getUsers, blockUser, unblockUser } from "../../../services/admin/adminService";
import { Link } from "react-router-dom";
import ConfirmModal from "../../components/adminUsers/modal";
import AdminList from "../../components/usersInstructorList/usersList";

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

  // const handlePageChange = (page: number) => {
  //   if (page >= 1 && page <= totalPages) {
  //     loadUsers(page, searchTerm);
  //   }
  // };

  return (
    <div className="user-list">
      <AdminList
  title="Users Management"
  data={users}
  
  columns={[
    { label: "Name", render: (u) => <Link to={`/admin/user/${u._id}`}>{u.name}</Link> },
    { label: "Email", render: (u) => u.email },
    { label: "Picture", render: (u) => <img src={u.profileImage ? `http://localhost:5000/assets/${u.profileImage}` : profilePic} width={40} /> },
    { label: "Status", render: (u) =>
        u.blocked ?
          <button onClick={() => handleUnblock(u._id)}>Unblock</button> :
          <button onClick={() => handleBlock(u._id)}>Block</button>
    },
  ]}
  page={currentPage}
  totalPages={totalPages}
  onPrev={() => setCurrentPage((p) => p - 1)}
  onNext={() => setCurrentPage((p) => p + 1)}
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  onSearchSubmit={() => loadUsers(1, searchTerm)}
/>


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
