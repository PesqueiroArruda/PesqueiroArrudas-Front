import axios from 'axios';
import { destroyCookie } from 'nookies';
import { API_URL } from './apiConfig';

export const serverApi = axios.create({
  baseURL: API_URL,
});

serverApi.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config;

  const token = localStorage.getItem('token');
  if (!token) return config;

  return {
    ...config,
    headers: { ...config.headers, Authorization: `Bearer ${token}` },
  };
});

serverApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error?.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('loggedUser');
      localStorage.removeItem('isAdmin');
      destroyCookie(null, 'isAuthorized');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
