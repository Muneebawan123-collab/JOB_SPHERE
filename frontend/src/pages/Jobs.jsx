import { useEffect, useState } from "react";
import axios from "axios";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    employmentType: "",
    salaryRange: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/jobs/all", {
        params: filters,
      });
      setJobs(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>Job Listings</h2>

      {/* Search & Filter Form */}
      <div>
        <input name="keyword" placeholder="Search by title..." onChange={handleChange} />
        <input name="location" placeholder="Location..." onChange={handleChange} />
        <select name="employmentType" onChange={handleChange}>
          <option value="">All Employment Types</option>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Contract</option>
          <option>Internship</option>
        </select>
        <input name="salaryRange" placeholder="Salary Range (e.g. 30000-50000)" onChange={handleChange} />
        <button onClick={fetchJobs}>Search</button>
      </div>

      {/* Job Listings */}
      {jobs.map((job) => (
        <div key={job._id}>
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <p>{job.location}</p>
          <p>Salary: {job.salary}</p>
          <p>Posted by: {job.postedBy.name}</p>
          <button>Apply</button>
        </div>
      ))}
    </div>
  );
};

export default Jobs;
