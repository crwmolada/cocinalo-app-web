import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSidebarContext } from '../../context/sidebarContext';
import { MdFoodBank } from "react-icons/md";
import { IoMdMenu } from "react-icons/io";
import { FaCalendarAlt, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import './Navbar.scss';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { openSidebar } = useSidebarContext();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        console.log('Estado de autenticación:', { user, isAuthenticated });
    }, [user, isAuthenticated]);

    const handleScroll = () => {
        const offset = window.scrollY;
        if(offset > 60){
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleCalendarClick = () => {
        if (!isAuthenticated) {
            navigate('/login', { 
                state: { 
                    message: "Inicia sesión para acceder al calendario de comidas" 
                } 
            });
        } else {
            navigate('/calendar');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className={`navbar bg-orange flex align-center ${scrolled ? 'scrolled': ""}`}>
            <div className='container w-100'>
                <div className='navbar-content text-white'>
                    <div className='brand-and-toggler flex align-center justify-between'>
                        {/* Logo y nombre */}
                        <Link to="/" className='navbar-brand fw-3 fs-22 flex align-center'>
                            <MdFoodBank />
                            <span className='navbar-brand-text fw-7'>COCINALO.</span>
                        </Link>

                        {/* Botones y mensaje de bienvenida */}
                        <div className='navbar-btns flex align-center'>
                            {/* Mensaje si está autenticado */}
                            {isAuthenticated && user && (
                                <span className="welcome-message">
                                    Bienvenido(a), {user.nombre} {user.apellido}
                                </span>
                            )}
                            
                            {/* Icono calendario */}
                            <button 
                                onClick={handleCalendarClick} 
                                className={`navbar-icon ${!isAuthenticated ? 'not-logged' : ''}`}
                                title={isAuthenticated ? "Ir al calendario" : "Inicia sesión para acceder al calendario"}
                            >
                                <FaCalendarAlt />
                                {!isAuthenticated && <span className="login-hint">Inicia sesión para usar</span>}
                            </button>

                            {/* Icono de login/logout */}
                            {isAuthenticated ? (
                                <button 
                                    onClick={handleLogout} 
                                    className="navbar-icon"
                                    title="Cerrar sesión"
                                >
                                    <FaSignOutAlt />
                                </button>
                            ) : (
                                <button 
                                    onClick={() => navigate('/login')} 
                                    className="navbar-icon"
                                    title="Iniciar sesión"
                                >
                                    <FaSignInAlt />
                                </button>
                            )}

                            {/* Icono del Sidebar */}
                            <button 
                                type="button" 
                                className='navbar-show-btn text-white' 
                                onClick={openSidebar}
                                title="Menú"
                            >
                                <IoMdMenu size={27} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;