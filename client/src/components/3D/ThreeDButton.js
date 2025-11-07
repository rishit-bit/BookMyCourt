import React, { useState } from 'react';
import styled from 'styled-components';

const ThreeDButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  size = 'medium',
  className,
  ...props 
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <ButtonContainer
      className={className}
      $variant={variant}
      size={size}
      disabled={disabled}
      $isPressed={isPressed}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <ButtonContent>
        {children}
      </ButtonContent>
      <ButtonShadow />
    </ButtonContainer>
  );
};

const ButtonContainer = styled.button`
  position: relative;
  border: none;
  background: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  padding: 0;
  font-family: inherit;
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
  transform: ${props => props.$isPressed ? 'translate3d(0,2px,0)' : 'translate3d(0,0,0)'};
  -webkit-transform: ${props => props.$isPressed ? 'translate3d(0,2px,0)' : 'translate3d(0,0,0)'};
  transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
  perspective: 1000px;
  -webkit-perspective: 1000px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  
  &:hover:not(:disabled) {
    transform: translate3d(0,-2px,0);
    -webkit-transform: translate3d(0,-2px,0);
  }
  
  &:active:not(:disabled) {
    transform: translate3d(0,1px,0);
    -webkit-transform: translate3d(0,1px,0);
  }
`;

const ButtonContent = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  height: 100%;
  padding: ${props => {
    switch (props.size) {
      case 'small': return '0.75rem 1.5rem';
      case 'large': return '1.5rem 2rem';
      default: return '1.25rem 2rem';
    }
  }};
  background: ${props => {
    if (props.disabled) return 'rgba(156, 163, 175, 0.5)';
    switch (props.$variant) {
      case 'secondary': return 'linear-gradient(135deg, #6B7280, #9CA3AF)';
      case 'success': return 'linear-gradient(135deg, #10B981, #34D399)';
      case 'danger': return 'linear-gradient(135deg, #EF4444, #F87171)';
      default: return 'linear-gradient(135deg, #A855F7, #EC4899)';
    }
  }};
  color: #FFFFFF;
  border-radius: 16px;
  font-size: ${props => {
    switch (props.size) {
      case 'small': return '0.9rem';
      case 'large': return '1.2rem';
      default: return '1.1rem';
    }
  }};
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  box-shadow: 
    0 8px 30px rgba(0, 0, 0, 0.3),
    0 4px 15px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transform: translateZ(10px);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, box-shadow;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.1), 
      rgba(255, 255, 255, 0.05));
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    will-change: opacity;
  }
  
  &:hover:not(:disabled)::before {
    opacity: 1;
  }
  
  &:hover:not(:disabled) {
    box-shadow: 
      0 15px 40px rgba(0, 0, 0, 0.4),
      0 8px 25px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.25);
    transform: translateZ(15px);
  }
  
  &:active:not(:disabled) {
    box-shadow: 
      0 4px 15px rgba(0, 0, 0, 0.3),
      0 2px 8px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    transform: translateZ(5px);
  }
`;

const ButtonShadow = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  border-radius: inherit;
  transform: translateZ(-5px);
  filter: blur(8px);
  opacity: 0.6;
  pointer-events: none;
  will-change: transform, opacity;
`;

export default ThreeDButton;
