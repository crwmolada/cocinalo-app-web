import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import './LoginForm.scss';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        correo: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.correo.trim()) {
            setError('El correo electrónico es requerido');
            return false;
        }

        if (!formData.correo.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError('Correo electrónico inválido');
            return false;
        }

        if (!formData.password) {
            setError('La contraseña es requerida');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (!validateForm()) {
                return;
            }

            const result = await login(formData.correo, formData.password);

            if (result.success) {
                setSuccess('¡Inicio de sesión exitoso! Redirigiendo...');
                setTimeout(() => {
                    navigate('/calendar');
                }, 1500);
            } else {
                if (result.message === 'El usuario no existe') {
                    setError('No existe una cuenta con este correo electrónico');
                } else if (result.message === 'Contraseña incorrecta') {
                    setError('La contraseña es incorrecta');
                } else {
                    setError(result.message);
                }
            }
        } catch (error) {
            setError('Error al iniciar sesión. Por favor, intente nuevamente.');
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setError('');
            setSuccess('');
            
            const result = await loginWithGoogle();

            if (result.success) {
                setSuccess('¡Inicio de sesión exitoso! Redirigiendo...');
                setTimeout(() => {
                    navigate('/calendar');
                }, 1500);
            } else {
                setError(result.message);
            }
        } catch (error) {
            setError('Error al iniciar sesión con Google');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Iniciar Sesión</h2>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="correo">Correo Electrónico</label>
                        <input
                            type="email"
                            id="correo"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button">
                        Iniciar Sesión
                    </button>

                    <div className="auth-separator">
                        <span>O</span>
                    </div>

                    <button 
                        type="button" 
                        className="auth-button google"
                        onClick={handleGoogleLogin}
                    >
                        <FontAwesomeIcon icon={faGoogle} className="google-icon" />
                        Continuar con Google
                    </button>

                    <div className="auth-separator">
                        <span>¿No tienes una cuenta?</span>
                    </div>

                    <button 
                        type="button" 
                        className="auth-button secondary"
                        onClick={() => navigate('/register')}
                    >
                        Registrarse
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm; 