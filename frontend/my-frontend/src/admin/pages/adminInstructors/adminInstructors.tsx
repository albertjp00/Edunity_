import React, { useEffect, useState} from 'react';
import './adminInstructors.css';
import { Link } from 'react-router-dom';
import adminApi from '../../../api/adminApi';
import AdminList from '../../components/usersInstructorList/usersList';
import useDebounce from '../../components/debounce/debounce';

interface Instructor {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  KYCstatus: 'notApplied' | 'verified' | 'pending' | 'rejected';
}

interface InstructorsResponse {
  data: {
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
  const [searchTerm, setSearchTerm] = useState<string>('')

  const debouncedSearchTerm = useDebounce(searchTerm , 500)

  const getInstructors = async (currentPage: number, search: string = ''): Promise<void> => {
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


  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setPage(1);
  //   getInstructors(1, searchTerm);
  // };


  useEffect(() => {
    getInstructors(page, searchTerm);
  }, [page]);

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < pages) setPage((prev) => prev + 1);
  };


  useEffect(()=>{

    if(page === 1){
      getInstructors(1 , debouncedSearchTerm)
    }else{
      setPage(1)
    }
  },[debouncedSearchTerm])

  return (
    <div className="instructor-list">
      <AdminList
        title="Instructors"
        data={instructors}
        columns={[
          { label: "Name", render: (i) => <Link to={`/admin/instructors/${i._id}`}>{i.name}</Link> },
          { label: "Email", render: (i) => i.email },
          { label: "Picture", render: (i) => i.profileImage && <img src={`http://localhost:5000/assets/${i.profileImage}`} width={40} /> },
          {
            label: "KYC", render: (i) => {
              if (i.KYCstatus === "notApplied") return <span>No KYC Submitted</span>;
              if (i.KYCstatus === "verified") return <button className="btn-verified">Verified</button>;
              if (i.KYCstatus === "pending") return <Link to={`/admin/viewKyc/${i._id}`}><button>Verify</button></Link>;
              if (i.KYCstatus === "rejected") return <span>Rejected</span>;
            }
          },
        ]}
        page={page}
        totalPages={pages}
        onPrev={handlePrev}
        onNext={handleNext}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={() => getInstructors(1, searchTerm)}
      />

    </div>
  );
};

export default InstructorsAdmin;
