import React, { useState, useRef } from 'react';
import styled from 'styled-components';

const ThreeDCard = ({ children, className, depth = 20, perspective = 1000 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  const rotateX = isHovered ? mousePosition.y * -15 : 0;
  const rotateY = isHovered ? mousePosition.x * 15 : 0;
  const translateZ = isHovered ? depth : depth / 2;

  return (
    <CardContainer
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        '--rotate-x': `${rotateX}deg`,
        '--rotate-y': `${rotateY}deg`,
        '--translate-z': `${translateZ}px`,
        '--perspective': `${perspective}px`
      }}
    >
      {children}
    </CardContainer>
  );
};

const CardContainer = styled.div`
  position: relative;
  transform-style: preserve-3d;
  transform: 
    perspective(var(--perspective))
    rotateX(var(--rotate-x))
    rotateY(var(--rotate-y))
    translateZ(var(--translate-z));
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  will-change: transform;
  
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, 
      rgba(168, 85, 247, 0.3), 
      rgba(236, 72, 153, 0.3), 
      rgba(168, 85, 247, 0.3));
    border-radius: inherit;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

export default ThreeDCard;
