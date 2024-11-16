import {
    FETCH_CATEGORY_BEGIN,
    FETCH_CATEGORY_ERROR,
    FETCH_CATEGORY_MEALS_BEGIN,
    FETCH_CATEGORY_MEALS_ERROR,
    FETCH_CATEGORY_MEALS_SUCCESS,
    FETCH_CATEGORY_SUCCESS,
    FETCH_MEALS_BEGIN,
    FETCH_MEALS_ERROR,
    FETCH_MEALS_SUCCESS,
    FETCH_SINGLE_MEAL_BEGIN,
    FETCH_SINGLE_MEAL_ERROR,
    FETCH_SINGLE_MEAL_SUCCESS
} from "../actions/actions";

export const initialState = {
    // Single meal state
    meal: null,
    mealLoading: false,
    mealError: null,

    // Categories state
    categories: [],
    categoryLoading: false,
    categoryError: null,

    // Category meals state
    categoryMeals: [],
    categoryMealsLoading: false,
    categoryMealsError: null,

    // Search state
    meals: [],
    mealsLoading: false,
    mealsError: null,
    searchResults: null,
};

export function mealReducer(state = initialState, action) {
    switch (action.type) {
        // Categories
        case FETCH_CATEGORY_BEGIN:
            return {
                ...state,
                categoryLoading: true,
                categoryError: null
            };
        case FETCH_CATEGORY_SUCCESS:
            return {
                ...state,
                categoryLoading: false,
                categories: action.payload,
                categoryError: null
            };
        case FETCH_CATEGORY_ERROR: 
            return {
                ...state,
                categoryLoading: false,
                categoryError: action.payload
            };

        // Search meals
        case FETCH_MEALS_BEGIN:
            return {
                ...state,
                mealsLoading: true,
                mealsError: null
            };
        case FETCH_MEALS_SUCCESS:
            return {
                ...state,
                mealsLoading: false,
                meals: action.payload,
                mealsError: null
            };
        case FETCH_MEALS_ERROR:
            return {
                ...state,
                mealsLoading: false,
                mealsError: action.payload
            };

        // Single meal
        case FETCH_SINGLE_MEAL_BEGIN:
            return {
                ...state,
                mealLoading: true,
                mealError: null
            };
        case FETCH_SINGLE_MEAL_SUCCESS:
            return {
                ...state,
                mealLoading: false,
                meal: action.payload,
                mealError: null
            };
        case FETCH_SINGLE_MEAL_ERROR:
            return {
                ...state,
                mealLoading: false,
                mealError: action.payload
            };

        // Category meals
        case FETCH_CATEGORY_MEALS_BEGIN:
            return {
                ...state,
                categoryMealsLoading: true,
                categoryMeals: [],
                categoryMealsError: null
            };
        case FETCH_CATEGORY_MEALS_SUCCESS:
            return {
                ...state,
                categoryMealsLoading: false,
                categoryMeals: action.payload,
                categoryMealsError: null
            };
        case FETCH_CATEGORY_MEALS_ERROR:
            return {
                ...state,
                categoryMealsLoading: false,
                categoryMeals: [],
                categoryMealsError: action.payload
            };

        // Search results
        case 'SET_SEARCH_RESULTS':
            return {
                ...state,
                searchResults: action.payload,
                mealsLoading: false,
                mealsError: null
            };

        default: 
            return state;
    }
}