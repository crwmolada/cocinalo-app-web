const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateToken } = require('../config/jwt'); 

const registerUser = async (req, res) => {
    try {
        const { nombre, apellido, correo, password } = req.body;

        // Validar campos requeridos
        if (!nombre || !apellido || !correo || !password) {
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
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear nuevo usuario
        const userData = { nombre, apellido, correo, password: hashedPassword };
        const newUser = await User.create(userData);

        res.status(201).json({
            success: true,
            message: 'Usuario creado con éxito',
            user: { id: newUser.id, nombre, apellido, correo }
        });

    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error al crear el usuario'
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { correo, password } = req.body;
        console.log('Intentando login con correo:', correo);

        // Usar findByEmail en lugar de findOne
        const users = await User.findByEmail(correo);
        
        if (!users || users.length === 0) {
            console.log('Usuario no encontrado');
            return res.json({
                success: false,
                message: 'El usuario no existe'
            });
        }

        const user = users[0]; // Tomar el primer usuario encontrado

        // Verificar la contraseña
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            console.log('Contraseña incorrecta para usuario:', user.correo);
            return res.json({
                success: false,
                message: 'Contraseña incorrecta'
            });
        }

        // Si todo es correcto, generar token y enviar respuesta
        const token = generateToken(user);
        console.log('Login exitoso para usuario:', user.correo);
        
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
        console.error('Error en login:', error);
        res.json({
            success: false,
            message: 'Error al procesar la solicitud'
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};