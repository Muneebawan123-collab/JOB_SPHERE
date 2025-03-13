import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const UserAnalytics = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/analytics/user-analytics");
      setData([
        { name: "Job Views", count: res.data.views },
        { name: "Job Applications", count: res.data.applications },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>My Job Analytics</h2>
      <BarChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default UserAnalytics;
