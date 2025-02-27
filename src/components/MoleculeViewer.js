import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


const MoleculeViewer = () => {
  const mountRef = useRef(null);
  const isInitialized = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const moleculeGroupRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    // Initialize scene, camera, renderer
    if (isInitialized.current) return;
    isInitialized.current = true;
    const scene = sceneRef.current;
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(75, 
      window.innerWidth / window.innerHeight,
      0.1,
      1000);
    camera.position.z = 5;
    cameraRef.current = camera;
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight);
    })
    const adjustCamera = (moleculeGroup) => {
      const box = new THREE.Box3().setFromObject(moleculeGroup);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      // Calculate appropriate camera distance
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs((maxDim / 2) / Math.tan(fov / 2));
  
      // Add some padding
      cameraZ *= 1.5;
      
      camera.position.copy(center);
      camera.position.z += cameraZ;
      controls.target.copy(center);
      controls.update();
    };
  
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    const rendererDom = renderer.domElement;
    mountRef.current?.appendChild(rendererDom);
    rendererRef.current = renderer;

    // Setup controls
    const controls = new OrbitControls(camera, rendererDom);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    loadMolecule();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Start animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (moleculeGroupRef.current) {
        moleculeGroupRef.current.rotation.z += 0.005;
        moleculeGroupRef.current.rotation.y += 0.005;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationIdRef.current);

      // Clear previous molecule
      if (moleculeGroupRef.current) {
        scene.remove(moleculeGroupRef.current);
      }

      // Safely remove renderer DOM element
      if (mountRef.current && rendererDom.parentNode === mountRef.current) {
        mountRef.current.removeChild(rendererDom);
      }

      // Dispose Three.js resources
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  const loadMolecule = async () => {
    try {
      // Remove existing molecule if any
      if (moleculeGroupRef.current) {
        sceneRef.current.remove(moleculeGroupRef.current);
        moleculeGroupRef.current = null;
      }

      const smiles = "CCO"; // Replace with your desired SMILES string or get it dynamically
      const response = await fetch('http://localhost:8000/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ smiles })
      });
      const data = await response.json();
      const molData = data.mol_block;

      const moleculeGroup = parseMolFile(molData);

      sceneRef.current.add(moleculeGroup);
      moleculeGroupRef.current = moleculeGroup;

      
      // Center camera
      const box = new THREE.Box3().setFromObject(moleculeGroup);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);

      cameraRef.current.position.copy(center);
      cameraRef.current.position.z += maxDim * 3;
      controlsRef.current.target.copy(center);

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading molecule:', error);
      setIsLoading(false);
    }
  };

  // ... keep the parseMolFile and createMoleculeGeometry functions unchanged ...
  const parseMolFile = (molData) => {
    const lines = molData.split('\n').map(line => line.replace(/\r/g, ''));
    const atoms = [];
    const bonds = [];
    const headerLine = lines[3];
    const numAtoms = parseInt(headerLine.substring(0, 3).trim(), 10);
    const numBonds = parseInt(headerLine.substring(3, 6).trim(), 10);

    for (let i = 0; i < numAtoms; i++) {
      const line = lines[i + 4];
      const x = parseFloat(line.substring(0, 10).trim());
      const y = parseFloat(line.substring(10, 20).trim());
      const z = parseFloat(line.substring(20, 30).trim());
      const element = line.substring(31, 34).trim();
      atoms.push({ position: new THREE.Vector3(x, y, z), element });
    }

    const bondStartLine = 4 + numAtoms;
    for (let i = 0; i < numBonds; i++) {
      const line = lines[bondStartLine + i];
      const atom1 = parseInt(line.substring(0, 3).trim(), 10) - 1;
      const atom2 = parseInt(line.substring(3, 6).trim(), 10) - 1;
      const order = parseInt(line.substring(6, 9).trim(), 10);
      bonds.push({ atom1, atom2, order });
    }

    return createMoleculeGeometry(atoms, bonds);
  };

  const createMoleculeGeometry = (atoms, bonds) => {
    const group = new THREE.Group();

    atoms.forEach((atom) => {
      const radius = atom.element === 'H' ? 0.1 : 0.2;
      const geometry = new THREE.SphereGeometry(radius, 16, 16);
      const material = new THREE.MeshPhongMaterial({
        color: atom.element === 'H' ? 0xffffff : 0x808080,
        shininess: 100
      });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.copy(atom.position);
      group.add(sphere);
    });

    bonds.forEach(bond => {
      const atom1 = atoms[bond.atom1];
      const atom2 = atoms[bond.atom2];
      const start = atom1.position;
      const end = atom2.position;

      const createBond = (offset) => {
        const direction = new THREE.Vector3().subVectors(end, start);
        const length = direction.length();
        const geometry = new THREE.CylinderGeometry(0.03, 0.03, length, 8);
        const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const cylinder = new THREE.Mesh(geometry, material);
        const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        cylinder.position.copy(midpoint);
        cylinder.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          direction.clone().normalize()
        );

        if (offset !== 0) {
          const axis = new THREE.Vector3().crossVectors(direction, new THREE.Vector3(0, 1, 0)).normalize();
          cylinder.position.add(axis.multiplyScalar(offset));
        }

        return cylinder;
      };

      switch (bond.order) {
        case 2:
          group.add(createBond(0.05));
          group.add(createBond(-0.05));
          break;
        case 3:
          group.add(createBond(0.1));
          group.add(createBond(0));
          group.add(createBond(-0.1));
          break;
        default:
          group.add(createBond(0));
          break;
      }
    });

    return group;
  };

  return (
    <div className="molecule-viewer-container">
      {/* Canvas container */}
      <div ref={mountRef} className="canvas-container" />
      
      {/* Left sidebar */}
      <div className="sidebar left-sidebar">
        {/* Your left sidebar content */}
      </div>
      
      {/* Right sidebar */}
      <div className="sidebar right-sidebar">
        {/* Your right sidebar content */}
      </div>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="loading-overlay">
          Loading molecule...
        </div>
      )}
    </div>
  );
};

export default MoleculeViewer;