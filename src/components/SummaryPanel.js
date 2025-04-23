import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import styled from 'styled-components';

const SummaryPanel = ({smiles}) => {
  const [prompt, setPrompt] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ smiles, prompt }),
      });
      if (!response.ok) {
        throw new Error("Error fetching AI summary");
      }
      const data = await response.json();
      setSummary(data.gemini_response);
    } catch (err) {
      console.error("Error fetching AI summary:", err);
      setError("Failed to fetch AI summary.");
    }
    setLoading(false);
  };

  return (
    <GlassPanel>
      <h3 className="app-title1">ToxiDesk</h3>
      <InputTextarea
        autoResize
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your question here..."
        rows={5}
        cols={30}
        style={{
          width: "100%",
          marginBottom: "10px",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: "white",
          borderRadius: "6px",
          padding: "12px"
        }}
      />

      <StyledWrapper>
        <Button
          label={loading ? "Loading..." : "Ask AI"}
          icon="pi pi-check"
          loading={loading}
          disabled={loading || !prompt}
          onClick={handleSubmit}
        />
      </StyledWrapper>
      
      {error && <p style={{ color: "#ff4444" }}>{error}</p>}
      
      {summary && (
        <SummaryContent>
          <p>{summary}</p>
        </SummaryContent>
      )}
    </GlassPanel>
  );
};

// Styled components
const GlassPanel = styled.div`
  background: rgba(30, 30, 30, 0.55);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  width: 80%;
`;

const SummaryContent = styled.div`
  margin-top: 15px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border-left: 3px solid #0077ff;
`;

const StyledWrapper = styled.div`
  button {
    --color: #0077ff;
    font-family: inherit;
    display: inline-block;
    width: 6em;
    height: 2.6em;
    line-height: 2.5em;
    overflow: hidden;
    cursor: pointer;
    margin: 20px 0;
    font-size: 17px;
    z-index: 1;
    color: var(--color);
    border: 2px solid var(--color);
    border-radius: 6px;
    position: relative;
    background: rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
  }

  button:hover {
    color: white;
    background: rgba(0, 119, 255, 0.2);
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default SummaryPanel;