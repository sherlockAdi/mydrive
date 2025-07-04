import React, { useEffect, useState } from 'react';
import Header from './Header';
import {
  getCategories,
  getCategoryFrequency,
  getPeriods,
  getSubTypes,
  getDocument,
  uploadDocument,
  downloadDocument,
} from '../lib/api';

const accent = '#ff6b5c';
const green = '#059669';
const red = '#dc2626';
const gray = '#888';

const Documents: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<any | null>(null);
  const [frequency, setFrequency] = useState<any | null>(null);
  const [periods, setPeriods] = useState<any[]>([]);
  const [subTypes, setSubTypes] = useState<any[]>([]);
  const [grid, setGrid] = useState<any[][]>([]); // [row][col] = doc
  const [loading, setLoading] = useState(false);
  const [cellLoading, setCellLoading] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<{ row: any; col: any; doc: any } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const cats = await getCategories();
        setCategories(cats);
        if (cats.length) setActiveCategory(cats[0]);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Fetch frequency, periods, subtypes when category changes
  useEffect(() => {
    if (!activeCategory) return;
    setLoading(true);
    setFrequency(null);
    setPeriods([]);
    setSubTypes([]);
    setGrid([]);
    (async () => {
      try {
        const freq = await getCategoryFrequency(activeCategory.id);
        setFrequency(freq);
        const [pers, subs] = await Promise.all([
          getPeriods(activeCategory.id),
          getSubTypes(activeCategory.id),
        ]);
        setPeriods(pers);
        setSubTypes(subs);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [activeCategory]);

  // Fetch grid data when periods/subTypes change
  useEffect(() => {
    if (!periods.length || !subTypes.length) return;
    setLoading(true);
    setGrid([]);
    (async () => {
      try {
        const newGrid: any[][] = [];
        for (let r = 0; r < subTypes.length; r++) {
          newGrid[r] = [];
          for (let c = 0; c < periods.length; c++) {
            const doc = await getDocument(activeCategory.id, periods[c].id, subTypes[r].id);
            newGrid[r][c] = doc;
          }
        }
        setGrid(newGrid);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line
  }, [periods, subTypes]);

  // Handle upload
  const handleUpload = async (file: File, row: any, col: any) => {
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('categoryId', activeCategory.id);
      formData.append('periodId', col.id);
      formData.append('subTypeId', row.id);
      formData.append('uploadedByUid', localStorage.getItem('uid') || '1001'); // fallback
      formData.append('file', file);
      await uploadDocument(formData);
      setModal(null);
      // Refresh grid cell
      setCellLoading(`${row.id}-${col.id}`);
      const doc = await getDocument(activeCategory.id, col.id, row.id);
      setGrid((g) => {
        const newG = g.map((rowArr) => [...rowArr]);
        const rIdx = subTypes.findIndex((s) => s.id === row.id);
        const cIdx = periods.findIndex((p) => p.id === col.id);
        if (rIdx !== -1 && cIdx !== -1) newG[rIdx][cIdx] = doc;
        return newG;
      });
      setCellLoading('');
    } catch (e: any) {
      setUploadError(e.message);
    } finally {
      setUploading(false);
    }
  };

  // Handle download
  const handleDownload = async (doc: any) => {
    if (!doc?.file) return;
    await downloadDocument(doc.file.id, doc.file.name);
  };

  // Render
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header active="Documents" />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 0' }}>
        <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 2px 16px #0001', padding: 32, minHeight: 400 }}>
          <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24 }}>Document Management</h2>
          {/* Parent Tabs */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: activeCategory?.id === cat.id ? accent : '#f3f4f6',
                  color: activeCategory?.id === cat.id ? '#fff' : '#222',
                  border: 'none',
                  borderRadius: 12,
                  padding: '10px 28px',
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: 'pointer',
                  boxShadow: activeCategory?.id === cat.id ? '0 2px 8px #ff6b5c22' : undefined,
                  transition: 'background 0.2s',
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
          {/* Frequency Info */}
          {frequency && (
            <div style={{ color: gray, fontWeight: 500, marginBottom: 16 }}>
              Frequency: <b>{frequency.name}</b>
            </div>
          )}
          {/* Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40 }}>Loading...</div>
          ) : error ? (
            <div style={{ color: 'red', textAlign: 'center', padding: 40 }}>{error}</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16, minWidth: 600 }}>
                <thead>
                  <tr>
                    <th style={{ padding: 12, textAlign: 'left', background: '#f3f4f6', borderRadius: '12px 0 0 12px' }}>SubType \ Period</th>
                    {periods.map((col) => (
                      <th key={col.id} style={{ padding: 12, textAlign: 'center', background: '#f3f4f6' }}>{col.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {subTypes.map((row, rIdx) => (
                    <tr key={row.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: 12, fontWeight: 600 }}>{row.name}</td>
                      {periods.map((col, cIdx) => {
                        const doc = grid[rIdx]?.[cIdx];
                        const isLoading = cellLoading === `${row.id}-${col.id}`;
                        return (
                          <td key={col.id} style={{ padding: 12, textAlign: 'center' }}>
                            {isLoading ? (
                              <span style={{ color: gray }}>...</span>
                            ) : doc && doc.file ? (
                              <span
                                style={{ cursor: 'pointer', color: green, fontSize: 22 }}
                                title="Download or Replace"
                                onClick={() => setModal({ row, col, doc })}
                              >
                                &#x2705;
                              </span>
                            ) : (
                              <span
                                style={{ cursor: 'pointer', color: red, fontSize: 22 }}
                                title="Upload"
                                onClick={() => setModal({ row, col, doc: null })}
                              >
                                &#x26A0;
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {/* Modal for upload/download/replace */}
      {modal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0005', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 320, boxShadow: '0 2px 16px #0002', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontWeight: 600, fontSize: 20, marginBottom: 8 }}>
              {modal.doc && modal.doc.file ? 'Document Exists' : 'No Document Uploaded'}
            </h3>
            <div style={{ fontSize: 15, marginBottom: 4 }}>
              <b>SubType:</b> {modal.row.name}<br />
              <b>Period:</b> {modal.col.label}
            </div>
            {modal.doc && modal.doc.file ? (
              <>
                <button
                  onClick={() => handleDownload(modal.doc)}
                  style={{ background: green, color: '#fff', border: 'none', borderRadius: 8, padding: 10, fontWeight: 600, cursor: 'pointer' }}
                >
                  Download
                </button>
                <div style={{ color: gray, fontSize: 14 }}>You can replace the document below:</div>
              </>
            ) : (
              <div style={{ color: red, fontSize: 15 }}>No document uploaded yet.</div>
            )}
            <form
              onSubmit={e => {
                e.preventDefault();
                const file = (e.target as any).file.files[0];
                if (file) handleUpload(file, modal.row, modal.col);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              <input type="file" name="file" accept="application/pdf" required style={{ fontSize: 15 }} />
              {uploadError && <div style={{ color: red }}>{uploadError}</div>}
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="button" onClick={() => setModal(null)} style={{ flex: 1, background: '#f3f4f6', border: 'none', borderRadius: 8, padding: 10, fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={uploading} style={{ flex: 1, background: accent, color: '#fff', border: 'none', borderRadius: 8, padding: 10, fontWeight: 600, cursor: 'pointer', opacity: uploading ? 0.5 : 1 }}>{uploading ? 'Uploading...' : (modal.doc && modal.doc.file ? 'Replace' : 'Upload')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents; 