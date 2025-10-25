import { useEffect, useState } from "react";
import FileUpload from "../component/fileupload";
import ReactFlask from "../component/reactflask";
import "./App.css";

function App() {
  const [conversionResult, setConversionResult] = useState(null);
  const [loadingConvert, setLoadingConvert] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8080")
      .then((response) => {
        if (!response.ok) throw new Error("Backend not reachable");
        return response.json();
      })
      .then((data) => console.log(`Connected to backend: ${data.status}`))
      .catch((error) => console.error("Error connecting to backend:", error));
  }, []);

  const uploadAndConvert = async (file) => {
    const form = new FormData();
    form.append("file", file);

    setLoadingConvert(true);
    try {
      const resp = await fetch(
        "http://127.0.0.1:8080/convert_pdf_to_md_to_response",
        {
          method: "POST",
          body: form,
          headers: {
            Accept: "application/json"
          },
        }
      );
      if (!resp.ok) throw new Error(`Server returned ${resp.status}`);
      const data = await resp.json();
      setConversionResult(data);
    } catch (err) {
      console.error("Conversion error:", err);
      setConversionResult({ error: err.message });
    } finally {
      setLoadingConvert(false);
    }
  };

  const handleFileSelected = (file) => {
    uploadAndConvert(file);
  };

  return (
    <div className="desktop">
      <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>calhacks is life</h1>
        <FileUpload onFileSelect={handleFileSelected} />
        <ReactFlask conversionResult={conversionResult} isLoading={loadingConvert} />
      </div>
    </div>
  );
}

export default App;
