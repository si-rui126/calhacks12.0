import { useEffect, useState } from "react";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking connection...");

  useEffect(() => {
    // fetching url from flask server
    fetch("http://127.0.0.1:8080")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend not reachable");
        }
        return response.json();
      })
      .then((data) => {
        setBackendStatus(`✅ Connected to backend: ${data.status}`);
      })
      .catch((error) => {
        console.error("Error connecting to backend:", error);
        setBackendStatus("❌ Failed to connect to backend");
      });
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>calhacks is life</h1>
      <h3>flask backend connection test</h3>
      <p>{backendStatus}</p>
    </div>
  );
}

export default App;
