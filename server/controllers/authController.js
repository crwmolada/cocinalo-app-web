const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateToken } = require('../config/jwt'); 

const registerUser = async (req, res) => {
    console.log('Datos recibidos en registerUser:', req.body);
    try {
        const { nombre, apellido, correo, password } = req.body;

        // Validar campos requeridos
        if (!nombre || !apellido || !correo || !password) {
            console.log('Faltan campos obligatorios');
            return res.status(400).json({ 
                message: 'Nombre, apellido, correo y contraseña son obligatorios' 
            });
        }

        // Validar formato de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            return res.status(400).json({ message: 'Formato de correo inválido' });
        }

        // Validar formato de contraseña
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: 'La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un carácter especial.'
            });
        }

        // Verificar si el usuario existe
        const existingUsers = await User.findByEmail(correo);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        // Hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear nuevo usuario
        const userData = {
            nombre,
            apellido,
            correo,
            password: hashedPassword
        };

        const newUser = await User.create(userData);
        console.log('Usuario creado exitosamente:', newUser.id);

        res.status(201).json({
            success: true,
            message: 'Usuario creado con éxito',
            user: { 
                id: newUser.id,
                nombre,
                apellido,
                correo 
            }
        });

    } catch (error) {
        console.error('Error en registerUser:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al crear el usuario',
            error: error.message 
        });
    }
};

// Función para login de usuario
const loginUser = async (req, res) => {
    console.log('Datos recibidos en loginUser:', req.body);
    try {
        const { correo, password } = req.body;

        // Buscar usuario por correo
        const users = await User.findByEmail(correo);
        if (users.length === 0) {
            return res.status(400).json({ 
                success: false,
                message: 'Usuario no encontrado' 
            });
        }

        const user = users[0];

        // Verificar contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ 
                success: false,
                message: 'Contraseña incorrecta' 
            });
        }

        // Generar token
        const token = generateToken(user.id);
        console.log('Token generado para usuario:', user.id);

        // Enviar respuesta
        const responseData = {
            success: true,
            message: 'Inicio de sesión exitoso',
            data: {
                token,
                user: {
                    id: user.id,
                    nombre: user.nombre,
                    apellido: user.apellido,
                    correo: user.correo
                }
            }
        };

        res.status(200).json(responseData);

    } catch (error) {
        console.error('Error en loginUser:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al iniciar sesión',
            error: error.message 
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};