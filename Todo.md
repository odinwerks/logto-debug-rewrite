# Logto-Kit Code Analysis & Todo List

## Project Overview
**logto-kit** - A self-service library (user button + account controls) in very beta state. Terminal UI is for developer use only, production UI to be built later.

## File-by-File Issues

### 1. `/app/logto-kit/src/logic/actions.ts`
- **Lines 11-20**: `getCleanEndpoint()` duplicates environment variable reading already done in `logto.ts`
- **Lines 26-30**: `getTokenForServerAction()` passes empty string as resource to `getAccessToken`
- **Lines 44, 89, 119, 140, 161, 186, 214, 244, 279, 319, 348, 373, 393, 417, 436, 461, 485, 505, 529**: Repeated `getCleanEndpoint()` calls and duplicate fetch logic
- **Lines 455-478**: `addMfaVerification` uses `string` and `any` instead of typed `MfaType` and `MfaVerificationPayload`
- **Throughout**: Hardcoded API paths (`/api/my-account`, `/api/verifications/...`, etc.)
- **Throughout**: No shared error handling, each action repeats token fetch, endpoint construction, error parsing

**Possible Fixes:**
- [] Create shared API client that uses `logtoConfig.endpoint` instead of `getCleanEndpoint()`
- [] Update `getTokenForServerAction()` to use `logtoConfig.resources[0]` as resource parameter
- [] Replace all `getCleanEndpoint()` calls with API client methods
- [] Update `addMfaVerification` signature to use `MfaType` and `MfaVerificationPayload` types
- [] Extract hardcoded API paths to constants file
- [] Centralize error handling in API client with `sanitizeLogtoError`

### 2. `/app/logto.ts`
- **Line 82**: `resources` built from endpoint but not used in actions
- **Lines 96-100**: `logtoConfig` includes `endpoint` property that should be used instead of `getCleanEndpoint()`

**Possible Fixes:**
- [] Update actions to use `logtoConfig.resources[0]` for token scope
- [] Replace `getCleanEndpoint()` calls with `logtoConfig.endpoint`
- [] Ensure `logtoConfig` is the single source of truth for API configuration

### 3. `/app/logto-kit/src/logic/types.ts`
- **Lines 111-129**: `MfaType` and `MfaVerificationPayload` types defined but not used in actions

**Possible Fixes:**
- [] Import and use `MfaType` in `addMfaVerification` function
- [] Use `MfaVerificationPayload` for payload parameter instead of `any`
- [] Ensure all MFA-related functions use these typed definitions

### 4. `/app/logto-kit/src/logic/validation.ts`
- **Lines 93-102**: `sanitizeLogtoError` function defined but never used
- Error sanitization should be applied to all error messages shown to users

**Possible Fixes:**
- [] Import and use `sanitizeLogtoError` in all action error handling
- [] Wrap API client error responses with sanitization
- [] Ensure UI error displays use sanitized messages

### 5. `/app/logto-kit/src/components/dashboard/client.tsx`
- **Line 42**: `onAddMfaVerification` prop uses `payload: any`

**Possible Fixes:**
- [] Update prop type to use `MfaVerificationPayload` instead of `any`
- [] Ensure parent component passes typed payload
- [] Add TypeScript generic for payload type if needed

### 6. `/app/logto-kit/src/components/dashboard/shared/CodeBlock.tsx`
- **Line 16**: `data: any` should be generic `T` or `unknown`

**Possible Fixes:**
- [] Convert `data: any` to `data: unknown` or generic `<T>`
- [] Add runtime type checking if needed
- [] Update all usages to provide proper types

### 7. `/app/logto-kit/src/components/dashboard/tabs/profile.tsx`
- **797 lines**: Monolithic component with complex verification state management
- Hard to test and maintain; should be split into smaller components

