import React, { useEffect, useState } from "react";

import "./reports.css";
import type { IReportAdmin } from "../../adminInterfaces";
import { getReports } from "../../services/adminServices";
import { Link } from "react-router-dom";

const Reports: React.FC = () => {
  const [reports, setReports] = useState<IReportAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await getReports();
      if(!res) return
      console.log(res);
      
      setReports(res.data.reports);
    } catch (error) {
      console.error("Failed to fetch reports", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="report-loading">Loading reports...</p>;
  }

  return (
    <div className="report-container">
      <h2 className="report-title">Course Reports</h2>

      {reports.length === 0 ?  (
        <p className="report-empty">No reports found</p>
      ) : (
        <div className="report-table-wrapper">
          <table className="report-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Course ID</th>
                <th>Reason</th>
                <th>Message</th>
                <th>Reported At</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((report , index) => (
                <tr key={report._id}>
                  <td>{`User `+ (index + 1)}</td>
                  <td> <Link   to={`/admin/courseDetails/${report.courseId}`}
                    className="report-courseId">{report.courseId}</Link></td>
                  <td className="report-reason">{report.reason}</td>
                  <td className="report-message">
                    {report.message || "—"}
                  </td>
                  <td>
                    {new Date(report.createdAt).toLocaleString("en-IN",{
                      year : 'numeric',
                      month : '2-digit',
                      day : '2-digit'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reports;
