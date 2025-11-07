import React, { useState, forwardRef } from 'react';
import styled from 'styled-components';

const ThreeDInput = forwardRef(({ 
  icon: Icon,
  placeholder,
  type = 'text',
  error,
  success,
  disabled = false,
  className,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFocus = (e) => {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (props.onBlur) props.onBlur(e);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <InputContainer
      className={className}
    >
      <InputWrapper
        $isFocused={isFocused}
        $isHovered={isHovered}
        $hasError={!!error}
        $hasSuccess={!!success}
        disabled={disabled}
      >
        {Icon && (
          <InputIcon
            $isFocused={isFocused}
            $hasError={!!error}
            $hasSuccess={!!success}
          >
            <Icon size={20} />
          </InputIcon>
        )}
        
        <StyledInput
          ref={ref}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          $hasIcon={!!Icon}
          {...props}
        />
        
        <InputGlow />
      </InputWrapper>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
    </InputContainer>
  );
});

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transform: translateZ(8px);
  will-change: transform;
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: translate3d(0,0,8px);
  -webkit-transform: translate3d(0,0,8px);
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  transform: translateZ(5px);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
  width: 100%;
  
  ${props => props.$isFocused && `
    transform: translateZ(8px) translateY(-2px);
  `}
  
  ${props => props.$isHovered && !props.$isFocused && `
    transform: translateZ(6px) translateY(-1px);
  `}
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%) translateZ(2px);
  color: ${props => {
    if (props.$hasError) return '#EF4444';
    if (props.$hasSuccess) return '#10B981';
    if (props.$isFocused) return '#A855F7';
    return '#A1A1AA';
  }};
  z-index: 2;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 1.25rem 1.25rem 1.25rem ${props => props.$hasIcon ? '3.5rem' : '1.25rem'};
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid ${props => {
    if (props.disabled) return 'rgba(156, 163, 175, 0.3)';
    if (props.$hasError) return '#EF4444';
    if (props.$hasSuccess) return '#10B981';
    if (props.$isFocused) return '#A855F7';
    return 'rgba(168, 85, 247, 0.2)';
  }};
  border-radius: 16px;
  color: ${props => props.disabled ? 'rgba(156, 163, 175, 0.7)' : '#FFFFFF'};
  font-size: 1rem;
  font-weight: 500;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
              border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
              box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
              background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transform: translateZ(3px);
  will-change: transform, box-shadow, border-color, background-color;

  &::placeholder {
    color: ${props => props.disabled ? 'rgba(156, 163, 175, 0.5)' : 'rgba(255, 255, 255, 0.5)'};
    font-weight: 400;
  }

  &:focus {
    outline: none;
    border-color: #A855F7;
    box-shadow: 
      0 0 0 4px rgba(168, 85, 247, 0.15),
      0 8px 30px rgba(168, 85, 247, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.12);
  }

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.12);
    border-color: ${props => {
      if (props.$hasError) return '#F87171';
      if (props.$hasSuccess) return '#34D399';
      return 'rgba(168, 85, 247, 0.4)';
    }};
    box-shadow: 
      0 6px 25px rgba(0, 0, 0, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.12);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const InputGlow = styled.div`
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, 
    rgba(168, 85, 247, 0.3), 
    rgba(236, 72, 153, 0.3));
  border-radius: inherit;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
  filter: blur(8px);
  pointer-events: none;
  will-change: opacity;
  
  ${props => props.$isFocused && `
    opacity: 0.6;
  `}
`;

const ErrorMessage = styled.span`
  color: #EF4444;
  font-size: 0.85rem;
  margin-left: 0.5rem;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  transform: translateZ(3px);
`;

const SuccessMessage = styled.span`
  color: #10B981;
  font-size: 0.85rem;
  margin-left: 0.5rem;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  transform: translateZ(3px);
`;

ThreeDInput.displayName = 'ThreeDInput';

export default ThreeDInput;
