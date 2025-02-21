import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const SearchPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const name = queryParams.get("name");

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!name) return;

        const fetchResults = async () => {
            try {
                const token = localStorage.getItem("token"); // Get token from localStorage
                if (!token) {
                    setError("Unauthorized: No token found");
                    return;
                }

                const response = await axios.get(`http://localhost:8000/api/applicants/search?name=${name}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Send token in request
                    },
                });

                setResults(response.data.data || []);
            } catch (err) {
                setError(err.response?.data?.error || "Error fetching results");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [name]);

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "auto", fontFamily: "Arial" }}>
            <h2>Search Results for "{name}"</h2>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {results.length === 0 && !loading && <p>No applicants found.</p>}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginTop: "20px" }}>
                {results.map((applicant, index) => (
                    <div key={index} style={{ padding: "15px", border: "1px solid #ccc", borderRadius: "5px", background: "#f9f9f9" }}>
                        <h3>{applicant.Name}</h3>
                        <p><strong>Email:</strong> {applicant.Email.join(", ")}</p>

                        <h4>Skills</h4>
                        <ul style={{ display: "flex", flexWrap: "wrap", listStyle: "none", padding: 0 }}>
                            {applicant.Skills.map((skill, idx) => (
                                <li key={idx} style={{ margin: "5px", padding: "5px", background: "#eee", borderRadius: "5px" }}>
                                    {skill}
                                </li>
                            ))}
                        </ul>

                        {applicant.Experience && applicant.Experience.length > 0 && (
                            <>
                                <h4>Experience</h4>
                                <ul>
                                    {applicant.Experience.map((exp, idx) => (
                                        <li key={idx}>
                                            <strong>{exp.Role}</strong> at {exp.Company} ({exp.Year})
                                            <p>{exp.Description}</p>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchPage;
