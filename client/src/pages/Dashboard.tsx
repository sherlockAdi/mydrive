import React from 'react';
import Header from './Header';

const accent = '#ff6b5c';
const yellow = '#facc15';
const grayBg = '#f8fafc';

const Dashboard: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: grayBg }}>
      <Header active="Dashboard" />
      <div
        className="dashboard-grid"
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 32px 32px',
          display: 'grid',
          gridTemplateColumns: '320px 1fr 320px',
          gridTemplateRows: 'auto auto 1fr',
          gap: 24,
          borderRadius: 32,
        }}
      >
        {/* Welcome & Profile */}
        <div className="dashboard-card" style={{ gridColumn: '1/2', gridRow: '1/2', background: '#fff', borderRadius: 24, boxShadow: '0 2px 16px #0001', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Profile" style={{ width: 90, height: 90, borderRadius: '50%', marginBottom: 16, objectFit: 'cover', boxShadow: '0 2px 8px #ff6b5c22' }} />
          <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 4 }}>Lora Piterson</div>
          <div style={{ color: '#888', fontWeight: 500, marginBottom: 8 }}>UX/UI Designer</div>
          <div style={{ background: accent, color: '#fff', borderRadius: 12, padding: '4px 18px', fontWeight: 600, fontSize: 16, marginBottom: 12 }}>$1,200</div>
          <div style={{ color: '#aaa', fontSize: 15, marginBottom: 8 }}>Pension contributions</div>
          <div style={{ color: '#222', fontSize: 15, marginBottom: 4 }}>Devices: <span style={{ color: accent }}>MacBook Air</span></div>
          <div style={{ color: '#222', fontSize: 15, marginBottom: 4 }}>Compensation Summary</div>
          <div style={{ color: '#222', fontSize: 15 }}>Employee Benefits</div>
        </div>
        {/* Welcome & Progress */}
        <div className="dashboard-card" style={{ gridColumn: '2/4', gridRow: '1/2', background: 'linear-gradient(90deg, #fffbe6 60%, #f8fafc 100%)', borderRadius: 24, boxShadow: '0 2px 16px #0001', padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Welcome in, Nixtio</div>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            <div style={{ fontSize: 16, color: '#888', fontWeight: 500 }}>Interviews</div>
            <div style={{ width: 80, height: 8, background: '#eee', borderRadius: 4, overflow: 'hidden', marginRight: 8 }}>
              <div style={{ width: '15%', height: '100%', background: accent }} />
            </div>
            <div style={{ fontSize: 16, color: '#888', fontWeight: 500 }}>Hired</div>
            <div style={{ width: 80, height: 8, background: '#eee', borderRadius: 4, overflow: 'hidden', marginRight: 8 }}>
              <div style={{ width: '15%', height: '100%', background: yellow }} />
            </div>
            <div style={{ fontSize: 16, color: '#888', fontWeight: 500 }}>Project time</div>
            <div style={{ width: 80, height: 8, background: '#eee', borderRadius: 4, overflow: 'hidden', marginRight: 8 }}>
              <div style={{ width: '60%', height: '100%', background: '#222' }} />
            </div>
            <div style={{ fontSize: 16, color: '#888', fontWeight: 500 }}>Output</div>
            <div style={{ width: 60, height: 8, background: '#eee', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: '10%', height: '100%', background: '#222' }} />
            </div>
          </div>
        </div>
        {/* Progress Widget */}
        <div className="dashboard-card" style={{ gridColumn: '1/2', gridRow: '2/3', background: '#fff', borderRadius: 24, boxShadow: '0 2px 16px #0001', padding: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Progress</div>
          <div style={{ color: '#888', fontSize: 15, marginBottom: 8 }}>6.1h Work Time this week</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 60, marginBottom: 8 }}>
            {[2, 3, 4, 2, 5, 6, 2].map((h, i) => (
              <div key={i} style={{ width: 18, height: h * 10, background: accent, borderRadius: 6, transition: 'height 0.3s' }} />
            ))}
          </div>
          <div style={{ color: '#aaa', fontSize: 13, display: 'flex', justifyContent: 'space-between' }}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => <span key={d}>{d}</span>)}
          </div>
          <div style={{ marginTop: 8, color: yellow, fontWeight: 600, fontSize: 15 }}>5h 25m</div>
        </div>
        {/* Time Tracker */}
        <div className="dashboard-card" style={{ gridColumn: '2/3', gridRow: '2/3', background: '#fff', borderRadius: 24, boxShadow: '0 2px 16px #0001', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Time tracker</div>
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="#f3f4f6" />
            <circle cx="60" cy="60" r="54" fill="none" stroke={yellow} strokeWidth="10" strokeDasharray="339.292" strokeDashoffset="120" />
            <text x="50%" y="54%" textAnchor="middle" fontSize="28" fontWeight="700" fill="#222">2:35</text>
            <text x="50%" y="68%" textAnchor="middle" fontSize="14" fill="#888">Work Time</text>
          </svg>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button style={{ background: accent, color: '#fff', border: 'none', borderRadius: '50%', width: 36, height: 36, fontSize: 18, fontWeight: 700, cursor: 'pointer' }}>⏸</button>
            <button style={{ background: '#f3f4f6', color: '#222', border: 'none', borderRadius: '50%', width: 36, height: 36, fontSize: 18, fontWeight: 700, cursor: 'pointer' }}>▶</button>
          </div>
        </div>
        {/* Stats */}
        <div className="dashboard-card" style={{ gridColumn: '3/4', gridRow: '2/3', background: '#fff', borderRadius: 24, boxShadow: '0 2px 16px #0001', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <div style={{ display: 'flex', gap: 32 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: 28, color: '#222' }}>78</div>
              <div style={{ color: '#888', fontSize: 15 }}>Employee</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: 28, color: '#222' }}>56</div>
              <div style={{ color: '#888', fontSize: 15 }}>Hirings</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: 28, color: '#222' }}>203</div>
              <div style={{ color: '#888', fontSize: 15 }}>Projects</div>
            </div>
          </div>
        </div>
        {/* Onboarding */}
        <div className="dashboard-card" style={{ gridColumn: '1/2', gridRow: '3/4', background: '#fff', borderRadius: 24, boxShadow: '0 2px 16px #0001', padding: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Onboarding</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 80, height: 8, background: '#eee', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: '30%', height: '100%', background: accent }} />
            </div>
            <div style={{ width: 80, height: 8, background: '#eee', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: '25%', height: '100%', background: yellow }} />
            </div>
            <div style={{ width: 80, height: 8, background: '#eee', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: '0%', height: '100%', background: '#222' }} />
            </div>
            <span style={{ fontWeight: 600, color: '#888', fontSize: 15 }}>18%</span>
          </div>
          <div style={{ color: '#aaa', fontSize: 13, marginBottom: 8 }}>Task</div>
          <div style={{ background: '#222', color: '#fff', borderRadius: 16, padding: '12px 18px', fontWeight: 600, fontSize: 16, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Onboarding Task</span>
            <span>2/8</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {['Interview', 'Team Meeting', 'Project Update', 'Discuss Q3 Goals', 'HR Policy Review'].map((task, i) => (
              <li key={i} style={{ color: '#fff', background: '#222', borderRadius: 12, padding: '8px 14px', marginBottom: 6, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: i < 2 ? accent : '#888', marginRight: 8 }} />
                {task}
              </li>
            ))}
          </ul>
        </div>
        {/* Calendar */}
        <div className="dashboard-card" style={{ gridColumn: '2/4', gridRow: '3/4', background: '#fff', borderRadius: 24, boxShadow: '0 2px 16px #0001', padding: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>September 2024</div>
          <div style={{ display: 'flex', gap: 24, marginBottom: 8, color: '#888', fontWeight: 500, fontSize: 15 }}>
            {['Mon 23', 'Tue 24', 'Wed 25', 'Thu 26', 'Fri 27'].map(day => <span key={day}>{day}</span>)}
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ background: '#f3f4f6', borderRadius: 12, padding: '12px 18px', fontWeight: 500, color: '#222', minWidth: 180 }}>
              <div>8:00 am</div>
              <div style={{ fontWeight: 700, marginTop: 4 }}>Weekly Team Sync</div>
              <div style={{ color: '#888', fontSize: 14, marginTop: 2 }}>Discuss progress on project</div>
            </div>
            <div style={{ background: '#f3f4f6', borderRadius: 12, padding: '12px 18px', fontWeight: 500, color: '#222', minWidth: 180 }}>
              <div>10:00 am</div>
              <div style={{ fontWeight: 700, marginTop: 4 }}>Onboarding Session</div>
              <div style={{ color: '#888', fontSize: 14, marginTop: 2 }}>Instructions for new hires</div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 1100px) {
          .dashboard-grid {
            grid-template-columns: 1fr 1fr !important;
            grid-template-rows: auto auto auto auto !important;
          }
        }
        @media (max-width: 800px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows: none !important;
          }
        }
        @media (max-width: 600px) {
          .dashboard-grid {
            padding: 0 8px 24px !important;
            gap: 14px !important;
          }
          .dashboard-card {
            padding: 14px !important;
            border-radius: 14px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard; 