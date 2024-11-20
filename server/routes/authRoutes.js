const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { handleGoogleLogin } = require('../controllers/googleAuthController');

// Rutas de autenticación
router.post('/register', registerUser);
router.post('/login', loginUser);

// Nueva ruta para Google
router.post('/google-login', handleGoogleLogin);

module.exports = router;