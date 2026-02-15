# Project Layout

Full directory tree of the logto-dash-modular project.

**Excluded directories**: `node_modules`, `.next`, `.crush`, `.git`, `__pycache__`, `.DS_Store`

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
