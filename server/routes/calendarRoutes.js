const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const calendarController = require('../controllers/calendarController');

// aPLICAMOS EL MIDDLEWARE PARA PROTEGER RUTAS
router.use(authMiddleware);

router.use((req, res, next) => {
    console.log('Ruta de calendario accedida:', req.path);
    console.log('Usuario autenticado:', req.userId);
    next();
});

router.get('/events', calendarController.getEvents);
router.post('/events', calendarController.createEvent);
router.delete('/events/:eventId', calendarController.deleteEvent);

module.exports = router;