const db = require('../config/db');

const User = {
    findByEmail: async (correo) => {
        try {
            const query = 'SELECT id, nombre, apellido, correo, password, google_id FROM users WHERE correo = ?';
            console.log('Buscando usuario con correo:', correo);
            
            const [results] = await db.query(query, [correo]);
            console.log('Resultados de la DB:', results);
            
            return results;
        } catch (error) {
            console.error('Error en findByEmail:', error);
            throw error;
        }
    },

    create: async (userData) => {
        try {
            // Validar datos requeridos
            if (!userData.correo) {
                throw new Error('El correo electrónico es requerido');
            }

            const query = `
                INSERT INTO users (nombre, apellido, correo, password, google_id) 
                VALUES (?, ?, ?, ?, ?)
            `;

            console.log('Creando nuevo usuario:', {
                nombre: userData.nombre,
                apellido: userData.apellido,
                correo: userData.correo,
                googleId: userData.googleId
            });
            
            const [result] = await db.query(
                query, 
                [
                    userData.nombre || 'Usuario',
                    userData.apellido || 'Google',
                    userData.correo,
                    userData.password,
                    userData.googleId || null
                ]
            );
            
            console.log('Usuario creado con ID:', result.insertId);
            
            return {
                id: result.insertId,
                nombre: userData.nombre,
                apellido: userData.apellido,
                correo: userData.correo,
                googleId: userData.googleId
            };
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    }
};

module.exports = User;