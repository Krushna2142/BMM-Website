import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

// ✅ Create axios instance for authenticated admin requests
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Create public axios instance (no auth required)
const publicApi = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Attach JWT token to authenticated requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('bmm_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Handle 401 Unauthorized errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('bmm_admin_token');
      Cookies.remove('bmm_admin_user');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// ✅ Upload helper with progress tracking AND folder support
export const uploadFile = async (
  file: File,
  folder?: string,
  onProgress?: (progress: number) => void
): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  
  // ✅ Add folder to FormData if provided
  if (folder) {
    formData.append('folder', folder);
  }

  const token = Cookies.get('bmm_admin_token');
  
  const response = await axios.post(`${API_BASE_URL}/api/media/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });

  return response.data;
};

// ✅ Public API helpers (no auth required)
export async function fetchHomePage() {
  const response = await publicApi.get('/pages/slug/home');
  return response.data;
}

export async function fetchInitiativesPage() {
  const response = await publicApi.get('/pages/slug/initiatives');
  return response.data;
}

export async function getHomePageSection(sectionType: string) {
  const data = await fetchHomePage();
  return data.sections?.find((s: any) => s.type === sectionType && s.isVisible) || null;
}

export async function getPageSection(pageSlug: string, sectionType: string) {
  const response = await publicApi.get(`/pages/slug/${pageSlug}`);
  return response.data.sections?.find((s: any) => s.type === sectionType && s.isVisible) || null;
}

// ✅ Export both instances
export { api, publicApi };
export default api;