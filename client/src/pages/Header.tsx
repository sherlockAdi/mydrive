import React, { useState } from 'react';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Documents', path: '/documents' },
  {
    label: 'Management',
    children: [
      { label: 'User Management', path: '/management/users' },
      { label: 'Team', path: '/management/team' },
    ],
  },
  {
    label: 'Master',
    children: [
      { label: 'Parent', path: '/master/parent' },
      { label: 'Sub', path: '/master/sub' },
      { label: 'Type', path: '/master/type' },
      { label: 'Frequency', path: '/master/frequency' },
      { label: 'Period', path: '/master/period' },
    ],
  },
  { label: 'Profile', path: '/profile' },
  { label: 'Settings', path: '/settings' },
];

const Header: React.FC<{ active?: string }> = ({ active }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header style={{
      background: 'linear-gradient(90deg, #f8fafc 60%, #fffbe6 100%)',
      borderRadius: 24,
      margin: '24px auto 32px',
      maxWidth: 1200,
      boxShadow: '0 4px 32px rgba(0,0,0,0.07)',
      padding: '0 32px',
      height: 72,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src="/logo.svg" alt="Logo" style={{ height: 38, marginRight: 8 }} />
        <span style={{ fontWeight: 700, fontSize: 22, color: '#222', letterSpacing: 1 }}>MyDrive</span>
      </div>
      {/* Navigation */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {navItems.map((item) => (
          <div key={item.label} style={{ position: 'relative' }}>
            {item.children ? (
              <>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: 16,
                    color: '#222',
                    padding: '10px 22px',
                    borderRadius: 20,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    ...(openDropdown === item.label ? { background: '#fff', boxShadow: '0 2px 8px #facc1533' } : {}),
                  }}
                  onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                  onBlur={() => setTimeout(() => setOpenDropdown(null), 150)}
                >
                  {item.label}
                </button>
                {openDropdown === item.label && (
                  <div style={{
                    position: 'absolute',
                    top: 48,
                    left: 0,
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 4px 24px #facc1533',
                    minWidth: 180,
                    padding: '10px 0',
                  }}>
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.path}
                        style={{
                          display: 'block',
                          padding: '10px 24px',
                          color: '#222',
                          fontWeight: 500,
                          textDecoration: 'none',
                          borderRadius: 12,
                          transition: 'background 0.15s',
                        }}
                        onMouseDown={e => e.preventDefault()}
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <a
                href={item.path}
                style={{
                  background: active === item.label ? '#222' : 'none',
                  color: active === item.label ? '#fff' : '#222',
                  fontWeight: 600,
                  fontSize: 16,
                  padding: '10px 22px',
                  borderRadius: 20,
                  textDecoration: 'none',
                  transition: 'background 0.2s',
                  boxShadow: active === item.label ? '0 2px 8px #2222' : undefined,
                }}
              >
                {item.label}
              </a>
            )}
          </div>
        ))}
      </nav>
      {/* Profile/Settings (right) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <a href="/profile" style={{ color: '#222', fontWeight: 500, fontSize: 16, textDecoration: 'none', padding: '8px 16px', borderRadius: 16, background: '#f3f4f6' }}>Profile</a>
        <a href="/settings" style={{ color: '#222', fontWeight: 500, fontSize: 16, textDecoration: 'none', padding: '8px 16px', borderRadius: 16, background: '#f3f4f6' }}>Settings</a>
      </div>
    </header>
  );
};

export default Header; 