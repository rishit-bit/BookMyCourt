# BookMyCourt Dashboard Features

## Overview
This document outlines the new dashboard functionality and OTP-based email verification system implemented for BookMyCourt.

## New Features

### 1. OTP-Based Email Verification
- **Replaced token-based verification** with 6-digit OTP codes
- **10-minute expiration** for security
- **Beautiful email templates** with OTP display
- **Resend functionality** with 60-second cooldown
- **Account activation required** before login

### 2. Sports Selection System
- **10 sports options** available:
  - Cricket 🏏
  - Football ⚽
  - Basketball 🏀
  - Tennis 🎾
  - Badminton 🏸
  - Volleyball 🏐
  - Hockey 🏑
  - Table Tennis 🏓
  - Squash 🥎
  - Swimming 🏊

- **Interactive selection interface** with sport details
- **Skip option** for users who want to select later
- **Persistent storage** of user preferences

### 3. Dashboard Interface
- **Personalized welcome** with user's name
- **Sport preference display** with selected sport info
- **Quick stats** showing booking history
- **Quick actions** for common tasks:
  - Book Court
  - Find Venues
  - View Schedule
  - Invite Friends
- **Recent bookings** with status indicators
- **Responsive design** for all devices

### 4. Enhanced Authentication Flow
- **Protected routes** with automatic redirects
- **Verification status checking** before dashboard access
- **Seamless navigation** between components
- **Persistent user sessions** with localStorage

## Technical Implementation

### Backend Changes
- **User model updates** with OTP fields and sport preferences
- **New API endpoints**:
  - `POST /api/auth/verify-otp` - Verify OTP code
  - `POST /api/auth/resend-otp` - Resend OTP code
  - `POST /api/auth/select-sport` - Update sport preference
- **Email service enhancements** with OTP templates
- **Account activation enforcement** in login flow

### Frontend Changes
- **New components**:
  - `OTPVerification.js` - OTP input and verification
  - `SportsSelection.js` - Sport selection interface
  - `Dashboard.js` - Main dashboard interface
- **Updated routing** with protected routes
- **Enhanced AuthContext** with localStorage persistence
- **Improved error handling** and user feedback

## User Journey

1. **Registration** → User signs up with email
2. **OTP Verification** → User receives and enters 6-digit code
3. **Sport Selection** → User chooses favorite sport (optional)
4. **Dashboard Access** → User lands on personalized dashboard
5. **Future Logins** → Direct access to dashboard (if verified)

## Security Features

- **OTP expiration** (10 minutes)
- **Account activation required** for login
- **Protected routes** with authentication checks
- **Secure token storage** in localStorage
- **Input validation** on all forms

## Email Templates

- **Professional design** with BookMyCourt branding
- **Mobile responsive** layouts
- **Clear OTP display** with security warnings
- **Welcome emails** after successful verification

## Future Enhancements

- **Booking management** integration
- **Venue recommendations** based on sport preference
- **Social features** for team bookings
- **Analytics dashboard** for usage statistics
- **Mobile app** development

## Getting Started

1. **Start the server**: `npm start` in the server directory
2. **Start the client**: `npm start` in the client directory
3. **Register a new account** to test the OTP flow
4. **Select a sport** to see the dashboard
5. **Explore the features** and functionality

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/select-sport` - Update sport preference

### User Management
- `POST /api/auth/verify-token` - Token validation
- `POST /api/auth/refresh-token` - Token refresh

## Environment Variables

Make sure to set up the following environment variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/bookmycourt

# JWT
JWT_SECRET=your-secret-key

# Email Service
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USERNAME=your-email
SMTP_PASSWORD=your-password
FROM_EMAIL=noreply@bookmycourt.com

# Client URL
CLIENT_URL=http://localhost:3000
```

## Testing

1. **Register** with a valid email address
2. **Check email** for OTP code
3. **Verify OTP** to activate account
4. **Select sport** preference
5. **Access dashboard** and explore features
6. **Test logout** and login flow

## Support

For any issues or questions, please refer to the main README.md file or contact the development team.
