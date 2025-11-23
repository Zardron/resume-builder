import sgMail from '@sendgrid/mail';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send email using SendGrid
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 * @param {Object} options.dynamicTemplateData - Data for SendGrid template
 * @returns {Promise}
 */
export const sendEmail = async ({ to, subject, text, html, dynamicTemplateData }) => {
  try {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@resumeiqhub.com',
      subject,
      text,
      html,
      ...(dynamicTemplateData && {
        templateId: process.env.SENDGRID_TEMPLATE_ID,
        dynamicTemplateData,
      }),
    };

    await sgMail.send(msg);
    console.log(`✅ Email sent successfully to ${to}`);
    return { success: true };
  } catch (error) {
    console.error('❌ SendGrid error:', error);
    if (error.response) {
      console.error('Error response body:', error.response.body);
    }
    throw error;
  }
};

/**
 * Send email verification email
 * @param {string} to - Recipient email
 * @param {string} name - Recipient name
 * @param {string} verificationUrl - Verification URL
 * @param {string} verificationCode - Verification code
 * @returns {Promise}
 */
export const sendVerificationEmail = async (to, name, verificationUrl, verificationCode) => {
  try {
    // Read the HTML template
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const templatePath = path.join(__dirname, 'email-verification-template.html');
    
    let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
    
    // Replace template variables
    htmlTemplate = htmlTemplate.replace(/{{name}}/g, name);
    htmlTemplate = htmlTemplate.replace(/{{verificationUrl}}/g, verificationUrl);
    htmlTemplate = htmlTemplate.replace(/{{verificationCode}}/g, verificationCode);
    htmlTemplate = htmlTemplate.replace(/{{frontendUrl}}/g, process.env.FRONTEND_URL || 'http://localhost:5173');
    
    const subject = 'Verify Your Email Address - ResumeIQHub';
    const text = `Hi ${name},\n\nPlease verify your email address by clicking this link: ${verificationUrl}\n\nOr use this verification code: ${verificationCode}\n\nThis link will expire in 24 hours.`;
    
    return await sendEmail({
      to,
      subject,
      text,
      html: htmlTemplate,
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

/**
 * Send password reset email
 * @param {string} to - Recipient email
 * @param {string} name - Recipient name
 * @param {string} resetUrl - Password reset URL
 * @param {string} resetCode - Password reset code
 * @returns {Promise}
 */
export const sendPasswordResetEmail = async (to, name, resetUrl, resetCode) => {
  const subject = 'Reset Your Password - ResumeIQHub';
  const text = `Hi ${name},\n\nYou requested to reset your password. Click this link to reset: ${resetUrl}\n\nOr use this reset code: ${resetCode}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Reset Your Password</h2>
      <p>Hi ${name},</p>
      <p>You requested to reset your password. Click the button below to reset it:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Reset Password</a>
      <p>Or use this reset code: <strong>${resetCode}</strong></p>
      <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
      <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
    </div>
  `;
  
  return await sendEmail({
    to,
    subject,
    text,
    html,
  });
};

/**
 * Send welcome email
 * @param {string} to - Recipient email
 * @param {string} name - Recipient name
 * @returns {Promise}
 */
export const sendWelcomeEmail = async (to, name) => {
  const subject = 'Welcome to ResumeIQHub!';
  const text = `Hi ${name},\n\nWelcome to ResumeIQHub! We're excited to have you on board.\n\nStart building your professional resume today!`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to ResumeIQHub!</h2>
      <p>Hi ${name},</p>
      <p>Welcome to ResumeIQHub! We're excited to have you on board.</p>
      <p>Start building your professional resume today!</p>
    </div>
  `;
  
  return await sendEmail({
    to,
    subject,
    text,
    html,
  });
};

export default {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
};

