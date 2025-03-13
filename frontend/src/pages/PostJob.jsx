import { useState } from "react";
import axios from "axios";

const PostJob = () => {
  const [job, setJob] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salary: "",
    employmentType: "Full-time",
  });

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/jobs/post", job, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Job posted successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Job Title" value={job.title} onChange={handleChange} />
      <textarea name="description" placeholder="Job Description" value={job.description} onChange={handleChange} />
      <input name="location" placeholder="Location" value={job.location} onChange={handleChange} />
      <input name="salary" placeholder="Salary" value={job.salary} onChange={handleChange} />
      <select name="employmentType" value={job.employmentType} onChange={handleChange}>
        <option>Full-time</option>
        <option>Part-time</option>
        <option>Contract</option>
        <option>Internship</option>
      </select>
      <button type="submit">Post Job</button>
    </form>
  );
};

export default PostJob;
