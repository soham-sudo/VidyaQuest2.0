import axios from 'axios';
import backendUrl from '../constants';

console.log('Using backend URL:', backendUrl);

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

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  response => {
    console.log(`API Response [${response.config.method.toUpperCase()} ${response.config.url}]:`, response.status);
    return response;
  },
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Question related API calls
export const questionApi = {
  getQuestions: async (filters = {}) => {
    const { category, difficulty, search } = filters;
    let queryParams = new URLSearchParams();
    
    if (category) queryParams.append('category', category);
    if (difficulty) queryParams.append('difficulty', difficulty);
    if (search) queryParams.append('search', search);
    
    try {
      console.log(`Fetching questions with filters:`, filters);
      const response = await apiClient.get(`/questions?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      return []; // Return empty array on error for better UX
    }
  },
  
  getQuestion: async (id) => {
    try {
      const response = await apiClient.get(`/questions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching question ${id}:`, error);
      throw error;
    }
  },
  
  createQuestion: async (questionData) => {
    try {
      console.log('Creating question with data:', questionData);
      const response = await apiClient.post('/questions', questionData);
      return response.data;
    } catch (error) {
      console.error('Error creating question:', error);
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
      console.log(`Fetching quiz questions with settings:`, settings);
      const response = await apiClient.get(`/quiz?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      throw error;
    }
  },
  
  submitQuiz: async (quizData) => {
    try {
      console.log('Submitting quiz with data:', quizData);
      const response = await apiClient.post('/quiz/submit', quizData);
      return response.data;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    }
  }
};

export default apiClient;
