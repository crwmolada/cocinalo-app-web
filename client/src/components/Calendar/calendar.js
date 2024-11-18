import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import CalendarGrid from './CalendarGrid';
import CalendarHeader from './CalendarHeader';
import EventForm from './EventForm';
import Alert from '../Alert/Alert';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import './calendar.scss';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [recipes, setRecipes] = useState([]);
    const [showRecipeForm, setShowRecipeForm] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        recipeId: null,
        recipeName: ''
    });

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get('/calendar/events');
                setRecipes(response?.data?.data || []);
            } catch (error) {
                console.log('No hay eventos guardados aún');
                setRecipes([]);
            }
        };

        fetchRecipes();
    }, []);

    const handleRecipeAdd = async (recipeData) => {
        try {
            const formattedData = {
                title: recipeData.title,
                day: parseInt(recipeData.day, 10),
                month: parseInt(recipeData.month, 10),
                year: parseInt(recipeData.year, 10),
                timeFrom: recipeData.timeFrom,
                timeTo: recipeData.timeTo
            };

            console.log('Cliente - Datos a enviar:', formattedData);
            const response = await axios.post('/calendar/events', formattedData);
            
            if (response.data && response.data.data) {
                const newRecipe = response.data.data;
                setRecipes(prevRecipes => [...prevRecipes, newRecipe]);
                setShowRecipeForm(false);
                
                setAlert({
                    show: true,
                    message: `¡Receta "${formattedData.title}" agregada exitosamente!`,
                    type: 'success'
                });
            }
        } catch (error) {
            console.error('Error detallado del cliente:', {
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers,
                error: error
            });
            setAlert({
                show: true,
                message: error.response?.data?.message || 'No se pudo guardar la receta. Por favor, intenta nuevamente.',
                type: 'error'
            });
        }
    };

    const handleRecipeDelete = async (recipeId) => {
        const recipe = recipes.find(r => r.id === recipeId);
        setConfirmDialog({
            isOpen: true,
            recipeId: recipeId,
            recipeName: recipe?.title || 'esta receta'
        });
    };

    const confirmDelete = async () => {
        try {
            const recipeId = confirmDialog.recipeId;
            await axios.delete(`/calendar/events/${recipeId}`);
            
            setRecipes(prevRecipes => 
                prevRecipes.filter(recipe => recipe.id !== recipeId)
            );
            
            setAlert({
                show: true,
                message: `Se eliminó "${confirmDialog.recipeName}" correctamente`,
                type: 'success'
            });
        } catch (error) {
            console.error('Error al eliminar:', error);
            setAlert({
                show: true,
                message: 'Error al eliminar la receta. Por favor, intenta nuevamente.',
                type: 'error'
            });
        } finally {
            setConfirmDialog({ isOpen: false, recipeId: null, recipeName: '' });
        }
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setShowRecipeForm(true);
    };

    return (
        <div className="calendar">
            <CalendarHeader 
                currentDate={currentDate}
                onPrevMonth={() => {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(currentDate.getMonth() - 1);
                    setCurrentDate(newDate);
                }}
                onNextMonth={() => {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(currentDate.getMonth() + 1);
                    setCurrentDate(newDate);
                }}
            />

            <div className="calendar-content-wrapper">
                <CalendarGrid 
                    currentDate={currentDate}
                    events={recipes}
                    onDateClick={handleDateClick}
                    onEventDelete={handleRecipeDelete}
                />
            </div>

            {showRecipeForm && (
                <EventForm 
                    selectedDate={selectedDate}
                    currentDate={currentDate}
                    onSubmit={handleRecipeAdd}
                    onClose={() => setShowRecipeForm(false)}
                />
            )}

            {alert.show && (
                <Alert 
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert({ show: false, message: '', type: '' })}
                />
            )}

            <ConfirmDialog 
                isOpen={confirmDialog.isOpen}
                message={`¿Estás seguro de que deseas eliminar "${confirmDialog.recipeName}"?`}
                onConfirm={confirmDelete}
                onCancel={() => setConfirmDialog({ isOpen: false, recipeId: null, recipeName: '' })}
            />
        </div>
    );
};

export default Calendar; 