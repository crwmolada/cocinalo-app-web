const db = require('../config/db');

const User = {
    findByEmail: (correo, callback) => {
        const query = 'SELECT id, nombre, apellido, correo, password FROM users WHERE correo = ?';
        // console.log('Ejecutando query:', query, 'con correo:', correo);
        
        db.query(query, [correo], (err, results) => {
            if (err) {
                console.error('Error en la consulta:', err);
                return callback(err, null);
            }
            
            console.log('Resultados de la DB:', JSON.stringify(results, null, 2));
            
            if (results && results.length > 0) {
                console.log('Usuario encontrado:', {
                    id: results[0].id,
                    nombre: results[0].nombre,
                    apellido: results[0].apellido
                });
            }
            
            callback(null, results);
        });
    },

    create: (userData, callback) => {
        const query = 'INSERT INTO users (nombre, apellido, correo, password) VALUES (?, ?, ?, ?)';
        // console.log('Ejecutando query de creación:', query);
        
        db.query(query, 
            [userData.nombre, userData.apellido, userData.correo, userData.password], 
            (err, result) => {
                if (err) {
                    console.error('Error en la creación:', err);
                    return callback(err, null);
                }
                
                // console.log('Resultado de la creación:', result);
                callback(null, result);
            }
        );
    }
};

module.exports = User;
