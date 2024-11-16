const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const recipeRoutes = require('./recipeRoutes');
const calendarRoutes = require('./calendarRoutes');

router.use('/auth', authRoutes);       
router.use('/recipes', recipeRoutes);   
router.use('/calendar', calendarRoutes);

module.exports = router;