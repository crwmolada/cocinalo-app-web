import React from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const CalendarHeader = ({ currentDate, onPrevMonth, onNextMonth }) => {
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    return (
        <div className="calendar-header-container">
            <div className="calendar-description">
                <h1>Calendario de Comidas</h1>
                <p className="calendar-subtitle">
                    Organiza tus comidas semanales y mantén un registro de tus recetas favoritas
                </p>
            </div>
            
            <div className="calendar-header">
                <button 
                    className="month-nav-btn" 
                    onClick={onPrevMonth}
                    aria-label="Mes anterior"
                >
                    <IoIosArrowBack />
                </button>
                
                <h2 className="current-month">
                    {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                
                <button 
                    className="month-nav-btn" 
                    onClick={onNextMonth}
                    aria-label="Mes siguiente"
                >
                    <IoIosArrowForward />
                </button>
            </div>
        </div>
    );
};

export default CalendarHeader; 