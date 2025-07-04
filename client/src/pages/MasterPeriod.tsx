import React, { useEffect, useState } from 'react';
import Header from './Header';
import {
  getAdminPeriods,
  createAdminPeriod,
  updateAdminPeriod,
  deleteAdminPeriod,
  getAdminCategories
} from '../lib/api';

function toDateInputValue(date: string | Date): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  // Adjust for timezone offset
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

interface Period {
  id: number;
  categoryId: number;
  label: string;
  startDate: string;
  endDate: string;
}
interface Category {
  id: number;
  code: string;
  name: string;
}

const MasterPeriod: React.FC = () => {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<{ id?: number; categoryId: number | ''; label: string; startDate: string; endDate: string }>({ categoryId: '', label: '', startDate: '', endDate: '' });
  const [editing, setEditing] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [per, cat] = await Promise.all([
        getAdminPeriods(),
        getAdminCategories()
      ]);
      setPeriods(per);
      setCategories(cat);
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
    if (!form.startDate || !form.endDate) {
      setError('Start Date and End Date are required');
      return;
    }
    // Send raw yyyy-MM-dd from input
    const payload = {
      categoryId: Number(form.categoryId),
      label: form.label,
      startDate: form.startDate,
      endDate: form.endDate
    };
    try {
      if (editing && form.id) {
        await updateAdminPeriod(form.id, payload);
      } else {
        await createAdminPeriod(payload);
      }
      setForm({ categoryId: '', label: '', startDate: '', endDate: '' });
      setEditing(false);
      fetchAll();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleEdit = (period: Period) => {
    setForm({
      id: period.id,
      categoryId: period.categoryId,
      label: period.label,
      startDate: toDateInputValue(period.startDate),
      endDate: toDateInputValue(period.endDate)
    });
    setEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this period?')) return;
    try {
      await deleteAdminPeriod(id);
      fetchAll();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header active="Master" />
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 0' }}>
        <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 2px 16px #0001', padding: 32 }}>
          <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24 }}>Master - Period</h2>
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
              placeholder="Label"
              value={form.label}
              onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
              required
              style={{ padding: 4 }}
            />
            <input
              type="date"
              placeholder="Start Date"
              value={toDateInputValue(form.startDate)}
              onChange={e => setForm(f => ({ ...f, startDate: e.target.value } ))}
              required
              style={{ padding: 4 }}
            />
            <input
              type="date"
              placeholder="End Date"
              value={toDateInputValue(form.endDate)}
              onChange={e => setForm(f => ({ ...f, endDate: e.target.value } ))}
              required
              style={{ padding: 4 }}
            />
            <button type="submit" style={{ padding: '4px 12px' }}>{editing ? 'Update' : 'Add'}</button>
            {editing && <button type="button" onClick={() => { setEditing(false); setForm({ categoryId: '', label: '', startDate: '', endDate: '' }); }} style={{ marginLeft: 8 }}>Cancel</button>}
          </form>
          {loading ? <div>Loading...</div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={{ textAlign: 'left', padding: 8 }}>Category</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Label</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Start Date</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>End Date</th>
                  <th style={{ padding: 8 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {periods.map(period => {
                  const cat = categories.find(c => c.id === period.categoryId);
                  return (
                    <tr key={period.id}>
                      <td style={{ padding: 8 }}>{cat ? `${cat.name} (${cat.code})` : period.categoryId}</td>
                      <td style={{ padding: 8 }}>{period.label}</td>
                      <td style={{ padding: 8 }}>{toDateInputValue(period.startDate)}</td>
                      <td style={{ padding: 8 }}>{toDateInputValue(period.endDate)}</td>
                      <td style={{ padding: 8 }}>
                        <button onClick={() => handleEdit(period)} style={{ marginRight: 8 }}>Edit</button>
                        <button onClick={() => handleDelete(period.id)}>Delete</button>
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

export default MasterPeriod; 