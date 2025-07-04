import React, { useEffect, useState } from 'react';
import Header from './Header';
import {
  getAdminFrequencies,
  createAdminFrequency,
  updateAdminFrequency,
  deleteAdminFrequency
} from '../lib/api';

interface Frequency {
  id: number;
  code: string;
  name: string;
}

const MasterFrequency: React.FC = () => {
  const [frequencies, setFrequencies] = useState<Frequency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<{ id?: number; code: string; name: string }>({ code: '', name: '' });
  const [editing, setEditing] = useState(false);

  const fetchFrequencies = async () => {
    setLoading(true);
    setError(null);
    try {
      setFrequencies(await getAdminFrequencies());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFrequencies(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing && form.id) {
        await updateAdminFrequency(form.id, { code: form.code, name: form.name });
      } else {
        await createAdminFrequency({ code: form.code, name: form.name });
      }
      setForm({ code: '', name: '' });
      setEditing(false);
      fetchFrequencies();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleEdit = (freq: Frequency) => {
    setForm({ id: freq.id, code: freq.code, name: freq.name });
    setEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this frequency?')) return;
    try {
      await deleteAdminFrequency(id);
      fetchFrequencies();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header active="Master" />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 0' }}>
        <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 2px 16px #0001', padding: 32 }}>
          <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24 }}>Master - Frequency</h2>
          {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
            <input
              type="text"
              placeholder="Code"
              value={form.code}
              onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
              required
              style={{ marginRight: 8, padding: 4 }}
            />
            <input
              type="text"
              placeholder="Frequency Name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              style={{ marginRight: 8, padding: 4 }}
            />
            <button type="submit" style={{ padding: '4px 12px' }}>{editing ? 'Update' : 'Add'}</button>
            {editing && <button type="button" onClick={() => { setEditing(false); setForm({ code: '', name: '' }); }} style={{ marginLeft: 8 }}>Cancel</button>}
          </form>
          {loading ? <div>Loading...</div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={{ textAlign: 'left', padding: 8 }}>Code</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
                  <th style={{ padding: 8 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {frequencies.map(freq => (
                  <tr key={freq.id}>
                    <td style={{ padding: 8 }}>{freq.code}</td>
                    <td style={{ padding: 8 }}>{freq.name}</td>
                    <td style={{ padding: 8 }}>
                      <button onClick={() => handleEdit(freq)} style={{ marginRight: 8 }}>Edit</button>
                      <button onClick={() => handleDelete(freq.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MasterFrequency; 