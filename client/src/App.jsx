import { useEffect, useState } from "react";
import Home from '../pages/home';
import FileUpload from '../component/fileupload';
import ReactFlask from "../component/reactflask";
import './App.css';

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
    <div className = "desktop">
      <Home/>
      {/* <FileUpload/>
      <ReactFlask/> */}
      <p>Flask connection test: {backendStatus}</p>
    </div>
  );
}

export default App;