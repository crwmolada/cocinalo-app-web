const db = require('../config/db');

const User = {
    findByEmail: async (correo) => {
        try {
            const query = 'SELECT id, nombre, apellido, correo, password FROM users WHERE correo = ?';
            console.log('Buscando usuario con correo:', correo);
            
            const [results] = await db.query(query, [correo]);
            
            console.log('Resultados de la DB:', JSON.stringify(results, null, 2));
            
            if (results && results.length > 0) {
                console.log('Usuario encontrado:', {
                    id: results[0].id,
                    nombre: results[0].nombre,
                    apellido: results[0].apellido
                });
            }
            
            return results;
        } catch (error) {
            console.error('Error en findByEmail:', error);
            throw error;
        }
    },

    create: async (userData) => {
        try {
            const query = 'INSERT INTO users (nombre, apellido, correo, password) VALUES (?, ?, ?, ?)';
            console.log('Creando nuevo usuario:', {
                nombre: userData.nombre,
                apellido: userData.apellido,
                correo: userData.correo
            });
            
            const [result] = await db.query(
                query, 
                [userData.nombre, userData.apellido, userData.correo, userData.password]
            );
            
            console.log('Usuario creado con ID:', result.insertId);
            
            return {
                id: result.insertId,
                ...userData,
                password: undefined 
            };
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    }
};

module.exports = User;