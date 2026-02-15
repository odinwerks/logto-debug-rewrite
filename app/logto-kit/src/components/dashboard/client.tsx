'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { IBM_Plex_Mono } from 'next/font/google';
import type { DashboardData, TabId, ToastMessage } from './types';
import type { ThemeColors } from '../../themes';
import type { Translations } from '../../locales';
import { darkColors, lightColors } from '../../themes';
import { ToastContainer } from './shared/Toast';
import { TruncatedToken } from './shared/CodeBlock';
import { ProfileTab } from './tabs/profile';
import { CustomDataTab } from './tabs/custom-data';
import { MfaTab } from './tabs/mfa';
import { IdentitiesTab } from './tabs/identities';
import { OrganizationsTab } from './tabs/organizations';
import { RawDataTab } from './tabs/raw-data';

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
});

interface DashboardClientProps {
  initialData: DashboardData;
  translations: Translations;
  initialTheme?: 'dark' | 'light';
  onUpdateBasicInfo: (updates: { name?: string; username?: string }) => Promise<void>;
  onUpdateAvatarUrl: (avatarUrl: string) => Promise<void>;
  onUpdateProfile: (profile: { givenName?: string; familyName?: string }) => Promise<void>;
  onUpdateCustomData: (customData: Record<string, unknown>) => Promise<void>;
  onVerifyPassword: (password: string) => Promise<{ verificationRecordId: string }>;
  onSendEmailVerification: (email: string) => Promise<{ verificationId: string }>;
  onSendPhoneVerification: (phone: string) => Promise<{ verificationId: string }>;
  onVerifyCode: (type: 'email' | 'phone', value: string, verificationId: string, code: string) => Promise<{ verificationRecordId: string }>;
  onUpdateEmail: (email: string | null, newIdentifierVerificationRecordId: string, identityVerificationRecordId: string) => Promise<void>;
  onUpdatePhone: (phone: string, newIdentifierVerificationRecordId: string, identityVerificationRecordId: string) => Promise<void>;
  onRemoveEmail: (identityVerificationRecordId: string) => Promise<void>;
  onRemovePhone: (identityVerificationRecordId: string) => Promise<void>;
  onGetMfaVerifications: () => Promise<Array<MfaVerification>>;
  onGenerateTotpSecret: () => Promise<{ secret: string; secretQrCode: string }>;
  onAddMfaVerification: (type: string, payload: any, identityVerificationRecordId: string) => Promise<void>;
  onDeleteMfaVerification: (verificationId: string, identityVerificationRecordId: string) => Promise<void>;
  onGenerateBackupCodes: (identityVerificationRecordId: string) => Promise<{ codes: string[] }>;
  onGetBackupCodes: (identityVerificationRecordId: string) => Promise<{ codes: Array<{ code: string; usedAt: string | null }> }>;
  onSignOut: () => Promise<void>;
  onRefresh: () => Promise<{ success: boolean; redirect?: string }>;
}

