import React, { useState, useEffect } from "react";

const MoleculeProperties = ({ smiles }) => {  
    const [properties, setProperties] = useState(null);
    const [moleculeName, setMoleculeName] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!smiles) {
            setError("");
            setProperties(null);
            return;
        }

        const fetchProperties = async () => {
            setError("");
            setProperties(null);
            setMoleculeName("");

            try {
                const response = await fetch("http://localhost:8000/analyze", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ smiles }),
                });

                const result = await response.json();

                if (response.ok && result.properties) {
                    setProperties(result.properties);
                    setMoleculeName(result.properties["Molecule Name"] || "Unknown Molecule");
                } else {
                    setError(result.error || "Invalid SMILES string or error fetching properties.");
                }
            } catch (error) {
                setError("Failed to fetch properties. Please try again.");
            }
        };

        fetchProperties();
    }, [smiles]);

    return (
        <div className="molecule">
          <h2 className="space app-title2">Molecule Properties</h2>
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      
          {properties && (
            <div className="glass-box"> {/* Changed from properties-box */}
              <h3>Properties of {moleculeName}</h3> 
              <div className="glass-table"> {/* Changed from properties-table */}
                {Object.entries(properties).map(([key, value]) => (
                  <div className="glass-row" key={key}> {/* Changed from property-row */}
                    <span className="glass-property-name">{key}</span>
                    <span className="glass-property-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
};

export default MoleculeProperties;
