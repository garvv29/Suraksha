import axios from 'axios';

const API_BASE_URL = 'https://0kd3vrm8-6969.inc1.devtunnels.ms/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
};

export const professionalAPI = {
  register: (data) => api.post('/register_professional', data),
  getAll: () => api.get('/get_professionals'),
  update: (id, data) => api.put(`/edit_professional/${id}`, data),
  delete: (id) => api.delete(`/delete_professional/${id}`),
};

export const traineeAPI = {
  register: (data) => api.post('/register_trainee', data),
  getAll: (userId, role) => api.get(`/get_trainees?user_id=${userId}&role=${role}`),
  update: (id, data) => api.put(`/edit_trainee/${id}`, data),
  delete: (id) => api.delete(`/delete_trainee/${id}`),
};

export const trainingAPI = {
  create: (data) => api.post('/create_training', data),
  getAll: (userId, role) => api.get(`/get_trainings?user_id=${userId}&role=${role}`),
  update: (id, data) => api.put(`/edit_training/${id}`, data),
  delete: (id) => api.delete(`/delete_training/${id}`),
};

export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
