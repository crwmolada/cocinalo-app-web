require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({ 
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}); 

// FuUNCIÓN TEST
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Conexión a la base de datos establecida correctamente');
        connection.release();
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
        throw error;
    }
};

// sE PRUEBA LA CONEXION
testConnection();

module.exports = pool;