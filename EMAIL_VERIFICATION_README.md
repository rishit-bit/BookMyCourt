# Email Verification System for BookMyCourt

This document describes the implementation of the email verification system for the BookMyCourt application, which ensures that users verify their email addresses after registration.

## Overview

The email verification system includes:
- Automatic email sending upon user registration
- Secure verification tokens with 24-hour expiration
- Beautiful HTML email templates
- Resend verification functionality
- Frontend verification page
- Integration with existing authentication system

## Features

### 🔐 Security Features
- **Cryptographically Secure Tokens**: Uses Node.js crypto module to generate 32-byte random tokens
- **Token Expiration**: Verification tokens expire after 24 hours
- **One-time Use**: Tokens are invalidated after successful verification
- **Email Validation**: Prevents login until email is verified

### 📧 Email Features
- **Professional Templates**: Beautiful HTML emails with BookMyCourt branding
- **SMTP Integration**: Uses your existing SMTP server (mail.aerisgo.in)
- **Automatic Sending**: Verification emails sent immediately after registration
- **Welcome Email**: Confirmation email sent after successful verification
- **Resend Functionality**: Users can request new verification emails

### 🎨 User Experience
- **Seamless Integration**: Works with existing signup/login flow
- **Clear Messaging**: Informative error messages and success confirmations
- **Responsive Design**: Mobile-friendly verification page
- **Auto-redirect**: Automatic navigation after successful verification

## Technical Implementation

### Backend Components

#### 1. Email Service (`server/utils/emailService.js`)
- **SMTP Configuration**: Configured for your mail.aerisgo.in server
- **Token Generation**: Secure random token generation
- **Email Templates**: Professional HTML email templates
- **Error Handling**: Comprehensive error handling and logging

#### 2. User Model Updates (`server/models/User.js`)
- **New Fields Added**:
  - `emailVerificationToken`: Stores the verification token
  - `emailVerificationExpires`: Token expiration timestamp
  - `isVerified`: Email verification status

#### 3. Authentication Routes (`server/routes/auth.js`)
- **New Endpoints**:
  - `POST /api/auth/verify-email`: Verify email with token
  - `POST /api/auth/resend-verification`: Resend verification email
- **Updated Endpoints**:
  - `POST /api/auth/signup`: Now sends verification email
  - `POST /api/auth/login`: Now checks email verification status

### Frontend Components

#### 1. Email Verification Page (`client/src/components/EmailVerification.js`)
- **Token Processing**: Automatically processes verification tokens from URL
- **Status Display**: Shows verification progress and results
- **Resend Form**: Allows users to request new verification emails
- **Navigation**: Seamless integration with existing routing

#### 2. Signup Form Updates (`client/src/components/SignupForm.js`)
- **Verification Notice**: Informs users about email verification requirement
- **Visual Enhancement**: Professional styling for verification information

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in your server root with the following variables:

```env
# SMTP Configuration
SMTP_HOST=mail.aerisgo.in
SMTP_PORT=587
SMTP_USERNAME=smtp@aerisgo.in
SMTP_PASSWORD=AerisGo@2025
FROM_EMAIL=no-reply@aerisgo.in

# Client URL
CLIENT_URL=http://localhost:3000

# Other configurations...
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bookmycourt
JWT_SECRET=your-secret-key
```

### 2. Install Dependencies

```bash
npm install nodemailer
```

Note: `crypto` is a built-in Node.js module, so no additional installation is needed.

### 3. Database Migration

The system automatically adds new fields to existing users. New users will have these fields populated automatically.

### 4. Frontend Integration

The email verification route is automatically added to your React application:
- Route: `/verify-email`
- Component: `EmailVerification`
- Styling: `EmailVerification.css`

## Usage Flow

### 1. User Registration
1. User fills out signup form
2. Account is created with `isVerified: false`
3. Verification email is automatically sent
4. User sees confirmation message about email verification

### 2. Email Verification
1. User receives verification email with secure link
2. Clicking link navigates to `/verify-email?token=<token>`
3. System validates token and marks email as verified
4. Welcome email is sent
5. User is redirected to login page