**Possible Fixes:**
- [] Extract verification flows into custom hook `useVerification`
- [] Split into smaller components: `ProfileBasicInfo`, `ProfileContactInfo`, `VerificationFlow`
- [] Create shared form components for inputs and buttons
- [] Move inline styles to CSS modules or theme variables

### 8. `/app/logto-kit/src/components/dashboard/tabs/mfa.tsx`
- **300+ lines**: Complex multi-step flows in single component
- Should extract MFA enrollment flows into custom hooks

**Possible Fixes:**
- [] Extract MFA enrollment logic into `useMfaEnrollment` hook
- [] Split component into `MfaSetup`, `MfaVerification`, `MfaManagement` subcomponents
- [] Create shared step wizard component for multi-step flows
- [] Improve error handling and loading states

## Critical Issues Summary

### 1. API Client Duplication & Inconsistency
**Files:**
- `/app/logto-kit/src/logic/actions.ts` (lines 11-20, 44, 89, etc.)
- `/app/logto.ts` (lines 82, 96-100)

**Problems:**
- `getCleanEndpoint()` reads raw `process.env.ENDPOINT` directly
- `logtoConfig` already has sanitized `endpoint` property
- Each action duplicates fetch logic 20+ times
- Potential mismatch between `logtoConfig.resources` and `getCleanEndpoint()`

**Fix:** Create shared API client that uses `logtoConfig.endpoint` consistently.

### 2. Weak MFA Type Safety
**Files:**
- `/app/logto-kit/src/logic/actions.ts` (lines 455-478)
- `/app/logto-kit/src/logic/types.ts` (lines 111-129)
- `/app/logto-kit/src/components/dashboard/client.tsx` (line 42)

**Problems:**
- `addMfaVerification(type: string, payload: any, ...)` uses `any` for payload
- Defined `MfaType` and `MfaVerificationPayload` types not being used
- Type safety completely lost in MFA operations

**Fix:** Update `addMfaVerification` to use `MfaType` and proper payload types.

### 3. Token Scope Issues
**Files:**
- `/app/logto-kit/src/logic/actions.ts` (lines 26-30)

**Problems:**
- `getAccessToken(logtoConfig, '')` passes empty string for resource parameter
- May cause incorrect token scopes for Account API
- Should use first resource from `logtoConfig.resources`

**Fix:** Pass the correct resource parameter to `getAccessToken`.

### 4. Complex State Management
**Files:**
- `/app/logto-kit/src/components/dashboard/tabs/profile.tsx` (797 lines)
- `/app/logto-kit/src/components/dashboard/tabs/mfa.tsx` (300+ lines)

**Problems:**
- Profile tab has monolithic verification state management
- MFA tab has complex multi-step flows in single component
- Hard to test and maintain

**Fix:** Extract verification flows into custom hooks, split components.

### 5. Missing Request Abstraction
**Files:**
- `/app/logto-kit/src/logic/actions.ts` (throughout)

**Problems:**
- No shared error handling or retry logic
- Each action repeats token fetch, endpoint construction, error parsing
- Inconsistent error message handling

**Fix:** Create `LogtoApiClient` class with methods for common operations.

### 6. Response Validation Missing
**Files:**
- All action functions in `actions.ts`

**Problems:**
- No validation that Logto API responses match expected shapes
- Type assertions without runtime checking
- Potential runtime errors from API changes

**Fix:** Add Zod schemas for all API responses.

### 7. Type Safety Gaps
**Files:**
- `/app/logto-kit/src/components/dashboard/client.tsx` (line 42: `payload: any`)
- `/app/logto-kit/src/components/dashboard/shared/CodeBlock.tsx` (`data: any`)

**Problems:**
- `any` types bypass TypeScript safety
- Props not properly typed in components

**Fix:** Replace `any` with proper types, use generics where needed.

### 8. Hardcoded API Paths
**Files:**
- `/app/logto-kit/src/logic/actions.ts` (throughout)

**Problems:**
- API paths like `/api/my-account` hardcoded in each action
- No single source of truth for API routes
- Difficult to update if Logto API changes

