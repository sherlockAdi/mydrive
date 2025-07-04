import React from 'react';
import Header from './Header';

const MasterType: React.FC = () => (
  <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
    <Header active="Master" />
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 0' }}>
      <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 2px 16px #0001', padding: 32 }}>
        <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24 }}>Master - Type</h2>
        <ul style={{ fontSize: 17, color: '#222', paddingLeft: 20 }}>
          <li>Type 1</li>
          <li>Type 2</li>
          <li>Type 3</li>
        </ul>
      </div>
    </div>
  </div>
);

export default MasterType; 