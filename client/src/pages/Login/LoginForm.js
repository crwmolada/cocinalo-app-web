import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import './LoginForm.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/axios';

const Form = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [registerForm, setRegisterForm] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        password: '',
    });
    const [loginForm, setLoginForm] = useState({
        correo: '',
        password: '',
    });
    const [messages, setMessages] = useState({
        error: null,
        success: null
    });

    // Validaciones simplificadas
    const validateForm = (formData) => {
        if (!formData.correo || !formData.password) {
            return "Correo y contraseña son requeridos";
        }
        if (formData.password.length < 6) {
            return "La contraseña debe tener al menos 6 caracteres";
        }
        return null;
    };

    const handleOverlayToggle = () => {
        setIsSignUp(!isSignUp);
        setMessages({ error: null, success: null });
        if (containerRef.current) {
            containerRef.current.classList.toggle('right-panel-active');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (isSignUp) {
            setRegisterForm((prev) => ({ ...prev, [name]: value }));
        } else {
            setLoginForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessages({ error: null, success: null });

        const formData = isSignUp ? registerForm : loginForm;

        const validationError = validateForm(formData);
        if (validationError) {
            setMessages(prev => ({ ...prev, error: validationError }));
            return;
        }

        try {
            if (isSignUp) {
                const response = await api.post('/users/register', formData);
                
                if (response.data.success) {
                    setMessages(prev => ({
                        ...prev,
                        success: '¡Usuario registrado exitosamente!'
                    }));
                    setRegisterForm({ nombre: '', apellido: '', correo: '', password: '' });
                    
                    setTimeout(() => {
                        setIsSignUp(false);
                        containerRef.current.classList.remove('right-panel-active');
                        setMessages({ error: null, success: null });
                    }, 3000);
                }
            } else {
                const success = await login(formData.correo, formData.password);
                if (success) {
                    setMessages(prev => ({
                        ...prev,
                        success: '¡Inicio de sesión exitoso! Redirigiendo...'
                    }));
                    setLoginForm({ correo: '', password: '' });
                    
                    setTimeout(() => {
                        navigate('/calendar');
                    }, 2000);
                }
            }
        } catch (error) {
            setMessages(prev => ({
                ...prev,
                error: error.response?.data?.message || error.message
            }));
        }
    };

    const containerRef = useRef(null);

    return (
        <div className='login-body'>
            <Navbar />
            <div className="login-container" id="login-container" ref={containerRef}>
                <div className="login-form-container sign-up-login-container">
                    <form onSubmit={handleSubmit} id="registerForm">
                        <h1>Crea una cuenta</h1>
                        <div className="login-infield">
                            <input type="text" name="nombre" placeholder="Nombre" value={registerForm.nombre} onChange={handleChange} id="register-nombre" required />
                            <label htmlFor="register-nombre"></label>
                        </div>
                        <div className="login-infield">
                            <input type="text" name="apellido" placeholder="Apellido" value={registerForm.apellido} onChange={handleChange} id="register-apellido" required />
                            <label htmlFor="register-apellido"></label>
                        </div>
                        <div className="login-infield">
                            <input type="email" name="correo" placeholder="Correo" value={registerForm.correo} onChange={handleChange} id="register-correo" required />
                            <label htmlFor="register-correo"></label>
                        </div>
                        <div className="login-infield">
                            <input type="password" name="password" placeholder="Contraseña" value={registerForm.password} onChange={handleChange} id="register-contraseña" required />
                            <label htmlFor="register-contraseña"></label>
                        </div>
                        <button type="submit" id="registerSubmit">Registrarse</button>
                    </form>
                </div>
                <div className="login-form-container sign-in-login-container">
                    <form onSubmit={handleSubmit} id="loginForm">
                        <h1>Iniciar sesión</h1>
                        <div className="login-infield">
                            <input type="email" placeholder="Usuario" value={loginForm.correo} onChange={handleChange} id="login-correo" name="correo" required />
                            <label htmlFor="login-correo"></label>
                        </div>
                        <div className="login-infield">
                            <input type="password" placeholder="Contraseña" value={loginForm.password} onChange={handleChange} id="login-contraseña" name="password" required />
                            <label htmlFor="login-contraseña"></label>
                        </div>
                        <button type="submit" id="loginSubmit">Iniciar sesión</button>
                    </form>
                </div>

                <div className="login-messages-container">
                    {messages.error && (
                        <div className="login-message error">
                            <i className="fas fa-exclamation-circle"></i>
                            {messages.error}
                        </div>
                    )}
                    {messages.success && (
                        <div className="login-message success">
                            <i className="fas fa-check-circle"></i>
                            {messages.success}
                        </div>
                    )}
                </div>

                <div className="login-overlay-container" id="login-overlayCon">
                    <div className="login-overlay">
                        <div className="login-overlay-panel login-overlay-left">
                            <h1>Hola de nuevo!</h1>
                            <p>Para conectarte en Cocínalo por favor ingresa tus datos</p>
                            <button onClick={handleOverlayToggle}>Iniciar sesión</button>
                        </div>
                        <div className="login-overlay-panel login-overlay-right">
                            <h1>Hola!</h1>
                            <p>Inicia sesión y comienza tu experiencia en Cocínalo</p>
                            <button onClick={handleOverlayToggle}>Registrarse</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Form;
