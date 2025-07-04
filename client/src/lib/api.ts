const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function getToken() {
  return localStorage.getItem('token');
}

function getAuthHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const headers: HeadersInit = {
    ...(options.headers || {}),
    ...getAuthHeaders(),
  };
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (res.headers.get('content-type')?.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'API error');
    return data;
  } else {
    if (!res.ok) throw new Error('API error');
    return res;
  }
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
}

export async function register(email: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data;
}

export async function getUser() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');
  // Example: fetch user profile if you have such an endpoint
  // const res = await fetch(`${API_URL}/user/profile`, { headers: { Authorization: `Bearer ${token}` } });
  // return await res.json();
  // For now, just return localStorage user
  return JSON.parse(localStorage.getItem('user') || '{}');
}

// --- User Management API ---

export async function fetchUsers() {
  const headers = getAuthHeaders();
  const res = await fetch(`${API_URL}/users`, headers ? { headers } : undefined);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch users');
  return data.data;
}

export async function createUser(email: string) {
  const headers = { 'Content-Type': 'application/json', ...getAuthHeaders() };
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create user');
  return data;
}

export async function updateUser(email: string, password: string) {
  const headers = { 'Content-Type': 'application/json', ...getAuthHeaders() };
  const res = await fetch(`${API_URL}/users`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update user');
  return data;
}

export async function deleteUser(linkId: string) {
  const headers = getAuthHeaders();
  const res = await fetch(`${API_URL}/users/${linkId}`, {
    method: 'DELETE',
    ...(headers ? { headers } : {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete user');
  return data;
}

// Document Management APIs
export async function getCategories() {
  const headers = getAuthHeaders();
  const res = await fetch(`${API_URL}/api/categories`, headers ? { headers } : undefined);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch categories');
  return data.data;
}

export async function getCategoryFrequency(categoryId: number) {
  const headers = getAuthHeaders();
  const res = await fetch(`${API_URL}/api/categories/${categoryId}/frequency`, headers ? { headers } : undefined);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch frequency');
  return data.data;
}

export async function getPeriods(categoryId: number) {
  const headers = getAuthHeaders();
  const res = await fetch(`${API_URL}/api/categories/${categoryId}/periods`, headers ? { headers } : undefined);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch periods');
  return data.data;
}

export async function getSubTypes(categoryId: number) {
  const headers = getAuthHeaders();
  const res = await fetch(`${API_URL}/api/categories/${categoryId}/subtypes`, headers ? { headers } : undefined);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch subtypes');
  return data.data;
}

export async function getDocument(categoryId: number, periodId: number, subTypeId: number) {
  const headers = getAuthHeaders();
  const res = await fetch(`${API_URL}/api/documents?categoryId=${categoryId}&periodId=${periodId}&subTypeId=${subTypeId}`, headers ? { headers } : undefined);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch document');
  return data.data;
}

export async function uploadDocument(formData: FormData) {
  const headers = getAuthHeaders();
  const res = await fetch(`${API_URL}/api/documents/upload`, {
    method: 'POST',
    ...(headers ? { headers } : {}),
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to upload document');
  return data;
}

export async function downloadDocument(fileId: number, fileName: string) {
  const headers = getAuthHeaders();
  const res = await fetch(`${API_URL}/api/documents/${fileId}/download`, headers ? { headers } : undefined);
  if (!res.ok) throw new Error('Failed to download document');
  // If streaming, get blob
  const blob = await res.blob();
  // Create a link and trigger download
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

// --- Admin Category ---
export async function getAdminCategories() {
  return (await apiFetch('/admin/categories')).data;
}

export async function createAdminCategory(category: { code: string, name: string, frequencyId: number, description?: string }) {
  return (await apiFetch('/admin/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(category) })).data;
}

export async function updateAdminCategory(id: number, category: { code: string, name: string, frequencyId: number, description?: string }) {
  return (await apiFetch(`/admin/categories/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(category) })).data;
}

export async function deleteAdminCategory(id: number) {
  return await apiFetch(`/admin/categories/${id}`, { method: 'DELETE' });
}

// --- Admin Frequency ---
export async function getAdminFrequencies() {
  return (await apiFetch('/admin/frequencies')).data;
}

export async function createAdminFrequency(frequency: { code: string, name: string }) {
  return (await apiFetch('/admin/frequencies', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(frequency) })).data;
}

export async function updateAdminFrequency(id: number, frequency: { code: string, name: string }) {
  return (await apiFetch(`/admin/frequencies/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(frequency) })).data;
}

export async function deleteAdminFrequency(id: number) {
  return await apiFetch(`/admin/frequencies/${id}`, { method: 'DELETE' });
}

// --- Admin Period ---
export async function getAdminPeriods() {
  return (await apiFetch('/admin/periods')).data;
}

export async function createAdminPeriod(period: { categoryId: number, label: string, startDate: string, endDate: string }) {
  return (await apiFetch('/admin/periods', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(period) })).data;
}

export async function updateAdminPeriod(id: number, period: { categoryId: number, label: string, startDate: string, endDate: string }) {
  return (await apiFetch(`/admin/periods/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(period) })).data;
}

export async function deleteAdminPeriod(id: number) {
  return await apiFetch(`/admin/periods/${id}`, { method: 'DELETE' });
}

// --- Admin SubType ---
export async function getAdminSubTypes() {
  return (await apiFetch('/admin/subtypes')).data;
}

export async function createAdminSubType(subtype: { categoryId: number, name: string }) {
  return (await apiFetch('/admin/subtypes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(subtype) })).data;
}

export async function updateAdminSubType(id: number, subtype: { categoryId: number, name: string }) {
  return (await apiFetch(`/admin/subtypes/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(subtype) })).data;
}

export async function deleteAdminSubType(id: number) {
  return await apiFetch(`/admin/subtypes/${id}`, { method: 'DELETE' });
}
