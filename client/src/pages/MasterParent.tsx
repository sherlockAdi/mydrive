import React, { useEffect, useState } from 'react';
import Header from './Header';
import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  getAdminFrequencies
} from '../lib/api';

interface Category {
  id: number;
  code: string;
  name: string;
  frequencyId: number;
  description?: string;
}
interface Frequency {
  id: number;
  code: string;
  name: string;
}

const MasterParent: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [frequencies, setFrequencies] = useState<Frequency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<{ id?: number; code: string; name: string; frequencyId: number | ''; description?: string }>({ code: '', name: '', frequencyId: '', description: '' });
  const [editing, setEditing] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [cat, freq] = await Promise.all([
        getAdminCategories(),
        getAdminFrequencies()
      ]);
      setCategories(cat);
      setFrequencies(freq);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.frequencyId) {
      setError('Frequency is required');
      return;
    }
    try {
      if (editing && form.id) {
        await updateAdminCategory(form.id, { code: form.code, name: form.name, frequencyId: Number(form.frequencyId), description: form.description });
      } else {
        await createAdminCategory({ code: form.code, name: form.name, frequencyId: Number(form.frequencyId), description: form.description });
      }
      setForm({ code: '', name: '', frequencyId: '', description: '' });
      setEditing(false);
      fetchAll();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleEdit = (cat: Category) => {
    setForm({ id: cat.id, code: cat.code, name: cat.name, frequencyId: cat.frequencyId, description: cat.description });
    setEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await deleteAdminCategory(id);
      fetchAll();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header active="Master" />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 0' }}>
        <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 2px 16px #0001', padding: 32 }}>
          <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24 }}>Master - Category</h2>
          {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ marginBottom: 24, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Code"
              value={form.code}
              onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
              required
              style={{ padding: 4 }}
            />
            <input
              type="text"
              placeholder="Category Name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              style={{ padding: 4 }}
            />
            <select
              value={form.frequencyId}
              onChange={e => setForm(f => ({ ...f, frequencyId: e.target.value ? Number(e.target.value) : '' }))}
              required
              style={{ padding: 4 }}
            >
              <option value="">Select Frequency</option>
              {frequencies.map(freq => (
                <option key={freq.id} value={freq.id}>{freq.name} ({freq.code})</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Description"
              value={form.description || ''}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              style={{ padding: 4 }}
            />
            <button type="submit" style={{ padding: '4px 12px' }}>{editing ? 'Update' : 'Add'}</button>
            {editing && <button type="button" onClick={() => { setEditing(false); setForm({ code: '', name: '', frequencyId: '', description: '' }); }} style={{ marginLeft: 8 }}>Cancel</button>}
          </form>
          {loading ? <div>Loading...</div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={{ textAlign: 'left', padding: 8 }}>Code</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Frequency</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Description</th>
                  <th style={{ padding: 8 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => {
                  const freq = frequencies.find(f => f.id === cat.frequencyId);
                  return (
                    <tr key={cat.id}>
                      <td style={{ padding: 8 }}>{cat.code}</td>
                      <td style={{ padding: 8 }}>{cat.name}</td>
                      <td style={{ padding: 8 }}>{freq ? `${freq.name} (${freq.code})` : cat.frequencyId}</td>
                      <td style={{ padding: 8 }}>{cat.description}</td>
                      <td style={{ padding: 8 }}>
                        <button onClick={() => handleEdit(cat)} style={{ marginRight: 8 }}>Edit</button>
                        <button onClick={() => handleDelete(cat.id)}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MasterParent; 