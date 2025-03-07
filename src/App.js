  import React,{useState} from 'react';
  import './App.css';
  import PredictionsPanel from './components/PredictionsPanel';
  import MoleculeViewer from './components/MoleculeViewer';
  import SummaryPanel from './components/SummaryPanel';
  import ErrorBoundary from './components/ErrorBoundary';
  import MoleculeProperties from './components/MoleculeProperties';

  function App() {
    const [smiles, setSmiles] = useState("C(O)(=O)C1=C(OC(C)=O)C=CC=C1");
    const [value, setValue] = useState('');

    
    return (
      <div className="main">
        
        <ErrorBoundary>
          <MoleculeViewer smiles={smiles} />
        </ErrorBoundary>

        {/* Side panels should overlay on top */}
        <div className="app-container">
          <div className="predictions-panel">
            <PredictionsPanel smiles={smiles} />
          </div>
          <div className="summary-panel">
            <SummaryPanel smiles={smiles} />
          </div>
        </div>

        <div className="input-container">
          <label className='label'>Enter SMILES: </label>
          <input 
            type="text"
            value={smiles}
            onChange={(e) => setSmiles(e.target.value)}
            placeholder="Enter SMILES string"
          />
      
        </div>
        {/* Molecule Properties should be placed at bottom */}
        <MoleculeProperties smiles={smiles} />
      </div>
    );
  }

  export default App;
