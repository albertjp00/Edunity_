import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import StatsCard from "./statsCard";
import { getEarnings } from "../../services/instructorServices";


interface IEarnings{
  earnings:{
    courseId : string;
    instructorId : string;
    coursePrice : string ;
    totalSales : number;
    totalEarnings : number;
    instructorEarnings : number;
    lastUpdated : Date;
  },
  totalEarnings:string;
}

const EarningsChart: React.FC = () => {

  const [earnings,setEarnings] = useState<IEarnings[]>([])
  const [totalEarnings,setTotalEarnings] = useState<IEarnings[]>([])

  useEffect(()=>{
    const Earnings = async ()=>{
    const res = await getEarnings()
    if(!res) return
    // console.log("earnings" , res);
    
    setEarnings(res.data.earnings.monthlyEarnings)
    setTotalEarnings(res.data.earnings.totalEarnings)
  }
  Earnings()
  },[])

  return (
    
    
  <div className="chart-container">
    {/* ✅ Show total earnings */}
          <StatsCard
            title="Total Earnings"
            value={`₹${(totalEarnings || 0).toLocaleString()}`}
          />
    <h4>Monthly Earnings</h4>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={earnings}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="earnings" stroke="#4f46e5" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
  )

}

export default EarningsChart;
