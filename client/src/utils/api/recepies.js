import axios from '../axios';

export const recipesApi = {
    searchRecipes: async (name) => {
        try {
            const response = await axios.get('/recipes/search', { params: { name } });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getCategories: async () => {
        try {
            const response = await axios.get('/recipes/categories');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getRecipeById: async (id) => {
        try {
            const response = await axios.get(`/recipes/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export const { searchRecipes, getCategories, getRecipeById } = recipesApi;