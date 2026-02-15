'use server';

import { getAccessToken, getLogtoContext } from '@logto/next/server-actions';
import { logtoConfig } from '../../../logto';
import type { DashboardResult, DashboardSuccess, UserData, MfaVerification } from './types';

// ============================================================================
// Environment Configuration
// ============================================================================

function getCleanEndpoint(): string {
  const endpoint = process.env.ENDPOINT;
  if (!endpoint) {
    throw new Error(
      'ENDPOINT environment variable is missing! ' +
        'Set it in your .env.local file: ENDPOINT=https://auth.yourdomain.org'
    );
  }
  return endpoint.replace(/\/$/, '');
}

// ============================================================================
// Token Helper - ONLY used in Server Actions
// ============================================================================

async function getTokenForServerAction(): Promise<string> {
  const token = await getAccessToken(logtoConfig, '');
  if (!token) throw new Error('No access token available for Account API');
  return token;
}

// ============================================================================
// Dashboard Data Fetching (Used in RSC)
// ============================================================================

export async function fetchDashboardData(): Promise<DashboardResult> {
  try {
    const { isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return { success: false, needsAuth: true };
    }

    const token = await getTokenForServerAction();
    const cleanEndpoint = getCleanEndpoint();
    const res = await fetch(`${cleanEndpoint}/api/my-account`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Logto API ${res.status}: ${errorText.substring(0, 200)}`);
    }

    const userData: UserData = await res.json();

    return {
      success: true,
      userData,
      accessToken: token,
    };
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// ============================================================================
// Authentication Actions
// ============================================================================

export async function signOutUser(): Promise<void> {
  const { signOut } = await import('@logto/next/server-actions');
  await signOut(logtoConfig);
}

// ============================================================================
// Profile Management Actions
// ============================================================================

export async function updateUserBasicInfo(updates: {
  name?: string;
  username?: string;
  avatar?: string;
}): Promise<void> {
  const token = await getTokenForServerAction();
  const cleanEndpoint = getCleanEndpoint();
  const url = `${cleanEndpoint}/api/my-account`;

  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, v]) => v !== undefined && v !== '')
  );

  if (Object.keys(cleanUpdates).length === 0) return;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cleanUpdates),
  });

  const responseText = await res.text();

  if (!res.ok) {
    throw new Error(`Basic info update failed ${res.status}: ${responseText.substring(0, 200)}`);
  }
}

export async function updateUserProfile(profile: {
  givenName?: string;
  familyName?: string;
}): Promise<void> {
  const token = await getTokenForServerAction();
  const cleanEndpoint = getCleanEndpoint();
  const url = `${cleanEndpoint}/api/my-account/profile`;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  });

  const responseText = await res.text();

  if (!res.ok) {
    throw new Error(`Profile update failed ${res.status}: ${responseText.substring(0, 200)}`);
  }
}

export async function updateUserCustomData(customData: Record<string, unknown>): Promise<void> {
  const token = await getTokenForServerAction();
  const cleanEndpoint = getCleanEndpoint();
  const url = `${cleanEndpoint}/api/my-account`;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ customData }),
  });

  const responseText = await res.text();

  if (!res.ok) {
    throw new Error(`Custom data update failed ${res.status}: ${responseText.substring(0, 200)}`);
  }
}

export async function updateAvatarUrl(avatarUrl: string): Promise<void> {
  const token = await getTokenForServerAction();
  const cleanEndpoint = getCleanEndpoint();
  const url = `${cleanEndpoint}/api/my-account`;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ avatar: avatarUrl }),
  });

  const responseText = await res.text();

  if (!res.ok) {
    throw new Error(`Avatar update failed ${res.status}: ${responseText.substring(0, 200)}`);
  }
}

// ============================================================================
// Verification Actions
// ============================================================================

export async function verifyPasswordForIdentity(password: string): Promise<{ verificationRecordId: string }> {
  const token = await getTokenForServerAction();
  const cleanEndpoint = getCleanEndpoint();
  const url = `${cleanEndpoint}/api/verifications/password`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });

  const responseText = await res.text();

  if (!res.ok) {
    throw new Error(`Password verification failed ${res.status}: ${responseText.substring(0, 200)}`);
  }

  const parsed = JSON.parse(responseText);
  if (!parsed.verificationRecordId) {
    throw new Error(`API didn't return verificationRecordId. Got: ${JSON.stringify(parsed)}`);
  }

  return { verificationRecordId: parsed.verificationRecordId };
}

export async function sendEmailVerificationCode(email: string): Promise<{ verificationId: string }> {
  const token = await getTokenForServerAction();
  const cleanEndpoint = getCleanEndpoint();
  const url = `${cleanEndpoint}/api/verifications/verification-code`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      identifier: { type: 'email', value: email },
    }),
  });

  const responseText = await res.text();

  if (!res.ok) {
    throw new Error(`Email verification send failed ${res.status}: ${responseText.substring(0, 200)}`);
  }

  const parsed = JSON.parse(responseText);
  if (!parsed.verificationRecordId) {
    throw new Error(`API didn't return verificationRecordId. Got: ${JSON.stringify(parsed)}`);
  }

  return { verificationId: parsed.verificationRecordId };
}

