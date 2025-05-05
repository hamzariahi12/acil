import axios from 'axios';

// Make sure the backend URL is correct
const API_URL =  'http://localhost:4000/api';

console.log('Using API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add token to all requests
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

// Response interceptor to handle token-related errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config.url,
        method: error.config.method,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Request Error:', {
        message: error.message,
        code: error.code,
        url: error.config.url,
        method: error.config.method,
      });
      
      // Check if it's a network error
      if (error.code === 'ERR_NETWORK') {
        console.error('Network Error: Could not connect to the backend server');
        console.error('Please check if:');
        console.error('1. The backend server is running');
        console.error('2. The backend URL is correct:', API_URL);
        console.error('3. There are no CORS issues');
        console.error('4. The backend port (4000) is not blocked by a firewall');
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Setup Error:', error.message);
    }

    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. Please check if the backend server is running.');
      console.error('Backend URL:', API_URL);
    }

    return Promise.reject(error);
  }
);

export const auth = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      throw error;
    }
  },
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.patch('/auth/me', data),
};

export const restaurants = {
  getAll: () => api.get('/restaurants'),
  getById: (id) => api.get(`/restaurants/${id}`),
  create: (data) => api.post('/restaurants', data),
  update: (id, data) => api.patch(`/restaurants/${id}`, data),
  delete: (id) => api.delete(`/restaurants/${id}`),
  getRestaurantByResponsable: (responsableId) => api.get(`/restaurants/responsable/${responsableId}`),
};

export const menus = {
  getAll: () => api.get('/menus'),
  create: (data) => api.post('/menus', data),
  update: (id, data) => api.patch(`/menus/${id}`, data),
  delete: (id) => api.delete(`/menus/${id}`),
};

export const tables = {
  getAll: () => api.get('/tables'),
  getAvailable: () => api.get('/tables/available'),
  create: (data) => api.post('/tables', data),
  update: (id, data) => api.patch(`/tables/${id}`, data),
  delete: (id) => api.delete(`/tables/${id}`),
};

export const reservations = {
  getAll: () => api.get('/reservations'),
  getByDate: (date) => api.get(`/reservations/date/${date}`),
  create: (data) => api.post('/reservations', data),
  update: (id, data) => api.patch(`/reservations/${id}`, data),
  delete: (id) => api.delete(`/reservations/${id}`),
};

export default api; 