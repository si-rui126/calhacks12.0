import { useState } from "react";

export default function ReactFlask() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://127.0.0.1:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: input }),
      });

      if (!res.ok) throw new Error("Flask backend error");
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error("Error:", error);
      setResponse("❌ Unable to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "3rem auto", fontFamily: "sans-serif" }}>
      <h2>Flask ↔ React Input Demo</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text..."
          style={{
            width: "100%",
            padding: "0.5rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "1rem",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#007bff",
            color: "white",
            cursor: "pointer",
          }}
        >
          {loading ? "Sending..." : "Send to Flask"}
        </button>
      </form>

      {response && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            color: "black",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          <strong>Flask says:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
