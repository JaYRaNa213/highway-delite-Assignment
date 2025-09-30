import axios, { AxiosResponse } from 'axios';
import { AuthResponse, NotesResponse, NoteResponse } from '../types';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = '' + (import.meta.env.VITE_API_URL || 'http://localhost:5000');

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  sendOtp: async (email: string, name?: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/auth/send-otp', { email, name });
    return response.data;
  },

  verifyOtp: async (email: string, otp: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  },
};

// Notes API
export const notesAPI = {
  createNote: async (title: string, content: string): Promise<NoteResponse> => {
    const response = await api.post('/notes', { title, content });
    return response.data;
  },

  getNotes: async (): Promise<NotesResponse> => {
    const response = await api.get('/notes');
    return response.data;
  },

  getNote: async (id: string): Promise<NoteResponse> => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  deleteNote: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },
};

export default api;
