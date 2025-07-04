import React, { useEffect, useState } from 'react';
import Header from './Header';
import {
  getAdminSubTypes,
  createAdminSubType,
  updateAdminSubType,
  deleteAdminSubType,
  getAdminCategories
} from '../lib/api';

interface SubType {
  id: number;
  categoryId: number;
  name: string;
}
interface Category {
  id: number;
  code: string;
  name: string;
}

const MasterSub: React.FC = () => {
  const [subtypes, setSubTypes] = useState<SubType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<{ id?: number; categoryId: number | ''; name: string }>({ categoryId: '', name: '' });
  const [editing, setEditing] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [subs, cats] = await Promise.all([
        getAdminSubTypes(),
        getAdminCategories()
      ]);
      setSubTypes(subs);
      setCategories(cats);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId) {
      setError('Category is required');
      return;
    }
    try {
      if (editing && form.id) {
        await updateAdminSubType(form.id, { categoryId: Number(form.categoryId), name: form.name });
      } else {
        await createAdminSubType({ categoryId: Number(form.categoryId), name: form.name });
      }
      setForm({ categoryId: '', name: '' });
      setEditing(false);
      fetchAll();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleEdit = (sub: SubType) => {
    setForm({ id: sub.id, categoryId: sub.categoryId, name: sub.name });
    setEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this sub type?')) return;
    try {
      await deleteAdminSubType(id);
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
          <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24 }}>Master - Sub Type</h2>
          {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ marginBottom: 24, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={form.categoryId}
              onChange={e => setForm(f => ({ ...f, categoryId: e.target.value ? Number(e.target.value) : '' }))}
              required
              style={{ padding: 4 }}
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name} ({cat.code})</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Sub Type Name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              style={{ padding: 4 }}
            />
            <button type="submit" style={{ padding: '4px 12px' }}>{editing ? 'Update' : 'Add'}</button>
            {editing && <button type="button" onClick={() => { setEditing(false); setForm({ categoryId: '', name: '' }); }} style={{ marginLeft: 8 }}>Cancel</button>}
          </form>
          {loading ? <div>Loading...</div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={{ textAlign: 'left', padding: 8 }}>Category</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
                  <th style={{ padding: 8 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subtypes.map(sub => {
                  const cat = categories.find(c => c.id === sub.categoryId);
                  return (
                    <tr key={sub.id}>
                      <td style={{ padding: 8 }}>{cat ? `${cat.name} (${cat.code})` : sub.categoryId}</td>
                      <td style={{ padding: 8 }}>{sub.name}</td>
                      <td style={{ padding: 8 }}>
                        <button onClick={() => handleEdit(sub)} style={{ marginRight: 8 }}>Edit</button>
                        <button onClick={() => handleDelete(sub.id)}>Delete</button>
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

export default MasterSub; 