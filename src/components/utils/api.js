import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

// Add a request interceptor to attach the access token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  response => response,
  async error => {
    
    const originalRequest = error.config;
    // if (error.response.status === 401 && !originalRequest._retry) {
      if (error.response.status === 401 ) {
      originalRequest._retry = true;
      try {
        // Try to refresh the token
        
        const refreshToken = localStorage.getItem('refreshToken');
        
        const response = await api.post('/refresh-token', {
          refreshToken
        });

        
        const  accessToken  = response.data.accessToken;
     
        localStorage.setItem('authToken', accessToken);
        // Retry the original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure (e.g., redirect to login)
        console.error('Refresh token error:', refreshError);
        // Optionally, handle user logout or redirection
      }
    }
    return Promise.reject(error);
  }
);

export default api;
