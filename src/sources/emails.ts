import { User } from 'src/modules/entities/users.entity';

export function passResetMessage(
  name: string,
  temporalPassword: string,
): string {
  const message = `
    Dear ${name},

    We received a request to reset the password for your Check-Inn account. As requested, we have generated a temporary password for you.

    Your Temporary Password: ${temporalPassword}

    Please use this temporary password to log in to your account. We recommend that you change this password immediately after logging in to ensure the security of your account.

    To update your password, follow these steps:

    1. Log in to your account using the temporary password.
    2. Navigate to the "Account Settings" or "Change Password" section.
    3. Enter a new password of your choice.

    If you did not request a password reset, please contact our support team immediately.

    Thank you for using Check-Inn.

    Best regards,
    Check-Inn Support Team
    `;

  return message;
}

// En sources/emails.ts
export function accountCreated(user: { name: string }): string {
  return `
      Welcome ${user.name}, to Check-Inn
    
      We're thrilled to have you as part of our community.
    
      Thank you for joining Check-In! We look forward to seeing you around.
    
      Best regards,
      Check-In Team
    `;
}
