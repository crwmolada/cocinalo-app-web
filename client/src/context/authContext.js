import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
            try {
                const parsedData = JSON.parse(userData);
                setUser(parsedData);
            } catch (error) {
                console.error('Error parsing userData:', error);
                localStorage.removeItem('userData');
                localStorage.removeItem('token');
            }
        }
    }, []);

    const login = async (correo, password) => {
        try {
            console.log('Intentando login con:', { correo, password });

            const response = await api.post('/auth/login', {
                correo,
                password
            });

            console.log('Respuesta completa del servidor:', response);

            if (!response.data.success || !response.data.data) {
                console.error('Respuesta inválida del servidor:', response.data);
                throw new Error(response.data.message || 'Respuesta del servidor inválida');
            }

            const { token, user } = response.data.data;
            
            if (!user || !user.id || !user.correo || !user.nombre || !user.apellido) {
                console.error('Datos de usuario incompletos:', user);
                throw new Error('Datos de usuario incompletos');
            }

            const userData = {
                id: Number(user.id),
                nombre: user.nombre,
                apellido: user.apellido,
                correo: user.correo
            };

            localStorage.setItem('token', token);
            localStorage.setItem('userData', JSON.stringify(userData));

            setUser(userData);
            return true;
        } catch (error) {
            console.error('Error en login:', error);
            if (error.response) {
                console.error('Datos del error:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout,
            isAuthenticated: !!user 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};