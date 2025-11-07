import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './EmailVerification.css';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [showResendForm, setShowResendForm] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  const verifyEmail = useCallback(async (token) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationStatus('success');
        setMessage(data.message);
            setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setVerificationStatus('error');
        setMessage(data.message || 'Verification failed. Please try again.');
      }
    } catch (error) {
      setVerificationStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    }
  }, [navigate]);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      verifyEmail(token);
    } else {
      setVerificationStatus('no-token');
      setMessage('No verification token found. Please check your email for the verification link.');
    }
  }, [searchParams, verifyEmail]);

  const handleResendVerification = async (e) => {
    e.preventDefault();
    setResendStatus('sending');

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setResendStatus('success');
        setMessage(data.message);
        setShowResendForm(false);
      } else {
        setResendStatus('error');
        setMessage(data.message || 'Failed to resend verification email.');
      }
    } catch (error) {
      setResendStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <div className="verification-loading">
            <div className="spinner"></div>
            <h2>Verifying your email...</h2>
            <p>Please wait while we verify your email address.</p>
          </div>
        );

      case 'success':
        return (
          <div className="verification-success">
            <div className="success-icon">✓</div>
            <h2>Email Verified Successfully! 🎉</h2>
            <p>{message}</p>
            <p>Redirecting you to login page...</p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </button>
          </div>
        );

      case 'error':
        return (
          <div className="verification-error">
            <div className="error-icon">✗</div>
            <h2>Verification Failed</h2>
            <p>{message}</p>
            <div className="verification-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowResendForm(true)}
              >
                Resend Verification Email
              </button>
              <button 
                className="btn-primary"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </button>
            </div>
          </div>
        );

      case 'no-token':
        return (
          <div className="verification-no-token">
            <div className="info-icon">ℹ</div>
            <h2>Verification Link Required</h2>
            <p>{message}</p>
            <div className="verification-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowResendForm(true)}
              >
                Resend Verification Email
              </button>
              <button 
                className="btn-primary"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="email-verification-container">
      <div className="verification-card">
        <div className="verification-header">
          <h1>🎯 BookMyCourt</h1>
          <p>Email Verification</p>
        </div>

        {renderContent()}

        {showResendForm && (
          <div className="resend-form">
            <h3>Resend Verification Email</h3>
            <form onSubmit={handleResendVerification}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={resendStatus === 'sending'}
              >
                {resendStatus === 'sending' ? 'Sending...' : 'Resend Email'}
              </button>
            </form>
            {resendStatus && (
              <div className={`resend-status ${resendStatus}`}>
                {resendStatus === 'sending' && 'Sending verification email...'}
                {resendStatus === 'success' && 'Verification email sent successfully!'}
                {resendStatus === 'error' && message}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
