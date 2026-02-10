import { useEffect, useState } from "react";
import "./earnings.css";
import type { IEarning } from "../../adminInterfaces";
import { getEarnings } from "../../services/adminServices";

const AdminEarnings: React.FC = () => {
  const [earnings, setEarnings] = useState<IEarning[]>();
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState<number>();
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [sort, setSort] = useState<string>("latest");
  const [removeFilter , setRemoveFilter] = useState<boolean>(false)

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        if(fromDate!='' || toDate!='' || sort!='latest'){
          setRemoveFilter(true)
        }
        const res = await getEarnings(page, {
          fromDate,
          toDate,
          sort,
        });

        if (res.data.success) {
          
          setEarnings(res.data.earnings);
          setTotal(res.data.totalEarnings);
          setTotalPages(res.data.totalPages);
        }
      } catch (error) {
        console.error("Error fetching earnings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [page, fromDate, toDate, sort]);

  if (loading)
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="admin-earnings">
      <h1 className="title">💰 Course Earnings</h1>

      <div className="summary-card">
        <h2>
          Total Admin Earnings :
          <span className="highlight">₹{total?.toFixed(2)}</span>
        </h2>
      </div>

      <div className="filter-bar">
        <div className="filter-item">
          <label>From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className="filter-item">
          <label>To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <div className="filter-item">
          <label>Sort</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="latest">Latest</option>
            <option value="adminHigh">Admin Earnings ↑</option>
            <option value="adminLow">Admin Earnings ↓</option>
          </select>
        </div>

        <button className="apply-btn" onClick={() => setPage(1)}>
          Apply Filters
        </button>

        {removeFilter &&
        <button
          onClick={() => {
            setFromDate("");
            setToDate("");
            setSort('latest')
            setPage(1)
            setRemoveFilter(false)
          }}
          
        >
          Remove all Filters
        </button>
        }
      </div>

      <div className="table-container">
        <table className="earnings-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Course Price</th>
              <th>Admin Share</th>
              <th>Instructor Share</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {earnings?.map((item: IEarning, index: number) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>₹{item.coursePrice}</td>
                <td className="text-green">₹{item.adminEarnings}</td>
                <td className="text-blue">₹{item.instructorEarnings}</td>
                <td>{new Date(item.lastUpdated).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  className={page === pageNumber ? "active" : "inActive"}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEarnings;
