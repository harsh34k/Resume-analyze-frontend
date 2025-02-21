import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchNavbar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim() === "") return;
        navigate(`/searchpage?name=${encodeURIComponent(searchQuery)}`);
    };

    return (
        <nav style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
            backgroundColor: "#333",
            color: "white"
        }}>
            <h2 style={{ margin: 0, cursor: "pointer" }} onClick={() => navigate("/")}>Resume Analyzer</h2>
            <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center" }}>
                <input
                    type="text"
                    placeholder="Please search fullName"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        padding: "8px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        marginRight: "8px"
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: "8px 12px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}>
                    Search
                </button>
            </form>
        </nav>
    );
};

export default SearchNavbar;