export async function sendPhoneVerificationCode(phone: string): Promise<{ verificationId: string }> {
  const token = await getTokenForServerAction();
  const cleanEndpoint = getCleanEndpoint();
  const url = `${cleanEndpoint}/api/verifications/verification-code`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      identifier: { type: 'phone', value: phone },
    }),
  });

  const responseText = await res.text();

  if (!res.ok) {
    throw new Error(`Phone verification send failed ${res.status}: ${responseText.substring(0, 200)}`);
  }

  const parsed = JSON.parse(responseText);
  if (!parsed.verificationRecordId) {
    throw new Error(`API didn't return verificationRecordId. Got: ${JSON.stringify(parsed)}`);
  }

  return { verificationId: parsed.verificationRecordId };
}

export async function verifyVerificationCode(
  type: 'email' | 'phone',
  value: string,
  verificationId: string,
  code: string
): Promise<{ verificationRecordId: string }> {
  const token = await getTokenForServerAction();
  const cleanEndpoint = getCleanEndpoint();
  const url = `${cleanEndpoint}/api/verifications/verification-code/verify`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      identifier: { type, value },
      verificationId,
      code,
    }),
  });

  const responseText = await res.text();

  if (!res.ok) {
    throw new Error(`Verification failed ${res.status}: ${responseText.substring(0, 200)}`);
  }

  const parsed = JSON.parse(responseText);
  if (!parsed.verificationRecordId) {
    throw new Error(`API didn't return verificationRecordId. Got: ${JSON.stringify(parsed)}`);
  }

  return { verificationRecordId: parsed.verificationRecordId };
}

// ============================================================================
// Contact Information Updates (Require Verification)
// ============================================================================

export async function updateEmailWithVerification(
  email: string | null,
  newIdentifierVerificationRecordId: string,
  identityVerificationRecordId: string
): Promise<void> {
  const token = await getTokenForServerAction();
  const cleanEndpoint = getCleanEndpoint();
  const url = `${cleanEndpoint}/api/my-account/primary-email`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'logto-verification-id': identityVerificationRecordId,
    },
    body: JSON.stringify({
      email,
      newIdentifierVerificationRecordId,
    }),
  });

  const responseText = await res.text();

  if (!res.ok) {
    throw new Error(`Email update failed ${res.status}: ${responseText.substring(0, 200)}`);
  }
}

export async function updatePhoneWithVerification(
  phone: string,
  newIdentifierVerificationRecordId: string,
  identityVerificationRecordId: string
): Promise<void> {
  const token = await getTokenForServerAction();
  const cleanEndpoint = getCleanEndpoint();
  const url = `${cleanEndpoint}/api/my-account/primary-phone`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'logto-verification-id': identityVerificationRecordId,
    },
    body: JSON.stringify({
      phone,
      newIdentifierVerificationRecordId,
    }),
  });

  const responseText = await res.text();

  if (!res.ok) {
    throw new Error(`Phone update failed ${res.status}: ${responseText.substring(0, 200)}`);
  }
}

