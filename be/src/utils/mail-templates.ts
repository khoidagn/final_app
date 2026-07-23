interface AccountStatusData {
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
}

interface VerificationData {
  firstName: string;
  verificationUrl: string;
}

interface ResetPasswordData {
  firstName: string;
  resetPasswordUrl: string;
}

export const MailTemplates = {
  getAccountStatusEmail: ({
    firstName,
    lastName,
    email,
    isActive,
  }: AccountStatusData): string => {
    const statusText = isActive ? 'ACCOUNT ACTIVATED' : 'ACCOUNT SUSPENDED';

    const statusDescription = isActive
      ? 'Your account has been successfully reactivated by the administrator. You can now log in and use our services as usual.'
      : 'Your account has been temporarily suspended due to a violation of our community standards or administrative review. You will no longer have the ability to log into the application.';

    const statusColor = isActive ? '#16a34a' : '#dc2626';
    const statusBg = isActive ? '#f0fdf4' : '#fef2f2';
    const statusBorder = isActive ? '#16a34a' : '#dc2626';

    return `
      <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #4f46e5;">Hello ${firstName} ${lastName},</h2>
        <p>This is an official notification regarding your Fotobook account status associated with the email address: <strong>${email}</strong>.</p>
        
        <div style="background-color: ${statusBg}; border-left: 4px solid ${statusBorder}; padding: 15px; margin: 20px 0;">
          <p style="color: ${statusColor}; font-weight: bold; margin: 0; text-transform: uppercase;">${statusText}</p>
          <p style="margin: 5px 0 0 0; color: #4b5563;">${statusDescription}</p>
        </div>
        
        <p style="font-size: 13px; color: #6b7280; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
          Best regards,<br>
          <strong>Fotobook Administration Team</strong>
        </p>
      </div>
    `;
  },

  getVerificationEmail: ({
    firstName,
    verificationUrl,
  }: VerificationData): string => {
    return `
      <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #4f46e5;">Welcome to Fotobook, ${firstName}!</h2>
        <p>Thank you for creating an account. To complete your registration, please verify your email address by clicking the link below:</p>
        
        <div style="margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        
        <p style="font-size: 12px; color: #9ca3af;">
          This verification link is secure and will expire after a limited time. If you did not perform this request, please safely ignore this email.
        </p>
        
        <p style="font-size: 13px; color: #6b7280; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
          Best regards,<br>
          <strong>Rosy Fotobook</strong>
        </p>
      </div>
    `;
  },

  getResetPasswordEmail: ({
    firstName,
    resetPasswordUrl,
  }: ResetPasswordData): string => {
    return `
      <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #4f46e5;">Hi ${firstName},</h2>
        <p>We received a request to reset the password for your Fotobook account. Click the button below to choose a new password:</p>
        
        <div style="margin: 30px 0;">
          <a href="${resetPasswordUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <p style="font-size: 12px; color: #9ca3af;">
          This password reset link is valid for 15 minutes. If you did not request a password reset, you can safely ignore this email — your password will remain unchanged.
        </p>
        
        <p style="font-size: 13px; color: #6b7280; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
          Best regards,<br>
          <strong>Rosy Fotobook</strong>
        </p>
      </div>
    `;
  },
};
