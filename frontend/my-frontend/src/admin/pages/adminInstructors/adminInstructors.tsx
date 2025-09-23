import React, { useEffect, useState, type ChangeEvent } from 'react';
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

interface InstructorsResponse {
data:{
    instructors: Instructor[];
  totalPages: number;
  currentPage: number;
  totalInstructors: number;
}
}


const InstructorsAdmin: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [searchTerm , setSearchTerm] = useState<string>('')

  const getInstructors = async (currentPage: number , search : string=''): Promise<void> => {
    try {
      const response = await adminApi.get<InstructorsResponse>(`/admin/getInstructors?page=${currentPage}&search=${search}`);
      console.log(response);
      const resData = response.data
      setInstructors(resData.data.instructors);
      setPages(resData.data.totalPages);
      setPage(resData.data.currentPage)
    } catch (error) {
      console.error("Error fetching instructors:", error);
    }
  };


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    getInstructors(1, searchTerm);
  };


  useEffect(() => {
    getInstructors(page , searchTerm);
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
              {/* ✅ Clicking name goes to details page */}
              <td>
                <Link to={`/admin/instructors/${user._id}`} className="instructor-link">
                  {user.name}
                </Link>
              </td>
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
