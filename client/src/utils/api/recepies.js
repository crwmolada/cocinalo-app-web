import axios from '../axios';

export const recipesApi = {
    // Función para buscar recetas por nombre
    searchRecipes: async (name) => {
        try {
            const response = await axios.get('/recipes/search', { params: { name } });
            return response.data;
        } catch (error) {
            console.error('Error al buscar recetas:', error);
            throw error;
        }
    },

    // Función para obtener todas las categorías
    getCategories: async () => {
        try {
            const response = await axios.get('/recipes/categories');
            return response.data;
        } catch (error) {
            console.error('Error al obtener categorías:', error);
            throw error;
        }
    },

    // Función para obtener los detalles de una receta por ID
    getRecipeById: async (id) => {
        try {
            const response = await axios.get(`/recipes/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener detalles de la receta:', error);
            throw error;
        }
    }
};

export const { searchRecipes, getCategories, getRecipeById } = recipesApi;