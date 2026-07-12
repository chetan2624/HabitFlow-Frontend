import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Points to backend
});

// Add a request interceptor to attach JWT token
api.interceptors.request.use(
  async (config) => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch (err) {
      console.error("Failed to read token from localStorage", err);
    }
    
    // Also try getClerkToken as fallback just in case
    if (!config.headers.Authorization && window.getClerkToken) {
      try {
        const token = await window.getClerkToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error("Failed to get Clerk token", err);
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

let isRedirecting = false;

// Add a response interceptor to handle 401s globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!isRedirecting) {
        isRedirecting = true;
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
