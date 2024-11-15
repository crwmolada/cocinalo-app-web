const db = require('../config/db');

const CalendarEvent = {
    create(userId, eventData) {
        const { title, day, month, year, timeFrom, timeTo } = eventData;
        
        return new Promise((resolve, reject) => {
            if (!userId) {
                return reject(new Error('userId es requerido'));
            }

            const query = `
                INSERT INTO calendar_events 
                (user_id, title, day, month, year, time_from, time_to) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const values = [userId, title, day, month, year, timeFrom, timeTo];
            
            // console.log('Ejecutando query:', query);
            // console.log('Con valores:', values);

            db.query(query, values, (err, result) => {
                if (err) {
                    console.error('Error en create:', err);
                    return reject(err);
                }
                resolve({
                    id: result.insertId,
                    userId,
                    title,
                    day,
                    month,
                    year,
                    timeFrom,
                    timeTo
                });
            });
        });
    },

    getByUserId(userId) {
        return new Promise((resolve, reject) => {
            if (!userId) {
                return reject(new Error('userId es requerido'));
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

            //console.log('Obteniendo eventos para usuario:', userId);

            db.query(query, [userId], (err, results) => {
                if (err) {
                    console.error('Error en getByUserId:', err);
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    delete(eventId, userId) {
        return new Promise((resolve, reject) => {
            if (!eventId || !userId) {
                return reject(new Error('eventId y userId son requeridos'));
            }

            const query = `
                DELETE FROM calendar_events 
                WHERE id = ? AND user_id = ?
            `;

            // console.log('Eliminando evento:', { eventId, userId });

            db.query(query, [eventId, userId], (err, result) => {
                if (err) {
                    console.error('Error en delete:', err);
                    return reject(err);
                }
                
                if (result.affectedRows === 0) {
                    return reject(new Error('Evento no encontrado o no pertenece al usuario'));
                }
                
                resolve({ message: 'Evento eliminado con éxito' });
            });
        });
    }
};

module.exports = CalendarEvent;