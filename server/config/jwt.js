const jwt = require('jsonwebtoken');
require('dotenv').config();

// Clave secreta para aprobar tokens
const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_temporal_equisde';

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
    console.error('ADVERTENCIA: JWT_SECRET no está definido en las variables de entorno');
    process.exit(1);
}

module.exports = {
    JWT_SECRET,
    generateToken: (user) => {
        return jwt.sign(
            { userId: parseInt(user.id, 10) }, 
            JWT_SECRET, 
            { expiresIn: '24h' } 
        );
    }
};
