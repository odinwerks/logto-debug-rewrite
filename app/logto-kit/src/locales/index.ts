// ============================================================================
// i18n System - ENV-based Locale Loading
// ============================================================================
// Usage:
//   LANG_MAIN=en-US (or NEXT_LANG_NAME=en-US) - sets default language
//   LANG_AVAILABLE=en-US,ka-GE (or NEXT_LANG_AVAILABLE) - available languages
//
// If not set, falls back to 'en-US'
// ============================================================================

import { enUS } from './en-US';
import { kaGE } from './ka-GE';

export type LocaleCode = 'en-US' | 'ka-GE';

export interface Translations {
  // Dashboard
  dashboard: {
    title: string;
    version: string;
    loading: string;
    error: string;
    refresh: string;
    signOut: string;
    session: string;
    processing: string;
    systemMessage: string;
  };
  
  // Terminal header
  terminal: {
    prompt: string;
    command: string;
  };
  
  // Tabs
  tabs: {
    profile: string;
    customData: string;
    identities: string;
    organizations: string;
    mfa: string;
    raw: string;
  };
  
  // Sidebar
  sidebar: {
    profileAvatar: string;
    noAvatar: string;
    token: string;
    userId: string;
    lastLogin: string;
    lightMode: string;
    darkMode: string;
  };
  
  // Profile tab
  profile: {
    userProfile: string;
    basicInfo: string;
    editingProfile: string;
    givenName: string;
    familyName: string;
    username: string;
    email: string;
    phone: string;
    name: string;
    editProfile: string;
    saveProfile: string;
    saving: string;
    cancel: string;
    add: string;
    edit: string;
    remove: string;
    null: string;
    notSet: string;
    avatarUrl: string;
    editAvatarUrl: string;
  };
  
  // Verification
  verification: {
    password: string;
    verifyPassword: string;
    verificationCode: string;
    verifyCode: string;
    codeSent: string;
  };
  
  // Custom Data tab
  customData: {
    title: string;
    editing: string;
    jsonData: string;
    editCustomData: string;
    save: string;
    empty: string;
    noCustomData: string;
    invalidJson: string;
    mustBeObject: string;
  };
  
  // Identities tab
  identities: {
    title: string;
    noIdentities: string;
  };
  
  // Organizations tab
  organizations: {
    title: string;
    orgs: string;
    orgRoles: string;
    noOrganizations: string;
    noRoles: string;
  };
  
  // MFA tab
  mfa: {
    title: string;
    enrolledFactors: string;
    noFactors: string;
    enrollNewFactor: string;
    totp: string;
    totpDescription: string;
    authenticatorApp: string;
    generateTotpSecret: string;
    scanQrCode: string;
    cantScan: string;
    enterManually: string;
    enterCodeFromApp: string;
    verifyAndEnroll: string;
    backupCodes: string;
    generateNewCodes: string;
    viewExisting: string;
    saveTheseCodes: string;
    existingCodes: string;
    codesLeft: string;
    downloadTxt: string;
    downloadHtml: string;
    finishAndSave: string;
    hide: string;
    webauthn: string;
    webauthnDescription: string;
    enrollWebauthn: string;
    remove: string;
    created: string;
    lastUsed: string;
  };
  
  // Raw tab
  raw: {
    title: string;
    rawUserData: string;
  };
  
  // Common
  common: {
    copy: string;
    copied: string;
    close: string;
    success: string;
    error: string;
    loading: string;
    retry: string;
  };
}

// Registry of all locales
const locales: Record<LocaleCode, Translations> = {
  'en-US': enUS,
  'ka-GE': kaGE,
};

/**
 * Get main locale from environment
 * Priority: LANG_MAIN > NEXT_LANG_NAME > 'en-US'
 */
export function getMainLocale(): LocaleCode {
  const lang = process.env.LANG_MAIN || process.env.NEXT_LANG_NAME || 'en-US';
  const normalized = lang.toUpperCase() as LocaleCode;
  
  // Check if locale exists
  if (locales[normalized]) {
    return normalized;
  }
  
  // Try without region
  const baseLang = normalized.split('-')[0];
  const match = Object.keys(locales).find(l => l.startsWith(baseLang));
  return (match as LocaleCode) || 'en-US';
}

/**
 * Get available locales from environment
 * LANG_AVAILABLE and NEXT_LANG_AVAILABLE should be comma-separated list
 */
export function getAvailableLocales(): LocaleCode[] {
  const available = process.env.LANG_AVAILABLE || process.env.NEXT_LANG_AVAILABLE || 'en-US';
  const codes = available.split(',').map(l => l.trim().toUpperCase() as LocaleCode);
  
  // Filter to only valid locales
  return codes.filter(code => locales[code]);
}

/**
 * Get translations for a locale
 */
export function getTranslations(locale: LocaleCode): Translations {
  return locales[locale] || locales['en-US'];
}

/**
 * Check if a locale is available
 */
export function isLocaleAvailable(locale: string): boolean {
  return locale.toUpperCase() in locales;
}

// Export individual locales
export { enUS } from './en-US';
export { kaGE } from './ka-GE';

// Default export
export default locales;
