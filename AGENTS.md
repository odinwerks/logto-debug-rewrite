# Agent Guide: Logto Debug Dashboard

This guide helps AI agents understand the codebase structure, conventions, and workflows for the Logto Debug Dashboard project.

## Project Overview

A modular Next.js debug dashboard for Logto authentication with comprehensive user profile management, featuring a terminal/hacker aesthetic.

- **Framework**: Next.js 15 with TypeScript, React 19
- **Authentication**: Logto (@logto/next)
- **Styling**: CSS-in-JS with theme system, IBM Plex Mono font
- **Architecture**: App Router, server actions, client components
- **Key Features**: Two-column layout, user profile management, MFA, custom data editor, i18n, theme system

## Essential Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start
```

**Notes**:
- No test or lint commands defined in package.json
- Environment variables must be set before running (see Environment Variables section)
- Development server runs on `http://localhost:3000` by default

## Code Organization

```
app/
├── logto.ts                    # Logto configuration with aggressive env validation
├── layout.tsx                  # Root layout with font and metadata
├── page.tsx                    # Main page with authentication check
├── globals.css                 # Global styles
├── middleware.ts               # Authentication middleware
├── callback/
│   └── route.ts               # Sign-in callback handler
└── logto-kit/                  # Modular dashboard components
    └── src/
        ├── index.ts           # Main exports
        ├── components/
        │   └── dashboard/
        │       ├── client.tsx # Main dashboard client component
        │       ├── index.tsx  # Server component wrapper
        │       ├── types.ts   # Dashboard types
        │       ├── shared/    # Shared UI components
        │       └── tabs/      # Tab-specific components
        ├── logic/
        │   ├── actions.ts     # Server actions for API calls
        │   ├── types.ts       # Type definitions and discriminated unions
        │   ├── validation.ts  # Validation functions
        │   ├── errors.ts      # Error classes
        │   └── index.ts       # Logic exports
        ├── themes/
        │   ├── index.ts       # Theme loader and color definitions
        │   └── default/       # Default theme files
        └── locales/
            ├── index.ts       # Locale loader and registry
            ├── en-US.ts       # English translations
            └── ka-GE.ts       # Georgian translations
```

## Key Patterns and Conventions

### TypeScript Patterns
- **Discriminated unions**: Used extensively for `DashboardResult` (`success`, `needsAuth`, `error`)
- **Type guards**: Functions like `isDashboardSuccess`, `isTotpVerification`
- **Strict typing**: All API responses and state have TypeScript interfaces
- **Server actions**: All data mutations use Next.js server actions with `'use server'`

### Component Architecture
- **Server components**: Page and layout are server components
- **Client components**: Dashboard and tabs are client components with `'use client'`
- **Props drilling**: Actions and data passed down from page to dashboard client
- **Theme propagation**: Theme colors passed via props, not context

### Styling Approach
- **CSS-in-JS**: Inline styles with theme color objects
- **Theme colors**: `ThemeColors` interface with dark/light variants
- **Font**: IBM Plex Mono monospace font for terminal aesthetic
- **Responsive**: Grid-based two-column layout with fixed sidebar

### Error Handling
- **Server actions**: Try/catch with consistent error formatting
- **Toast notifications**: Toast system for user feedback
- **API errors**: Detailed error messages with status codes and response snippets
- **Validation**: Aggressive whitespace trimming and validation in `logto.ts`

## Environment Variables

### Required (see `.env.example`)
```
APP_ID=your-app-id
APP_SECRET=your-app-secret
ENDPOINT=https://auth.yourdomain.org
BASE_URL=http://localhost:3000
COOKIE_SECRET=your-random-secret
```

### Optional - Theme Configuration
```
THEME=default
NEXT_THEME=default
THEMES_AVAILABLE=default
NEXT_THEMES_AVAILABLE=default
```

### Optional - i18n Configuration
```
LANG_MAIN=en-US
NEXT_LANG_NAME=en-US
LANG_AVAILABLE=en-US,ka-GE
NEXT_LANG_AVAILABLE=en-US,ka-GE
```

**Important**: The `logto.ts` file performs aggressive whitespace trimming on env vars and checks multiple fallbacks (`NEXT_PUBLIC_*` variants).

## Theme System

Themes are loaded from `app/logto-kit/src/themes/{THEME}/`:

- `dark.css` - Dark theme CSS variables
- `light.css` - Light theme CSS variables
- `index.ts` - Theme metadata

### Theme Interface
```typescript
interface ThemeColors {
  bgPage: string;
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  borderColor: string;
  accentGreen: string;
  accentYellow: string;
  accentRed: string;
  accentBlue: string;
  successBg: string;
  errorBg: string;
  warningBg: string;
  fontWeight: string;
}
```

