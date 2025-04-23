import React, { useState } from 'react';
import './App.css';
import PredictionsPanel from './components/PredictionsPanel';
import MoleculeViewer from './components/MoleculeViewer';
import SummaryPanel from './components/SummaryPanel';
import ErrorBoundary from './components/ErrorBoundary';
import MoleculeProperties from './components/MoleculeProperties';
import PredictionChart from './components/PredictionChart';

function App() {
  const [isEntered, setIsEntered] = useState(false);
  const [smiles, setSmiles] = useState("C(O)(=O)C1=C(OC(C)=O)C=CC=C1");

  const handleEnter = () => {
    setIsEntered(true);
  };

  return (
    <>
      <div className="main">
        {/* Added MolTox heading */}
        <div className="app-header">
          <h1 className="app-title">MolTox</h1>
        </div>

        <div className="viewer-container">
          <ErrorBoundary>
            <MoleculeViewer smiles={smiles} />
          </ErrorBoundary>
        </div>

        <div className="app-container">
          <div className="predictions-panel">
            <PredictionsPanel smiles={smiles} />
          </div>
          <div className="summary-panel">
            <SummaryPanel smiles={smiles} />
          </div>
        </div>

        <div className="smiles-input-container">
          <div className="input-group">
            <div className="input-wrapper">
              <input
                type="text"
                value={smiles}
                onChange={(e) => setSmiles(e.target.value)}
                placeholder=" "
                className="modern-input"
              />
              <label className="floating-label">Enter SMILES Notation</label>
              <button
                className="clear-button"
                onClick={() => setSmiles('')}
                aria-label="Clear input"
              >
                &times;
              </button>
            </div>
            <button className="analyze-button">
              <span className="icon">🧪</span>
              Analyze Structure
            </button>
          </div>
          <div className="input-hint">
            Example: CC(=O)OC1=CC=CC=C1C(=O)O
          </div>
        </div>

        <MoleculeProperties smiles={smiles} />
        <PredictionChart smiles={smiles} />
      </div>
    </>
  );
}

export default App;