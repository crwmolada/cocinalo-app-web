const db = require('../config/db');

const CalendarEvent = {
    async create(userId, eventData) {
        try {
            console.log('1. Model - Datos recibidos:', {
                userId,
                eventData,
                userIdType: typeof userId
            });

            const numericUserId = parseInt(userId, 10);
            
            if (!numericUserId || isNaN(numericUserId)) {
                console.error('2. Model - userId inválido:', userId);
                throw new Error('userId inválido');
            }

            const { title, day, month, year, timeFrom, timeTo } = eventData;
            
            const values = [
                numericUserId,
                title.trim(),
                parseInt(day, 10),
                parseInt(month, 10),
                parseInt(year, 10),
                String(timeFrom),
                String(timeTo)
            ];

            console.log('3. Model - Valores preparados:', values);

            const query = 'INSERT INTO calendar_events (user_id, title, day, month, year, time_from, time_to) VALUES (?, ?, ?, ?, ?, ?, ?)';
            
            console.log('4. Model - Query a ejecutar:', {
                query,
                values
            });

            const [result] = await db.query(query, values);
            
            console.log('5. Model - Resultado de la inserción:', result);

            if (!result.insertId) {
                throw new Error('No se pudo crear el evento');
            }

            const createdEvent = {
                id: result.insertId,
                userId: numericUserId,
                title: title.trim(),
                day: parseInt(day, 10),
                month: parseInt(month, 10),
                year: parseInt(year, 10),
                timeFrom: String(timeFrom),
                timeTo: String(timeTo)
            };

            console.log('6. Model - Evento creado:', createdEvent);
            return createdEvent;

        } catch (error) {
            console.error('7. Model - Error detallado:', {
                error,
                message: error.message,
                sql: error.sql,
                sqlMessage: error.sqlMessage
            });
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
            const numericUserId = parseInt(userId, 10);
            const [events] = await db.query(query, [numericUserId]);
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