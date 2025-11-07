import React from 'react';
import styled from 'styled-components';
import logoImage from '../logo/logo.png';

const Logo = ({ size = 'medium', showText = true, className = '' }) => {
  return (
    <LogoContainer className={className} size={size}>
      <LogoImage 
        src={logoImage} 
        alt="Book My Court Logo" 
        size={size}
      />
      {showText && (
        <LogoText size={size}>
          <LogoLine>BOOK</LogoLine>
          <LogoLine>MY COURT</LogoLine>
        </LogoText>
      )}
    </LogoContainer>
  );
};

// Styled Components
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => {
    switch (props.size) {
      case 'small': return '0.5rem';
      case 'large': return '1rem';
      default: return '0.8rem';
    }
  }};
  font-weight: 700;
`;

const LogoImage = styled.img`
  width: ${props => {
    switch (props.size) {
      case 'small': return '32px';
      case 'large': return '80px';
      default: return '48px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'small': return '32px';
      case 'large': return '80px';
      default: return '48px';
    }
  }};
  object-fit: contain;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  font-size: ${props => {
    switch (props.size) {
      case 'small': return '0.9rem';
      case 'large': return '2rem';
      default: return '1.2rem';
    }
  }};
  font-weight: 700;
  letter-spacing: -0.5px;
  color: #14b8a6;
  line-height: 1;
`;

const LogoLine = styled.span`
  display: block;
  font-weight: 700;
  text-transform: uppercase;
`;

export default Logo;
