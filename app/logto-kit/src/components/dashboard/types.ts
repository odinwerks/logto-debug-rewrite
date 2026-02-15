import type { UserData, MfaVerification } from '../../logic/types';
import type { ThemeColors } from '../../themes';
import type { Translations } from '../../locales';

export interface DashboardData {
  userData: UserData;
  accessToken: string;
}

export type TabId = 'profile' | 'custom-data' | 'identities' | 'organizations' | 'mfa' | 'raw';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

export interface VerificationState {
  type: 'email' | 'phone' | null;
  operation: 'add' | 'edit' | 'remove' | null;
  step: 'password' | 'code' | null;
  verificationId: string | null;
  newValue: string;
}

// Dashboard context for passing theme, locale, and callbacks
export interface DashboardContext {
  theme: ThemeColors;
  t: Translations;
  locale: string;
  showToast: (type: 'success' | 'error' | 'info', message: string) => void;
  refreshData: () => void;
}

// Re-export for convenience
export type { UserData, MfaVerification, ThemeColors, Translations };
