import React, { useEffect, useState } from 'react';
import Header from './Header';
import { fetchUsers, createUser, updateUser, deleteUser } from '../lib/api';

const accent = '#ff6b5c';

type User = {
  id: number;
  name?: string;
  email: string;
  role?: string;
  status?: string;
  linkId?: string;
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addEmail, setAddEmail] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [showEdit, setShowEdit] = useState<User | null>(null);
  const [editPassword, setEditPassword] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    try {
      await createUser(addEmail);
      setShowAdd(false);
      setAddEmail('');
      loadUsers();
    } catch (e: any) {
      setAddError(e.message);
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEdit) return;
    setEditLoading(true);
    setEditError(null);
    try {
      await updateUser(showEdit.email, editPassword);
      setShowEdit(null);
      setEditPassword('');
      loadUsers();
    } catch (e: any) {
      setEditError(e.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!user.linkId) return;
    setDeleteLoading(user.linkId);
    try {
      await deleteUser(user.linkId);
      loadUsers();
    } catch (e) {
      // Optionally show error
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header active="Management" />
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 0' }}>
        <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 2px 16px #0001', padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontWeight: 700, fontSize: 24 }}>User Management</h2>
            <button
              style={{ background: accent, color: '#fff', border: 'none', borderRadius: 12, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #ff6b5c22' }}
              onClick={() => setShowAdd(true)}
            >
              + Add User
            </button>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40 }}>Loading...</div>
          ) : error ? (
            <div style={{ color: 'red', textAlign: 'center', padding: 40 }}>{error}</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
              <thead>
                <tr style={{ background: '#f3f4f6' }}>
                  <th style={{ padding: 12, textAlign: 'left', borderRadius: '12px 0 0 12px' }}>Email</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>Role</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>Status</th>
                  <th style={{ padding: 12, textAlign: 'center', borderRadius: '0 12px 12px 0' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id || user.linkId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: 12 }}>{user.email}</td>
                    <td style={{ padding: 12 }}>{user.role || '-'}</td>
                    <td style={{ padding: 12 }}>
                      <span style={{ background: user.status === 'Active' ? '#d1fae5' : '#fee2e2', color: user.status === 'Active' ? '#059669' : '#dc2626', borderRadius: 8, padding: '4px 12px', fontWeight: 600, fontSize: 15 }}>{user.status || '-'}</span>
                    </td>
                    <td style={{ padding: 12, textAlign: 'center' }}>
                      <button
                        style={{ background: '#f3f4f6', color: '#222', border: 'none', borderRadius: 8, padding: '6px 14px', fontWeight: 500, marginRight: 8, cursor: 'pointer' }}
                        onClick={() => { setShowEdit(user); setEditPassword(''); }}
                      >Edit</button>
                      <button
                        style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '6px 14px', fontWeight: 500, cursor: 'pointer', opacity: deleteLoading === user.linkId ? 0.5 : 1 }}
                        onClick={() => handleDeleteUser(user)}
                        disabled={deleteLoading === user.linkId}
                      >{deleteLoading === user.linkId ? 'Deleting...' : 'Delete'}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0005', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <form onSubmit={handleAddUser} style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 320, boxShadow: '0 2px 16px #0002', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontWeight: 600, fontSize: 20, marginBottom: 8 }}>Add User</h3>
            <input
              type="email"
              placeholder="Email"
              value={addEmail}
              onChange={e => setAddEmail(e.target.value)}
              required
              style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
            />
            {addError && <div style={{ color: 'red' }}>{addError}</div>}
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="button" onClick={() => setShowAdd(false)} style={{ flex: 1, background: '#f3f4f6', border: 'none', borderRadius: 8, padding: 10, fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
              <button type="submit" disabled={addLoading} style={{ flex: 1, background: accent, color: '#fff', border: 'none', borderRadius: 8, padding: 10, fontWeight: 600, cursor: 'pointer', opacity: addLoading ? 0.5 : 1 }}>{addLoading ? 'Adding...' : 'Add'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Edit User Modal */}
      {showEdit && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0005', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <form onSubmit={handleEditUser} style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 320, boxShadow: '0 2px 16px #0002', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontWeight: 600, fontSize: 20, marginBottom: 8 }}>Update Password</h3>
            <div style={{ fontSize: 15, marginBottom: 4 }}>User: <b>{showEdit.email}</b></div>
            <input
              type="password"
              placeholder="New Password"
              value={editPassword}
              onChange={e => setEditPassword(e.target.value)}
              required
              style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
            />
            {editError && <div style={{ color: 'red' }}>{editError}</div>}
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="button" onClick={() => setShowEdit(null)} style={{ flex: 1, background: '#f3f4f6', border: 'none', borderRadius: 8, padding: 10, fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
              <button type="submit" disabled={editLoading} style={{ flex: 1, background: accent, color: '#fff', border: 'none', borderRadius: 8, padding: 10, fontWeight: 600, cursor: 'pointer', opacity: editLoading ? 0.5 : 1 }}>{editLoading ? 'Updating...' : 'Update'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 