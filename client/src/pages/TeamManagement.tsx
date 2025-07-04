import React from 'react';
import Header from './Header';

const teams = [
  { id: 1, name: 'Design Team', members: 5, lead: 'Lora Piterson', status: 'Active' },
  { id: 2, name: 'Dev Team', members: 8, lead: 'Bob Johnson', status: 'Active' },
  { id: 3, name: 'QA Team', members: 3, lead: 'Carol Lee', status: 'Inactive' },
];

const accent = '#ff6b5c';

const TeamManagement: React.FC = () => (
  <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
    <Header active="Management" />
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 0' }}>
      <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 2px 16px #0001', padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontWeight: 700, fontSize: 24 }}>Team Management</h2>
          <button style={{ background: accent, color: '#fff', border: 'none', borderRadius: 12, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #ff6b5c22' }}>+ Add Team</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={{ padding: 12, textAlign: 'left', borderRadius: '12px 0 0 12px' }}>Team Name</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Members</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Lead</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Status</th>
              <th style={{ padding: 12, textAlign: 'center', borderRadius: '0 12px 12px 0' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.map(team => (
              <tr key={team.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: 12 }}>{team.name}</td>
                <td style={{ padding: 12 }}>{team.members}</td>
                <td style={{ padding: 12 }}>{team.lead}</td>
                <td style={{ padding: 12 }}>
                  <span style={{ background: team.status === 'Active' ? '#d1fae5' : '#fee2e2', color: team.status === 'Active' ? '#059669' : '#dc2626', borderRadius: 8, padding: '4px 12px', fontWeight: 600, fontSize: 15 }}>{team.status}</span>
                </td>
                <td style={{ padding: 12, textAlign: 'center' }}>
                  <button style={{ background: '#f3f4f6', color: '#222', border: 'none', borderRadius: 8, padding: '6px 14px', fontWeight: 500, marginRight: 8, cursor: 'pointer' }}>Edit</button>
                  <button style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '6px 14px', fontWeight: 500, cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default TeamManagement; 