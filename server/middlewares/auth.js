const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ 
                success: false,
                message: 'Token no proporcionado' 
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Token no proporcionado' 
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Token decodificado:', decoded);
        
        req.userId = parseInt(decoded.userId, 10);
        
        if (isNaN(req.userId)) {
            throw new Error('ID de usuario inválido en el token');
        }
        
        console.log('ID de usuario extraído:', req.userId);
        next();
    } catch (error) {
        console.error('Error de autenticación:', error);
        res.status(401).json({ 
            success: false,
            message: 'Token inválido o expirado',
            error: error.message
        });
    }
};

module.exports = authMiddleware;