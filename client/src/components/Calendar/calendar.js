import React, { useState, useEffect } from 'react';
import './calendar.scss';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import api from '../../utils/axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAngleLeft,
    faAngleRight,
    faPlus,
} from '@fortawesome/free-solid-svg-icons';

const Calendar = () => {
    const { user } = useAuth();

    // Arrays para nombres de meses y días
    const months = [
        "Enero", "Febrero", "Marzo", "Abril",
        "Mayo", "Junio", "Julio", "Agosto",
        "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const days = [
        "Domingo", "Lunes", "Martes", "Miércoles",
        "Jueves", "Viernes", "Sábado"
    ];

    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState(new Date().getDate());
    const [activeDay, setActiveDay] = useState(new Date().getDate());
    const [eventsArr, setEventsArr] = useState([]);
    const [dateInput, setDateInput] = useState('');
    const [addEventWrapper, setAddEventWrapper] = useState(false);
    const [eventForm, setEventForm] = useState({
        title: '',
        timeFrom: '',
        timeTo: ''
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const remainingDays = 42 - (firstDayIndex + daysInMonth);

    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await api.get('/calendar/events', {
                    timeout: 30000
                });
                
                if (response.data.success) {
                    setEventsArr(response.data.data || []);
                } else {
                    setEventsArr([]);
                    setError(response.data.message || 'No se pudieron cargar los eventos');
                }
            } catch (error) {
                console.error('Error completo:', error);
                let errorMessage = 'Error al cargar eventos';
                
                if (error.code === 'ECONNABORTED') {
                    errorMessage = 'La conexión tardó demasiado. Por favor, recarga la página.';
                } else if (error.response?.data?.message) {
                    errorMessage = error.response.data.message;
                }
                
                setError(errorMessage);
                setEventsArr([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchEvents();
        } else {
            setEventsArr([]);
            setIsLoading(false);
        }
    }, [user]);

    // Convertir tiempo a formato 12 horas
    const convertTime = (time) => {
        let timeArr = time.split(":");
        let timeHour = parseInt(timeArr[0]);
        let timeMin = timeArr[1];
        let timeFormat = timeHour >= 12 ? "PM" : "AM";
        timeHour = timeHour % 12 || 12;
        return `${timeHour}:${timeMin} ${timeFormat}`;
    };

    // Actualiza los eventos del día seleccionado
    const updateEvents = (date) => {
        if (!Array.isArray(eventsArr)) {
            console.error('eventsArr no es un array:', eventsArr);
            return (
                <div className="no-event">
                    <h3>Ninguna Receta</h3>
                </div>
            );
        }

        const dayEvents = eventsArr.filter(event =>
            date === event.day &&
            month + 1 === event.month &&
            year === event.year &&
            event.userId === user?.id
        );

        if (!dayEvents || dayEvents.length === 0) {
            return (
                <div className="no-event">
                    <h3>Ninguna Receta</h3>
                </div>
            );
        }

        return dayEvents.map((event) => (
            <div
                className="event"
                key={event.id}
                onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    if (x > rect.width - 50) {
                        handleDeleteEvent(event.id);
                    }
                }}
            >
                <div className="title">
                    <i className="fas fa-circle"></i>
                    <h3 className="event-title">{event.title}</h3>
                </div>
                <div className="event-time">
                    <span className="event-time">
                        {`${convertTime(event.timeFrom)} - ${convertTime(event.timeTo)}`}
                    </span>
                </div>
            </div>
        ));
    };

    // Funciones auxiliares
    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
    };

    const handleDateClick = (day) => {
        setSelectedDate(day);
        setActiveDay(day);
    };

    const getPrevDays = () => {
        const prevMonthDays = new Date(year, month, 0).getDate();
        return Array.from(
            { length: firstDayIndex },
            (_, i) => prevMonthDays - firstDayIndex + i + 1
        );
    };

    // Navegación entre meses
    const handlePrevMonth = () => {
        if (month === 0) {
            setMonth(11);
            setYear(year - 1);
        } else {
            setMonth(month - 1);
        }
    };

    const handleNextMonth = () => {
        if (month === 11) {
            setMonth(0);
            setYear(year + 1);
        } else {
            setMonth(month + 1);
        }
    };

    // Ir a hoy
    const goToToday = () => {
        const today = new Date();
        setMonth(today.getMonth());
        setYear(today.getFullYear());
        setSelectedDate(today.getDate());
        setActiveDay(today.getDate());
    };

    // Manejar el envío del formulario de evento
    const handleEventSubmit = async (e) => {
        e.preventDefault();
        const { title, timeFrom, timeTo } = eventForm;

        if (!title || !timeFrom || !timeTo) {
            alert("Por favor completa todos los campos");
            return;
        }

        try {
            const response = await api.post('/calendar/events', {
                title,
                day: activeDay,
                month: month + 1,
                year,
                timeFrom,
                timeTo
            });

            if (response.data.success) {
                // Recargar eventos
                const eventsResponse = await api.get('/calendar/events');
                if (eventsResponse.data.success) {
                    setEventsArr(eventsResponse.data.data || []);
                }
                
                setEventForm({ title: '', timeFrom: '', timeTo: '' });
                setAddEventWrapper(false);
            } else {
                throw new Error(response.data.message || 'Error al crear el evento');
            }
        } catch (error) {
            console.error('Error al crear evento:', error);
            alert(error.response?.data?.message || 'Error al crear el evento');
        }
    };

    // Eliminar evento
    const handleDeleteEvent = async (eventId) => {
        try {
            setIsLoading(true);
            const response = await api.delete(`/calendar/events/${eventId}`);
            
            if (response.data.success) {
                // Recargar eventos
                const eventsResponse = await api.get('/calendar/events');
                if (eventsResponse.data.success) {
                    setEventsArr(eventsResponse.data.data || []);
                }
            } else {
                throw new Error(response.data.message || 'Error al eliminar el evento');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Error al eliminar el evento');
            console.error('Error al eliminar evento:', error);
            alert('Error al eliminar el evento');
        } finally {
            setIsLoading(false);
        }
    };

    // Manejar input de fecha
    const handleDateInput = (e) => {
        let value = e.target.value.replace(/[^0-9/]/g, "");
        if (value.length === 2 && !value.includes('/')) value += '/';
        if (value.length > 7) value = value.slice(0, 7);
        setDateInput(value);
    };

    // Ir a fecha específica
    const goToDate = () => {
        const dateArr = dateInput.split("/");
        if (dateArr.length === 2) {
            const month = parseInt(dateArr[0]) - 1;
            const year = parseInt(dateArr[1]);

            if (month >= 0 && month < 12 && year > 0) {
                setMonth(month);
                setYear(year);
                setDateInput('');
                return;
            }
        }
        alert("Fecha Inválida");
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (addEventWrapper) {
                const modal = document.querySelector('.add-event-wrapper');
                const addButton = document.querySelector('.add-event');
                if (modal && !modal.contains(e.target) && e.target !== addButton) {
                    setAddEventWrapper(false);
                }
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [addEventWrapper]);

    const hasEvent = (day) => {
        if (!Array.isArray(eventsArr)) {
            console.error('eventsArr no es un array:', eventsArr);
            return false;
        }
        
        return eventsArr.some(
            event => event.day === day &&
                event.month === month + 1 &&
                event.year === year &&
                event.userId === user?.id
        );
    };

    return (
        <div className="calendar-page">
            <Navbar />

            {isLoading && (
                <div className="loading-message">
                    <h2>Cargando eventos...</h2>
                </div>
            )}

            {error && (
                <div className="error-message">
                    <h2>Error: {error}</h2>
                </div>
            )}

            {!isLoading && !error && (
                <div className="calendar-container">
                    <div className="left">
                        <div className="calendar">

                            <div className="month">
                                <i className="fas fa-angle-left prev" onClick={handlePrevMonth}>
                                    <FontAwesomeIcon icon={faAngleLeft} />
                                </i>
                                <div className="date">{months[month]} {year}</div>
                                <i className="fas fa-angle-right next" onClick={handleNextMonth}>
                                    <FontAwesomeIcon icon={faAngleRight} />
                                </i>
                            </div>
                            <div className="weekdays">
                                {days.map((day, index) => (
                                    <div key={index}>{day}</div>
                                ))}
                            </div>
                            <div className="days">
                                {firstDayIndex > 0 &&
                                    Array.from({ length: firstDayIndex }).map((_, index) => (
                                        <div key={`prev-${index}`} className="day prev-date">
                                            {getPrevDays()[index]}
                                        </div>
                                    ))}

                                {Array.from({ length: daysInMonth }).map((_, index) => {
                                    const day = index + 1;
                                    return (
                                        <div
                                            key={`current-${index}`}
                                            className={`day ${isToday(day) ? 'today' : ''} 
                                                                  ${day === activeDay ? 'active' : ''} 
                                                                  ${hasEvent(day) ? 'event' : ''}`}
                                            onClick={() => handleDateClick(day)}
                                        >
                                            {day}
                                        </div>
                                    );
                                })}

                                {remainingDays > 0 &&
                                    Array.from({ length: remainingDays }).map((_, index) => (
                                        <div key={`next-${index}`} className="day next-date">
                                            {index + 1}
                                        </div>
                                    ))}
                            </div>
                        </div>
                        <div className="goto-today">
                            <div className="goto">
                                <input
                                    type="text"
                                    placeholder="mm/yyyy"
                                    className="date-input"
                                    value={dateInput}
                                    onChange={handleDateInput}
                                />
                                <button className="goto-btn" onClick={goToDate}>IR</button>
                            </div>
                            <button className="today-btn" onClick={goToToday}>Hoy</button>
                        </div>
                    </div>
                    <div className="right">
                        <div className="today-date">
                            <div className="event-day">
                                {days[new Date(year, month, activeDay).getDay()]}
                            </div>
                            <div className="event-date">
                                {months[month]} {activeDay} {year}
                            </div>
                        </div>
                        <div className="events">
                            {updateEvents(activeDay)}
                        </div>

                    </div>

                    <button
                        className="add-event"
                        onClick={(e) => {
                            e.stopPropagation();
                            setAddEventWrapper(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </button>

                    {/* Modal para agregar recetas */}
                    <div className={`add-event-wrapper ${addEventWrapper ? 'active' : ''}`}>
                        <div className="add-event-header">
                            <div className="title">Añadir receta</div>
                            <i
                                className="fas fa-times close"
                                onClick={() => setAddEventWrapper(false)}
                            ></i>
                        </div>
                        <div className="add-event-body">
                            <div className="add-event-input">
                                <input
                                    type="text"
                                    placeholder="Nombre del Evento"
                                    className="event-name"
                                    value={eventForm.title}
                                    onChange={e => setEventForm({ ...eventForm, title: e.target.value.slice(0, 60) })}
                                />
                            </div>
                            <div className="add-event-input">
                                <input
                                    type="text"
                                    placeholder="Hora Inicio (HH:MM)"
                                    className="event-time-from"
                                    value={eventForm.timeFrom}
                                    onChange={e => {
                                        let value = e.target.value.replace(/[^0-9:]/g, "");
                                        if (value.length === 2) value += ":";
                                        if (value.length > 5) value = value.slice(0, 5);
                                        setEventForm({ ...eventForm, timeFrom: value });
                                    }}
                                />
                            </div>
                            <div className="add-event-input">
                                <input
                                    type="text"
                                    placeholder="Hora Fin (HH:MM)"
                                    className="event-time-to"
                                    value={eventForm.timeTo}
                                    onChange={e => {
                                        let value = e.target.value.replace(/[^0-9:]/g, "");
                                        if (value.length === 2) value += ":";
                                        if (value.length > 5) value = value.slice(0, 5);
                                        setEventForm({ ...eventForm, timeTo: value });
                                    }}
                                />
                            </div>
                        </div>
                        <div className="add-event-footer">
                            <button className="add-event-btn" onClick={handleEventSubmit}>
                                Añadir Receta
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;