export async function removeUserEmail(identityVerificationRecordId: string): Promise<void> {
  const token = await getTokenForServerAction();
  const cleanEndpoint = getCleanEndpoint();
  const url = `${cleanEndpoint}/api/my-account/primary-email`;

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'logto-verification-id': identityVerificationRecordId,
    },
  });

  const responseText = await res.text();
  if (!res.ok) {
    throw new Error(`Email removal failed ${res.status}: ${responseText.substring(0, 200)}`);
  }
}

export async function removeUserPhone(identityVerificationRecordId: string): Promise<void> {
  const token = await getTokenForServerAction();
  const cleanEndpoint = getCleanEndpoint();
  const url = `${cleanEndpoint}/api/my-account/primary-phone`;

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'logto-verification-id': identityVerificationRecordId,
    },
  });

  const responseText = await res.text();
  if (!res.ok) {
    throw new Error(`Phone removal failed ${res.status}: ${responseText.substring(0, 200)}`);
  }
}

// ============================================================================
// MFA Management Actions
// ============================================================================

export async function getMfaVerifications(): Promise<MfaVerification[]> {
  const token = await getTokenForServerAction();
  const cleanEndpoint = getCleanEndpoint();
  const url = `${cleanEndpoint}/api/my-account/mfa-verifications`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Get MFA verifications failed ${res.status}: ${errorText.substring(0, 200)}`);
  }

  return res.json();
}

export async function generateTotpSecret(): Promise<{ secret: string; secretQrCode: string }> {
  const token = await getTokenForServerAction();
  const cleanEndpoint = getCleanEndpoint();
  const url = `${cleanEndpoint}/api/my-account/mfa-verifications/totp-secret/generate`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Generate TOTP secret failed ${res.status}: ${errorText.substring(0, 200)}`);
  }

  return res.json();
}

export async function addMfaVerification(
  type: string,
  payload: { secret: string; code: string } | Record<string, unknown>,
  identityVerificationRecordId: string
): Promise<void> {
  const token = await getTokenForServerAction();
  const cleanEndpoint = getCleanEndpoint();
  const url = `${cleanEndpoint}/api/my-account/mfa-verifications`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'logto-verification-id': identityVerificationRecordId,
    },
    body: JSON.stringify({ type, ...payload }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Add MFA verification failed ${res.status}: ${errorText.substring(0, 200)}`);
  }
}

export async function deleteMfaVerification(
  verificationId: string,
  identityVerificationRecordId: string
): Promise<void> {
  const token = await getTokenForServerAction();
  const cleanEndpoint = getCleanEndpoint();
  const url = `${cleanEndpoint}/api/my-account/mfa-verifications/${verificationId}`;

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'logto-verification-id': identityVerificationRecordId,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Delete MFA verification failed ${res.status}: ${errorText.substring(0, 200)}`);
  }
}

export async function generateBackupCodes(identityVerificationRecordId: string): Promise<{ codes: string[] }> {
  const token = await getTokenForServerAction();
  const cleanEndpoint = getCleanEndpoint();
  const url = `${cleanEndpoint}/api/my-account/mfa-verifications/backup-codes/generate`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'logto-verification-id': identityVerificationRecordId,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Generate backup codes failed ${res.status}: ${errorText.substring(0, 200)}`);
  }

  return res.json();
}

export async function getBackupCodes(
  identityVerificationRecordId: string
): Promise<{ codes: Array<{ code: string; usedAt: string | null }> }> {
  const token = await getTokenForServerAction();
  const cleanEndpoint = getCleanEndpoint();
  const url = `${cleanEndpoint}/api/my-account/mfa-verifications/backup-codes`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'logto-verification-id': identityVerificationRecordId,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Get backup codes failed ${res.status}: ${errorText.substring(0, 200)}`);
  }

  return res.json();
}
