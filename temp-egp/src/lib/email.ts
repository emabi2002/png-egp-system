import nodemailer from 'nodemailer'

// Create email transporter
const createTransporter = () => {
  // In development, use a test transporter
  if (process.env.NODE_ENV === 'development') {
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass'
      }
    })
  }

  // In production, use configured SMTP
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
}

// Email templates
const getEmailTemplate = (type: 'verification' | 'welcome' | 'password-reset', data: any) => {
  const baseUrl = process.env.APP_URL || 'http://localhost:3000'

  switch (type) {
    case 'verification':
      return {
        subject: 'Verify Your PNG e-GP Account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">PNG e-Government Procurement</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">National Procurement Commission</p>
            </div>

            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Verify Your Account</h2>

              <p style="color: #4b5563; line-height: 1.6;">
                Hello ${data.fullName},<br><br>
                Welcome to PNG e-GP! Please click the button below to verify your email address and activate your account.
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${baseUrl}/auth/verify-email?token=${data.verificationToken}"
                   style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Verify Email Address
                </a>
              </div>

              <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">
                This verification link will expire in 24 hours. If you didn't create an account with PNG e-GP, please ignore this email.
              </p>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

              <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                © 2025 National Procurement Commission (PNG). All rights reserved.
              </p>
            </div>
          </div>
        `
      }

    case 'welcome':
      return {
        subject: 'Welcome to PNG e-Government Procurement',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">Welcome to PNG e-GP!</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Your account has been verified</p>
            </div>

            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Get Started</h2>

              <p style="color: #4b5563; line-height: 1.6;">
                Hello ${data.fullName},<br><br>
                Your PNG e-GP account has been successfully verified! You can now access all features of the platform.
              </p>

              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
                <h3 style="margin: 0 0 10px 0; color: #1f2937;">Next Steps:</h3>
                <ul style="color: #4b5563; line-height: 1.6; margin: 0; padding-left: 20px;">
                  ${data.role === 'SUPPLIER_USER' ? `
                    <li>Complete your supplier profile</li>
                    <li>Upload required compliance documents</li>
                    <li>Browse available tenders</li>
                    <li>Submit your first bid</li>
                  ` : `
                    <li>Set up your procurement plan</li>
                    <li>Create your first tender</li>
                    <li>Manage bid evaluations</li>
                    <li>Track contract performance</li>
                  `}
                </ul>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${baseUrl}/dashboard"
                   style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Access Dashboard
                </a>
              </div>
            </div>
          </div>
        `
      }

    case 'password-reset':
      return {
        subject: 'Reset Your PNG e-GP Password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">Password Reset Request</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">PNG e-Government Procurement</p>
            </div>

            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Reset Your Password</h2>

              <p style="color: #4b5563; line-height: 1.6;">
                Hello ${data.fullName},<br><br>
                We received a request to reset your password. Click the button below to set a new password.
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${baseUrl}/auth/reset-password?token=${data.resetToken}"
                   style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Reset Password
                </a>
              </div>

              <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">
                This reset link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
              </p>
            </div>
          </div>
        `
      }

    default:
      throw new Error('Invalid email template type')
  }
}

// Send verification email
export const sendVerificationEmail = async (email: string, fullName: string, verificationToken: string) => {
  try {
    const transporter = createTransporter()
    const template = getEmailTemplate('verification', { fullName, verificationToken })

    const result = await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'noreply@png-egp.gov.pg',
      to: email,
      subject: template.subject,
      html: template.html
    })

    console.log('Verification email sent:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Failed to send verification email:', error)
    return { success: false, error: error }
  }
}

// Send welcome email
export const sendWelcomeEmail = async (email: string, fullName: string, role: string) => {
  try {
    const transporter = createTransporter()
    const template = getEmailTemplate('welcome', { fullName, role })

    const result = await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'noreply@png-egp.gov.pg',
      to: email,
      subject: template.subject,
      html: template.html
    })

    console.log('Welcome email sent:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    return { success: false, error: error }
  }
}

// Send password reset email
export const sendPasswordResetEmail = async (email: string, fullName: string, resetToken: string) => {
  try {
    const transporter = createTransporter()
    const template = getEmailTemplate('password-reset', { fullName, resetToken })

    const result = await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'noreply@png-egp.gov.pg',
      to: email,
      subject: template.subject,
      html: template.html
    })

    console.log('Password reset email sent:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Failed to send password reset email:', error)
    return { success: false, error: error }
  }
}
