import axios from 'axios';

// Create an axios instance
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    config => {
        // Get token from localStorage
        const token = localStorage.getItem('authToken');
        if (token) {
            // Attach the token to the request header
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // Check if the error is due to an expired token (status code 401)
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the token
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/refreshToken`, { refreshToken });

                // Store the new tokens
                localStorage.setItem('authToken', response.data.authToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);

                // Update the Authorization header
                axiosInstance.defaults.headers['Authorization'] = `Bearer ${response.data.authToken}`;

                // Retry the original request
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Handle refresh token failure (e.g., logout user)
                console.error('Refresh token error:', refreshError);
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login'; // Redirect to login
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
