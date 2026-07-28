import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { LifestyleScene } from '../../types';
import { LIFESTYLE_SCENES } from '../../data/mockData';

interface Runway3DCanvasProps {
  activeScene: LifestyleScene;
  scrollProgress: number; // 0 to 1 across total page scroll
}

export const Runway3DCanvas: React.FC<Runway3DCanvasProps> = ({ activeScene, scrollProgress }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const outfitMeshRef = useRef<THREE.Mesh | null>(null);
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const floatingGroupRef = useRef<THREE.Group | null>(null);

  // Keep track of active scene props for smooth material interpolation
  const activeSceneInfo = LIFESTYLE_SCENES.find((s) => s.id === activeScene) || LIFESTYLE_SCENES[0];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x0b0b10, 0.035);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.6, 6.5);
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.SpotLight(0xd8c7ff, 4);
    keyLight.position.set(4, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xce93d8, 2, 10);
    fillLight.position.set(-4, 2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xb388ff, 3);
    rimLight.position.set(0, 4, -5);
    scene.add(rimLight);

    // 5. Runway Platform & Glass Mirror Floor
    const runwayGeo = new THREE.BoxGeometry(3.5, 0.15, 20);
    const runwayMat = new THREE.MeshStandardMaterial({
      color: 0x151226,
      roughness: 0.15,
      metalness: 0.85,
    });
    const runwayMesh = new THREE.Mesh(runwayGeo, runwayMat);
    runwayMesh.position.set(0, -1.2, -5);
    runwayMesh.receiveShadow = true;
    scene.add(runwayMesh);

    // Runway glowing side strips
    const stripGeo = new THREE.BoxGeometry(0.08, 0.16, 20);
    const stripMat = new THREE.MeshBasicMaterial({ color: 0xb388ff });
    const leftStrip = new THREE.Mesh(stripGeo, stripMat);
    leftStrip.position.set(-1.75, -1.18, -5);
    scene.add(leftStrip);

    const rightStrip = new THREE.Mesh(stripGeo, stripMat);
    rightStrip.position.set(1.75, -1.18, -5);
    scene.add(rightStrip);

    // 6. Stylized Procedural Fashion Model / Mannequin
    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;
    modelGroup.position.set(0, -1.1, 0);

    const mannequinMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(activeSceneInfo.modelColor),
      roughness: 0.3,
      metalness: 0.1,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
    });

    // Head
    const headGeo = new THREE.SphereGeometry(0.22, 32, 32);
    headGeo.scale(1, 1.25, 0.95);
    const headMesh = new THREE.Mesh(headGeo, mannequinMat);
    headMesh.position.set(0, 2.35, 0);
    headMesh.castShadow = true;
    modelGroup.add(headMesh);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.25, 16);
    const neckMesh = new THREE.Mesh(neckGeo, mannequinMat);
    neckMesh.position.set(0, 2.02, 0);
    modelGroup.add(neckMesh);

    // Torso / Bust
    const torsoGeo = new THREE.CylinderGeometry(0.28, 0.2, 0.7, 32);
    const torsoMesh = new THREE.Mesh(torsoGeo, mannequinMat);
    torsoMesh.position.set(0, 1.55, 0);
    torsoMesh.castShadow = true;
    modelGroup.add(torsoMesh);

    // Outfit Mesh (Customizable gown/coat geometry)
    const outfitGeo = new THREE.CylinderGeometry(0.22, 0.65, 1.1, 32);
    const outfitMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(activeSceneInfo.clothColor),
      roughness: 0.2,
      metalness: 0.4,
      emissive: new THREE.Color(activeSceneInfo.clothColor).multiplyScalar(0.15),
    });
    const outfitMesh = new THREE.Mesh(outfitGeo, outfitMat);
    outfitMesh.position.set(0, 0.8, 0);
    outfitMesh.castShadow = true;
    outfitMeshRef.current = outfitMesh;
    modelGroup.add(outfitMesh);

    // Limbs - Legs
    const legGeo = new THREE.CylinderGeometry(0.08, 0.06, 1.0, 16);
    const leftLeg = new THREE.Mesh(legGeo, mannequinMat);
    leftLeg.position.set(-0.14, 0.1, 0);
    leftLeg.castShadow = true;

    const rightLeg = new THREE.Mesh(legGeo, mannequinMat);
    rightLeg.position.set(0.14, 0.1, 0);
    rightLeg.castShadow = true;

    modelGroup.add(leftLeg);
    modelGroup.add(rightLeg);

    // Limbs - Arms
    const armGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.8, 16);
    const leftArm = new THREE.Mesh(armGeo, mannequinMat);
    leftArm.position.set(-0.35, 1.5, 0);
    leftArm.rotation.z = Math.PI / 14;

    const rightArm = new THREE.Mesh(armGeo, mannequinMat);
    rightArm.position.set(0.35, 1.5, 0);
    rightArm.rotation.z = -Math.PI / 14;

    modelGroup.add(leftArm);
    modelGroup.add(rightArm);

    scene.add(modelGroup);

    // 7. Floating 3D Fashion Accessories Group
    const floatingGroup = new THREE.Group();
    floatingGroupRef.current = floatingGroup;

    // Shoe Mesh
    const shoeGeo = new THREE.ConeGeometry(0.22, 0.4, 16);
    shoeGeo.rotateX(Math.PI / 2);
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0xd8c7ff, roughness: 0.2, metalness: 0.8 });
    const floatingShoe = new THREE.Mesh(shoeGeo, shoeMat);
    floatingShoe.position.set(-1.8, 1.2, 1.2);
    floatingGroup.add(floatingShoe);

    // Handbag Mesh
    const bagGeo = new THREE.BoxGeometry(0.4, 0.3, 0.2);
    const bagMat = new THREE.MeshStandardMaterial({ color: 0xb388ff, roughness: 0.3, metalness: 0.5 });
    const floatingBag = new THREE.Mesh(bagGeo, bagMat);
    floatingBag.position.set(1.9, 1.5, 0.8);
    floatingGroup.add(floatingBag);

    // Sunglasses Mesh
    const glassesGeo = new THREE.TorusGeometry(0.18, 0.03, 16, 32);
    const glassesMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const floatingGlasses = new THREE.Mesh(glassesGeo, glassesMat);
    floatingGlasses.position.set(-1.5, 2.2, -0.5);
    floatingGroup.add(floatingGlasses);

    // Diamond Gem
    const gemGeo = new THREE.OctahedronGeometry(0.18, 0);
    const gemMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, roughness: 0.1 });
    const floatingGem = new THREE.Mesh(gemGeo, gemMat);
    floatingGem.position.set(1.6, 2.5, -0.8);
    floatingGroup.add(floatingGem);

    scene.add(floatingGroup);

    // 8. Clothing Particle Field
    const particleCount = 200;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8;
      particlePositions[i + 1] = Math.random() * 5 - 1;
      particlePositions[i + 2] = (Math.random() - 0.5) * 8;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.06,
      color: 0xd8c7ff,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    particleSystemRef.current = particleSystem;
    scene.add(particleSystem);

    // Mouse Move listener for 3D parallax
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 9. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Procedural walking sway for model
      if (modelGroupRef.current) {
        modelGroupRef.current.position.y = -1.1 + Math.sin(elapsedTime * 2.5) * 0.03;
        modelGroupRef.current.rotation.y = Math.sin(elapsedTime * 1.2) * 0.15;

        // Animate arms walking swing
        leftArm.rotation.x = Math.sin(elapsedTime * 2.5) * 0.25;
        rightArm.rotation.x = -Math.sin(elapsedTime * 2.5) * 0.25;

        // Animate legs walking step
        leftLeg.rotation.x = -Math.sin(elapsedTime * 2.5) * 0.2;
        rightLeg.rotation.x = Math.sin(elapsedTime * 2.5) * 0.2;
      }

      // Rotate floating accessories
      if (floatingGroupRef.current) {
        floatingGroupRef.current.rotation.y = elapsedTime * 0.3;
        floatingShoe.rotation.x = elapsedTime * 0.5;
        floatingBag.rotation.z = Math.sin(elapsedTime) * 0.2;
        floatingGem.rotation.y = elapsedTime * 0.8;

        // Mouse Parallax reaction
        floatingGroupRef.current.position.x = mouseRef.current.x * 0.4;
        floatingGroupRef.current.position.y = mouseRef.current.y * 0.4;
      }

      // Slowly rotate particle field
      if (particleSystemRef.current) {
        particleSystemRef.current.rotation.y = elapsedTime * 0.05;
      }

      // Camera smooth follow based on mouse & scroll
      if (cameraRef.current) {
        const targetCamX = mouseRef.current.x * 0.8;
        const targetCamY = 1.6 + mouseRef.current.y * 0.4 + scrollProgress * 0.5;
        const targetCamZ = 6.5 - scrollProgress * 1.5;

        cameraRef.current.position.x += (targetCamX - cameraRef.current.position.x) * 0.05;
        cameraRef.current.position.y += (targetCamY - cameraRef.current.position.y) * 0.05;
        cameraRef.current.position.z += (targetCamZ - cameraRef.current.position.z) * 0.05;

        cameraRef.current.lookAt(0, 0.8, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update materials when active scene changes
  useEffect(() => {
    const sceneInfo = LIFESTYLE_SCENES.find((s) => s.id === activeScene) || LIFESTYLE_SCENES[0];
    if (outfitMeshRef.current) {
      const mat = outfitMeshRef.current.material as THREE.MeshStandardMaterial;
      mat.color.set(sceneInfo.clothColor);
      mat.emissive.set(sceneInfo.clothColor).multiplyScalar(0.2);

      // Trigger temporary mesh scale pop on transition
      outfitMeshRef.current.scale.set(1.15, 1.15, 1.15);
      setTimeout(() => {
        if (outfitMeshRef.current) outfitMeshRef.current.scale.set(1, 1, 1);
      }, 300);
    }
  }, [activeScene]);

  return (
    <div className="relative w-full h-full pointer-events-auto overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />
      {/* Soft Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-radial from-transparent via-black/20 to-black/80" />
    </div>
  );
};
