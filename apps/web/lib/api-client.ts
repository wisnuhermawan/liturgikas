import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default apiClient;

// API endpoints
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
};

export const categoriesAPI = {
  list: (params?: { parent?: string }) => apiClient.get('/api/categories', { params }),

  get: (id: number) => apiClient.get(`/api/categories/${id}`),
};
