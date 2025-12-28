import React, { useEffect, useState } from "react";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import {

  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
  BarChart,
  Bar
} from "recharts";




import { getOverview, getStats } from "../../services/adminServices";
import type { DashboardStats } from "../../adminInterfaces";




const StatCard: React.FC<{
  title: string;
  value: number;
  change: number;
  data: { name: string; value: number }[];
}> = ({ title, value, change, data }) => {
  const isPositive = change >= 0;
  const color = isPositive ? "#10b981" : "#ef4444";
  const sign = isPositive ? "+" : "";

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        transition: "transform 0.2s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "6px",
        }}
      >
        <h4 style={{ fontSize: "0.95rem", color: "#374151" }}>{title}</h4>
        <p style={{ color, fontWeight: 500 }}>
          {sign}
          {change.toFixed(1)}%
        </p>
      </div>
      <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "6px" }}>
        {value.toLocaleString()}
      </h2>
      <ResponsiveContainer width="100%" height={40}>
        <BarChart data={data}>
          <Tooltip cursor={false} />
          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};







export interface IUserOverview {
  name: string;  // "Oct 2025"
  count: number;
}


const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getStats()
        console.log(res);

        const data = res.data.stats;
        setStats({
          totalUsers: data.totalUsers ?? 0,
          totalInstructors: data.totalInstructors ?? 0,
          totalCourses: data.totalCourses ?? 0,
          totalEnrolled: data.totalEnrolled ?? 0,
          totalEarnings: data.totalEarnings ?? 0,
          activeUsers: data.activeUsers ?? 0,
          statsChange: data.statsChange ?? {
            instructors: 0,
            courses: 0,
            enrolled: 0,
            events: 0,
            earnings: 0,
          },
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchStats();
  }, []);


  const [userOverview, setUserOverview] = useState<IUserOverview[]>([]);

  useEffect(() => {

    const fetchUserOverview = async () => {
      try {
        const res = await getOverview()
        console.log(res);

        setUserOverview(res.data.data)

      } catch (error) {
        console.log(error);

      }
    }

    fetchUserOverview()
  }, [])


  // const [total , setTotal ]= useState<number>()

  // const getTotal = async() =>{
  //   try {
  //     const res = await adminApi.get('/admin/getEarnings')
  //     setTotal(res)
  //   } catch (error) {
  //     console.log(error);
      
  //   }
  // }

  // useEffect(()=>{
  //   getTotal()
  // },[])

  // Dummy sparkline data for charts
  const sparkData = Array.from({ length: 7 }, (_, i) => ({
    name: `Day ${i + 1}`,
    value: Math.floor(Math.random() * 100) + 20,
  }));

  if (!stats)
    return (
      <p style={{ color: "#374151", padding: "30px" }}>
        Loading dashboard...
      </p>
    );

  return (
    <div
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "Inter, sans-serif",
        color: "#111827",
      }}
    >
      {/* Top Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        <StatCard
          title="Total Instructors"
          value={stats.totalInstructors}
          change={stats.statsChange.instructors}
          data={sparkData}
        />
        <StatCard
          title="Total Courses"
          value={stats.totalCourses}
          change={stats.statsChange.courses}
          data={sparkData}
        />
        <StatCard
          title="Total Enrolled"
          value={stats.totalEnrolled}
          change={stats.statsChange.enrolled}
          data={sparkData}
        />
        {/* <StatCard
          title="Total Events"
          value={stats.totalEvents}
          change={stats.statsChange.events}
          data={sparkData}
        /> */}
        <StatCard
          title="Total Earnings"
          value={stats.totalEarnings}
          change={stats.statsChange.earnings}
          data={sparkData}
        />
      </div>

      {/* Bottom Stats */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "40px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: "280px",
            background: "#fff",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <h4 style={{ color: "#374151" }}>Active Users</h4>
          <h2
            style={{ fontSize: "1.8rem", fontWeight: 700, marginTop: "4px" }}
          >
            {stats.activeUsers.toLocaleString()}
          </h2>
          <p style={{ color: "#10b981", fontSize: "0.9rem" }}>↑ 6.7% Increase</p>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={sparkData}>
              <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: "280px",
            background: "#fff",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <h4 style={{ color: "#374151" }}>Total Users</h4>
          <h2
            style={{ fontSize: "1.8rem", fontWeight: 700, marginTop: "4px" }}
          >
            {stats.totalUsers.toLocaleString()}
          </h2>
          <p style={{ color: "#10b981", fontSize: "0.9rem" }}>↑ 6.7% Increase</p>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={sparkData}>
              <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>


      {/* User Overview Chart */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          marginTop: "40px",
        }}
      >
        <h3
          style={{
            marginBottom: "16px",
            color: "#374151",
            fontWeight: 600,
            fontSize: "1.1rem",
          }}
        >
          User Overview
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={userOverview}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
              labelStyle={{ color: "#111827", fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorCount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>



    </div>
  );
};

export default AdminDashboard;
