import React, { createContext, useContext, useReducer, useEffect } from "react";
import { mealReducer } from "../reducers/mealReducer";
import { fetchCategories } from "../actions/mealAction";

const MealContext = createContext();

export const MealProvider = ({ children }) => {
    const initialState = {
        meal: null,
        mealLoading: false,
        mealError: false,
        categories: [],
        categoryLoading: false,
        categoryError: false,
        meals: [],
        mealsLoading: false,
        mealsError: false,
        categoryMeals: {
            description: '',
            recipes: []
        },
        searchResults: null,
    };

    const [state, dispatch] = useReducer(mealReducer, initialState);

    useEffect(() => {
        fetchCategories()(dispatch);
    }, []);

    return (
        <MealContext.Provider value={{ ...state, dispatch }}>
            {children}
        </MealContext.Provider>
    );
}

export const useMealContext = () => useContext(MealContext);

export const SET_SEARCH_RESULTS = 'SET_SEARCH_RESULTS';
