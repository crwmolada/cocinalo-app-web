const express = require('express');
const router = express.Router();
const { 
    searchRecipes, 
    getCategories, 
    getRecipeById, 
    searchRecipesByCategory 
} = require('../controllers/recipeController');

// Rutas de recetas
router.get('/categories', getCategories);
router.get('/search', searchRecipes);
router.get('/category/:category', searchRecipesByCategory);
router.get('/:id', getRecipeById);

module.exports = router;