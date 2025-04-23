import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { color } from 'chart.js/helpers';
import { materialOpacity } from 'three/tsl';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PredictionsChart = ({ smiles }) => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://127.0.0.1:8000/chart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ smiles }),
        });
        if (!response.ok) {
          throw new Error("Error fetching chart data");
        }
        const data = await response.json();
        setPredictions(data.predictions);
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setError("Failed to load chart data.");
      }
      setLoading(false);
    };

    fetchChartData();
  }, [smiles]);

  const chartData = {
    labels: predictions.map((pred) => pred.endpoint),
    datasets: [
      {
        label: 'Confidence',
        borderColor:'#FF6384',
        data: predictions.map((pred) => parseFloat(pred.value)),
        backgroundColor: 'rgba(0, 194, 242, 0.7)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Prediction Confidence by Endpoint' },
    },
    scales: {
      x: {
        ticks: {
          color: '#07eb10', // Change label color (x-axis)
          font: {
            size: 14, // Adjust font size if needed
            weight: 'bold'
          }
        },
      },
      y: {
        ticks: {
          color: '#07eb10', // Change label color (y-axis)
          font: {
            size: 14,
            weight: 'bold'
          }
        },
      },
    },
  };
  

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ 
      marginTop: '40px',
      width: '100%',
      padding: '0 0px' // Add horizontal padding
    }}>
      {loading && <p>Loading chart...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {!loading && !error && predictions?.length > 0 && (
        <div style={{ 
          width: '100%',
          height: '500px', // Adjust height as needed
          position: 'relative' // Important for chart responsiveness
        }}>
          <Bar 
            data={chartData} 
            options={{
              ...chartOptions,
              responsive: true,
              maintainAspectRatio: false // Allow chart to fill container
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PredictionsChart;