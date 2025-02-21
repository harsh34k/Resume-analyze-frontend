import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dzxdafcun/upload";
const CLOUDINARY_PRESET = "ml_default";

const ProcessPage = () => {
    const [file, setFile] = useState(null);
    const [resumeUrl, setResumeUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [resumeData, setResumeData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            navigate("/"); // Redirect to login if no token
        }
    }, [navigate]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setResumeUrl(""); // Clear direct link if file is selected
    };

    const handleUpload = async () => {
        if (!file && !resumeUrl) {
            setMessage("Please select a file or enter a resume link!");
            return;
        }

        setUploading(true);
        setMessage("");
        setResumeData(null);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setMessage("Unauthorized: No token found");
                return;
            }

            let fileUrl = resumeUrl; // Default to user-provided link

            if (file) {
                // Upload file to Cloudinary
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", CLOUDINARY_PRESET);

                const cloudRes = await axios.post(CLOUDINARY_URL, formData);
                fileUrl = cloudRes.data.secure_url;
            }

            // Send URL to backend
            const backendRes = await axios.post(
                "http://localhost:8000/api/resume/process",
                { url: fileUrl },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setMessage(backendRes.data.message || "Resume processed successfully!");
            setResumeData(backendRes.data.data);
        } catch (error) {
            setMessage(error.response?.data?.error || "Error processing resume");
            console.error(error);
        }

        setUploading(false);
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto", fontFamily: "Arial" }}>
            <h2>Upload or Paste Resume Link</h2>

            {/* File Upload Input */}
            <input type="file" accept="application/pdf" onChange={handleFileChange} />

            <p style={{ textAlign: "center", margin: "10px 0" }}>OR</p>

            {/* Direct Link Input */}
            <input
                type="text"
                placeholder="Paste resume link here..."
                value={resumeUrl}
                onChange={(e) => {
                    setResumeUrl(e.target.value);
                    setFile(null); // Clear file if user enters a link
                }}
                style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />

            <button onClick={handleUpload} disabled={uploading} style={{ marginLeft: "10px" }}>
                {uploading ? "Processing..." : "Upload/Paste & Process"}
            </button>

            {message && <p>{message}</p>}

            {/* Display Resume Analysis */}
            {resumeData && (
                <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
                    <h3>Resume Analysis</h3>
                    <p><strong>Name:</strong> {resumeData.Name}</p>
                    <p><strong>Email:</strong> {resumeData.Email?.join(", ")}</p>

                    <h4>Education</h4>
                    <ul>
                        {resumeData.Education?.map((edu, index) => (
                            <li key={index}>
                                <strong>{edu.Degree}</strong> - {edu.Institution} ({edu.Year})
                            </li>
                        ))}
                    </ul>

                    {/* Conditionally Render Experience Section Only if Experience Exists */}
                    {resumeData.Experience && resumeData.Experience.length > 0 && (
                        <>
                            <h4>Experience</h4>
                            <ul>
                                {resumeData.Experience.map((exp, index) => (
                                    <li key={index}>
                                        <strong>{exp.Role}</strong> at {exp.Company} ({exp.Year})
                                        <p>{exp.Description}</p>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    <h4>Skills</h4>
                    <ul style={{ display: "flex", flexWrap: "wrap", listStyle: "none", padding: 0 }}>
                        {resumeData.Skills?.map((skill, index) => (
                            <li key={index} style={{ margin: "5px", padding: "5px", background: "#eee", borderRadius: "5px" }}>
                                {skill}
                            </li>
                        ))}
                    </ul>

                    <h4>Summary</h4>
                    <p>{resumeData.Summary}</p>
                </div>
            )}

            <button onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
                alert("You have been logged out!");
            }} style={{ marginTop: "20px", backgroundColor: "red", color: "white", padding: "5px 10px", border: "none", cursor: "pointer" }}>
                Logout
            </button>
        </div>
    );
};

export default ProcessPage;

