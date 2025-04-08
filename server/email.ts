import { log } from "./vite";

// This is a placeholder for SendGrid implementation
// It will be replaced with actual SendGrid implementation when API key is provided
export interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    // Just log the email for now
    log(`[EMAIL] Sending email to ${params.to}: ${params.subject}`, "email");
    log(`[EMAIL] Content: ${params.text || params.html}`, "email");
    
    // In a real implementation, we would use SendGrid here
    // Example:
    // await mailService.send({
    //   to: params.to,
    //   from: params.from,
    //   subject: params.subject,
    //   text: params.text,
    //   html: params.html,
    // });
    
    // Return success (simulate successful email sending)
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
}

// Generate OTP code (6-digit)
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create email verification template
export function createVerificationEmail(to: string, otp: string): EmailParams {
  return {
    to,
    from: "verification@bahaghar.com", // Will be updated with a verified sender
    subject: "Verify Your Bahaghar.com Account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4f46e5; text-align: center;">Bahaghar.com Email Verification</h2>
        <p>Thank you for registering with Bahaghar.com, the premier matrimony service for the Odia community.</p>
        <p>Your verification code is:</p>
        <div style="text-align: center; padding: 15px; background-color: #f3f4f6; font-size: 24px; letter-spacing: 5px; font-weight: bold; border-radius: 5px;">
          ${otp}
        </div>
        <p style="margin-top: 20px;">This code will expire in 15 minutes for security reasons.</p>
        <p>If you did not request this verification, please ignore this email.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 12px; color: #6b7280;">
          <p>© ${new Date().getFullYear()} Bahaghar.com - Finding your perfect match</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    `
  };
}

// Create phone verification message
export function createPhoneVerificationMessage(otp: string): string {
  return `Your Bahaghar.com verification code is: ${otp}. This code will expire in 15 minutes.`;
}