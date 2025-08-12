import axios from 'axios';

export const BASE_URL = 'https://ruru-backend.onrender.com/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
});

// Add a request interceptor to include the token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const ENDPOINTS = {
  SIGNIN: '/auth/login',
};

export default api;