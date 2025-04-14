import axios from 'axios';
import backendUrl from '../constants';

// Create axios instance
const apiClient = axios.create({
  baseURL: backendUrl,
  withCredentials: true, // Include cookies for authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      // Get token from response headers
      const token = response.headers['authorization']?.split(' ')[1];
      if (token) {
        localStorage.setItem('token', token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  logout: async () => {
    try {
      const response = await apiClient.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getProfile: async () => {
    try {
      const response = await apiClient.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Question related API calls
export const questionApi = {
  getQuestions: async (filters = {}) => {
    const { category, difficulty, search } = filters;
    let queryParams = new URLSearchParams();
    
    if (category) queryParams.append('category', category);
    if (difficulty) queryParams.append('difficulty', difficulty);
    if (search) queryParams.append('search', search);
    
    try {
      const response = await apiClient.get(`/questions?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getQuestion: async (id) => {
    try {
      const response = await apiClient.get(`/questions/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createQuestion: async (questionData) => {
    try {
      const response = await apiClient.post('/questions', questionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Quiz related API calls
export const quizApi = {
  getQuizQuestions: async (settings = {}) => {
    const { categories, limit } = settings;
    let queryParams = new URLSearchParams();
    
    if (categories) {
      // Handle both single category and array of categories
      if (Array.isArray(categories)) {
        categories.forEach(category => {
          queryParams.append('categories', category);
        });
      } else {
        queryParams.append('categories', categories);
      }
    }
    
    if (limit) queryParams.append('limit', limit);
    
    try {
      const response = await apiClient.get(`/quiz?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  submitQuiz: async (quizData) => {
    try {
      const response = await apiClient.post('/quiz/submit', quizData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default apiClient;
