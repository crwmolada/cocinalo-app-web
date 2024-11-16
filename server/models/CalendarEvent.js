const db = require('../config/db');

const CalendarEvent = {
    async create(userId, eventData) {
        try {
            if (!userId) {
                throw new Error('userId es requerido');
            }

            const { title, day, month, year, timeFrom, timeTo } = eventData;
            
            const query = `
                INSERT INTO calendar_events 
                (user_id, title, day, month, year, time_from, time_to) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const values = [userId, title, day, month, year, timeFrom, timeTo];
            
            console.log('Creando evento para usuario:', userId);
            const [result] = await db.query(query, values);
            
            console.log('Evento creado con ID:', result.insertId);
            
            return {
                id: result.insertId,
                userId,
                title,
                day,
                month,
                year,
                timeFrom,
                timeTo
            };
        } catch (error) {
            console.error('Error al crear evento:', error);
            throw new Error('Error al crear el evento en el calendario');
        }
    },

    async getByUserId(userId) {
        try {
            if (!userId) {
                throw new Error('userId es requerido');
            }

            const query = `
                SELECT 
                    id,
                    user_id AS userId,
                    title,
                    day,
                    month,
                    year,
                    time_from AS timeFrom,
                    time_to AS timeTo
                FROM calendar_events 
                WHERE user_id = ? 
                ORDER BY year, month, day
            `;

            console.log('Buscando eventos para usuario:', userId);
            const [events] = await db.query(query, [userId]);
            console.log(`Se encontraron ${events.length} eventos`);
            
            return events;
        } catch (error) {
            console.error('Error al obtener eventos:', error);
            throw new Error('Error al obtener los eventos del calendario');
        }
    },

    async delete(eventId, userId) {
        try {
            if (!eventId || !userId) {
                throw new Error('eventId y userId son requeridos');
            }

            const query = `
                DELETE FROM calendar_events 
                WHERE id = ? AND user_id = ?
            `;

            console.log('Intentando eliminar evento:', { eventId, userId });
            const [result] = await db.query(query, [eventId, userId]);
            
            if (result.affectedRows === 0) {
                throw new Error('Evento no encontrado o no pertenece al usuario');
            }
            
            console.log('Evento eliminado exitosamente');
            return { message: 'Evento eliminado con éxito' };
        } catch (error) {
            console.error('Error al eliminar evento:', error);
            throw error;
        }
    }
};

module.exports = CalendarEvent;