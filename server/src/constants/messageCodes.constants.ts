export const MessageCodes = {
  AUTH_EMAIL_ALREADY_REGISTERED_VERIFIED:
    'AUTH_EMAIL_ALREADY_REGISTERED_VERIFIED', // Email is already registered and verified.
  AUTH_EMAIL_ALREADY_REGISTERED_UNVERIFIED:
    'AUTH_EMAIL_ALREADY_REGISTERED_UNVERIFIED', // This email is already registered but not verified. A new OTP has been sent to your inbox.
  AUTH_USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND', // User not found for this email.
  AUTH_EMAIL_ALREADY_VERIFIED: 'AUTH_EMAIL_ALREADY_VERIFIED', // This email is already verified. Please log in.
  AUTH_UNEXPECTED_REGISTRATION_STATE: 'AUTH_UNEXPECTED_REGISTRATION_STATE', // Unexpected registration state.
  AUTH_EMAIL_NOT_VERIFIED: 'AUTH_EMAIL_NOT_VERIFIED', // Your email is not verified. Please complete verification to continue.
  AUTH_REGISTER_SUCCESS: 'AUTH_REGISTER_SUCCESS', // Registration successful! Please verify your account using the OTP sent to your email.
  AUTH_LOGIN_SUCCESS: 'AUTH_LOGIN_SUCCESS', // Login successful.
  AUTH_TOKEN_MISSING: 'AUTH_TOKEN_MISSING', // Access token is missing.
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID', // Invalid or expired access token.

  OTP_EXPIRED_OR_INVALID: 'OTP_EXPIRED_OR_INVALID', // The OTP has expired or is invalid. Please request a new one.
  OTP_INCORRECT: 'OTP_INCORRECT', // The OTP you entered is incorrect.
  OTP_VERIFIED_SUCCESS: 'OTP_VERIFIED_SUCCESS', // OTP verified successfully.
  OTP_RESEND_COOLDOWN_ACTIVE: 'OTP_RESEND_COOLDOWN_ACTIVE', // Please wait before requesting another verification code.
  OTP_RESENT_SUCCESS: 'OTP_RESENT_SUCCESS', // A new verification code has been sent to your email.

  VALIDATION_EMAIL_INVALID: 'VALIDATION_EMAIL_INVALID', // Please provide a valid email address.
  VALIDATION_EMAIL_PASSWORD_REQUIRED: 'VALIDATION_EMAIL_PASSWORD_REQUIRED', // Email and password are required.
  VALIDATION_EMAIL_PASSWORD_INVALID: 'VALIDATION_EMAIL_PASSWORD_INVALID', // Invalid email or password.
  VALIDATION_EMAIL_OTP_REQUIRED: 'VALIDATION_EMAIL_OTP_REQUIRED', // Email and OTP are required.
  VALIDATION_EMAIL_OTP_INVALID: 'VALIDATION_EMAIL_OTP_INVALID', // Invalid email or otp.

  EMAIL_SERVICE_NOT_CONFIGURED: 'EMAIL_SERVICE_NOT_CONFIGURED', // Email service is not configured properly.
  EMAIL_UNKNOWN_ERROR: 'EMAIL_UNKNOWN_ERROR', // Failed to send OTP email due to an unknown error.

  SYSTEM_INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR', // Internal server error
  SYSTEM_DATABASE_CONNECTION_FAILED: 'SYSTEM_DATABASE_CONNECTION_FAILED', // Database connection failed
  SYSTEM_DATABASE_CONNECTED: 'SYSTEM_DATABASE_CONNECTED', // Database Connected

  REDIS_OTP_STORAGE_FAILED: 'REDIS_OTP_STORAGE_FAILED', // Failed to store verification code. Please try again later.
} as const;
