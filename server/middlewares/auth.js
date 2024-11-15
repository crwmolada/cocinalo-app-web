const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');

const authMiddleware = (req, res, next) => {
    try {
        // Obtener el token del header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Token no proporcionado' });
        }

        const token = authHeader.split(' ')[1]; // Bearer TOKEN
        
        // Verificar token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Agregar el ID del usuario a la request
        req.userId = decoded.userId;
        
        // Log para debug
        // console.log('Token decodificado:', decoded);
        // console.log('Usuario autenticado:', req.userId);
        
        next();
    } catch (error) {
        console.error('Error de autenticación:', error);
        res.status(401).json({ message: 'Token inválido' });
    }
};

module.exports = authMiddleware;