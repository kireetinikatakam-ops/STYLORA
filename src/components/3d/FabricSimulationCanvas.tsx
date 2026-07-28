import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FabricType } from '../../types';

interface FabricSimulationCanvasProps {
  selectedFabric: FabricType;
  fabricColor: string;
  windSpeed: number;
}

export const FabricSimulationCanvas: React.FC<FabricSimulationCanvasProps> = ({
  selectedFabric,
  fabricColor,
  windSpeed,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const clothMeshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 50);
    camera.position.set(0, 0, 3.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xd8c7ff, 3);
    dirLight1.position.set(3, 4, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xb388ff, 2);
    dirLight2.position.set(-3, -2, 2);
    scene.add(dirLight2);

    // Create Fabric Cloth Mesh Grid
    const gridCols = 32;
    const gridRows = 32;
    const clothGeo = new THREE.PlaneGeometry(2.4, 2.4, gridCols, gridRows);

    // Material setup based on fabric type
    const clothMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(fabricColor),
      roughness: selectedFabric === 'Silk' || selectedFabric === 'Satin' ? 0.1 : 0.6,
      metalness: selectedFabric === 'Satin' ? 0.3 : 0.05,
      side: THREE.DoubleSide,
      wireframe: false,
    });

    const clothMesh = new THREE.Mesh(clothGeo, clothMat);
    clothMeshRef.current = clothMesh;
    scene.add(clothMesh);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const positionAttribute = clothGeo.attributes.position;
    const initialPositions = positionAttribute.array.slice() as Float32Array;

    // Real-time fabric physics wave animation loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime() * windSpeed;

      for (let i = 0; i < positionAttribute.count; i++) {
        const x = initialPositions[i * 3];
        const y = initialPositions[i * 3 + 1];

        // Fabric specific drape stiffness & wave frequency
        let frequency = 2.5;
        let amplitude = 0.18;

        if (selectedFabric === 'Silk') {
          frequency = 3.5;
          amplitude = 0.22;
        } else if (selectedFabric === 'Denim') {
          frequency = 1.8;
          amplitude = 0.08;
        } else if (selectedFabric === 'Velvet') {
          frequency = 2.0;
          amplitude = 0.14;
        }

        const waveZ =
          Math.sin(x * frequency + time * 2) * amplitude * Math.cos(y * frequency + time * 1.5) +
          Math.sin((x + y) * 3 + time * 3) * 0.05;

        // Top edge remains pinned like hanging garment
        const pinFactor = Math.abs(y - 1.2) / 2.4;
        positionAttribute.setZ(i, waveZ * pinFactor);
      }

      positionAttribute.needsUpdate = true;
      clothGeo.computeVertexNormals();

      clothMesh.rotation.y = Math.sin(time * 0.3) * 0.15;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [selectedFabric, fabricColor, windSpeed]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black/40 border border-purple-500/20">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-purple-300 font-mono flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        Generative Fabric Physics ({selectedFabric})
      </div>
    </div>
  );
};
