import React, { useEffect, useState } from "react";
import "./payments.css";
import { getPaymentHistory } from "../../services/profileServices";
import type { IPayment } from "../../interfaces";
import Navbar from "../navbar/navbar";

const AllPayments = () => {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page , setPage] = useState<number>(1)
  const [totalPages , setTotalPages] = useState<number>(1)

  const fetchPayments = async (page:number) => {
    try {
      setLoading(true)
      const res = await getPaymentHistory(page);
      
      if (res?.data.success) {
        
        const paymentsData = res.data.payments.pay;

        // Normalize single object → array
        const normalizedPayments = Array.isArray(paymentsData) 
          ? paymentsData
          : [paymentsData];

        setPayments(normalizedPayments);
        setTotalPages(res.data.payments.totalPages)
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchPayments(page);
  }, [page]);

  return (
    <>
    <Navbar />
    <div className="all-payments-container">
      <h2 className="all-payments-title">All Payment History</h2>

      <div className="payment-table-wrapper">
        {loading ? (
          <p>Loading payment history...</p>
        ) : payments.length > 0 ? (
          <table className="payment-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td>{p.courseName || "N/A"}</td>
                  <td>₹{p.amount}</td>
                  <td className={`status ${p.status.toLowerCase()}`}>
                    {p.status}
                  </td>
                  <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          
        ) : (
          <p>No payment records found.</p>
        )}

        <div className="pagination">
             <button disabled={page===1} onClick={()=>setPage((prev)=>prev - 1)}>
              prev
              </button>

              <span>
                Page {page} of {totalPages}  
              </span> 

              <button
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Next
                </button>  
        </div>
      </div>
    </div>
    </>
  );
};

export default AllPayments;
