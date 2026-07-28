import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { BodyShapeType } from '../../types';

interface BodySilhouetteCanvasProps {
  shape: BodyShapeType;
}

export const BodySilhouetteCanvas: React.FC<BodySilhouetteCanvasProps> = ({ shape }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0, 4.0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xd8c7ff, 3, 10);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    // Create 3D Body Silhouette Wireframe Mesh
    const bodyGroup = new THREE.Group();

    // Shape specific scale ratios
    let shoulderScale = 1.0;
    let waistScale = 0.6;
    let hipScale = 1.0;

    switch (shape) {
      case 'Pear':
        shoulderScale = 0.8;
        waistScale = 0.65;
        hipScale = 1.25;
        break;
      case 'Apple':
        shoulderScale = 1.0;
        waistScale = 1.1;
        hipScale = 0.9;
        break;
      case 'Rectangle':
        shoulderScale = 1.0;
        waistScale = 0.95;
        hipScale = 1.0;
        break;
      case 'Inverted Triangle':
        shoulderScale = 1.3;
        waistScale = 0.7;
        hipScale = 0.8;
        break;
      case 'Hourglass':
      default:
        shoulderScale = 1.1;
        waistScale = 0.55;
        hipScale = 1.1;
        break;
    }

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xc0a0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });

    // Shoulders
    const shoulderGeo = new THREE.CylinderGeometry(0.3 * shoulderScale, 0.25 * shoulderScale, 0.4, 16);
    const shoulderMesh = new THREE.Mesh(shoulderGeo, wireMat);
    shoulderMesh.position.set(0, 0.8, 0);
    bodyGroup.add(shoulderMesh);

    // Waist
    const waistGeo = new THREE.CylinderGeometry(0.25 * shoulderScale, 0.22 * waistScale, 0.5, 16);
    const waistMesh = new THREE.Mesh(waistGeo, wireMat);
    waistMesh.position.set(0, 0.35, 0);
    bodyGroup.add(waistMesh);

    // Hips
    const hipGeo = new THREE.CylinderGeometry(0.22 * waistScale, 0.32 * hipScale, 0.6, 16);
    const hipMesh = new THREE.Mesh(hipGeo, wireMat);
    hipMesh.position.set(0, -0.2, 0);
    bodyGroup.add(hipMesh);

    // Head
    const headGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const headMesh = new THREE.Mesh(headGeo, wireMat);
    headMesh.position.set(0, 1.35, 0);
    bodyGroup.add(headMesh);

    scene.add(bodyGroup);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      bodyGroup.rotation.y = elapsedTime * 0.8;
      bodyGroup.position.y = Math.sin(elapsedTime * 2) * 0.05;

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
  }, [shape]);

  return (
    <div className="relative w-full h-64 rounded-2xl bg-black/40 border border-purple-500/20 overflow-hidden flex items-center justify-center">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute bottom-2 left-3 bg-purple-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs text-purple-200 border border-purple-500/30">
        3D Wireframe Morph: <span className="font-semibold text-white">{shape}</span>
      </div>
    </div>
  );
};
