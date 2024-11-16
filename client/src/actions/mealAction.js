import axios from "../utils/axios";
import {
    FETCH_CATEGORY_BEGIN,
    FETCH_CATEGORY_ERROR,
    FETCH_CATEGORY_SUCCESS,
    FETCH_CATEGORY_MEALS_BEGIN,
    FETCH_CATEGORY_MEALS_ERROR,
    FETCH_CATEGORY_MEALS_SUCCESS,
    FETCH_SINGLE_MEAL_BEGIN,
    FETCH_SINGLE_MEAL_ERROR,
    FETCH_SINGLE_MEAL_SUCCESS,
    FETCH_MEALS_BEGIN,
    FETCH_MEALS_ERROR,
    FETCH_MEALS_SUCCESS
} from "./actions";

// Obtener categorías
export const fetchCategories = () => async (dispatch) => {
    try {
        dispatch({ type: FETCH_CATEGORY_BEGIN });
        const response = await axios.get('/recipes/categories');
        dispatch({ 
            type: FETCH_CATEGORY_SUCCESS, 
            payload: response.data 
        });
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        dispatch({ 
            type: FETCH_CATEGORY_ERROR, 
            payload: error.message 
        });
    }
};

// Mantener la versión antigua para compatibilidad
export const startFetchSingleMeal = (dispatch, id) => {
    dispatch({ type: FETCH_SINGLE_MEAL_BEGIN });
    axios.get(`/recipes/${id}`)
        .then(response => {
            dispatch({ 
                type: FETCH_SINGLE_MEAL_SUCCESS, 
                payload: response.data 
            });
        })
        .catch(error => {
            console.error("Error fetching meal:", error);
            dispatch({ 
                type: FETCH_SINGLE_MEAL_ERROR, 
                payload: error.message 
            });
        });
};

// Nueva versión (para usar en el futuro)
export const fetchSingleMeal = (id) => async (dispatch) => {
    try {
        dispatch({ type: FETCH_SINGLE_MEAL_BEGIN });
        const response = await axios.get(`/recipes/${id}`);
        dispatch({ 
            type: FETCH_SINGLE_MEAL_SUCCESS, 
            payload: response.data 
        });
    } catch (error) {
        console.error("Error fetching meal:", error);
        dispatch({ 
            type: FETCH_SINGLE_MEAL_ERROR, 
            payload: error.message 
        });
    }
};

// Obtener recetas por categoría
export const fetchMealsByCategory = (category) => async (dispatch) => {
    try {
        dispatch({ type: FETCH_CATEGORY_MEALS_BEGIN });
        const response = await axios.get(`/recipes/category/${category}`);
        
        // Asegurar que los datos estén en formato de array
        const formattedData = Array.isArray(response.data) ? response.data : [];
        
        dispatch({
            type: FETCH_CATEGORY_MEALS_SUCCESS,
            payload: formattedData
        });
    } catch (error) {
        console.error('Error al obtener recetas por categoría:', error);
        dispatch({
            type: FETCH_CATEGORY_MEALS_ERROR,
            payload: error.message
        });
    }
};

// Buscar recetas por término
export const searchMeals = (searchTerm) => async (dispatch) => {
    try {
        dispatch({ type: FETCH_MEALS_BEGIN });
        const response = await axios.get('/recipes/search', {
            params: { name: searchTerm }
        });
        dispatch({ 
            type: FETCH_MEALS_SUCCESS, 
            payload: response.data 
        });
    } catch (error) {
        console.error('Error al buscar recetas:', error);
        dispatch({
            type: FETCH_MEALS_ERROR, 
            payload: error.message
        });
    }
};