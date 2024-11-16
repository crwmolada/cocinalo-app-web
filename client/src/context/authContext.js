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

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);

            if (!response.data.success || !response.data.data) {
                return {
                    success: false,
                    message: response.data.message || 'Error en el registro'
                };
            }

            const { token, user } = response.data.data;

            if (!user?.id || !user?.correo || !user?.nombre || !user?.apellido) {
                return {
                    success: false,
                    message: 'Error en los datos del usuario'
                };
            }

            const newUserData = {
                id: Number(user.id),
                nombre: user.nombre,
                apellido: user.apellido,
                correo: user.correo
            };

            localStorage.setItem('token', token);
            localStorage.setItem('userData', JSON.stringify(newUserData));
            setUser(newUserData);

            return {
                success: true,
                message: 'Registro exitoso'
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error en el registro'
            };
        }
    };

    const login = async (correo, password) => {
        try {
            const response = await api.post('/auth/login', { correo, password });

            if (!response.data.success || !response.data.data) {
                return {
                    success: false,
                    message: response.data.message || 'Credenciales inválidas'
                };
            }

            const { token, user } = response.data.data;
            
            if (!user?.id || !user?.correo || !user?.nombre || !user?.apellido) {
                return {
                    success: false,
                    message: 'Error en los datos del usuario'
                };
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
            
            return {
                success: true,
                message: 'Inicio de sesión exitoso'
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Usuario o contraseña incorrectos'
            };
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
            register,
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