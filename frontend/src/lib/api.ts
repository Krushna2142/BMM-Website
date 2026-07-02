// frontend/src/lib/api.ts
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`, // ✅ Added /api prefix
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request - ✅ Fixed key to match login
api.interceptors.request.use((config) => {
  const token = Cookies.get('bmm_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 Unauthorized errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('bmm_admin_token');
      Cookies.remove('bmm_admin_user');
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
