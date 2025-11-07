import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar, Users } from 'lucide-react';
import styled from 'styled-components';
import { ThreeDInput, ThreeDButton } from './3D';

const SignupForm = ({ onSubmit, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const password = watch('password');

  const handleFormSubmit = async (data) => {
    console.log('Signup form submitted with data:', data);
    
    // Check if required fields are provided
    if (!data.firstName || !data.lastName || !data.email || !data.password) {
      console.error('Missing required fields');
      return;
    }
    
    const result = await onSubmit(data);
    if (result.success) {
      // Form will be handled by parent component
    }
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      <FormTitle>Create Your Account</FormTitle>
      <FormSubtitle>Start booking courts in minutes</FormSubtitle>

      {/* First Name & Last Name */}
      <NameRow>
        <FieldGroup>
          <FieldLabel>First Name</FieldLabel>
          <ThreeDInput
            icon={User}
            type="text"
            placeholder="First name"
            error={errors.firstName?.message}
            {...register('firstName', {
              required: 'First name is required',
              minLength: {
                value: 2,
                message: 'First name must be at least 2 characters'
              }
            })}
          />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>Last Name</FieldLabel>
          <ThreeDInput
            type="text"
            placeholder="Last name"
            error={errors.lastName?.message}
            {...register('lastName', {
              required: 'Last name is required',
              minLength: {
                value: 2,
                message: 'Last name must be at least 2 characters'
              }
            })}
          />
        </FieldGroup>
      </NameRow>

      {/* Username */}
      <FieldGroup>
        <FieldLabel>Username</FieldLabel>
        <ThreeDInput
          icon={Users}
          type="text"
          placeholder="Choose a unique username"
          error={errors.username?.message}
                  {...register('username', {
          required: 'Username is required',
          minLength: {
            value: 3,
            message: 'Username must be at least 3 characters'
          },
          maxLength: {
            value: 20,
            message: 'Username cannot exceed 20 characters'
          },
          pattern: {
            value: /^[a-zA-Z0-9_]+$/,
            message: 'Username can only contain letters, numbers, and underscores'
          }
        })}
        />
      </FieldGroup>

      {/* Email */}
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

      {/* Phone */}
      <FieldGroup>
        <FieldLabel>Phone Number</FieldLabel>
        <ThreeDInput
          icon={Phone}
          type="tel"
          placeholder="Enter your phone number"
          error={errors.phone?.message}
          {...register('phone', {
            pattern: {
              value: /^[+]?[1-9][\d]{0,15}$/,
              message: 'Please enter a valid phone number'
            }
          })}
        />
      </FieldGroup>

      {/* Date of Birth */}
      <FieldGroup>
        <FieldLabel>Date of Birth</FieldLabel>
        <ThreeDInput
          icon={Calendar}
          type="date"
          error={errors.dateOfBirth?.message}
          {...register('dateOfBirth', {
            validate: (value) => {
              if (!value) return true; // Optional field
              const today = new Date();
              const birthDate = new Date(value);
              const age = today.getFullYear() - birthDate.getFullYear();
              if (age < 13) return 'You must be at least 13 years old';
              if (age > 100) return 'Please enter a valid date of birth';
              return true;
            }
          })}
        />
      </FieldGroup>

      {/* Password */}
      <FieldGroup>
        <FieldLabel>Password</FieldLabel>
        <PasswordInputContainer>
          <ThreeDInput
            icon={Lock}
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            error={errors.password?.message}
            style={{ paddingRight: '3.5rem' }}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters long'
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                message: 'Password must contain uppercase, lowercase, number, and special character'
              }
            })}
          />
          <PasswordToggle
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff size={18} style={{ transform: 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
            ) : (
              <Eye size={18} style={{ transform: 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
            )}
          </PasswordToggle>
        </PasswordInputContainer>
        <PasswordStrength>
          <StrengthBar strength={password?.length || 0} />
          <StrengthText>
            {password?.length < 8 && 'Too short'}
            {password?.length >= 8 && password?.length < 12 && 'Good'}
            {password?.length >= 12 && 'Strong'}
          </StrengthText>
        </PasswordStrength>
      </FieldGroup>

      {/* Confirm Password */}
      <FieldGroup>
        <FieldLabel>Confirm Password</FieldLabel>
        <PasswordInputContainer>
          <ThreeDInput
            icon={Lock}
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            error={errors.confirmPassword?.message}
            style={{ paddingRight: '3.5rem' }}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match'
            })}
          />
          <PasswordToggle
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? (
              <EyeOff size={18} style={{ transform: 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
            ) : (
              <Eye size={18} style={{ transform: 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
            )}
          </PasswordToggle>
        </PasswordInputContainer>
      </FieldGroup>

      {/* Terms and Conditions */}
      <TermsContainer>
        <TermsCheckbox
          type="checkbox"
          id="terms"
          {...register('terms', {
            required: 'You must accept the terms and conditions'
          })}
        />
        <TermsLabel htmlFor="terms">
          I agree to the{' '}
          <TermsLink href="#" target="_blank">Terms of Service</TermsLink>
          {' '}and{' '}
          <TermsLink href="#" target="_blank">Privacy Policy</TermsLink>
        </TermsLabel>
      </TermsContainer>
      {errors.terms && <ErrorMessage>{errors.terms.message}</ErrorMessage>}

      {/* Submit Button */}
      <ThreeDButton
        type="submit"
        disabled={isLoading}
        size="large"
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            Creating Account...
          </>
        ) : (
          <>
            <Users size={20} />
            Join The Game
          </>
        )}
      </ThreeDButton>

      {/* Email Verification Note */}
      <VerificationNote>
        <Mail size={16} />
        After registration, you'll receive a verification email to activate your account
      </VerificationNote>
    </Form>
  );
};

// Styled Components
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
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

const NameRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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

const ErrorMessage = styled.span`
  color: #EF4444;
  font-size: 0.85rem;
  margin-left: 0.5rem;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
`;

const PasswordStrength = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
  transform: translateZ(3px);
`;

const StrengthBar = styled.div`
  width: 80px;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => Math.min((props.strength / 12) * 100, 100)}%;
    background: ${props => {
      if (props.strength < 8) return '#EF4444';
      if (props.strength < 12) return '#F59E0B';
      return '#10B981';
    }};
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 0 10px ${props => {
      if (props.strength < 8) return 'rgba(239, 68, 68, 0.5)';
      if (props.strength < 12) return 'rgba(245, 158, 11, 0.5)';
      return 'rgba(16, 185, 129, 0.5)';
    }};
  }
`;

const StrengthText = styled.span`
  color: #FFFFFF;
  font-size: 0.8rem;
  opacity: 0.8;
  font-weight: 500;
`;

const TermsContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin: 0.5rem 0;
  transform: translateZ(5px);
`;

const TermsCheckbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #A855F7;
  cursor: pointer;
  margin-top: 0.25rem;
  filter: drop-shadow(0 2px 4px rgba(168, 85, 247, 0.3));
`;

const TermsLabel = styled.label`
  color: #FFFFFF;
  font-size: 0.9rem;
  cursor: pointer;
  user-select: none;
  font-weight: 500;
  line-height: 1.4;
`;

const TermsLink = styled.a`
  color: #A855F7;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;

  &:hover {
    color: #EC4899;
    text-decoration: underline;
    text-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
  }
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

const VerificationNote = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #A1A1AA;
  font-size: 0.9rem;
  text-align: center;
  padding: 1rem;
  background: rgba(168, 85, 247, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 12px;
  transform: translateZ(5px);
  
  svg {
    color: #A855F7;
    flex-shrink: 0;
  }
`;

export default SignupForm;
