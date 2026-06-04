import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  googleLogin: (data) => api.post('/auth/google', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/update-profile', data),
};

// Property APIs
export const propertyAPI = {
  getAll: (params) => api.get('/properties/', { params }),
  getById: (id) => api.get(`/properties/${id}`),
  create: (data) => api.post('/properties/', data),
  update: (id, data) => api.put(`/properties/${id}`, data),
  delete: (id) => api.delete(`/properties/${id}`),
  getMyListings: (params) => api.get('/properties/my-listings', { params }),
  saveProperty: (id) => api.post(`/properties/save/${id}`),
  getSaved: () => api.get('/properties/saved'),
  getFeatured: () => api.get('/properties/featured'),
  compare: (ids) => api.post('/properties/compare', { property_ids: ids }),
};

// Location APIs
export const locationAPI = {
  getStates: () => api.get('/locations/states'),
  getDistricts: (stateId) => api.get(`/locations/districts/${stateId}`),
  getCities: (districtId) => api.get(`/locations/cities/${districtId}`),
  search: (query) => api.get('/locations/search', { params: { q: query } }),
};

// AI APIs
export const aiAPI = {
  predictPrice: (data) => api.post('/ai/predict-price', data),
  investmentScore: (data) => api.post('/ai/investment-score', data),
  roiCalculator: (data) => api.post('/ai/roi-calculator', data),
  rentalYield: (data) => api.post('/ai/rental-yield', data),
  marketTrends: (city) => api.get('/ai/market-trends', { params: { city } }),
  getRecommendations: () => api.get('/ai/recommendations'),
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUserActive: (id) => api.put(`/admin/users/${id}/toggle-active`),
  getPendingProperties: () => api.get('/admin/properties/pending'),
  approveProperty: (id) => api.put(`/admin/properties/${id}/approve`),
  rejectProperty: (id) => api.put(`/admin/properties/${id}/reject`),
  getAnalytics: () => api.get('/admin/analytics'),
};

// User APIs
export const userAPI = {
  getDashboard: () => api.get('/users/dashboard'),
  getAgents: () => api.get('/users/agents'),
  getAgent: (id) => api.get(`/users/agents/${id}`),
};

export default api;
