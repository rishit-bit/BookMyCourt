import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FloatingParticles = ({ count = 200 }) => {
  const particlesRef = useRef();
  const positionsRef = useRef();
  const velocitiesRef = useRef();

  const particleSystem = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100
      positions[i * 3 + 1] = Math.random() * 20; 
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100; 

      velocities[i * 3] = (Math.random() - 0.5) * 0.02; 
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01; 
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02; 

      const colorVariation = Math.random() * 0.3;
      colors[i * 3] = 0.8 + colorVariation; 
      colors[i * 3 + 1] = 0.7 + colorVariation; 
      colors[i * 3 + 2] = 0.5 + colorVariation; 

      sizes[i] = Math.random() * 0.5 + 0.1;
    }

    positionsRef.current = positions;
    velocitiesRef.current = velocities;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    return { geometry, material };
  }, [count]);

  useFrame((state, delta) => {
    if (!particlesRef.current || !positionsRef.current || !velocitiesRef.current) return;

    const positions = positionsRef.current;
    const velocities = velocitiesRef.current;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];

      positions[i3 + 1] += Math.sin(time * 0.5 + i * 0.1) * 0.001;

      if (positions[i3] > 50) positions[i3] = -50;
      if (positions[i3] < -50) positions[i3] = 50;
      if (positions[i3 + 1] > 25) positions[i3 + 1] = 0;
      if (positions[i3 + 1] < 0) positions[i3 + 1] = 25;
      if (positions[i3 + 2] > 50) positions[i3 + 2] = -50;
      if (positions[i3 + 2] < -50) positions[i3 + 2] = 50;

      velocities[i3] += (Math.random() - 0.5) * 0.001;
      velocities[i3 + 1] += (Math.random() - 0.5) * 0.001;
      velocities[i3 + 2] += (Math.random() - 0.5) * 0.001;

      velocities[i3] = Math.max(-0.05, Math.min(0.05, velocities[i3]));
      velocities[i3 + 1] = Math.max(-0.03, Math.min(0.03, velocities[i3 + 1]));
      velocities[i3 + 2] = Math.max(-0.05, Math.min(0.05, velocities[i3 + 2]));
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <primitive object={particleSystem.geometry} />
      <primitive object={particleSystem.material} />
    </points>
  );
};

export default FloatingParticles;


