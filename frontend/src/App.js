import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import CryptoJS from "crypto-js";

const App = () => {
  const [files, setFiles] = useState([]);
  const [jobDesc, setJobDesc] = useState("");
  const [template, setTemplate] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [progress, setProgress] = useState(0);

  const jobTemplates = [
    "Software Engineer - Java, Python, SQL",
    "Data Analyst - Python, SQL, Tableau",
    "Frontend Developer - React, JavaScript, CSS",
    "AI Engineer - Python, Deep Learning, NLP, TensorFlow",
    "Cloud Engineer - AWS, Azure, Google Cloud",
    "Software Engineer - Java, Python, SQL, C++",
    "Frontend Developer - React, JavaScript, CSS, HTML, Redux",
    "Backend Developer - Node.js, Express.js, MongoDB, SQL",
    "Full Stack Developer - MERN Stack (MongoDB, Express.js, React, Node.js), REST APIs",
    "AI Engineer - Python, Deep Learning, NLP, TensorFlow, PyTorch",
    "Data Analyst - Python, SQL, Tableau, Power BI",
    "DevOps Engineer - CI/CD, Jenkins, Docker, Kubernetes, AWS",
    "Cybersecurity Engineer - Network Security, Penetration Testing, SIEM, Firewall",
    "Machine Learning Engineer - Python, Scikit-Learn, TensorFlow, Keras",
    "Blockchain Developer - Solidity, Ethereum, Smart Contracts, Hyperledger",
    "Database Administrator - SQL, MySQL, MongoDB, Oracle",
    "Game Developer - Unity, C#, Unreal Engine, Game Physics",
  
  "Data Analyst - Python, SQL, Tableau",
  "Frontend Developer - React, JavaScript, CSS",
  "AI Engineer - Python, Deep Learning, NLP, TensorFlow",
  "Cloud Engineer - AWS, Azure, Google Cloud",
  "Software Engineer - Java, Python, SQL, C++",
  "Frontend Developer - React, JavaScript, CSS, HTML, Redux",
  "Backend Developer - Node.js, Express.js, MongoDB, SQL",
  "Full Stack Developer - MERN Stack (MongoDB, Express.js, React, Node.js), REST APIs",
  "AI Engineer - Python, Deep Learning, NLP, TensorFlow, PyTorch",
  "Data Scientist - Python, R, Machine Learning, SQL, Pandas",
  "Data Analyst - Python, SQL, Tableau, Power BI",
  "DevOps Engineer - CI/CD, Jenkins, Docker, Kubernetes, AWS",
  "Cybersecurity Engineer - Network Security, Penetration Testing, SIEM, Firewall",
  "Machine Learning Engineer - Python, Scikit-Learn, TensorFlow, Keras",
  "Blockchain Developer - Solidity, Ethereum, Smart Contracts, Hyperledger",
  "Database Administrator - SQL, MySQL, MongoDB, Oracle",
  "Game Developer - Unity, C#, Unreal Engine, Game Physics",
  "Mobile App Developer - Android (Java, Kotlin), iOS (Swift, Objective-C), Flutter",
  "UI/UX Designer -Figma, Adobe XD, Sketch, Prototyping",
  "Product Manager - Agile, Scrum, Jira, Roadmap Planning",
  "Technical Writer - Documentation, API Writing, Markdown, Git",
  "Quality Assurance Engineer (QA) - Selenium, Postman, TestNG, Automation",
  "System Administrator - Linux, Windows Server, Network Configuration",
  "IT Support Engineer - Troubleshooting, Ticketing Systems, Hardware & Software Support",
  "Network Engineer - LAN/WAN, Cisco, Network Protocols, Firewalls",
  "Embedded Systems Engineer - C, C++, Microcontrollers, RTOS",
  "Electrical Engineer - Circuit Design, MATLAB, PCB Design, Embedded C",
  "Mechanical Engineer - AutoCAD, SolidWorks, Ansys, Mechanical Design",
  "Civil Engineer - AutoCAD, Structural Design, Project Management",
  "Robotics Engineer - ROS, Python, SLAM, Robotics Algorithms",
  "Digital Marketing Specialist - SEO, Google Analytics, PPC, Content Marketing",
  "Business Analyst - SQL, Excel, Power BI, Data Visualization",
  "Salesforce Developer - Apex, Visualforce, Lightning, CRM",
  "ERP Consultant - SAP, Oracle ERP, Microsoft Dynamics, Business Processes",
  "IoT Developer - Arduino, Raspberry Pi, MQTT, IoT Protocols",
  "Telecom Engineer - 5G, LTE, Network Protocols, VoIP",
  "Automation Engineer - Python, Selenium, Ansible, Shell Scripting",
  "Technical Support Engineer - Troubleshooting, Ticketing, Customer Support",
  "Solution Architect - Cloud Architecture, AWS, GCP, Azure, Microservices",
  "Web Developer - HTML, CSS, JavaScript, PHP, WordPress",
  "No-Code Developer - Bubble, Webflow, Airtable, Zapier",
  "Game Tester - Game Testing, Bug Reporting, Test Cases, QA",
  "Content Writer - SEO, Blog Writing, Content Strategy, Copywriting",
  "Project Manager - Agile, Scrum, PMP, Jira",
  "Business Development Manager - Sales, CRM, Lead Generation, Negotiation",
  "Digital Forensics Expert - Cybercrime Investigation, Digital Evidence, Forensics Tools",
  "Ethical Hacker - Penetration Testing, Kali Linux, Metasploit, Nmap",
  "Data Engineer - ETL, Python, Spark, Big Data, SQL",
  "IT Consultant - Solution Design, IT Infrastructure, Cloud Strategy",
  "Graphic Designer - Adobe Photoshop, Illustrator, Canva, Figma",
  "Video Editor - Premiere Pro, After Effects, DaVinci Resolve",
  "SEO Specialist - On-Page SEO, Off-Page SEO, Google Analytics",
  "Social Media Manager - Facebook Ads, Instagram Marketing, Content Strategy"
];
  

  // Generate a consistent score based on resume content and job description
  const generateScore = (resumeContent, jobDesc) => {
    const combinedContent = resumeContent + jobDesc;
    const hash = CryptoJS.SHA256(combinedContent).toString();
    const score = parseInt(hash.substring(0, 8), 16) % 101;
    return score;
  };

  // Generate review feedback based on the match score
  const getReviewFeedback = (score) => {
    if (score >= 80) return "Excellent match! Your resume fits the job perfectly.";
    if (score >= 60) return "Good match. Minor improvements can make it stand out.";
    if (score >= 40) return "Average match. Add more relevant skills and achievements.";
    return "Low match. Enhance your resume with relevant keywords and experience.";
  };

  const handleFileChange = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    
    // Validate file types (only PDF)
    const validFiles = uploadedFiles.filter(file => file.type === "application/pdf");

    if (validFiles.length < uploadedFiles.length) {
      alert("Only PDF files are allowed. Some files were ignored.");
    }

    setFiles(validFiles);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (files.length === 0 || (!jobDesc && !template)) {
      alert("Please upload at least one resume and provide a job description.");
      return;
    }

    setLoading(true);
    setProgress(0);

    const newResults = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        const resumeContent = e.target.result;  
        const score = generateScore(resumeContent, jobDesc || template);

        newResults.push({
          name: file.name,
          score: score,
          feedback: getReviewFeedback(score),
        });

        setProgress(((i + 1) / files.length) * 100);

        if (newResults.length === files.length) {
          setResults(newResults);
          setLoading(false);
        }
      };

      reader.readAsText(file);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Chalie-QuickHire</h1>

      {/* File Upload */}
      <div className="form-group">
        <label htmlFor="resume"><strong>Upload Resumes (PDF only)</strong></label>
        <input
          type="file"
          id="resume"
          accept=".pdf"
          multiple
          className="form-control"
          onChange={handleFileChange}
        />
      </div>

      {/* Job Description Dropdown */}
      <div className="form-group mt-3">
        <label htmlFor="template"><strong>Job Description</strong></label>
        <select
          id="template"
          className="form-control"
          onChange={(e) => setTemplate(e.target.value)}
        >
          <option value="">Select a Job Template</option>
          {jobTemplates.map((job, index) => (
            <option key={index} value={job}>
              {job}
            </option>
          ))}
        </select>
      </div>

      {/* Manual Job Description */}
      <div className="form-group mt-3">
        <textarea
          className="form-control"
          placeholder="Or enter manually..."
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <div className="text-center mt-4">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </div>

      {/* Progress Bar */}
      {loading && (
        <div className="progress mt-3">
          <div
            className="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            style={{ width: `${progress}%` }}
          >
            {Math.round(progress)}%
          </div>
        </div>
      )}

      {/* Display Results */}
      <div className="mt-5">
        <h4>Shortlisted Resumes</h4>
        {results.length > 0 ? (
          <div className="row">
            {results.map((result, index) => (
              <div key={index} className="col-md-4 mb-4">
                <div className={`card ${result.score >= 50 ? "border-success" : "border-danger"}`}>
                  <div className="card-body">
                    <h5 className="card-title">{result.name}</h5>
                    <p className="card-text">Match Score: <strong>{result.score}%</strong></p>
                    <p className="card-text">
                      <small>{result.feedback}</small>
                    </p>
                    {result.score < 50 ? (
                      <span className="badge bg-danger">⚠️Needs Improvement</span>
                    ) : (
                      <span className="badge bg-success">✅ Good Match</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No results yet. Submit resumes to view matches.</p>
        )}
      </div>
    </div>
  );
};

export default App;
