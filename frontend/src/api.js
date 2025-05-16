import axios from 'axios';
import { toast } from 'react-toastify';

export const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

api.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response?.status === 401) {
        toast.error('Sessão expirada. Faça login novamente.');
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    if (error.response?.data?.message) {
        toast.error(error.response.data.message);
    } else {
        toast.error('Ocorreu um erro inesperado');
    }

    return Promise.reject(error);
});

export default api;