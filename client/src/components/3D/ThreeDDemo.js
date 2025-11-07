import React, { useState } from 'react';
import styled from 'styled-components';
import { Mail, Lock, User, Phone, LogIn, Plus } from 'lucide-react';
import { ThreeDCard, ThreeDButton, ThreeDInput, ThreeDToggle } from './index';

const ThreeDDemo = () => {
  const [toggleValue, setToggleValue] = useState('option1');
  const [inputValue, setInputValue] = useState('');

  const toggleOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];

  return (
    <DemoContainer>
      <DemoTitle>3D Components Showcase</DemoTitle>
      <DemoSubtitle>Experience the power of CSS-based 3D effects</DemoSubtitle>

      <ComponentsGrid>
        {/* ThreeDCard Demo */}
        <DemoSection>
          <SectionTitle>ThreeDCard</SectionTitle>
          <ThreeDCard depth={25}>
            <CardContent>
              <h3>Interactive 3D Card</h3>
              <p>Move your mouse over this card to see the 3D effect!</p>
              <p>This card responds to mouse movement with realistic depth.</p>
            </CardContent>
          </ThreeDCard>
        </DemoSection>

        {/* ThreeDButton Demo */}
        <DemoSection>
          <SectionTitle>ThreeDButton</SectionTitle>
          <ButtonGrid>
            <ThreeDButton variant="primary" size="medium">
              <LogIn size={18} />
              Primary Button
            </ThreeDButton>
            
            <ThreeDButton variant="secondary" size="medium">
              Secondary
            </ThreeDButton>
            
            <ThreeDButton variant="success" size="medium">
              Success
            </ThreeDButton>
            
            <ThreeDButton variant="danger" size="medium">
              Danger
            </ThreeDButton>
          </ButtonGrid>
          
          <ButtonGrid>
            <ThreeDButton size="small">Small</ThreeDButton>
            <ThreeDButton size="medium">Medium</ThreeDButton>
            <ThreeDButton size="large">Large</ThreeDButton>
          </ButtonGrid>
        </DemoSection>

        {/* ThreeDInput Demo */}
        <DemoSection>
          <SectionTitle>ThreeDInput</SectionTitle>
          <InputGrid>
            <ThreeDInput
              icon={Mail}
              placeholder="Email address"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            
            <ThreeDInput
              icon={Lock}
              type="password"
              placeholder="Password"
            />
            
            <ThreeDInput
              icon={User}
              placeholder="Username"
              error="Username is required"
            />
            
            <ThreeDInput
              icon={Phone}
              placeholder="Phone number"
              success="Phone number is valid"
            />
          </InputGrid>
        </DemoSection>

        {/* ThreeDToggle Demo */}
        <DemoSection>
          <SectionTitle>ThreeDToggle</SectionTitle>
          <ToggleContainer>
            <ThreeDToggle
              options={toggleOptions}
              value={toggleValue}
              onChange={setToggleValue}
              size="medium"
            />
            <ToggleValue>Selected: {toggleValue}</ToggleValue>
          </ToggleContainer>
        </DemoSection>

        {/* Interactive Demo */}
        <DemoSection>
          <SectionTitle>Interactive Demo</SectionTitle>
          <ThreeDCard depth={30}>
            <InteractiveContent>
              <h3>Try It Out!</h3>
              <p>This card has enhanced depth. Move your mouse around!</p>
              <ThreeDButton variant="primary" size="large">
                <Plus size={20} />
                Interactive Button
              </ThreeDButton>
            </InteractiveContent>
          </ThreeDCard>
        </DemoSection>
      </ComponentsGrid>
    </DemoContainer>
  );
};

// Styled Components
const DemoContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0B0E23 0%, #1A1B3D 25%, #2D1B69 50%, #1A1B3D 75%, #0B0E23 100%);
  padding: 2rem;
  color: white;
`;

const DemoTitle = styled.h1`
  text-align: center;
  font-size: 3rem;
  font-weight: 900;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, #A855F7, #EC4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 8px rgba(0,0,0,0.3);
`;

const DemoSubtitle = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #A1A1AA;
  margin: 0 0 3rem 0;
  font-weight: 500;
`;

const ComponentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const DemoSection = styled.div`
  background: rgba(17, 24, 39, 0.7);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 25px 50px rgba(0,0,0,0.4);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  color: #A855F7;
  text-align: center;
`;

const CardContent = styled.div`
  text-align: center;
  
  h3 {
    margin: 0 0 1rem 0;
    color: #FFFFFF;
    font-size: 1.3rem;
  }
  
  p {
    margin: 0.5rem 0;
    color: #A1A1AA;
    line-height: 1.5;
  }
`;

const ButtonGrid = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const InputGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ToggleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const ToggleValue = styled.div`
  color: #A855F7;
  font-weight: 600;
  font-size: 0.9rem;
`;

const InteractiveContent = styled.div`
  text-align: center;
  
  h3 {
    margin: 0 0 1rem 0;
    color: #FFFFFF;
    font-size: 1.3rem;
  }
  
  p {
    margin: 0 0 1.5rem 0;
    color: #A1A1AA;
    line-height: 1.5;
  }
`;

export default ThreeDDemo;
