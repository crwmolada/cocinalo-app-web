const CalendarEvent = require('../models/CalendarEvent');

const calendarController = {
    getEvents: async (req, res) => {
        try {
            const userId = req.userId;
            // console.log('Obteniendo eventos para usuario:', userId);
        

            const events = await CalendarEvent.getByUserId(userId);
            
            res.json({
                success: true,
                data: events,
                message: 'Eventos obtenidos exitosamente'
            });
        } catch (error) {
            console.error('Error al obtener eventos:', error);
            res.status(500).json({ 
                success: false,
                message: 'Error al obtener eventos',
                error: error.message 
            });
        }
    },

    createEvent: async (req, res) => {
        try {
            const userId = req.userId;
            const { title, day, month, year, timeFrom, timeTo } = req.body;
            
            if (!title?.trim()) {
                return res.status(400).json({ 
                    success: false,
                    message: 'El título es requerido' 
                });
            }

            if (!day || !month || !year || !timeFrom || !timeTo) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Todos los campos de fecha y hora son requeridos' 
                });
            }

           /*  console.log('Creando evento para usuario:', userId, {
                title, day, month, year, timeFrom, timeTo
            }); */

            const newEvent = await CalendarEvent.create(userId, {
                title, day, month, year, timeFrom, timeTo
            });

            res.status(201).json({
                success: true,
                data: newEvent,
                message: 'Evento creado exitosamente'
            });
        } catch (error) {
            console.error('Error al crear evento:', error);
            res.status(500).json({ 
                success: false,
                message: 'Error al crear evento',
                error: error.message
            });
        }
    },

    deleteEvent: async (req, res) => {
        try {
            const userId = req.userId;
            const { eventId } = req.params;
            
            if (!eventId) {
                return res.status(400).json({ 
                    success: false,
                    message: 'ID del evento es requerido' 
                });
            }

            // console.log('Eliminando evento:', { userId, eventId });

            await CalendarEvent.delete(eventId, userId);
            
            res.json({
                success: true,
                message: 'Evento eliminado exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar evento:', error);
            
            if (error.message.includes('no encontrado')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({ 
                success: false,
                message: 'Error al eliminar evento',
                error: error.message 
            });
        }
    }
};

module.exports = calendarController;