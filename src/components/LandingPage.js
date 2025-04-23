import React, { useState } from "react";

function LandingPage({ onStart }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onStart(input); // Pass the entered SMILES to App
    }
  };

  return (
    <div className="landing-container">
      <h2>Welcome to Molecule Analysis</h2>
      <p>Enter a SMILES string to begin:</p>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter SMILES string"
      />
      <button onClick={handleSubmit}>Start</button>
    </div>
  );
}

export default LandingPage;
