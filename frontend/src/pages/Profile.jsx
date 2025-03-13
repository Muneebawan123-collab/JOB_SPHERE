import { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState({
    skills: "",
    experience: "",
    education: "",
    certifications: "",
    companyInfo: "",
    jobHistory: [],
    resume: "", // To store uploaded resume URL
  });

  const [resume, setResume] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProfile(res.data || {});
    } catch (error) {
      console.log("Error fetching profile:", error);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "http://localhost:5000/api/users/profile",
        { ...profile },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Profile updated successfully!");
    } catch (error) {
      console.log("Error updating profile:", error);
    }
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!resume) {
      alert("Please select a resume file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);

    try {
      await axios.post("http://localhost:5000/api/users/upload-resume", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Resume uploaded successfully!");
      fetchProfile(); // Refresh profile data to show updated resume
    } catch (error) {
      console.log("Error uploading resume:", error);
    }
  };

  return (
    <div>
      <h2>Profile</h2>

      {/* Profile Update Form */}
      <form onSubmit={handleSubmit}>
        <input name="skills" placeholder="Skills" value={profile.skills} onChange={handleChange} />
        <input name="experience" placeholder="Experience" value={profile.experience} onChange={handleChange} />
        <input name="education" placeholder="Education" value={profile.education} onChange={handleChange} />
        <input name="certifications" placeholder="Certifications" value={profile.certifications} onChange={handleChange} />
        <button type="submit">Update Profile</button>
      </form>

      {/* Resume Upload Section */}
      <div>
        <h3>Upload Resume</h3>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload Resume</button>

        {profile.resume && (
          <div>
            <p>Uploaded Resume:</p>
            <a href={`http://localhost:5000/${profile.resume}`} target="_blank" rel="noopener noreferrer">
              View Resume
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
