import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LoginForm.scss';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.nombre.trim() || !formData.apellido.trim()) {
            setError('Nombre y apellido son requeridos');
            return false;
        }

        if (!formData.correo.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError('Correo electrónico inválido');
            return false;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
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

            const userData = {
                nombre: formData.nombre.trim(),
                apellido: formData.apellido.trim(),
                correo: formData.correo.trim().toLowerCase(),
                password: formData.password
            };

            const result = await register(userData);

            if (result.success) {
                setFormData({
                    nombre: '',
                    apellido: '',
                    correo: '',
                    password: '',
                    confirmPassword: ''
                });
                
                setSuccess('¡Registro exitoso! Redirigiendo al inicio de sesión...');
                setError('');

                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(result.message || 'Error al registrar usuario');
                setSuccess('');
            }
        } catch (error) {
            console.error('Error en el registro:', error);
            setError('Error al procesar el registro. Por favor, intente nuevamente.');
            setSuccess('');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Registro</h2>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="apellido">Apellido</label>
                            <input
                                type="text"
                                id="apellido"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

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

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button">
                        Registrarse
                    </button>

                    <div className="auth-separator">
                        <span>¿Ya tienes una cuenta?</span>
                    </div>

                    <button 
                        type="button" 
                        className="auth-button secondary"
                        onClick={() => navigate('/login')}
                    >
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm; 