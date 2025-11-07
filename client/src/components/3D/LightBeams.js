import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const LightBeams = () => {
  const beamsRef = useRef();

  const beamSystem = useMemo(() => {
    const beams = [];
    
    for (let i = 0; i < 6; i++) {
      const beamGroup = new THREE.Group();
      
      const beamGeometry = new THREE.ConeGeometry(0.5, 15, 8);
      const beamMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.6 + i * 0.05, 0.8, 0.6), 
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
      });
      
      const beam = new THREE.Mesh(beamGeometry, beamMaterial);
      beam.rotation.x = Math.PI / 2; 
      beam.position.y = 12;
      beamGroup.add(beam);
      
      const glowGeometry = new THREE.ConeGeometry(1, 18, 8);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.6 + i * 0.05, 0.8, 0.4),
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
      });
      
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.rotation.x = Math.PI / 2;
      glow.position.y = 12;
      beamGroup.add(glow);
      
      const angle = (i / 6) * Math.PI * 2;
      const radius = 30;
      beamGroup.position.x = Math.cos(angle) * radius;
      beamGroup.position.z = Math.sin(angle) * radius;
      
      const pointLight = new THREE.PointLight(
        new THREE.Color().setHSL(0.6 + i * 0.05, 0.8, 0.8),
        3,
        25,
        2
      );
      pointLight.position.y = 12;
      beamGroup.add(pointLight);
      
      beams.push(beamGroup);
    }
    
    return beams;
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    
    beamSystem.forEach((beam, index) => {
      const angle = (time * 0.2 + index * 0.5) % (Math.PI * 2);
      const radius = 30;
      
      beam.position.x = Math.cos(angle) * radius;
      beam.position.z = Math.sin(angle) * radius;
      
      beam.rotation.z = Math.sin(time * 0.5 + index) * 0.1;
      beam.rotation.y = Math.sin(time * 0.3 + index) * 0.05;
      
      beam.children.forEach(child => {
        if (child.material && child.material.opacity !== undefined) {
          const baseOpacity = child === beam.children[0] ? 0.4 : 0.2;
          child.material.opacity = baseOpacity + Math.sin(time * 2 + index) * 0.1;
        }
      });
      
      if (beam.children[2] && beam.children[2].intensity !== undefined) {
        beam.children[2].intensity = 3 + Math.sin(time * 1.5 + index) * 1;
      }
    });
  });

  return (
    <group ref={beamsRef}>
      {beamSystem.map((beam, index) => (
        <primitive key={index} object={beam} />
      ))}
    </group>
  );
};

export default LightBeams;
