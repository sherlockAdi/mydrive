import React, { useState } from 'react';
import { register } from '../lib/api';

const accent = '#ff6b5c';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const data = await register(email);
      if (data.status !== 'success') throw new Error(data.message || 'Registration failed');
      setMessage(data.message);
      setEmail('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: 32, width: '100%', maxWidth: 380, margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 22 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#222' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            style={{ width: '100%', padding: '12px 10px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 16, outline: 'none', boxSizing: 'border-box', marginBottom: 2 }}
            autoComplete="email"
          />
        </div>
        {error && <div style={{ color: accent, marginBottom: 14, fontWeight: 500, textAlign: 'center' }}>{error}</div>}
        {message && <div style={{ color: '#059669', marginBottom: 14, fontWeight: 500, textAlign: 'center' }}>{message}</div>}
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: 13, borderRadius: 8, background: accent, color: '#fff', fontWeight: 700, fontSize: 17, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 2px 8px #ff6b5c22', transition: 'background 0.2s' }}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register; 