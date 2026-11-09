import axios from 'axios';

const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

// 20s timeout covers a Render free-tier cold start (typically 30-50s on first hit, so the UI also retries).
export const api = axios.create({ baseURL, timeout: 20000 });

export const fetchContent = () => api.get('/api/content').then((r) => r.data);

export const loginAdmin = (username, password) =>
  api.post('/api/auth/login', { username, password }).then((r) => r.data);

const bearer = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const saveContent = (token, content) =>
  api.put('/api/content', content, bearer(token)).then((r) => r.data);

export const changePassword = (token, currentPassword, newPassword) =>
  api.put('/api/auth/password', { currentPassword, newPassword }, bearer(token)).then((r) => r.data);

export const errorMessage = (err, fallback = 'Something went wrong. Try again.') => {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.code === 'ECONNABORTED') return 'The server is waking up. Wait a few seconds and try again.';
  if (err?.request) return 'Cannot reach the server. Check your connection and try again.';
  return fallback;
};
