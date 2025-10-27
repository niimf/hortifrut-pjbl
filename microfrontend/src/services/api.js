import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (username) => api.post('/auth/login', { username })
};

export const dashboardService = {
  get: () => api.get('/api/dashboard')
};

export default api;
