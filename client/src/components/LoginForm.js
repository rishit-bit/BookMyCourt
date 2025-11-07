import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import styled from 'styled-components';
import { ThreeDInput, ThreeDButton } from './3D';
import { useAuth } from '../contexts/AuthContext';

const LoginForm = ({ onSubmit, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const { error: authError, clearError } = useAuth();

  // Clear form error when component mounts or unmounts
  useEffect(() => {
    setFormError('');
    return () => {
      if (clearError) {
        clearError();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // clearError is intentionally omitted to prevent infinite loops

  // Set form error when auth error changes
  useEffect(() => {
    if (authError) {
      setFormError(authError);
    }
  }, [authError]);

  const handleFormSubmit = async (data) => {
    console.log('Form submitted with data:', data);
    setFormError('');
    
    // Check if email and password are provided
    if (!data.email || !data.password) {
      setFormError('Please provide both email and password');
      return;
    }
    
    try {
      const result = await onSubmit(data.email, data.password);
      if (result.success) {
        // Form will be handled by parent component
      } else if (result.error) {
        setFormError(result.error);
        // Check for specific error messages
        if (result.error.toLowerCase().includes('email') && !result.error.toLowerCase().includes('password')) {
          setError('email', { type: 'manual', message: 'Invalid email' });
        } else if (result.error.toLowerCase().includes('password') && !result.error.toLowerCase().includes('email')) {
          setError('password', { type: 'manual', message: 'Invalid password' });
        } else if (result.error.toLowerCase().includes('email or password')) {
          // When both are mentioned, highlight both fields
          setError('email', { type: 'manual', message: 'Invalid credentials' });
          setError('password', { type: 'manual', message: 'Invalid credentials' });
        }
      }
    } catch (error) {
      console.error('Login submission error:', error);
      setFormError(error.message || 'An unexpected error occurred');
    }
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      <FormTitle>Welcome Back</FormTitle>
      <FormSubtitle>Please sign in to continue</FormSubtitle>

      {/* Email Field */}
      <FieldGroup>
        <FieldLabel>Email Address</FieldLabel>
        <ThreeDInput
          icon={Mail}
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Please enter a valid email address'
            }
          })}
        />
      </FieldGroup>

      {/* Password Field */}
      <FieldGroup>
        <FieldLabel>Password</FieldLabel>
        <PasswordInputContainer>
          <ThreeDInput
            icon={Lock}
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            error={errors.password?.message}
            style={{ paddingRight: '3.5rem' }}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters long'
              }
            })}
          />
          <PasswordToggle
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </PasswordToggle>
        </PasswordInputContainer>
      </FieldGroup>

      {/* Remember Me & Forgot Password */}
      <FormOptions>
        <RememberMe>
          <Checkbox type="checkbox" id="remember" />
          <CheckboxLabel htmlFor="remember">Stay signed</CheckboxLabel>
        </RememberMe>
        <ForgotPassword href="#">Forgot password?</ForgotPassword>
      </FormOptions>

      {/* Error Message */}
      {formError && (
        <ErrorContainer>
          <AlertCircle size={18} />
          <ErrorText>{formError}</ErrorText>
        </ErrorContainer>
      )}

      {/* Submit Button */}
      <ThreeDButton
        type="submit"
        disabled={isLoading}
        size="large"
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            Signing In...
          </>
        ) : (
          <>
            <LogIn size={20} />
            Sign In
          </>
        )}
      </ThreeDButton>

      {/* Demo Credentials */}
     
    </Form>
  );
};

// Styled Components
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
  class-name: login-form-container;
`;

const FormTitle = styled.h2`
  color: #FFFFFF;
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0;
  text-align: center;
  background: linear-gradient(135deg, #A855F7, #EC4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 8px rgba(0,0,0,0.3);
  transform: translateZ(10px);
`;

const FormSubtitle = styled.p`
  color: #A1A1AA;
  text-align: center;
  margin: 0;
  font-size: 1rem;
  opacity: 0.9;
  font-weight: 500;
  transform: translateZ(5px);
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transform: translateZ(8px);
`;

const FieldLabel = styled.label`
  color: #FFFFFF;
  font-size: 0.95rem;
  font-weight: 600;
  margin-left: 0.5rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
`;

const PasswordInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(236, 72, 153, 0.15));
  border: 1.5px solid rgba(168, 85, 247, 0.3);
  color: #A855F7;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
  transform: translateY(-50%) translateZ(8px);
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 2px 8px rgba(168, 85, 247, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  font-weight: 600;

  @media (max-width: 768px) {
    right: 0.5rem;
    padding: 0.35rem;
    min-width: 30px;
    height: 30px;
  }

  @media (max-width: 480px) {
    right: 0.4rem;
    padding: 0.3rem;
    min-width: 28px;
    height: 28px;
  }

  &:hover {
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(236, 72, 153, 0.25));
    border-color: rgba(168, 85, 247, 0.5);
    color: #EC4899;
    transform: translateY(-50%) scale(1.05) translateZ(10px);
    box-shadow: 
      0 4px 20px rgba(168, 85, 247, 0.4),
      0 0 0 2px rgba(168, 85, 247, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }

  &:active {
    transform: translateY(-50%) scale(0.95) translateZ(8px);
    box-shadow: 
      0 2px 10px rgba(168, 85, 247, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  &:focus {
    outline: none;
    box-shadow: 
      0 0 0 3px rgba(168, 85, 247, 0.3),
      0 4px 20px rgba(168, 85, 247, 0.4);
  }

  svg {
    transition: all 0.2s ease;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
  }

  &:hover svg {
    transform: scale(1.1);
    filter: drop-shadow(0 2px 4px rgba(168, 85, 247, 0.5));
  }
`;

const FormOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0;
  transform: translateZ(5px);

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
  }
`;

const RememberMe = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #A855F7;
  cursor: pointer;
  filter: drop-shadow(0 2px 4px rgba(168, 85, 247, 0.3));
`;

const CheckboxLabel = styled.label`
  color: #FFFFFF;
  font-size: 0.9rem;
  cursor: pointer;
  user-select: none;
  font-weight: 500;
`;

const ForgotPassword = styled.a`
  color: #A855F7;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;

  &:hover {
    color: #EC4899;
    text-decoration: underline;
    text-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
  }
`;



const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 12px;
  border-left: 4px solid #EF4444;
  color: #EF4444;
  transform: translateZ(5px);
  will-change: transform;
`;

const ErrorText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  font-weight: 500;
  color: #EF4444;
`;

const LoadingSpinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #FFFFFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default LoginForm;