export function DashboardClient({
  initialData,
  translations: t,
  initialTheme = 'dark',
  onUpdateBasicInfo,
  onUpdateAvatarUrl,
  onUpdateProfile,
  onUpdateCustomData,
  onVerifyPassword,
  onSendEmailVerification,
  onSendPhoneVerification,
  onVerifyCode,
  onUpdateEmail,
  onUpdatePhone,
  onRemoveEmail,
  onRemovePhone,
  onGetMfaVerifications,
  onGenerateTotpSecret,
  onAddMfaVerification,
  onDeleteMfaVerification,
  onGenerateBackupCodes,
  onGetBackupCodes,
  onSignOut,
  onRefresh,
}: DashboardClientProps) {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(initialTheme);
  const themeColors = useMemo(() => (theme === 'dark' ? darkColors : lightColors), [theme]);

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('logto-dashboard-theme') as 'dark' | 'light' | null;
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      setTheme(savedTheme);
    }
  }, []);

  // Save theme when changed
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('logto-dashboard-theme', newTheme);
      return newTheme;
    });
  }, []);

  // Tab state
  const [activeTab, setActiveTab] = useState<TabId>('profile');

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const toast: ToastMessage = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      message,
      duration: type === 'success' ? 3000 : 5000,
    };
    setToasts((prev) => [...prev, toast]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Data refresh
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
      window.location.reload();
    } catch (error) {
      showToast('error', 'Failed to refresh data');
      setIsRefreshing(false);
    }
  }, [onRefresh, showToast]);

  // Sign out
  const handleSignOut = useCallback(async () => {
    try {
      await onSignOut();
    } catch (error) {
      showToast('error', 'Sign out failed');
    }
  }, [onSignOut, showToast]);

  // Get initials for avatar fallback
  const getInitials = useCallback((data: UserData): string => {
    if (!data) return '?';
    if (data.profile?.givenName && data.profile?.familyName) {
      return `${data.profile.givenName[0]}${data.profile.familyName[0]}`.toUpperCase();
    }
    if (data.name) {
      const parts = data.name.split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return parts[0][0]?.toUpperCase() || '?';
    }
    if (data.username) {
      return data.username[0]?.toUpperCase() || '?';
    }
    return '?';
  }, []);

  // Format date
  const formatDate = useCallback((timestamp?: number | string) => {
    if (!timestamp) return 'N/A';
    try {
      let date: Date;
      if (typeof timestamp === 'string') {
        date = new Date(timestamp);
      } else {
        if (timestamp < 1e12) {
          date = new Date(timestamp * 1000);
        } else {
          date = new Date(timestamp);
        }
      }
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    } catch {
      return 'Invalid Date';
    }
  }, []);

  // Tabs configuration
  const tabs: Array<{ id: TabId; label: string; icon: string }> = [
    { id: 'profile', label: t.tabs.profile, icon: '>' },
    { id: 'custom-data', label: t.tabs.customData, icon: '>' },
    { id: 'identities', label: t.tabs.identities, icon: '>' },
    { id: 'organizations', label: t.tabs.organizations, icon: '>' },
    { id: 'raw', label: t.tabs.raw, icon: '>' },
    { id: 'mfa', label: t.tabs.mfa, icon: '>' },
  ];

  // Determine token type
  const isJwt = initialData.accessToken.split('.').length === 3;
  const tokenPrefix = isJwt ? 'JWT' : 'OPAQUE';

  return (
    <div
      className={ibmPlexMono.className}
      style={{
        padding: '12px',
        maxWidth: '100vw',
        margin: '0',
        backgroundColor: themeColors.bgPage,
        color: themeColors.textPrimary,
        minHeight: '100vh',
        boxSizing: 'border-box',
        fontWeight: themeColors.fontWeight,
        fontFamily: 'var(--font-ibm-plex-mono)',
      }}
    >
      {/* Header - Terminal Style */}
      <div
        style={{
          background: themeColors.bgSecondary,
          border: `1px solid ${themeColors.borderColor}`,
          borderRadius: '6px',
          marginBottom: '16px',
          overflow: 'hidden',
        }}
      >
        {/* Terminal prompt line */}
        <div
          style={{
            background: themeColors.bgPrimary,
            padding: '10px 16px',
            borderBottom: `1px solid ${themeColors.borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '12px', color: themeColors.textTertiary }}>
            {t.terminal.prompt} {t.terminal.command}
          </span>
        </div>

        {/* Dashboard info line */}
        <div style={{ padding: '14px', background: themeColors.bgPrimary }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '10px',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontSize: '13px', color: themeColors.textTertiary }}>
              [{t.dashboard.title} {t.dashboard.version}]
            </span>
            <span style={{ fontSize: '11px', color: themeColors.textTertiary, fontWeight: 'bold' }}>
              {t.dashboard.session}: {initialData.userData.id.substring(0, 12)}...
            </span>
            {isRefreshing && (
              <span style={{ fontSize: '11px', color: themeColors.accentYellow }}>
                {t.dashboard.processing}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Layout - Two Column */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: '16px',
          alignItems: 'start',
          maxHeight: 'calc(100vh - 140px)',
          overflow: 'hidden',
        }}
      >
        {/* Left Sidebar */}
        <div
          style={{
            border: `1px solid ${themeColors.borderColor}`,
            borderRadius: '6px',
            padding: '14px',
            background: themeColors.bgSecondary,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxHeight: 'calc(100vh - 140px)',
            overflowY: 'auto',
          }}
        >
          {/* Avatar Card */}
          <div
            style={{
              padding: '18px',
              background: themeColors.bgPrimary,
              border: `1px solid ${themeColors.borderColor}`,
              borderRadius: '5px',
            }}
          >
            <div style={{ color: themeColors.textTertiary, fontSize: '10px', marginBottom: '12px' }}>
              {t.sidebar.profileAvatar}
            </div>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '14px' }}>
              {/* Initials Avatar */}
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  border: `2px solid ${themeColors.borderColor}`,
                  background: themeColors.bgTertiary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  color: themeColors.textTertiary,
                }}
              >
                {getInitials(initialData.userData)}
              </div>

              {/* Actual Avatar */}
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  border: `2px solid ${themeColors.borderColor}`,
                  background: initialData.userData.avatar ? 'transparent' : themeColors.bgTertiary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {initialData.userData.avatar ? (
                  <img
                    src={initialData.userData.avatar}
                    alt="Avatar"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      fontSize: '14px',
                      color: themeColors.textTertiary,
                      textAlign: 'center',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {t.sidebar.noAvatar}
                  </div>
                )}
              </div>
            </div>

            {/* Avatar URL display */}
            <div
              style={{
                color: themeColors.textTertiary,
                fontSize: '10px',
                wordBreak: 'break-all',
                marginBottom: '10px',
                textAlign: 'center',
              }}
            >
              {initialData.userData.avatar
                ? initialData.userData.avatar.substring(0, 40) + '...'
                : 'No avatar URL'}
            </div>
          </div>

          {/* Token Card */}
          <div>
            <div style={{ color: themeColors.textTertiary, fontSize: '10px', marginBottom: '6px' }}>
              {tokenPrefix}_{t.sidebar.token}
            </div>
            <TruncatedToken token={initialData.accessToken} themeColors={themeColors} />
          </div>

          {/* User ID Card */}
          <div
            style={{
              padding: '10px',
              background: themeColors.bgPrimary,
              border: `1px solid ${themeColors.borderColor}`,
              borderRadius: '4px',
            }}
          >
            <div style={{ color: themeColors.textTertiary, fontSize: '10px', marginBottom: '6px' }}>
              {t.sidebar.userId}
            </div>
            <div
              style={{
                color: themeColors.textPrimary,
                fontSize: '12px',
                wordBreak: 'break-all',
              }}
            >
              {initialData.userData.id}
            </div>
          </div>

          {/* Last Login Card */}
          <div
            style={{
              padding: '10px',
              background: themeColors.bgPrimary,
              border: `1px solid ${themeColors.borderColor}`,
              borderRadius: '4px',
            }}
          >
            <div style={{ color: themeColors.textTertiary, fontSize: '10px', marginBottom: '6px' }}>
              {t.sidebar.lastLogin}
            </div>
            <div style={{ color: themeColors.textPrimary, fontSize: '12px' }}>
              {formatDate(initialData.userData.lastSignInAt)}
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              padding: '14px',
              background: themeColors.bgPrimary,
              border: `1px solid ${themeColors.borderColor}`,
              borderRadius: '4px',
              display: 'flex',
              gap: '10px',
            }}
          >
            <button
              onClick={toggleTheme}
              style={{
                flex: 1,
                padding: '8px',
                background: themeColors.bgTertiary,
                color: themeColors.textPrimary,
                border: `1px solid ${themeColors.borderColor}`,
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                fontFamily: 'var(--font-ibm-plex-mono)',
              }}
            >
              {theme === 'dark' ? t.sidebar.lightMode : t.sidebar.darkMode}
            </button>
            <button
              onClick={handleSignOut}
              style={{
                flex: 1,
                padding: '8px',
                background: themeColors.accentRed,
                color: '#fee2e2',
                border: `1px solid ${themeColors.accentRed}`,
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                fontFamily: 'var(--font-ibm-plex-mono)',
              }}
            >
              {t.dashboard.signOut}
            </button>
          </div>
        </div>

        {/* Right Content Panel */}
        <div
          style={{
            border: `1px solid ${themeColors.borderColor}`,
            borderRadius: '6px',
            overflow: 'hidden',
            background: themeColors.bgSecondary,
            maxHeight: 'calc(100vh - 140px)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              borderBottom: `1px solid ${themeColors.borderColor}`,
              background: themeColors.bgPrimary,
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  background: activeTab === tab.id ? themeColors.bgSecondary : themeColors.bgPrimary,
                  color: activeTab === tab.id ? themeColors.textPrimary : themeColors.textTertiary,
                  border: 'none',
                  borderRight: `1px solid ${themeColors.borderColor}`,
                  borderBottom: activeTab === tab.id ? `2px solid ${themeColors.accentGreen}` : 'none',
                  cursor: 'pointer',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  outline: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontFamily: 'var(--font-ibm-plex-mono)',
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div
            style={{
              padding: '14px',
              background: themeColors.bgPrimary,
              overflowY: 'auto',
              flex: 1,
            }}
          >
            {activeTab === 'profile' && (
              <ProfileTab
                userData={initialData.userData}
                themeColors={themeColors}
                t={t}
                onUpdateBasicInfo={onUpdateBasicInfo}
                onUpdateAvatarUrl={onUpdateAvatarUrl}
                onUpdateProfile={onUpdateProfile}
                onVerifyPassword={onVerifyPassword}
                onSendEmailVerification={onSendEmailVerification}
                onSendPhoneVerification={onSendPhoneVerification}
                onVerifyCode={onVerifyCode}
                onUpdateEmail={onUpdateEmail}
                onUpdatePhone={onUpdatePhone}
                onRemoveEmail={onRemoveEmail}
                onRemovePhone={onRemovePhone}
                onSuccess={(msg) => showToast('success', msg)}
                onError={(msg) => showToast('error', msg)}
                refreshData={refreshData}
              />
            )}

            {activeTab === 'custom-data' && (
              <CustomDataTab
                userData={initialData.userData}
                themeColors={themeColors}
                t={t}
                onUpdateCustomData={onUpdateCustomData}
                onSuccess={(msg) => showToast('success', msg)}
                onError={(msg) => showToast('error', msg)}
                refreshData={refreshData}
              />
            )}

            {activeTab === 'mfa' && (
              <MfaTab
                userData={initialData.userData}
                themeColors={themeColors}
                t={t}
                onGetMfaVerifications={onGetMfaVerifications}
                onGenerateTotpSecret={onGenerateTotpSecret}
                onAddMfaVerification={onAddMfaVerification}
                onDeleteMfaVerification={onDeleteMfaVerification}
                onGenerateBackupCodes={onGenerateBackupCodes}
                onGetBackupCodes={onGetBackupCodes}
                onVerifyPassword={onVerifyPassword}
                onSuccess={(msg) => showToast('success', msg)}
                onError={(msg) => showToast('error', msg)}
              />
            )}

            {activeTab === 'identities' && (
              <IdentitiesTab userData={initialData.userData} themeColors={themeColors} t={t} />
            )}

            {activeTab === 'organizations' && (
              <OrganizationsTab userData={initialData.userData} themeColors={themeColors} t={t} />
            )}

            {activeTab === 'raw' && (
              <RawDataTab userData={initialData.userData} themeColors={themeColors} t={t} />
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '12px',
          padding: '8px',
          color: themeColors.textTertiary,
          fontSize: '10px',
          background: themeColors.bgSecondary,
          borderRadius: '4px',
          border: `1px solid ${themeColors.borderColor}`,
        }}
      >
        <div>{t.dashboard.systemMessage}</div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer messages={toasts} onDismiss={dismissToast} themeColors={themeColors} />
    </div>
  );
}

// Import MfaVerification type
import type { MfaVerification } from '../../logic/types';
