import React from 'react';
import Header from './Header';

const accent = '#ff6b5c';

const Profile: React.FC = () => (
  <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
    <Header active="Profile" />
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 0' }}>
      <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 2px 16px #0001', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Profile" style={{ width: 90, height: 90, borderRadius: '50%', marginBottom: 16, objectFit: 'cover', boxShadow: '0 2px 8px #ff6b5c22' }} />
        <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 4 }}>Lora Piterson</div>
        <div style={{ color: '#888', fontWeight: 500, marginBottom: 8 }}>UX/UI Designer</div>
        <div style={{ color: '#222', fontSize: 16, marginBottom: 8 }}>Email: lora@example.com</div>
        <button style={{ background: accent, color: '#fff', border: 'none', borderRadius: 12, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #ff6b5c22', marginTop: 16 }}>Edit Profile</button>
      </div>
    </div>
  </div>
);

export default Profile; 