import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const HolographicIcons = () => {
  const iconsRef = useRef();

  const holographicIcons = useMemo(() => {
    const icons = [];
    const sportsData = [
      { emoji: '🏏', name: 'Cricket', color: '#00d4ff' },
      { emoji: '⚽', name: 'Football', color: '#00ff88' },
      { emoji: '🏀', name: 'Basketball', color: '#ff6b35' },
      { emoji: '🎾', name: 'Tennis', color: '#ffd700' },
      { emoji: '🏸', name: 'Badminton', color: '#ff69b4' },
      { emoji: '🏐', name: 'Volleyball', color: '#32cd32' },
      { emoji: '🏒', name: 'Hockey', color: '#ff4500' },
      { emoji: '🏓', name: 'Table Tennis', color: '#ff1493' }
    ];

    sportsData.forEach((sport, index) => {
      const iconGroup = new THREE.Group();
      
      const iconGeometry = new THREE.PlaneGeometry(2, 2);
      const iconMaterial = new THREE.MeshBasicMaterial({
        color: sport.color,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });
      
      const icon = new THREE.Mesh(iconGeometry, iconMaterial);
      iconGroup.add(icon);
      
      const glowGeometry = new THREE.PlaneGeometry(3, 3);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: sport.color,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.z = -0.1;
      iconGroup.add(glow);
      
      for (let ring = 0; ring < 3; ring++) {
        const ringGeometry = new THREE.RingGeometry(1.5 + ring * 0.5, 1.6 + ring * 0.5, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: sport.color,
          transparent: true,
          opacity: 0.2 - ring * 0.05,
          side: THREE.DoubleSide
        });
        
        const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.z = ring * 0.1;
        iconGroup.add(ringMesh);
      }
      
      const textGeometry = new THREE.PlaneGeometry(4, 1);
      const textMaterial = new THREE.MeshBasicMaterial({
        color: sport.color,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      });
      
      const text = new THREE.Mesh(textGeometry, textMaterial);
      text.position.y = -2;
      iconGroup.add(text);
      
      const angle = (index / sportsData.length) * Math.PI * 2;
      const radius = 40;
      iconGroup.position.x = Math.cos(angle) * radius;
      iconGroup.position.z = Math.sin(angle) * radius;
      iconGroup.position.y = 15 + Math.sin(angle) * 5;
      
      iconGroup.userData = {
        initialPosition: iconGroup.position.clone(),
        initialRotation: iconGroup.rotation.clone(),
        sport: sport
      };
      
      icons.push(iconGroup);
    });
    
    return icons;
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    
    holographicIcons.forEach((icon, index) => {
      const userData = icon.userData;
      
      icon.position.y = userData.initialPosition.y + Math.sin(time * 0.5 + index) * 2;
      
      icon.rotation.y = time * 0.3 + index * 0.5;
      icon.rotation.z = Math.sin(time * 0.2 + index) * 0.1;
      
      icon.children.forEach((child, childIndex) => {
        if (child.material && child.material.opacity !== undefined) {
          const baseOpacity = childIndex === 0 ? 0.8 : 
                             childIndex === 1 ? 0.3 : 
                             childIndex === 2 ? 0.2 : 0.6;
          
          const flicker = Math.sin(time * 3 + index + childIndex) * 0.1;
          child.material.opacity = Math.max(0, baseOpacity + flicker);
        }
      });
      
      const orbitRadius = 40;
      const orbitSpeed = 0.1;
      const orbitAngle = time * orbitSpeed + index * 0.5;
      
      icon.position.x = Math.cos(orbitAngle) * orbitRadius;
      icon.position.z = Math.sin(orbitAngle) * orbitRadius;
      
      userData.initialPosition.x = icon.position.x;
      userData.initialPosition.z = icon.position.z;
    });
  });

  return (
    <group ref={iconsRef}>
      {holographicIcons.map((icon, index) => (
        <primitive key={index} object={icon} />
      ))}
    </group>
  );
};

export default HolographicIcons;


