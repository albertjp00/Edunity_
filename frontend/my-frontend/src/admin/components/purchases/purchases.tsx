import React, { useEffect, useState, type ChangeEvent } from "react";
import "./purchases.css";
import adminApi from "../../../api/adminApi";

interface Purchase {
  _id: string;
  userName: string;
  userEmail: string;
  courseTitle: string;
  coursePrice: number;
  amountPaid: number;
  paymentStatus: string;
  createdAt: string;
}

interface PurchasesPagination {
  currentPage: number;
  totalPages: number;
  totalPurchases: number;
  purchases: Purchase[];
}

interface PurchasesResponse {
  success: boolean;
  purchases: PurchasesPagination;
}


const Purchases: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pages, setPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchPurchases = async (search: string = "", page: number = 1) => {
    try {
      setLoading(true);
      const res = await adminApi.get<PurchasesResponse>(
        `/admin/purchases?search=${search}&page=${page}`
      );
      console.log(res);
      const resData = res.data.purchases
      
      setPurchases(resData.purchases);
      setPages(resData.totalPages);
      setCurrentPage(resData.currentPage);
    } catch (err) {
      console.error("Error fetching purchases:", err);
    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
    fetchPurchases(searchTerm, currentPage);
  }, [currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPurchases(searchTerm, 1);
  };

  if (loading) return <p className="p-4">Loading purchases...</p>;

  return (
    <div className="purchases-container">
      <h2 className="purchases-title">Purchase History</h2>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          name="search"
          placeholder="🔍 search here"
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          className="search-box"
        />
        <button type="submit">Search</button>
      </form>

      <table className="purchases-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Course</th>
            <th>Course Price</th>
            <th>Amount Paid</th>
            <th>Payment Status</th>
            <th>Purchase Date</th>
          </tr>
        </thead>
        <tbody>
          {purchases.length === 0 ? (
            <tr>
              <td colSpan={7} className="empty-row">
                No purchases found
              </td>
            </tr>
          ) : (
            purchases.map((p) => (
              <tr key={p._id}>
                <td data-label="User">{p.userName}</td>
                <td data-label="Email">{p.userEmail}</td>
                <td data-label="Course">{p.courseTitle}</td>
                <td data-label="Course Price">₹{p.coursePrice}</td>
                <td data-label="Amount Paid">₹{p.amountPaid}</td>
                <td data-label="Status">{p.paymentStatus}</td>
                <td data-label="Date">
                  {new Date(p.createdAt).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ✅ Pagination Controls */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Prev
        </button>

        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i + 1}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === pages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Purchases;
