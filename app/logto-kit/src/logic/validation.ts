export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

const E164_REGEX = /^\+[1-9]\d{1,14}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;

export function validateE164(phone: string, field = 'phone'): void {
  const cleaned = phone.replace(/[\s-]/g, '');
  if (!E164_REGEX.test(cleaned)) {
    throw new ValidationError('Phone must be E.164 format (e.g., +995555123456)', field);
  }
}

export function validateEmail(email: string, field = 'email'): void {
  if (!EMAIL_REGEX.test(email)) {
    throw new ValidationError('Invalid email format', field);
  }
  if (email.length > 128) {
    throw new ValidationError('Email too long (max 128 characters)', field);
  }
}

export function validatePassword(password: string, field = 'password'): void {
  if (!password || password.length === 0) {
    throw new ValidationError('Password is required', field);
  }
  if (password.length > 256) {
    throw new ValidationError('Password too long (max 256 characters)', field);
  }
}

export function validateVerificationCode(code: string, field = 'code'): void {
  if (!/^\d{6}$/.test(code)) {
    throw new ValidationError('Code must be exactly 6 digits', field);
  }
}

export function validateVerificationId(id: string, field = 'verificationId'): void {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    throw new ValidationError('Verification ID is required', field);
  }
}

export function validateUsername(username: string, field = 'username'): void {
  if (!username) return;
  if (username.length < 3) {
    throw new ValidationError('Username too short (min 3 characters)', field);
  }
  if (username.length > 32) {
    throw new ValidationError('Username too long (max 32 characters)', field);
  }
  if (!USERNAME_REGEX.test(username)) {
    throw new ValidationError(
      'Username can only contain letters, numbers, underscores, and hyphens',
      field
    );
  }
}

export function validateUrl(url: string, field = 'url'): void {
  if (!url) return;
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new ValidationError('URL must use http or https protocol', field);
    }
  } catch {
    throw new ValidationError('Invalid URL format', field);
  }
}

export function validateJsonObject(value: string, field = 'json'): Record<string, unknown> {
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new ValidationError('Must be a JSON object (not array or null)', field);
    }
    return parsed;
  } catch (e) {
    if (e instanceof ValidationError) throw e;
    throw new ValidationError(
      `Invalid JSON: ${e instanceof Error ? e.message : 'parse error'}`,
      field
    );
  }
}

export function sanitizeLogtoError(errorText: string | null | undefined): string {
  if (!errorText) return 'Unknown error';

  return String(errorText)
    .replace(/https?:\/\/\S+/g, '[URL]')
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]')
    .replace(/\+[1-9]\d{1,14}/g, '[PHONE]')
    .replace(/[A-Za-z0-9_-]{20,}/g, '[TOKEN]')
    .substring(0, 200);
}

export type ValidationResult<T = void> =
  | { success: true; value: T }
  | { success: false; error: string; field?: string };
