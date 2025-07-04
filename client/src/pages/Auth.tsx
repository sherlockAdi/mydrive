import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const accent = '#ff6b5c'; // Coral accent for button

const Auth: React.FC = () => {
  const [tab, setTab] = useState<'login' | 'register'>('login');

  return (
    <div style={{ minHeight: '100vh', background: '#f7f8fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', background: '#fff', borderRadius: 22, boxShadow: '0 4px 32px rgba(0,0,0,0.10)', width: 900, maxWidth: '98%', minHeight: 500, overflow: 'hidden' }}>
        {/* Left: Abstract Art Image */}
        <div style={{ flex: 1, background: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
          <img src="/auth-art.svg" alt="Abstract Art" style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 400 }} />
        </div>
        {/* Right: Form */}
        <div style={{ flex: 1.1, padding: '48px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 320 }}>
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <img src="/logo.svg" alt="Logo" style={{ height: 38, marginBottom: 8 }} />
            <h2 style={{ fontWeight: 700, fontSize: 28, color: '#222', marginBottom: 8 }}>
              {tab === 'login' ? 'Login' : 'Sign Up'}
            </h2>
          </div>
          <div style={{ marginBottom: 24, fontSize: 15, textAlign: 'center' }}>
            {tab === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <span style={{ color: accent, cursor: 'pointer', fontWeight: 600 }} onClick={() => setTab('register')}>
                  Signup
                </span>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <span style={{ color: accent, cursor: 'pointer', fontWeight: 600 }} onClick={() => setTab('login')}>
                  Login
                </span>
              </>
            )}
          </div>
          <div style={{ minHeight: 320, width: '100%' }}>
            {tab === 'login' ? <Login /> : <Register />}
          </div>
        </div>
      </div>
      {/* Responsive: stack vertically on small screens */}
      <style>{`
        @media (max-width: 900px) {
          .auth-split-card { flex-direction: column !important; min-width: 0 !important; width: 98vw !important; }
          .auth-split-card > div { width: 100% !important; min-width: 0 !important; padding: 24px !important; }
        }
        @media (max-width: 600px) {
          .auth-split-card { box-shadow: none !important; border-radius: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default Auth; 