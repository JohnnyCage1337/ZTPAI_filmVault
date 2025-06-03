import axios from 'axios';

const api = axios.create({
  baseURL: '/api',          // dzięki proxy w Vite → backend:8000
  timeout: 8000,
});

export default api;
