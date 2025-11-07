import React from 'react';
import styled from 'styled-components';

const ThreeDToggle = ({ 
  options = [], 
  value, 
  onChange, 
  className,
  size = 'medium',
  variant = 'primary'
}) => {
  const handleOptionClick = (optionValue) => {
    if (onChange) {
      onChange(optionValue);
    }
  };

  return (
    <ToggleContainer
      className={className}
      size={size}
      $variant={variant}
    >
      {options.map((option, index) => (
        <ToggleOption
          key={option.value}
          $isActive={value === option.value}
          size={size}
          $variant={variant}
          onClick={() => handleOptionClick(option.value)}
        >
          {option.label}
        </ToggleOption>
      ))}
    </ToggleContainer>
  );
};

const ToggleContainer = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 999px;
  padding: ${props => {
    switch (props.size) {
      case 'small': return '0.35rem';
      case 'large': return '0.75rem';
      default: return '0.5rem';
    }
  }};
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transform: translateZ(10px);
  gap: 0.25rem;
  will-change: transform;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    max-width: 350px;
    padding: ${props => {
      switch (props.size) {
        case 'small': return '0.3rem';
        case 'large': return '0.6rem';
        default: return '0.4rem';
      }
    }};
    gap: 0.2rem;
  }
  
  @media (max-width: 480px) {
    max-width: 320px;
    padding: ${props => {
      switch (props.size) {
        case 'small': return '0.25rem';
        case 'large': return '0.5rem';
        default: return '0.35rem';
      }
    }};
    gap: 0.15rem;
  }
  
  @media (max-width: 420px) and (min-width: 380px) {
    max-width: 320px;
    padding: ${props => {
      switch (props.size) {
        case 'small': return '0.3rem';
        case 'large': return '0.5rem';
        default: return '0.4rem';
      }
    }};
    gap: 0.15rem;
    margin: 0 auto;
    width: 90%;
  }
  
  @media (max-width: 400px) {
    max-width: 280px;
    padding: ${props => {
      switch (props.size) {
        case 'small': return '0.2rem';
        case 'large': return '0.4rem';
        default: return '0.3rem';
      }
    }};
    gap: 0.1rem;
  }
  
  @media (max-width: 320px) {
    max-width: 260px;
    padding: ${props => {
      switch (props.size) {
        case 'small': return '0.15rem';
        case 'large': return '0.35rem';
        default: return '0.25rem';
      }
    }};
    gap: 0.05rem;
  }
`;

const ToggleOption = styled.button`
  background: transparent;
  color: ${props => props.$isActive ? '#0B0E23' : '#E5E7EB'};
  border: none;
  padding: ${props => {
    switch (props.size) {
      case 'small': return '0.5rem 1rem';
      case 'large': return '1rem 2rem';
      default: return '0.8rem 1.5rem';
    }
  }};
  border-radius: 999px;
  font-size: ${props => {
    switch (props.size) {
      case 'small': return '0.85rem';
      case 'large': return '1.1rem';
      default: return '1rem';
    }
  }};
  font-weight: 600;
  cursor: pointer;
  position: relative;
  isolation: isolate;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateZ(5px);
  white-space: nowrap;
  will-change: transform, box-shadow;
  flex: 1;
  min-width: 0;
  
  @media (max-width: 768px) {
    padding: ${props => {
      switch (props.size) {
        case 'small': return '0.4rem 0.8rem';
        case 'large': return '0.8rem 1.6rem';
        default: return '0.6rem 1.2rem';
      }
    }};
    font-size: ${props => {
      switch (props.size) {
        case 'small': return '0.8rem';
        case 'large': return '1rem';
        default: return '0.9rem';
      }
    }};
  }
  
  @media (max-width: 480px) {
    padding: ${props => {
      switch (props.size) {
        case 'small': return '0.35rem 0.7rem';
        case 'large': return '0.7rem 1.4rem';
        default: return '0.5rem 1rem';
      }
    }};
    font-size: ${props => {
      switch (props.size) {
        case 'small': return '0.75rem';
        case 'large': return '0.95rem';
        default: return '0.85rem';
      }
    }};
  }
  
  @media (max-width: 420px) and (min-width: 380px) {
    padding: ${props => {
      switch (props.size) {
        case 'small': return '0.4rem 0.8rem';
        case 'large': return '0.8rem 1.6rem';
        default: return '0.6rem 1.2rem';
      }
    }};
    font-size: ${props => {
      switch (props.size) {
        case 'small': return '0.8rem';
        case 'large': return '1rem';
        default: return '0.9rem';
      }
    }};
    min-width: 0;
    flex: 1;
    text-align: center;
  }
  
  @media (max-width: 400px) {
    padding: ${props => {
      switch (props.size) {
        case 'small': return '0.3rem 0.6rem';
        case 'large': return '0.6rem 1.2rem';
        default: return '0.4rem 0.8rem';
      }
    }};
    font-size: ${props => {
      switch (props.size) {
        case 'small': return '0.7rem';
        case 'large': return '0.9rem';
        default: return '0.8rem';
      }
    }};
  }
  
  @media (max-width: 320px) {
    padding: ${props => {
      switch (props.size) {
        case 'small': return '0.25rem 0.5rem';
        case 'large': return '0.5rem 1rem';
        default: return '0.35rem 0.7rem';
      }
    }};
    font-size: ${props => {
      switch (props.size) {
        case 'small': return '0.65rem';
        case 'large': return '0.85rem';
        default: return '0.75rem';
      }
    }};
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: ${props => props.$isActive 
      ? 'linear-gradient(135deg, #4F46E5, #2563EB)' 
      : 'transparent'};
    opacity: ${props => props.$isActive ? 1 : 0};
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: -1;
    box-shadow: ${props => props.$isActive 
      ? '0 4px 20px rgba(79, 70, 229, 0.4)' 
      : 'none'};
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, 
      rgba(79, 70, 229, 0.3), 
      rgba(37, 99, 235, 0.3));
    border-radius: inherit;
    z-index: -2;
    opacity: 0;
    transition: opacity 0.3s ease;
    filter: blur(8px);
    pointer-events: none;
  }

  &:hover {
    transform: translateZ(8px) translateY(-2px);
    box-shadow: ${props => !props.$isActive 
      ? '0 8px 25px rgba(79, 70, 229, 0.2)' 
      : '0 8px 25px rgba(79, 70, 229, 0.5)'};
    
    &::after {
      opacity: 0.4;
    }
  }

  &:active {
    transform: translateZ(3px) translateY(0);
  }
`;

export default ThreeDToggle;
