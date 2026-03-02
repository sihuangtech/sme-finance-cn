import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const enterpriseId = localStorage.getItem('enterpriseId');
  if (enterpriseId) {
    config.headers['x-enterprise-id'] = enterpriseId;
  }
  return config;
});

export default api;
