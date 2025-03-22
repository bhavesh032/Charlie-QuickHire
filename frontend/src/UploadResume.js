import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleJobDescChange = (e) => {
    setJobDesc(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !jobDesc) {
      toast.error("Please upload a resume and enter job description.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_desc", jobDesc);

    try {
      const response = await axios.post("http://127.0.0.1:5001/shortlist", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Failed to upload resume.");
    }
  };

  return (
    <div className="upload-container">
      <ToastContainer />
      <h2>Upload Resume for Shortlisting</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
        <textarea placeholder="Enter Job Description" value={jobDesc} onChange={handleJobDescChange}></textarea>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadResume;
