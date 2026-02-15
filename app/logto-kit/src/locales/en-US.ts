import type { Translations } from './index';

export const enUS: Translations = {
  // Dashboard
  dashboard: {
    title: 'LOGTO DEBUG DASHBOARD',
    version: 'v3.4',
    loading: '[LOADING USER DATA...]',
    error: '[ERROR]',
    refresh: '[REFRESH]',
    signOut: '[SIGN OUT]',
    session: 'SESSION',
    processing: '[PROCESSING...]',
    systemMessage: '[SYSTEM] This debug tool is barely an ALPHA. It itself may be a bug. Haaaave fuun.',
  },
  
  // Terminal header
  terminal: {
    prompt: 'user@logto-debug:~$',
    command: 'sudo userinfo --verbose --edit',
  },
  
  // Tabs
  tabs: {
    profile: 'USER',
    customData: 'CUSTOM',
    identities: 'IDENTITIES',
    organizations: 'ORGS',
    mfa: 'MFA',
    raw: 'RAW',
  },
  
  // Sidebar
  sidebar: {
    profileAvatar: 'PROFILE AVATAR',
    noAvatar: 'NO\nAVATAR',
    token: 'TOKEN',
    userId: 'USER_ID',
    lastLogin: 'LAST_LOGIN',
    lightMode: '[LIGHT MODE]',
    darkMode: '[DARK MODE]',
  },
  
  // Profile tab
  profile: {
    userProfile: 'USER PROFILE',
    basicInfo: 'BASIC INFORMATION',
    editingProfile: 'EDITING PROFILE',
    givenName: 'GIVEN NAME',
    familyName: 'FAMILY NAME',
    username: 'USERNAME',
    email: 'EMAIL',
    phone: 'PHONE',
    name: 'NAME',
    editProfile: '[EDIT PROFILE]',
    saveProfile: '[SAVE PROFILE]',
    saving: '[SAVING...]',
    cancel: '[CANCEL]',
    add: '[ADD]',
    edit: '[EDIT]',
    remove: '[REMOVE]',
    null: 'null',
    notSet: '(not set)',
    avatarUrl: 'AVATAR URL',
    editAvatarUrl: '[EDIT AVATAR URL]',
  },
  
  // Verification
  verification: {
    password: 'Password',
    verifyPassword: '[VERIFY PASS]',
    verificationCode: 'Code',
    verifyCode: '[VERIFY CODE]',
    codeSent: 'Code sent to',
  },
  
  // Custom Data tab
  customData: {
    title: 'CUSTOM DATA',
    editing: 'EDITING CUSTOM DATA',
    jsonData: 'JSON DATA',
    editCustomData: '[EDIT CUSTOM DATA]',
    save: '[SAVE]',
    empty: '[EMPTY]',
    noCustomData: 'No custom data fields found',
    invalidJson: 'Invalid JSON',
    mustBeObject: 'Must be a JSON object',
  },
  
  // Identities tab
  identities: {
    title: 'IDENTITIES',
    noIdentities: 'No external identities linked',
  },
  
  // Organizations tab
  organizations: {
    title: 'ORGANIZATIONS',
    orgs: 'ORGANIZATIONS',
    orgRoles: 'ORGANIZATION ROLES',
    noOrganizations: 'Not a member of any organizations',
    noRoles: 'No organization roles assigned',
  },
  
  // MFA tab
  mfa: {
    title: 'MULTI-FACTOR AUTHENTICATION',
    enrolledFactors: 'ENROLLED FACTORS',
    noFactors: '[NO MFA FACTORS ENROLLED]',
    enrollNewFactor: 'ENROLL NEW FACTOR',
    totp: 'TOTP',
    totpDescription: '(Authenticator App)',
    authenticatorApp: 'Authenticator App',
    generateTotpSecret: '[GENERATE TOTP SECRET]',
    scanQrCode: 'Scan this QR code with your authenticator app:',
    cantScan: "Can't scan?",
    enterManually: 'Enter this secret manually in your authenticator app.',
    enterCodeFromApp: 'Enter 6-digit code from app',
    verifyAndEnroll: '[VERIFY & ENROLL]',
    backupCodes: 'BACKUP CODES',
    generateNewCodes: '[GENERATE NEW CODES]',
    viewExisting: '[VIEW EXISTING]',
    saveTheseCodes: 'SAVE THESE CODES - Each can be used only once:',
    existingCodes: 'EXISTING BACKUP CODES:',
    codesLeft: 'Codes left',
    downloadTxt: '[DOWNLOAD .TXT]',
    downloadHtml: '[DOWNLOAD .HTML]',
    finishAndSave: '[FINISH & SAVE]',
    hide: '[HIDE]',
    webauthn: 'WEBAUTHN',
    webauthnDescription: '(Passkey) - WebAuthn enrollment requires browser API integration. Use device biometrics or security keys.',
    enrollWebauthn: '[ENROLL WEBAUTHN]',
    remove: '[REMOVE]',
    created: 'Created',
    lastUsed: 'Last used',
  },
  
  // Raw tab
  raw: {
    title: 'RAW',
    rawUserData: 'RAW USER DATA',
  },
  
  // Common
  common: {
    copy: 'COPY',
    copied: 'COPIED!',
    close: '[CLOSE]',
    success: '[SUCCESS]',
    error: '[ERROR]',
    loading: '[...]',
    retry: '[RETRY]',
  },
};

export default enUS;
