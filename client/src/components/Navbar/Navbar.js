import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MdFoodBank } from "react-icons/md";
import './Navbar.scss';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

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
        if (!user) {
            navigate('/login');
        } else {
            navigate('/calendar');
        }
    };

    return (
        <nav className={`navbar bg-orange flex align-center ${scrolled ? 'scrolled': ""}`}>
            <div className='container w-100'>
                <div className='navbar-content text-white'>
                    <div className='brand-and-toggler flex align-center justify-between'>
                        <Link to="/" className='navbar-brand fw-3 fs-22 flex align-center'>
                            <MdFoodBank />
                            <span className='navbar-brand-text fw-7'>Cocínalo</span>
                        </Link>

                        <div className='navbar-btns flex align-center'>
                            {user && (
                                <span className="welcome-message">
                                    Bienvenido(a), {user.nombre} {user.apellido}
                                </span>
                            )}
                            
                            <button 
                                onClick={handleCalendarClick} 
                                className="navbar-icon"
                                title="Calendario"
                            >
                                <i className="fas fa-calendar"></i>
                            </button>

                            {user && (
                                <button 
                                    onClick={logout} 
                                    className="navbar-icon"
                                    title="Cerrar sesión"
                                >
                                    <i className="fas fa-sign-out-alt"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;