### 3. Login Process
1. User attempts to login
2. System checks if email is verified
3. If verified: Normal login process
4. If not verified: Error message with option to resend verification

### 4. Resend Verification
1. User can request new verification email
2. New token is generated and sent
3. Previous tokens are invalidated

## Email Templates

### Verification Email
- **Subject**: "Welcome to BookMyCourt - Verify Your Email"
- **Content**: Professional welcome message with verification button
- **Design**: Branded with BookMyCourt colors and logo
- **CTA**: Clear verification button with fallback link

### Welcome Email
- **Subject**: "Email Verified - Welcome to BookMyCourt! 🎉"
- **Content**: Congratulations message with next steps
- **Features**: List of available features and actions
- **CTA**: "Start Booking Now" button

## Security Considerations

### Token Security
- **Random Generation**: Uses cryptographically secure random generation
- **Expiration**: 24-hour expiration prevents long-term token abuse
- **One-time Use**: Tokens are invalidated after verification
- **Secure Storage**: Tokens are hashed and stored securely in database

### Email Security
- **SMTP Authentication**: Proper SMTP authentication with your server
- **TLS Support**: TLS encryption for email transmission
- **Rate Limiting**: Built-in protection against email spam
- **Validation**: Email format and domain validation

## Testing

### Backend Testing
1. **Registration Flow**: Test user registration and email sending
2. **Token Validation**: Test token verification with valid/invalid tokens
3. **Expiration**: Test token expiration after 24 hours
4. **Resend**: Test resend verification functionality

### Frontend Testing
1. **Verification Page**: Test all verification states
2. **Responsive Design**: Test on various screen sizes
3. **Navigation**: Test integration with existing routing
4. **Error Handling**: Test various error scenarios

## Troubleshooting

### Common Issues

#### 1. Email Not Sending
- Check SMTP configuration in `.env` file
- Verify SMTP credentials are correct
- Check server logs for SMTP errors
- Ensure port 587 is open and not blocked

#### 2. Verification Link Not Working
- Check if token is properly generated
- Verify token expiration logic
- Check database for token storage
- Ensure proper URL encoding

#### 3. Frontend Not Loading
- Check React component imports
- Verify routing configuration
- Check browser console for errors
- Ensure CSS file is properly linked

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=email:*
```

## Customization

### Email Templates
- **Styling**: Modify CSS in email templates
- **Content**: Update email text and branding
- **Layout**: Adjust email structure and design
- **Localization**: Add support for multiple languages

### Token Expiration
- **Duration**: Modify token expiration time (currently 24 hours)
- **Format**: Change token generation method
- **Validation**: Customize token validation logic

### SMTP Configuration
- **Server**: Use different SMTP providers
- **Authentication**: Implement OAuth2 or other auth methods
- **Security**: Enable additional security features

## Performance Considerations

### Email Sending
- **Async Processing**: Emails are sent asynchronously
- **Error Handling**: Failed emails don't block user registration
- **Rate Limiting**: Built-in protection against email spam
- **Queue System**: Consider implementing email queue for high volume

### Database Optimization
- **Indexing**: Email and token fields are indexed
- **Cleanup**: Expired tokens are automatically handled
- **Storage**: Minimal additional storage requirements

## Future Enhancements

### Planned Features
- **Email Queue**: Implement background email processing
- **Template Engine**: Dynamic email template system
- **Analytics**: Track email open rates and verification success
- **Multi-language**: Support for multiple languages
- **SMS Verification**: Alternative verification methods

### Integration Opportunities
- **Marketing Tools**: Integrate with email marketing platforms
- **Analytics**: Connect with user behavior analytics
- **CRM**: Integration with customer relationship management
- **Notifications**: Push notification support

## Support

For technical support or questions about the email verification system:

1. **Check Logs**: Review server and client console logs
2. **Verify Configuration**: Ensure all environment variables are set
3. **Test SMTP**: Verify SMTP server connectivity
4. **Database Check**: Verify database schema and data

## License

This email verification system is part of the BookMyCourt application and follows the same licensing terms.

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Author**: BookMyCourt Development Team
