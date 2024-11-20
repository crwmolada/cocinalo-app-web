import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 60);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleCalendarClick = () => {
        if (!isAuthenticated) {
            navigate('/login', { 
                state: { message: "Inicia sesión para acceder al calendario de comidas" } 
            });
        } else {
            navigate('/calendar');
        }
    };

    const getNavbarClass = () => {
        const authPages = ['/login', '/register', '/calendar'];
        const isAuthPage = authPages.includes(location.pathname);
        return `navbar ${isAuthPage ? 'auth-page' : ''} ${scrolled ? 'scrolled': ""}`;
    };

    return (
        <nav className={getNavbarClass()}>
            <div className='container'>
                <div className='navbar-content'>
                    <div className='brand-and-toggler'>
                        <Link to="/" className='navbar-brand'>
                            <MdFoodBank />
                            <span className='navbar-brand-text'>COCINALO.</span>
                        </Link>

                        <div className='navbar-btns'>
                            {isAuthenticated && user && (
                                <span className="welcome-message">
                                    Bienvenido(a), {user.nombre} {user.apellido}
                                </span>
                            )}
                            
                            <button 
                                onClick={handleCalendarClick} 
                                className={`navbar-icon ${!isAuthenticated ? 'not-logged' : ''}`}
                                title={isAuthenticated ? "Ir al calendario" : "Inicia sesión para acceder al calendario"}
                            >
                                <FaCalendarAlt />
                                {!isAuthenticated && <span className="login-hint">Inicia sesión para usar</span>}
                            </button>

                            <button 
                                onClick={isAuthenticated ? logout : () => navigate('/login')} 
                                className="navbar-icon"
                                title={isAuthenticated ? "Cerrar sesión" : "Iniciar sesión"}
                            >
                                {isAuthenticated ? <FaSignOutAlt /> : <FaSignInAlt />}
                            </button>

                            <button 
                                className='navbar-show-btn' 
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