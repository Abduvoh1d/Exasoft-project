import axios from "axios";

const api = axios.create({
    baseURL: 'http://45.138.158.137:92/api/',
    timeout: 30000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error: unknown) => {
    return Promise.reject(error);
});

export default api;