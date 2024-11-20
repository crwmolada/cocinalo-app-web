import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup } from 'firebase/auth';
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

    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            
            if (!result.user.email) {
                throw new Error('No se pudo obtener el correo electrónico de Google');
            }

            console.log('Datos de usuario Google:', {
                email: result.user.email,
                displayName: result.user.displayName,
                uid: result.user.uid
            });

            // aquí se extrae el nombre y apellido del display
            const fullName = result.user.displayName || '';
            const [nombre, ...apellidoArray] = fullName.split(' ');
            const apellido = apellidoArray.join(' ');

            // enviamos datos al servidor
            const response = await api.post('/auth/google-login', {
                correo: result.user.email,
                nombre: nombre || '',
                apellido: apellido || '',
                googleId: result.user.uid
            });

            if (!response.data.success || !response.data.data) {
                return {
                    success: false,
                    message: response.data.message || 'Error en la autenticación con Google'
                };
            }

            const { token, user: userData } = response.data.data;

            if (!userData?.id || !userData?.correo || !userData?.nombre || !userData?.apellido) {
                return {
                    success: false,
                    message: 'Error en los datos del usuario'
                };
            }

            const newUserData = {
                id: Number(userData.id),
                nombre: userData.nombre,
                apellido: userData.apellido,
                correo: userData.correo
            };

            localStorage.setItem('token', token);
            localStorage.setItem('userData', JSON.stringify(newUserData));
            setUser(newUserData);

            return {
                success: true,
                message: 'Inicio de sesión con Google exitoso'
            };

        } catch (error) {
            console.error('Error en login con Google:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Error al iniciar sesión con Google'
            };
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout,
            register,
            loginWithGoogle,
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