import React from 'react';
import Header from './Header';

const accent = '#ff6b5c';

const Settings: React.FC = () => (
  <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
    <Header active="Settings" />
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 0' }}>
      <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 2px 16px #0001', padding: 32 }}>
        <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24 }}>Settings</h2>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 500, color: '#222' }}>Theme</label>
          <select style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 16, marginTop: 6 }}>
            <option>Light</option>
            <option>Dark</option>
          </select>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 500, color: '#222' }}>Notifications</label>
          <input type="checkbox" checked readOnly style={{ marginLeft: 12, transform: 'scale(1.2)' }} />
        </div>
        <button style={{ background: accent, color: '#fff', border: 'none', borderRadius: 12, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #ff6b5c22', marginTop: 16 }}>Save Changes</button>
      </div>
    </div>
  </div>
);

export default Settings; 