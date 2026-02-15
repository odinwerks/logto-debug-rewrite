import { getLogtoContext } from '@logto/next/server-actions';
import { logtoConfig } from './logto';
import { Dashboard } from './logto-kit/src';

async function handleSignIn() {
  'use server';
  const { signIn } = await import('@logto/next/server-actions');
  await signIn(logtoConfig);
}

export default async function HomePage() {
  const { isAuthenticated } = await getLogtoContext(logtoConfig);

  if (!isAuthenticated) {
    return (
      <form
        action={handleSignIn}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: '#0a0a0a',
        }}
      >
        <div
          style={{
            background: '#050505',
            border: '1px solid #374151',
            padding: '40px',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <h1 style={{ color: '#d1d5db', marginBottom: '20px', fontFamily: 'var(--font-ibm-plex-mono)' }}>
            LOGTO DEBUG DASHBOARD
          </h1>
          <p style={{ color: '#9ca3af', marginBottom: '30px', fontFamily: 'var(--font-ibm-plex-mono)', fontSize: '12px' }}>
            Sign in to view and edit your profile data
          </p>
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              background: '#1a1a1a',
              color: '#d1d5db',
              border: '1px solid #374151',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'var(--font-ibm-plex-mono)',
            }}
          >
            [SIGN IN]
          </button>
        </div>
      </form>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <Dashboard />
    </main>
  );
}
