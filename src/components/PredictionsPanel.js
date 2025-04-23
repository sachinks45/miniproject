import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const PredictionsPanel = ({smiles}) => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://127.0.0.1:8000/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ smiles, prompt: "" }),
        });

        if (!response.ok) {
          throw new Error("Error fetching predictions");
        }

        const data = await response.json();
        const toxicityPredictions = data.toxicity;
        const predictionsArray = Object.entries(toxicityPredictions).map(
          ([endpoint, details]) => ({
            endpoint,
            prediction: details.prediction,
            value: details.confidence,
          })
        );
        setPredictions(predictionsArray);
      } catch (err) {
        console.error("Error fetching predictions:", err);
        setError("Failed to load predictions.");
      }
      setLoading(false);
    };

    fetchPredictions();
  }, [smiles]);

  return (
    <GlassPanel>
      <h3 className='app-title2'>Predicted Endpoints</h3>
      {loading && <LoadingText>Loading predictions...</LoadingText>}
      {error && <ErrorText>{error}</ErrorText>}
      {!loading && !error && (
        <TableContainer>
          <StyledTable>
            <thead>
              <TableRow>
                <TableHeader>Endpoint</TableHeader>
                <TableHeader>Prediction</TableHeader>
                <TableHeader>Confidence</TableHeader>
              </TableRow>
            </thead>
            <tbody>
              {predictions.map((pred) => (
                <TableRow key={pred.endpoint}>
                  <TableCell>{pred.endpoint}</TableCell>
                  <TableCell>{pred.prediction}</TableCell>
                  <TableCell>{pred.value}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </StyledTable>
        </TableContainer>
      )}
    </GlassPanel>
  );
};

// Styled components
const GlassPanel = styled.div`
  background: rgba(30, 30, 30, 0.25);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  width: 80%;
  color: white;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 15px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 12px 15px;
  text-align: left;
  background-color: rgba(0, 119, 255, 0.2);
  border-bottom: 2px solid rgba(0, 119, 255, 0.5);
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  &:hover {
    background-color: rgba(0, 119, 255, 0.1);
  }
`;

const TableCell = styled.td`
  padding: 10px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const LoadingText = styled.p`
  color: #aaa;
  margin-top: 10px;
`;

const ErrorText = styled.p`
  color: #ff4444;
  margin-top: 10px;
`;

export default PredictionsPanel;