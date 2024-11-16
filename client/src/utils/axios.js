import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor para peticiones
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Enviando petición a:', config.url);
        console.log('Headers:', config.headers);
        return config;
    },
    (error) => {
        console.error('Error en la petición:', error);
        return Promise.reject(error);
    }
);

// Interceptor para respuestas
api.interceptors.response.use(
    (response) => {
        console.log('Respuesta recibida de:', response.config.url);
        return response;
    },
    (error) => {
        if (error.code === 'ECONNABORTED') {
            console.error('La petición excedió el tiempo límite');
        } else if (error.response) {
            console.error('Error del servidor:', error.response.data);
            
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('userData');
                window.location.href = '/login';
            }
        } else if (error.request) {
            console.error('No se recibió respuesta del servidor');
        }
        return Promise.reject(error);
    }
);

export default api;