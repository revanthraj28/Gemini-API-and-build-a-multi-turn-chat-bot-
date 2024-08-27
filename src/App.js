import { useState } from "react";

const App = () => {
  const [error, setError] = useState("");
  const [value, setValue] = useState("");
  const [charHistory, setCharHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const surpriseOptions = [
    "Who won the latest Nobel Peace Prize?",
    "Where does pizza come from?",
    "Who created DSA?",
  ];

  const surprise = () => {
    const randomIndex = Math.floor(Math.random() * surpriseOptions.length);
    setValue(surpriseOptions[randomIndex]);
  };

  const getResponse = async () => {
    if (!value) {
      setError("Error! Please ask a question!");
      return;
    }
    setLoading(true);
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: charHistory,
          message: value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("http://localhost:8000/gemini", options);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
      setCharHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: "user",
          parts: value,
        },
        {
          role: "model",
          parts: data.response, // Ensure you access the correct property based on your server response structure
        },
      ]);
      setValue("");
    } catch (error) {
      console.error(error);
      setError("Error! Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const clearInput = () => {
    setValue("");
    setError("");
    setCharHistory([]);
  };

  return (
    <div className="app">
      <h1>Ask me anything</h1>
      <p>
        What do you want to know?
        <button className="surprise" onClick={surprise} disabled={loading}>
          Surprise me
        </button>
      </p>
      <div className="input-container">
        <input
          value={value}
          placeholder="When is Christmas...?"
          onChange={(e) => setValue(e.target.value)}
          disabled={loading}
        />
        <button onClick={getResponse} disabled={!value || loading}>
          {loading ? "Loading..." : "Ask me"}
        </button>
        <button onClick={clearInput}>Clear</button>
      </div>
      {error && <p className="error">{error}</p>}

      <div className="search-result">
        {charHistory.map((chatitem, _index) => (
          <div key={_index}>
            <p className="answer">
              {chatitem.role}: {chatitem.parts}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
