import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// API endpoints
export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/api/auth/login', { email, password }),

  logout: () => apiClient.post('/api/auth/logout'),

  me: () => apiClient.get('/api/auth/me'),

  getSessions: () => apiClient.get('/api/auth/sessions'),

  revokeSession: (id: number) => apiClient.delete(`/api/auth/sessions/${id}`),
};

export const bibleAPI = {
  getBooks: (params?: { testament?: string; category?: string }) =>
    apiClient.get('/api/bible/books', { params }),

  getBook: (id: number) => apiClient.get(`/api/bible/books/${id}`),

  getChapter: (id: number) => apiClient.get(`/api/bible/chapters/${id}`),

  getVerse: (id: number) => apiClient.get(`/api/bible/verses/${id}`),

  search: (params: { q: string; book_id?: number; testament?: string; limit?: number }) =>
    apiClient.get('/api/bible/search', { params }),
};

export const contentsAPI = {
  list: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    contentType?: string;
    categoryId?: number;
    search?: string;
  }) => apiClient.get('/api/contents', { params }),

  get: (id: string) => apiClient.get(`/api/contents/${id}`),

  create: (data: any) => apiClient.post('/api/contents', data),

  update: (id: string, data: any) => apiClient.put(`/api/contents/${id}`, data),

  delete: (id: string) => apiClient.delete(`/api/contents/${id}`),

  publish: (id: string) => apiClient.patch(`/api/contents/${id}/publish`),

  unpublish: (id: string) => apiClient.patch(`/api/contents/${id}/unpublish`),
};

export const categoriesAPI = {
  list: (params?: { parent?: string }) => apiClient.get('/api/categories', { params }),

  get: (id: number) => apiClient.get(`/api/categories/${id}`),

  create: (data: any) => apiClient.post('/api/categories', data),

  update: (id: number, data: any) => apiClient.put(`/api/categories/${id}`, data),

  delete: (id: number) => apiClient.delete(`/api/categories/${id}`),
};
