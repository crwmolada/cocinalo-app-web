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
                setUser(JSON.parse(userData));
            } catch (error) {
                localStorage.removeItem('userData');
                localStorage.removeItem('token');
            }
        }
    }, []);

    const login = async (correo, password) => {
        try {
            const response = await api.post('/auth/login', { correo, password });

            if (!response.data.success || !response.data.data) {
                throw new Error(response.data.message || 'Error de autenticación');
            }

            const { token, user } = response.data.data;
            
            if (!user?.id || !user?.correo || !user?.nombre || !user?.apellido) {
                throw new Error('Error de autenticación');
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