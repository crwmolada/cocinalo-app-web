const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const { registerUser, loginUser } = require('../controllers/authController');
const calendarController = require('../controllers/calendarController');

// Rutas de usuarios (sin autenticación)
router.post('/users/register', registerUser);
router.post('/users/login', loginUser);

// Rutas del calendario (con autenticación)
router.use('/calendar', authMiddleware); 

// Rutas del calendario
router.get('/calendar/events', calendarController.getEvents); 
router.post('/calendar/events', calendarController.createEvent);
router.delete('/calendar/events/:eventId', calendarController.deleteEvent); 

module.exports = router;