const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');

const authMiddleware = (req, res, next) => {
    //logs
   // console.log('Verificando autenticación...');
    // console.log('Headers recibidos:', req.headers);

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.log('No se encontró header de autorización');
            return res.status(401).json({ 
                success: false,
                message: 'Token no proporcionado' 
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            console.log('Token no encontrado en el header');
            return res.status(401).json({ 
                success: false,
                message: 'Token no proporcionado' 
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Token decodificado:', decoded);
        
        req.userId = decoded.userId;
        console.log('Usuario autenticado:', req.userId);
        
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