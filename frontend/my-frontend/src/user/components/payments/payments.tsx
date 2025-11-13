import React, { useEffect, useState } from "react";
import "./payments.css";
import { getPaymentHistory } from "../../services/profileServices";
import type { IPayment } from "../../interfaces";
import Navbar from "../navbar/navbar";

const AllPayments = () => {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const res = await getPaymentHistory();
      console.log(res);
      
      if (res?.data.success) {
        const paymentsData = res.data.payments;

        // Normalize single object → array
        const normalizedPayments = Array.isArray(paymentsData) 
          ? paymentsData
          : [paymentsData];

        setPayments(normalizedPayments);
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

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
      </div>
    </div>
    </>
  );
};

export default AllPayments;
