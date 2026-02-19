# i18n Audit Findings

Files that are fully i18n-ed (all human text uses translation system):

## Clean Files (no hardcoded human text)

1. `app/logto-kit/src/components/dashboard/types.ts` - Only type definitions, no UI text
2. `app/logto-kit/src/components/dashboard/shared/Toast.tsx` - Only displays `message.message` passed as prop, no hardcoded text
3. `app/logto-kit/src/components/dashboard/shared/CodeBlock.tsx` - Has hardcoded "COPY" and "COPIED!" strings (needs i18n)

## Files with Hardcoded Text (needs i18n)

1. `app/logto-kit/src/components/dashboard/tabs/profile.tsx` - Many success/error messages, confirm dialogs, placeholders
2. `app/logto-kit/src/components/dashboard/tabs/custom-data.tsx` - Description text, success/error messages
3. `app/logto-kit/src/components/dashboard/tabs/identities.tsx` - Description text, labels, titles
4. `app/logto-kit/src/components/dashboard/tabs/organizations.tsx` - Description text, labels, titles
5. `app/logto-kit/src/components/dashboard/tabs/mfa.tsx` - Many success/error messages, confirm dialogs, placeholders, HTML content
6. `app/logto-kit/src/components/dashboard/client.tsx` - Error messages, "AVAILABLE_LANGS"
7. `app/logto-kit/src/components/dashboard/index.tsx` - Error message
8. `app/logto-kit/src/logic/validation.ts` - Validation error messages
9. `app/logto-kit/src/logic/actions.ts` - Internal error messages
10. `app/logto-kit/src/logic/cookie-killer.ts` - System messages
11. `app/logto-kit/src/logic/tabs.ts` - System messages
12. `app/logto-kit/src/logic/i18n.ts` - System messages

## Translation Files Status

1. `app/logto-kit/src/locales/en-US.ts` - Complete English translations
2. `app/logto-kit/src/locales/ka-GE.ts` - Incomplete Georgian translations (some keys missing, some English left)

## Next Steps

1. Update `Translations` interface with missing keys for all hardcoded strings
2. Add missing English translations
3. Add missing Georgian translations (translate all missing keys)
4. Replace hardcoded strings with i18n calls
5. Test language switching

## Notes

- HTML content in MFA backup codes download needs special handling (maybe keep English as it's downloadable file)
- Validation error messages should be moved to i18n system
- System/error messages in server actions/logic might need i18n but could stay English (technical audience)
- Need to decide about placeholder text, confirm dialogs, success/error messages