import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled, { keyframes } from 'styled-components';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import Logo from './Logo';
import { ThreeDToggle } from './3D';

const AuthPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    setIsLoading(true);
    try {
      const result = await login(email, password);
      setIsLoading(false);
      if (result.success) {
        // Small delay to ensure auth context is updated
        setTimeout(() => {
          const user = JSON.parse(localStorage.getItem('bookmycourt_user') || '{}');
          
          // Redirect admin users directly to admin panel
          if (user?.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        }, 100);
      } else if (result.needsVerification) {
        navigate('/verify-otp', { state: { email } });
      }
      return result;
    } catch (error) {
      console.error('Login error in page component:', error);
      setIsLoading(false);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  };

  const handleSignup = async (userData) => {
    setIsLoading(true);
    try {
      const result = await signup(userData);
      setIsLoading(false);
      if (result.success) {
        if (result.needsVerification) {
          navigate('/verify-otp', { state: { email: userData.email } });
        } else {
          setTimeout(() => {
            navigate('/dashboard');
          }, 100);
        }
      }
      return result;
    } catch (error) {
      console.error('Signup error in page component:', error);
      setIsLoading(false);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  };

  const toggleOptions = [
    { value: true, label: 'Sign In' },
    { value: false, label: 'Create Account' }
  ];

  return (
    <PageContainer>
      <Background />
      <FloatingElements />

      <UIOverlay>
        <HeaderSection>
          <LogoContainer>
            <Logo size="large" />
          </LogoContainer>
          <Tagline>Smart court booking system for teams.</Tagline>
        </HeaderSection>

        <FormContainer>
          <ToggleWrapper>
            <ThreeDToggle
              options={toggleOptions}
              value={isLoginMode}
              onChange={setIsLoginMode}
              size="medium"
            />
          </ToggleWrapper>

          <FormWrapper $isLoginMode={isLoginMode} key={isLoginMode ? 'login' : 'signup'}>
            <FormContent>
              {isLoginMode ? (
                <LoginForm onSubmit={handleLogin} isLoading={isLoading} key="login-form" />
              ) : (
                <SignupForm onSubmit={handleSignup} isLoading={isLoading} key="signup-form" />
              )}
            </FormContent>
          </FormWrapper>
        </FormContainer>

        <FooterSection>
          <FooterText>© BookMyCourt</FooterText>
          <BackToHome onClick={() => navigate('/')}>← Back to Home</BackToHome>
        </FooterSection>
      </UIOverlay>

      {isLoading && (
        <LoadingOverlay>
          <LoadingSpinner />
          <LoadingText>Loading...</LoadingText>
        </LoadingOverlay>
      )}
    </PageContainer>
  );
};

const PageContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0B0E23 0%, #1A1B3D 25%, #2D1B69 50%, #1A1B3D 75%, #0B0E23 100%);
  perspective: 1000px;
  -webkit-perspective: 1000px;
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
  transform: translate3d(0,0,0);
  -webkit-transform: translate3d(0,0,0);
  will-change: transform;
`;

const Background = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(circle at 20% 20%, rgba(55, 48, 163, 0.15) 0, transparent 40%),
    radial-gradient(circle at 80% 10%, rgba(79, 70, 229, 0.12) 0, transparent 35%),
    radial-gradient(circle at 10% 80%, rgba(37, 99, 235, 0.1) 0, transparent 35%),
    linear-gradient(135deg, rgba(255,255,255,0.02), rgba(0,0,0,0.01));
  pointer-events: none;
`;

const FloatingElements = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(45deg, rgba(79, 70, 229, 0.1), rgba(37, 99, 235, 0.1));
    animation: float 20s ease-in-out infinite;
    will-change: transform;
  }
  
  &::before {
    width: 300px;
    height: 300px;
    top: 10%;
    left: 5%;
    animation-delay: 0s;
  }
  
  &::after {
    width: 200px;
    height: 200px;
    top: 60%;
    right: 10%;
    animation-delay: -10s;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
`;

const UIOverlay = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
  transform: translate3d(0,0,0);
  -webkit-transform: translate3d(0,0,0);
  will-change: transform;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const HeaderSection = styled.div`
  text-align: center;
  transform: translateZ(20px);
  will-change: transform;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  margin-bottom: 0.5rem;
`;

const Tagline = styled.p`
  font-size: 1.1rem;
  color: #A1A1AA;
  margin: 0;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  flex: 1;
  margin: 3rem 0;
  transform: translateZ(30px);
  will-change: transform;
  perspective: 1500px;
  -webkit-perspective: 1500px;
  width: 100%;
  padding: 0 1rem;
  
  @media (max-width: 768px) {
    gap: 1.5rem;
    margin: 2rem 0;
    padding: 0 0.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 1.25rem;
    margin: 1.5rem 0;
    padding: 0 0.25rem;
  }
  
  @media (max-width: 420px) and (min-width: 380px) {
    gap: 1.5rem;
    margin: 1.5rem 0;
    padding: 0 1rem;
    align-items: center;
    justify-content: center;
  }
  
  @media (max-width: 400px) {
    gap: 1rem;
    margin: 1rem 0;
    padding: 0 0.125rem;
  }
  
  @media (max-width: 320px) {
    gap: 0.75rem;
    margin: 0.75rem 0;
    padding: 0;
  }
`;

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  
  @media (max-width: 420px) and (min-width: 380px) {
    padding: 0 0.5rem;
    margin: 0 auto;
  }
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 480px;
  background: rgba(17, 24, 39, 0.7);
  border: 1px solid rgba(79, 70, 229, 0.2);
  border-radius: 20px;
  padding: clamp(2rem, 3vw + 1.5rem, 3rem);
  box-shadow: 
    0 25px 50px rgba(0,0,0,0.4),
    0 0 0 1px rgba(79, 70, 229, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transform: translateZ(20px) rotateX(5deg);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, box-shadow;
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
  animation: ${props => props.$isLoginMode ? 'rotateToLogin' : 'rotateToSignup'} 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;

  &:hover {
    box-shadow: 
      0 35px 70px rgba(0,0,0,0.5),
      0 0 0 1px rgba(79, 70, 229, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }

  @media (max-width: 768px) {
    max-width: 95vw;
    transform: translateZ(15px) rotateX(3deg);
  }
  
  @media (max-width: 480px) {
    max-width: 100%;
    border-radius: 16px;
    padding: 1.5rem;
    transform: translateZ(15px) rotateX(0deg);
  }

  @keyframes rotateToLogin {
    0% { transform: translateZ(20px) rotateY(-120deg); opacity: 0; }
    100% { transform: translateZ(20px) rotateY(0deg); opacity: 1; }
  }

  @keyframes rotateToSignup {
    0% { transform: translateZ(20px) rotateY(120deg); opacity: 0; }
    100% { transform: translateZ(20px) rotateY(0deg); opacity: 1; }
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const FormContent = styled.div`
  animation: ${fadeIn} 0.4s ease-out forwards;
  animation-delay: 0.35s;
  opacity: 0;
  width: 100%;
`;

const FooterSection = styled.div`
  text-align: center;
  transform: translateZ(10px);
  will-change: transform;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const FooterText = styled.p`
  color: #A1A1AA;
  opacity: 0.8;
  margin: 0;
  font-size: 0.9rem;
  font-weight: 500;
`;

const BackToHome = styled.button`
  background: none;
  border: 1px solid rgba(79, 70, 229, 0.3);
  color: #4F46E5;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(79, 70, 229, 0.1);
    border-color: rgba(79, 70, 229, 0.5);
    transform: translateY(-2px);
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(11, 14, 35, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(79, 70, 229, 0.2);
  border-top: 4px solid #4F46E5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  box-shadow: 0 0 20px rgba(79, 70, 229, 0.3);
  will-change: transform;

  @keyframes spin { 
    0% { transform: rotate(0deg); } 
    100% { transform: rotate(360deg); } 
  }
`;

const LoadingText = styled.p`
  color: #4F46E5;
  margin-top: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(79, 70, 229, 0.5);
`;

export default AuthPage;
