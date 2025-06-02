// api.js
import axios from 'axios';
import { toast } from 'react-toastify';

// Base API configuration
const api = axios.create({
    baseURL: '',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);

        if (config.url === '/auth/login') {
            console.log("Skipping auth token for login request.");
            return config;
        }

        const token = sessionStorage.getItem('token');
        if (token) {
            console.log("Setting bearer token:", token);
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.log("No token provided.");
        }

        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log(`API Response: ${response.status} for ${response.config.url}`);
        return response;
    },
    (error) => {
        if (error.response) {
            const { status, statusText, data, config } = error.response;

            if (status === 401) {
                toast.warning('Unauthorized: Please log in again.');
            } else if (status === 403) {
                toast.warning('Forbidden: You do not have permission to perform this action.');
            } else {
                toast.error(`Error ${status}: ${statusText || 'Unknown error'}`);
            }

            console.error('API Error Response:', {
                status,
                statusText,
                data,
                url: config.url,
            });
        } else if (error.request) {
            toast.error('Network error: No response from server.');
            console.error('API Error Request:', error.request);
        } else {
            toast.error(`API Error: ${error.message}`);
            console.error('API Error Message:', error.message);
        }

        return Promise.reject(error);
    }
);

export default api;
