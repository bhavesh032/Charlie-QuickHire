import React, { useState } from "react";
import axios from "axios"; // ✅ Import axios

const Home = () => {
  const [file, setFile] = useState(null); // ✅ Define file state
  const [jobDesc, setJobDesc] = useState(""); // ✅ Define jobDesc state

  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // ✅ Store selected file
  };

  const handleJobDescChange = (event) => {
    setJobDesc(event.target.value); // ✅ Store job description
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a resume file.");
      return;
    }

    if (!jobDesc) {
      alert("Please enter a job description.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_desc", jobDesc);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5001/shortlist",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Response:", response.data);
      alert("Resume submitted successfully!");
    } catch (error) {
      console.error("Error uploading:", error.response?.data || error.message);
      alert("Failed to upload resume.");
    }
  };

  return (
    <div>
      <h2>AI Resume Shortlisting</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
        <br />
        <textarea
          placeholder="Enter job description"
          value={jobDesc}
          onChange={handleJobDescChange}
        />
        <br />
        <button type="submit">Upload Resume</button>
      </form>
    </div>
  );
};

export default Home;

