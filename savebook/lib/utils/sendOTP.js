import { sendMail } from './sendMail.js';

/**
 * Utility to send an OTP email.
 * @param {string} to - Recipient email address
 * @param {string} otp - The OTP to send
 * @returns {Promise<any>}
 */
export const sendOTP = async (to, otp) => {
    const subject = 'Your Password Reset OTP - SaveBook';
    const text = `You requested a password reset. Your OTP is: ${otp}. It will expire in 10 minutes.`;
    const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2>Password Reset Request</h2>
      <p>We received a request to reset your password for your SaveBook account.</p>
      <p>Your One-Time Password (OTP) is:</p>
      <div style="font-size: 24px; font-weight: bold; background: #f4f4f4; padding: 10px; display: inline-block; border-radius: 5px; margin: 10px 0;">
        ${otp}
      </div>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you did not request a password reset, please ignore this email.</p>
      <br />
      <p>Thanks,</p>
      <p>The SaveBook Team</p>
    </div>
  `;

    return sendMail({ to, subject, text, html });
};