**Fix:** Create API route constants/configuration object.

### 9. Unused Error Sanitization
**Files:**
- `/app/logto-kit/src/logic/validation.ts` (lines 93-102)

**Problems:**
- `sanitizeLogtoError` function defined but never used
- Error messages in actions show raw API responses (potential PII exposure)
- No consistent error sanitization across the application

**Fix:** Use `sanitizeLogtoError` in all action error messages and component error displays.

## Step-by-Step Analysis

**Overall Strategy:** Fix foundational API layer first, then type safety, then component refactoring.

**Phase 1 - API Client & Configuration:**
[] 1. Create `api-client.ts` that uses `logtoConfig.endpoint` and `resources[0]`
[] 2. Update `getTokenForServerAction()` to use correct resource
[] 3. Create `api-routes.ts` with path constants
[] 4. Replace all `getCleanEndpoint()` calls and duplicate fetch logic with API client methods

**Phase 2 - Type Safety & Validation:**
[] 1. Update MFA functions to use typed parameters
[] 2. Add Zod schemas for API responses
[] 3. Eliminate `any` types in components
[] 4. Implement error sanitization across all error displays

**Phase 3 - Component Refactoring:**
[] 1. Extract verification flows into custom hooks
[] 2. Split monolithic components into smaller, focused components
[] 3. Create shared form components with theme support

**Testing Strategy:**
- [] After each phase, verify no TypeScript errors
- [] Test API calls with mock responses
- [] Ensure error messages are sanitized
- [] Verify component functionality remains intact

## Priority Fixes

### Phase 1: Critical Foundations
[] 1. **Create shared API client** (`/app/logto-kit/src/logic/api-client.ts`)
   - Use `logtoConfig.endpoint` instead of `getCleanEndpoint()`
   - Handle token fetching, error parsing, retry logic
   - Remove duplicate fetch code from all actions

[] 2. **Fix token scope issue**
   - Update `getTokenForServerAction()` to use correct resource
   - Verify Account API access works properly

[] 3. **Add API route constants**
   - Create `src/logic/api-routes.ts` with all Logto API paths
   - Use constants throughout actions

### Phase 2: Type Safety & Validation
[] 4. **Fix MFA type safety**
   - Update `addMfaVerification` to use `MfaType` and `MfaVerificationPayload`
   - Update component props to match

[] 5. **Add response validation with Zod**
   - Create schemas for all API responses
   - Validate responses in API client

[] 6. **Eliminate `any` types**
   - Fix `CodeBlock` component with proper generics
   - Type all component props strictly

[] 7. **Implement error sanitization**
   - Use `sanitizeLogtoError` in all action error messages
   - Ensure no PII leaks in UI error displays

### Phase 3: Component Refactoring
[] 8. **Split monolithic components**
   - Extract verification flows into hooks (`useVerification`, `useMfaEnrollment`)
   - Split profile tab into smaller components

[] 9. **Create shared form components**
   - Input, button, card components with theme support
   - Reduce inline style duplication

## Technical Debt Notes

### Environment Variable Handling
- Current aggressive trimming in `logto.ts` may be too strict
- Consider more graceful fallbacks for optional variables

### Theme System
- Currently only in-memory colors, no CSS variables
- Consider CSS custom properties for dynamic theming

### Internationalization
- Simple object-based i18n works but lacks pluralization, interpolation
- Consider `react-i18next` for production

### Error Handling
- Current error messages show raw API responses (potential PII)
- Add sanitization for all error displays (already have `sanitizeLogtoError` but unused)

## Next Steps
[] 1. Start with Phase 1 fixes (API client) as they're foundational
[] 2. Test thoroughly after each phase
[] 3. Consider adding unit tests for the logic layer
[] 4. Document API usage patterns for library consumers

**Note:** This is beta code with solid foundations. Focus on making the logic layer robust before polishing UI.