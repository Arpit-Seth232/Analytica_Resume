import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API calls
export const authAPI = {
  register: (email) => api.post('/users/register', { email }),
  verifyOTP: (email, otp) => api.post('/users/register/otpVerification', { email, otp }),
  createPassword: (email, pass) => api.post('/users/register/passwordCreation', { email, pass }),
  login: (email, pass) => api.post('/users/login', { email, pass }),
};

// Resume API calls
export const resumeAPI = {
  upload: (formData) => api.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  analyze: (resumeText) => api.post('/resume/upload/analysis', { resumeText }),
};

// Jobs API calls
export const jobsAPI = {
  search: (query, country = 'in', employment_types = 'FULLTIME') => 
    api.post('/jobs/search', { query, country, employment_types }),
};

export default api;