### Adding a New Theme
1. Create folder in `app/logto-kit/src/themes/{your-theme}/`
2. Add `dark.css` and `light.css` with CSS variables
3. Add `index.ts` with theme metadata
4. Set `THEME=your-theme` in `.env`
5. Add to `THEMES_AVAILABLE` if using multiple themes

## i18n System

Translations are loaded from `app/logto-kit/src/locales/`:

- `index.ts` - Locale loader and registry
- `{locale-code}.ts` - Translation files (e.g., `en-US.ts`, `ka-GE.ts`)

### Translations Interface
```typescript
interface Translations {
  dashboard: { title: string; version: string; /* ... */ };
  terminal: { prompt: string; command: string };
  tabs: { profile: string; customData: string; /* ... */ };
  sidebar: { /* ... */ };
  profile: { /* ... */ };
  verification: { /* ... */ };
  customData: { /* ... */ };
  identities: { /* ... */ };
  organizations: { /* ... */ };
  mfa: { /* ... */ };
  raw: { /* ... */ };
  common: { /* ... */ };
}
```

### Adding a New Language
1. Create file in `app/logto-kit/src/locales/{locale-code}.ts`
2. Export a `Translations` object matching the interface
3. Register in `locales/index.ts`
4. Add to `LANG_AVAILABLE` in `.env`

## Logto Integration

### Configuration (`app/logto.ts`)
- Aggressive env var validation with whitespace trimming
- Automatic resource building (`{ENDPOINT}/api`)
- Scope mapping from strings to Logto enums
- Comprehensive error logging

### Authentication Flow
1. Middleware (`middleware.ts`) checks authentication on protected routes
2. Public paths (`/`, `/callback`, `/api/public`) bypass auth
3. Unauthenticated users redirected to sign-in via `client.handleSignIn()`
4. Callback route (`/callback`) handles OAuth response

**Middleware Matcher Pattern**:
```typescript
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
```
This catches all routes except static Next.js files and public folder. API routes are currently bypassed (line 17-19 in middleware).

### API Integration
- All API calls use `fetch` with Bearer token from `getAccessToken`
- Token obtained via `getTokenForServerAction()` in server actions
- Endpoint cleaning: removes trailing slashes, validates protocol
- Consistent error handling with response text extraction

## Gotchas and Important Notes

### 1. Whitespace Handling
The `logto.ts` file aggressively trims ALL whitespace (spaces, tabs, newlines) from environment variables. This can break values that intentionally contain spaces.

### 2. Token Management
- Server actions use `getTokenForServerAction()` which calls `getAccessToken(logtoConfig, '')`
- The empty string parameter is intentional for default resource
- Tokens are not stored client-side; refreshed via server actions

### 3. Theme Persistence
- Theme preference stored in `localStorage` as `logto-dashboard-theme`
- Defaults to `dark` if not set
- Toggle updates both state and localStorage

### 4. i18n Fallbacks
- If requested locale not available, falls back to `en-US`
- Locale codes are normalized to uppercase (`en-US` → `EN-US`)
- Environment variables support both `LANG_*` and `NEXT_LANG_*` prefixes

### 5. API Response Format
- All Logto API responses expected to match `UserData` interface
- Custom data is `Record<string, unknown>`
- MFA verifications have specific type structure
- Verification endpoints return `verificationRecordId`

### 6. Component Dependencies
- Dashboard components depend on `logto-kit/src` exports
- Theme colors must be passed explicitly via props
- Translations object passed from server component

### 7. Development vs Production
- `cookieSecure` set based on `NODE_ENV` (production → true)
- Build output in `.next/` directory
- No custom server configuration required

## Common Tasks for Agents

### Adding a New Dashboard Tab
1. Create component in `app/logto-kit/src/components/dashboard/tabs/`
2. Add to `DashboardClient` props and render logic
3. Add translation keys in locale files
4. Add to tabs configuration in `client.tsx`

### Extending API Integration
1. Add server action in `app/logto-kit/src/logic/actions.ts`
2. Define types in `app/logto-kit/src/logic/types.ts`
3. Add props to dashboard client and pass to relevant tab
4. Implement UI in tab component

### Modifying Styling
1. Update theme colors in `app/logto-kit/src/themes/index.ts`
2. Or create new theme folder with CSS variables
3. Update component styles to use theme color properties

### Adding Environment Variables
1. Add to `.env.example` with documentation
2. Use `getEnvVar()` helper in `logto.ts` for required vars
3. Add validation and fallback logic as needed

---

**Last Updated**: February 2026  
**Project Version**: 0.2.0  
**Next.js Version**: 15.5.9  
**Logto Version**: 4.2.6