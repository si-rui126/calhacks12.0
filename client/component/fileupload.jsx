import React, { useState } from "react";

export default function FileUpload() {
  const [files, setFiles] = useState([]);
  const [userId, setUserId] = useState("demo");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFiles(Array.from(e.target.files)); // convert FileList to array
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      alert("Please select at least one file!");
      return;
    }

    setLoading(true);
    const allResults = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("file", file);

      try {
        const res = await fetch("http://127.0.0.1:8080/convert_pdf_to_md_to_response", {
          method: "POST",
          body: formData,
        });
        
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        allResults.push({ file: file.name, result: data });
      } catch (err) {
        console.error(err);
        allResults.push({ file: file.name, error: err.message });
      }
    }

    setResults(allResults);
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", border: "1px solid #ddd", borderRadius: "8px",display: "flex",
    justifyContent: "center",
    alignItems: "center"}}>
      <h3>Upload Study Materials</h3>

      <form onSubmit={handleSubmit}>
        <label>User ID:</label>
        <input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="demo"
          style={{ marginBottom: "1rem", marginLeft: "0.5rem" }}
        />
        <br />

        <input
          type="file"
          accept=".pdf,.txt,.pptx"
          multiple
          onChange={handleChange}
          style={{ marginTop: "1rem" }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#4caf50",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {files.length > 0 && (
        <ul style={{ marginTop: "1rem" }}>
          {files.map((f, i) => (
            <li key={i}>{f.name}</li>
          ))}
        </ul>
      )}

      {results.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <h4>Upload Results:</h4>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
