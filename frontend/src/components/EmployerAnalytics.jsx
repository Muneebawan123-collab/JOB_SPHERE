import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const EmployerAnalytics = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/analytics/employer-analytics");
      setData(res.data.map((job, index) => ({ name: `Job ${index + 1}`, value: job.count })));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Job Posting Performance</h2>
      <PieChart width={400} height={400}>
        <Pie data={data} dataKey="value" outerRadius={150} fill="#8884d8">
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default EmployerAnalytics;
