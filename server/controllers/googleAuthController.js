const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const bcrypt = require('bcrypt');

const handleGoogleLogin = async (req, res) => {
    try {
        const { correo, nombre, apellido, googleId } = req.body;

        console.log('Datos recibidos del frontend:', { correo, nombre, apellido, googleId });

        if (!correo) {
            return res.status(400).json({
                success: false,
                message: 'El correo electrónico es requerido'
            });
        }

        // Buscar si el usuario existe
        const users = await User.findByEmail(correo);
        let user;

        if (users.length === 0) {
            // Aquí se genera una contraseña segura para usuarios de Google
            const hashedPassword = await bcrypt.hash(googleId + Date.now(), 10);
            
            const userData = {
                nombre: nombre || 'Usuario',
                apellido: apellido || 'Google',
                correo,
                password: hashedPassword,
                googleId
            };

            console.log('Creando nuevo usuario:', userData);
            user = await User.create(userData);
        } else {
            user = users[0];
            console.log('Usuario existente encontrado:', user);
        }

        const token = generateToken(user);

        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    nombre: user.nombre,
                    apellido: user.apellido,
                    correo: user.correo
                }
            }
        });

    } catch (error) {
        console.error('Error en Google login:', error);
        res.status(500).json({
            success: false,
            message: 'Error al procesar la autenticación con Google',
            error: error.message
        });
    }
};

module.exports = {
    handleGoogleLogin
};