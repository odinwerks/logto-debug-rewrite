# Logto Debug Dashboard

A modular Next.js debug dashboard for Logto authentication with comprehensive user profile management, featuring a terminal/hacker aesthetic.

## Features

- **Terminal/Hacker Aesthetic**: OG styling with bracketed buttons, monospace fonts, and dark/light themes
- **Two-Column Layout**: Sidebar with avatar, token, and user info; main content area with tabs
- **Full User Management**: Profile, custom data, identities, organizations, MFA, and raw data views
- **Theme System**: ENV-based theme loading with dark/light variants
- **i18n Support**: Multi-language support with ENV-based locale configuration
- **MFA Management**: TOTP enrollment, backup codes generation, and WebAuthn support

## Project Structure

```
./
├── app/
│   ├── callback/
│   │   └── route.ts
│   ├── logto-kit/
│   │   └── src/
│   │       ├── components/
│   │       │   └── dashboard/
│   │       │       ├── shared/
│   │       │       │   ├── CodeBlock.tsx
│   │       │       │   └── Toast.tsx
│   │       │       ├── tabs/
│   │       │       │   ├── custom-data.tsx
│   │       │       │   ├── identities.tsx
│   │       │       │   ├── mfa.tsx
│   │       │       │   ├── organizations.tsx
│   │       │       │   ├── profile.tsx
│   │       │       │   └── raw-data.tsx
│   │       │       ├── client.tsx
│   │       │       ├── index.tsx
│   │       │       └── types.ts
│   │       ├── locales/
│   │       │   ├── en-US.ts
│   │       │   ├── index.ts
│   │       │   └── ka-GE.ts
│   │       ├── logic/
│   │       │   ├── actions.ts
│   │       │   ├── errors.ts
│   │       │   ├── index.ts
│   │       │   ├── types.ts
│   │       │   └── validation.ts
│   │       ├── themes/
│   │       │   ├── default/
│   │       │   │   ├── dark.css
│   │       │   │   ├── index.ts
│   │       │   │   └── light.css
│   │       │   └── index.ts
│   │       └── index.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── logto.ts
│   └── page.tsx
├── .env
├── .env.example
├── AGENTS.md
├── README.md
├── Todo.md
├── layout.md
├── middleware.ts
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
└── tsconfig.json
```

## Environment Variables

### Required

```env
APP_ID=your-app-id
APP_SECRET=your-app-secret
ENDPOINT=https://auth.yourdomain.org
BASE_URL=http://localhost:3000
COOKIE_SECRET=your-random-secret
```

### Optional - Theme Configuration

```env
# Theme folder name (default: default)
THEME=default
NEXT_THEME=default

# Available themes
THEMES_AVAILABLE=default
NEXT_THEMES_AVAILABLE=default
```

### Optional - i18n Configuration

```env
# Default language
LANG_MAIN=en-US
NEXT_LANG_NAME=en-US

# Available languages
LANG_AVAILABLE=en-US,ka-GE
NEXT_LANG_AVAILABLE=en-US,ka-GE
```

## Theme System

Themes are loaded from `app/logto-kit/src/themes/{THEME}/`:

- `dark.css` - Dark theme variables
- `light.css` - Light theme variables
- `index.ts` - Theme metadata

### Adding a New Theme

1. Create a new folder in `app/logto-kit/src/themes/{your-theme}/`
2. Add `dark.css` and `light.css` with CSS variables
3. Add `index.ts` with theme metadata
4. Set `THEME=your-theme` in your `.env`

## i18n System

Translations are loaded from `app/logto-kit/src/locales/`:

- `index.ts` - Locale loader and registry
- `{locale-code}.ts` - Translation files (e.g., `en-US.ts`, `ka-GE.ts`)

### Adding a New Language

1. Create a new file in `app/logto-kit/src/locales/{locale-code}.ts`
2. Export a `Translations` object matching the interface
3. Register in `locales/index.ts`
4. Add to `LANG_AVAILABLE` in your `.env`

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## License

MIT

> **Disclaimer**: If you cause the decadence of Earth running this horrid code, I am not liable. Also take care <3
