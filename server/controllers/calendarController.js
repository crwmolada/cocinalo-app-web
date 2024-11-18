const CalendarEvent = require('../models/CalendarEvent');

const calendarController = {
    getEvents: async (req, res) => {
        try {
            const userId = parseInt(req.userId, 10);
            
            if (!userId || isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de usuario inválido'
                });
            }

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
            const userId = parseInt(req.userId, 10);
            
            console.log('1. Controller - Datos recibidos:', {
                userId: userId,
                bodyData: req.body,
                userIdType: typeof userId
            });
            
            if (!userId || isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de usuario inválido'
                });
            }

            const { title, day, month, year, timeFrom, timeTo } = req.body;
            
            console.log('2. Controller - Datos procesados:', {
                title, day, month, year, timeFrom, timeTo
            });

            const newEvent = await CalendarEvent.create(userId, {
                title, day, month, year, timeFrom, timeTo
            });

            console.log('3. Controller - Evento creado:', newEvent);

            res.status(201).json({
                success: true,
                data: newEvent,
                message: 'Evento creado exitosamente'
            });
        } catch (error) {
            console.error('4. Controller - Error completo:', error);
            res.status(500).json({ 
                success: false,
                message: 'Error al crear evento',
                error: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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