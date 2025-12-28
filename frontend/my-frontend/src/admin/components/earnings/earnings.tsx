import React, { useEffect, useState } from "react";
import { getEarnings } from "../../../services/admin/adminService";
import "./earnings.css";
import type { IEarning } from "../../adminInterfaces";




const AdminEarnings: React.FC = () => {
  const [earnings, setEarnings] = useState<IEarning[]>();
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState<number>();


  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await getEarnings();
        console.log(res);
        if (res.data.success) {
          setEarnings(res.data.earnings.earningsData);
          setTotal(res.data.earnings.total)
        }
      } catch (error) {
        console.error("Error fetching earnings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);



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
      </div>
    </div>
  );
};

export default AdminEarnings;
