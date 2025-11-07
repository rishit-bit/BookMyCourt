const nodemailer = require('nodemailer');
const crypto = require('crypto');

const createTransporter = () => {
  console.log('Email Config Debug:');
  console.log('SMTP_HOST:', process.env.SMTP_HOST);
  console.log('SMTP_USERNAME:', process.env.SMTP_USERNAME);
  console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? '***SET***' : 'NOT SET');
  console.log('GMAIL_USER:', process.env.GMAIL_USER);
  console.log('GMAIL_PASS:', process.env.GMAIL_PASS ? '***SET***' : 'NOT SET');
  
  if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
    console.log('Using Gmail configuration');
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });
  }
  
  console.log('Using SMTP configuration');
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, 
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000, 
    greetingTimeout: 5000,   
      socketTimeout: 10000      // 10 seconds
    });
};

const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

const sendVerificationEmail = async (email, firstName, verificationToken) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"BookMyCourt" <${process.env.FROM_EMAIL || 'no-reply@aerisgo.in'}>`,
      to: email,
      subject: 'Welcome to BookMyCourt - Your Account is Ready',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title>Welcome to BookMyCourt</title>
          <style>
            @media only screen and (max-width: 600px) {
              .container { width: 100% !important; }
              .mobile-padding { padding: 20px !important; }
              .mobile-text { font-size: 16px !important; }
              .mobile-title { font-size: 24px !important; }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333;">
          
          <!-- Main Container -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa;">
            <tr>
              <td style="padding: 40px 20px;">
                
                <!-- Email Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
                      <!-- Logo -->
                      <div style="margin-bottom: 20px;">
                        <div style="display: inline-block; background: rgba(255, 255, 255, 0.2); border-radius: 50%; width: 80px; height: 80px; line-height: 80px; text-align: center; border: 2px solid rgba(255, 255, 255, 0.3);">
                          <span style="font-size: 40px; color: #ffffff;">🎯</span>
                        </div>
                      </div>
                      
                      <!-- Company Name -->
                      <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">BookMyCourt</h1>
                      <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 400;">Premium Sports Facility Booking Platform</p>
                    </td>
                  </tr>
                  
                  <!-- Welcome Section -->
                  <tr>
                    <td style="padding: 50px 40px; background-color: #ffffff; text-align: center;">
                      <!-- Welcome Icon -->
                      <div style="margin-bottom: 30px;">
                        <div style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #1e3a8a); border-radius: 50%; width: 100px; height: 100px; line-height: 100px; text-align: center; box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);">
                          <span style="font-size: 50px; color: #ffffff;">🏟️</span>
                        </div>
                      </div>
                      
                      <!-- Welcome Message -->
                      <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 28px; font-weight: 600; letter-spacing: -0.025em;">Welcome to BookMyCourt, ${firstName}!</h2>
                      <p style="margin: 0 0 25px 0; color: #6b7280; font-size: 18px; font-weight: 400; max-width: 500px; margin-left: auto; margin-right: auto;">
                        Thank you for choosing BookMyCourt. Your account has been successfully created and you're now ready to start booking sports facilities.
                      </p>
                      
                      <!-- Account Details -->
                      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin: 30px 0; text-align: left; max-width: 400px; margin-left: auto; margin-right: auto;">
                        <p style="margin: 0 0 10px 0; color: #374151; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Account Details</p>
                        <p style="margin: 0; color: #6b7280; font-size: 16px;">
                          <strong style="color: #374151;">Email:</strong> ${email}
                        </p>
                        <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 16px;">
                          <strong style="color: #374151;">Status:</strong> <span style="color: #059669; font-weight: 600;">✓ Active</span>
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Features Section -->
                  <tr>
                    <td style="padding: 0 40px 50px; background-color: #ffffff;">
                      <h3 style="margin: 0 0 30px 0; color: #1f2937; font-size: 22px; font-weight: 600; text-align: center; letter-spacing: -0.025em;">What You Can Do Now</h3>
                      
                      <!-- Features Grid -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="width: 50%; padding: 0 10px 20px 0; vertical-align: top;">
                            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 25px; text-align: center; height: 100%;">
                              <div style="font-size: 32px; margin-bottom: 15px;">🏟️</div>
                              <h4 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px; font-weight: 600;">Browse Facilities</h4>
                              <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Explore available sports courts and facilities in your area</p>
                            </div>
                          </td>
                          <td style="width: 50%; padding: 0 0 20px 10px; vertical-align: top;">
                            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 25px; text-align: center; height: 100%;">
                              <div style="font-size: 32px; margin-bottom: 15px;">📅</div>
                              <h4 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px; font-weight: 600;">Check Availability</h4>
                              <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Find the perfect time slots that fit your schedule</p>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td style="width: 50%; padding: 0 10px 0 0; vertical-align: top;">
                            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 25px; text-align: center; height: 100%;">
                              <div style="font-size: 32px; margin-bottom: 15px;">🎯</div>
                              <h4 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px; font-weight: 600;">Book Courts</h4>
                              <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Reserve your preferred time slots instantly</p>
                            </div>
                          </td>
                          <td style="width: 50%; padding: 0 0 0 10px; vertical-align: top;">
                            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 25px; text-align: center; height: 100%;">
                              <div style="font-size: 32px; margin-bottom: 15px;">👥</div>
                              <h4 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px; font-weight: 600;">Invite Friends</h4>
                              <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Bring your friends and enjoy sports together</p>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- CTA Section -->
                  <tr>
                    <td style="padding: 0 40px 50px; background-color: #ffffff; text-align: center;">
                      <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border: 1px solid #cbd5e1; border-radius: 8px; padding: 40px;">
                        <h3 style="margin: 0 0 20px 0; color: #1f2937; font-size: 20px; font-weight: 600;">Ready to Get Started?</h3>
                        <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 16px;">Access your account and start exploring available facilities</p>
                        
                        <!-- CTA Button -->
                        <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}" 
                           style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4); transition: all 0.2s ease;">
                          Access Your Account
                        </a>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Support Section -->
                  <tr>
                    <td style="padding: 0 40px 50px; background-color: #ffffff;">
                      <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 30px; text-align: center;">
                        <div style="margin-bottom: 20px;">
                          <div style="display: inline-block; background-color: #3b82f6; border-radius: 50%; width: 60px; height: 60px; line-height: 60px; text-align: center;">
                            <span style="font-size: 24px; color: #ffffff;">💬</span>
                          </div>
                        </div>
                        <h4 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px; font-weight: 600;">Need Assistance?</h4>
                        <p style="margin: 0 0 20px 0; color: #1e40af; font-size: 15px; line-height: 1.5;">
                          Our support team is available to help you with any questions or concerns
                        </p>
                        <p style="margin: 0; color: #1e40af; font-size: 14px; font-weight: 500;">
                          Contact us at: <strong>support@bookmycourt.com</strong>
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #1f2937; padding: 30px; text-align: center;">
                      <div style="margin-bottom: 20px;">
                        <span style="display: inline-block; width: 40px; height: 2px; background: linear-gradient(90deg, #3b82f6, #1e3a8a); border-radius: 1px;"></span>
                      </div>
                      <p style="margin: 0 0 15px 0; color: #9ca3af; font-size: 14px; font-weight: 500;">© 2025 BookMyCourt. All rights reserved.</p>
                      <p style="margin: 0; color: #6b7280; font-size: 12px;">
                        This email was sent to ${email} as part of your BookMyCourt account registration.
                      </p>
                    </td>
                  </tr>
                  
                </table>
                
              </td>
            </tr>
          </table>
          
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};


const sendWelcomeEmail = async (email, firstName) => {
  try {
    const transporter = createTransporter();
    
          const mailOptions = {
        from: `"BookMyCourt" <${process.env.FROM_EMAIL || 'no-reply@aerisgo.in'}>`,
        to: email,
        subject: 'Registration Confirmed - Welcome to BookMyCourt! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to BookMyCourt!</title>
        </head>
        <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <tr>
              <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <div style="background: rgba(255,255,255,0.1); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 40px; color: white;">🎯</span>
                      </div>
                      <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">BookMyCourt</h1>
                      <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 18px; font-weight: 300;">Premium Sports Facility Booking</p>
                    </td>
                  </tr>
                  
                  <!-- Success Icon -->
                  <tr>
                    <td style="padding: 40px 40px 20px; background: white; text-align: center;">
                      <div style="background: linear-gradient(135deg, #48bb78, #38a169); width: 120px; height: 120px; border-radius: 50%; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center; box-shadow: 0 15px 35px rgba(72, 187, 120, 0.4);">
                        <span style="font-size: 60px; color: white; font-weight: bold;">✓</span>
                      </div>
                                             <h2 style="color: #2d3748; margin: 0 0 15px 0; font-size: 32px; font-weight: 600;">Congratulations, ${firstName}! 🎉</h2>
                       <p style="color: #718096; font-size: 18px; line-height: 1.6; margin: 0; font-weight: 300;">
                         Your registration has been successfully confirmed! You're now ready to start booking sports facilities on BookMyCourt.
                       </p>
                    </td>
                  </tr>
                  
                  <!-- Features Section -->
                  <tr>
                    <td style="padding: 20px 40px 40px; background: white;">
                      <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 20px; padding: 35px; margin: 30px 0; border: 1px solid #e2e8f0;">
                        <h3 style="color: #2d3748; margin: 0 0 25px 0; font-size: 24px; font-weight: 600; text-align: center;">🚀 What's Next?</h3>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                          <div style="background: white; padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #e2e8f0;">
                            <div style="font-size: 30px; margin-bottom: 10px;">🏟️</div>
                            <p style="color: #4a5568; font-size: 14px; margin: 0; font-weight: 500;">Browse available sports facilities</p>
                          </div>
                          <div style="background: white; padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #e2e8f0;">
                            <div style="font-size: 30px; margin-bottom: 10px;">📅</div>
                            <p style="color: #4a5568; font-size: 14px; margin: 0; font-weight: 500;">Check court availability</p>
                          </div>
                          <div style="background: white; padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #e2e8f0;">
                            <div style="font-size: 30px; margin-bottom: 10px;">🎯</div>
                            <p style="color: #4a5568; font-size: 14px; margin: 0; font-weight: 500;">Book your preferred time slots</p>
                          </div>
                          <div style="background: white; padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #e2e8f0;">
                            <div style="font-size: 30px; margin-bottom: 10px;">👥</div>
                            <p style="color: #4a5568; font-size: 14px; margin: 0; font-weight: 500;">Invite friends to join your games</p>
                          </div>
                        </div>
                        
                        <div style="text-align: center;">
                          <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}" 
                             style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 8px 25px rgba(72, 187, 120, 0.4); transition: all 0.3s ease;">
                            🚀 Start Booking Now
                          </a>
                        </div>
                      </div>
                      
                      <div style="background: #ebf8ff; border-radius: 15px; padding: 25px; margin: 25px 0; border: 1px solid #bee3f8; text-align: center;">
                        <p style="color: #2b6cb0; font-size: 16px; margin: 0; font-weight: 500;">
                          💬 If you have any questions or need assistance, feel free to reach out to our support team.
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background: #2d3748; padding: 30px; text-align: center;">
                      <p style="color: #a0aec0; font-size: 14px; margin: 0 0 15px 0;">© 2025 BookMyCourt. All rights reserved.</p>
                      <div style="display: inline-block;">
                        <span style="display: inline-block; width: 8px; height: 8px; background: #48bb78; border-radius: 50%; margin: 0 5px;"></span>
                        <span style="display: inline-block; width: 8px; height: 8px; background: #38a169; border-radius: 50%; margin: 0 5px;"></span>
                        <span style="display: inline-block; width: 8px; height: 8px; background: #48bb78; border-radius: 50%; margin: 0 5px;"></span>
                      </div>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
};


const sendOTPEmail = async (email, firstName, otpCode) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"BookMyCourt" <${process.env.FROM_EMAIL || 'no-reply@aerisgo.in'}>`,
      to: email,
      subject: 'Your BookMyCourt Verification Code',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>BookMyCourt - Verification Code</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa;">
            <tr>
              <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
                      <div style="margin-bottom: 20px;">
                        <div style="display: inline-block; background: rgba(255, 255, 255, 0.2); border-radius: 50%; width: 80px; height: 80px; line-height: 80px; text-align: center; border: 2px solid rgba(255, 255, 255, 0.3);">
                          <span style="font-size: 40px; color: #ffffff;">🎯</span>
                        </div>
                      </div>
                      <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">BookMyCourt</h1>
                      <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Email Verification</p>
                    </td>
                  </tr>
                  
                  <!-- OTP Section -->
                  <tr>
                    <td style="padding: 50px 40px; background-color: #ffffff; text-align: center;">
                      <div style="margin-bottom: 30px;">
                        <div style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #1e3a8a); border-radius: 50%; width: 100px; height: 100px; line-height: 100px; text-align: center; box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);">
                          <span style="font-size: 50px; color: #ffffff;">🔐</span>
                        </div>
                      </div>
                      
                      <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 28px; font-weight: 600;">Verify Your Email</h2>
                      <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 18px; max-width: 500px; margin-left: auto; margin-right: auto;">
                        Hi ${firstName}, please use the verification code below to activate your BookMyCourt account.
                      </p>
                      
                      <!-- OTP Code -->
                      <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border: 2px solid #3b82f6; border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center; max-width: 300px; margin-left: auto; margin-right: auto;">
                        <p style="margin: 0 0 15px 0; color: #374151; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Your Verification Code</p>
                        <div style="background: #ffffff; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 0 auto; display: inline-block;">
                          <span style="color: #1e3a8a; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otpCode}</span>
                        </div>
                        <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 14px;">This code expires in 10 minutes</p>
                      </div>
                      
                      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: left; max-width: 500px; margin-left: auto; margin-right: auto;">
                        <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 500;">
                          <strong>⚠️ Security Notice:</strong> Never share this code with anyone. BookMyCourt will never ask for your verification code via phone or email.
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #1f2937; padding: 30px; text-align: center;">
                      <p style="margin: 0 0 15px 0; color: #9ca3af; font-size: 14px;">© 2025 BookMyCourt. All rights reserved.</p>
                      <p style="margin: 0; color: #6b7280; font-size: 12px;">
                        This email was sent to ${email} for account verification.
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendOTPEmail,
  generateVerificationToken,
  generateOTP
};
