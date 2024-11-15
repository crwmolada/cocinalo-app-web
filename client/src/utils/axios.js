import axios from 'axios';

// Instancia de Axios con URL base de API
const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});

// Interceptor para agregar el token en las peticiones
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

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expirado o inválido
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;