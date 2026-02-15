// ============================================================================
// Theme System - ENV-based Theme Loading
// ============================================================================
// Usage:
//   THEME=default (or NEXT_THEME=default) - loads themes/default folder
//   If not set, falls back to 'default'
//
// Each theme folder should contain:
//   - dark.css (dark theme variables)
//   - light.css (light theme variables)
//   - index.ts (optional theme metadata)
// ============================================================================

import { existsSync } from 'fs';
import { join } from 'path';

export interface ThemeColors {
  // Backgrounds
  bgPage: string;
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  // Border
  borderColor: string;
  // Accents
  accentGreen: string;
  accentYellow: string;
  accentRed: string;
  accentBlue: string;
  // Status backgrounds
  successBg: string;
  errorBg: string;
  warningBg: string;
  // Font weight (differs between dark/light)
  fontWeight: string;
}

// Dark theme colors (OG style)
export const darkColors: ThemeColors = {
  bgPage: '#0a0a0a',
  bgPrimary: '#050505',
  bgSecondary: '#0a0a0a',
  bgTertiary: '#1a1a1a',
  borderColor: '#374151',
  textPrimary: '#d1d5db',
  textSecondary: '#9ca3af',
  textTertiary: '#6b7280',
  accentGreen: '#86efac',
  accentYellow: '#fbbf24',
  accentRed: '#ef4444',
  accentBlue: '#60a5fa',
  successBg: '#003300',
  errorBg: '#330000',
  warningBg: '#78350f',
  fontWeight: 'normal',
};

// Light theme colors (OG style)
export const lightColors: ThemeColors = {
  bgPage: '#e8eaed',
  bgPrimary: '#ffffff',
  bgSecondary: '#dadcde',
  bgTertiary: '#c0c2c4',
  borderColor: '#7a7c7e',
  textPrimary: '#050505',
  textSecondary: '#333333',
  textTertiary: '#555555',
  accentGreen: '#059669',
  accentYellow: '#d97706',
  accentRed: '#dc2626',
  accentBlue: '#2563eb',
  successBg: '#ecfdf5',
  errorBg: '#fef2f2',
  warningBg: '#fffbdc',
  fontWeight: '500',
};

/**
 * Get theme name from environment variables
 * Priority: THEME > NEXT_THEME > 'default'
 */
export function getThemeName(): string {
  const themeName = process.env.THEME || process.env.NEXT_THEME || 'default';
  // Sanitize: only allow alphanumeric, hyphens, underscores
  return themeName.replace(/[^a-zA-Z0-9_-]/g, '') || 'default';
}

/**
 * Get available themes from environment
 * LANG_AVAILABLE and NEXT_LANG_AVAILABLE should be comma-separated list
 */
export function getAvailableThemes(): string[] {
  const available = process.env.THEMES_AVAILABLE || process.env.NEXT_THEMES_AVAILABLE || 'default';
  return available.split(',').map(t => t.trim()).filter(Boolean);
}

/**
 * Check if a theme exists
 */
export function themeExists(themeName: string): boolean {
  const available = getAvailableThemes();
  return available.includes(themeName);
}

/**
 * Get CSS import path for a theme's variant (dark/light)
 */
export function getThemeCssPath(themeName: string, variant: 'dark' | 'light'): string {
  return `/logto-kit/src/themes/${themeName}/${variant}.css`;
}

// Re-export for convenience
export { darkColors as darkTheme, lightColors as lightTheme };
