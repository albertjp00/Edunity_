import React, { useEffect, useState } from 'react';
import './adminInstructors.css';
import { Link } from 'react-router-dom';
import adminApi from '../../../api/adminApi';

interface Instructor {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  KYCstatus: 'notApplied' | 'verified' | 'pending' | 'rejected';
}

const InstructorsAdmin: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const getInstructors = async (currentPage: number): Promise<void> => {
    try {
      const response = await adminApi.get(`/admin/get-instructors?page=${currentPage}&limit=5`);
      setInstructors(response.data.data);
      setPages(response.data.pages);
    } catch (error) {
      console.error("Error fetching instructors:", error);
    }
  };

  useEffect(() => {
    getInstructors(page);
  }, [page]);

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < pages) setPage((prev) => prev + 1);
  };

  return (
    <div className="instructor-list">
      <h2>Instructors List</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Picture</th>
            <th>KYC</th>
          </tr>
        </thead>
        <tbody>
          {instructors.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {user.profileImage && (
                  <img
                    src={`http://localhost:5000/assets/${user.profileImage}`}
                    alt={user.name}
                    width="40"
                    height="40"
                  />
                )}
              </td>
              <td>
                {user.KYCstatus === 'notApplied' ? (
                  <span className="no-kyc">No KYC Submitted</span>
                ) : user.KYCstatus === 'verified' ? (
                  <button className="btn-verified">Verified</button>
                ) : user.KYCstatus === 'pending' ? (
                  <Link to={`/admin/viewKyc/${user._id}`}>
                    <button className="verify-btn">Verify</button>
                  </Link>
                ) : user.KYCstatus === 'rejected' ? (
                  <span className="kyc-rejected">Rejected</span>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={handlePrev} disabled={page === 1}>
          Prev
        </button>
        <span>
          Page {page} of {pages}
        </span>
        <button onClick={handleNext} disabled={page === pages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default InstructorsAdmin;
