import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';

function ToxicParticles() {
  return (
    <>
      {Array(400).fill().map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
          ]}
          scale={Math.random() * 0.5 + 0.5}
        >
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#ff2222" />
        </mesh>
      ))}
    </>
  );
}

export default function EntryPage({ onEnter }) {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        <Text
          fontSize={0.8}
          position={[0, 0, 0]}
          color="#ff4444"
          anchorX="center"
          anchorY="middle"
        >
          TOXICITY PREDICTION
          <meshStandardMaterial color="#ff4444" />
        </Text>

        <ToxicParticles />
        <OrbitControls enableDamping />
      </Canvas>

      <button
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '10px 20px',
          backgroundColor: '#ff4444',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '1.2em',
        }}
        onClick={onEnter}
      >
        Start Analysis
      </button>
    </div>
  );
}
