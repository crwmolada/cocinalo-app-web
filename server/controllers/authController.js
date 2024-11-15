const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateToken } = require('../config/jwt'); 

// Función para registrar un nuevo usuario
const registerUser = (req, res) => {
    console.log('Datos recibidos en registerUser:', req.body);
    const { nombre, apellido, correo, password } = req.body;

    if (!nombre || !apellido || !correo || !password) {
        console.log('Faltan campos obligatorios');
        return res.status(400).json({ 
            message: 'Nombre, apellido, correo y contraseña son obligatorios' 
        });
    }

    // Verifica si el correo ya está registrado
    User.findByEmail(correo, async (err, results) => {
        if (err) {
            console.log('Error al buscar el usuario:', err);
            return res.status(500).json({ message: 'Error al verificar el correo' });
        }
        if (results.length > 0) {
            //console.log('Usuario ya registrado');
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        // Validaciones
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            // console.log('Formato de correo inválido');
            return res.status(400).json({ message: 'Formato de correo inválido' });
        }

        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
        if (!passwordRegex.test(password)) {
            // console.log('La contraseña no cumple con los requisitos');
            return res.status(400).json({
                message: 'La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un carácter especial.'
            });
        }

        try {
            // console.log('Hasheando la contraseña...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const userData = {
                nombre,
                apellido,
                correo,
                password: hashedPassword
            };

            User.create(userData, (err, result) => {
                if (err) {
                    console.log('Error al guardar el usuario:', err);
                    return res.status(500).json({ message: 'Error al crear el usuario' });
                }

                console.log('El usuario se ha creado');
                res.status(201).json({
                    success: true,
                    message: 'Usuario creado con éxito',
                    user: { 
                        nombre,
                        apellido,
                        correo 
                    }
                });
            });
        } catch (error) {
            console.error('Error en el proceso de hash:', error);
            return res.status(500).json({ message: 'Error al procesar la contraseña' });
        }
    });
};

// Función que registra un nuevo usuario
const loginUser = (req, res) => {
    console.log('Datos recibidos en loginUser:', req.body);
    const { correo, password } = req.body;

    User.findByEmail(correo, (err, results) => {
        if (err) {
            console.error('Error al buscar el usuario:', err);
            return res.status(500).json({ 
                success: false,
                message: 'Error al verificar las credenciales' 
            });
        }

        // console.log('Resultados de la búsqueda:', results);

        if (results.length === 0) {
            return res.status(400).json({ 
                success: false,
                message: 'Usuario no encontrado' 
            });
        }

        const user = results[0];
        // console.log('Usuario encontrado:', user);

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error en bcrypt:', err);
                return res.status(500).json({ 
                    success: false,
                    message: 'Error al iniciar sesión' 
                });
            }

            if (!isMatch) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Contraseña incorrecta' 
                });
            }

            // Función de jwt.js
            const token = generateToken(user.id);
            console.log('Token generado para usuario:', user.id);

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

            // Mnesaje de confirmación de envio
            //console.log('Enviando al frontend:', responseData);
            res.status(200).json(responseData);
        });
    });
};

module.exports = {
    registerUser,
    loginUser
};
