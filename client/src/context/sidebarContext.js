import React, { createContext, useContext, useReducer } from 'react';

// Actions
export const OPEN_SIDEBAR = 'OPEN_SIDEBAR';
export const CLOSE_SIDEBAR = 'CLOSE_SIDEBAR';

const initialState = {
    isSidebarOpen: false
};

// Reducer
const sidebarReducer = (state, action) => {
    switch(action.type){
        case OPEN_SIDEBAR:
            return {
                ...state,
                isSidebarOpen: true
            }
        case CLOSE_SIDEBAR:
            return {
                ...state,
                isSidebarOpen: false
            }
        default: 
            return state;
    }
}

// Create context
const SidebarContext = createContext();

// Custom hook para usar el contexto
export const useSidebarContext = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebarContext debe ser usado dentro de un SidebarProvider');
    }
    return context;
};

// Provider componente
export const SidebarProvider = ({ children }) => {
    const [state, dispatch] = useReducer(sidebarReducer, initialState);

    // Actions
    const openSidebar = () => dispatch({ type: OPEN_SIDEBAR });
    const closeSidebar = () => dispatch({ type: CLOSE_SIDEBAR });

    const value = {
        isSidebarOpen: state.isSidebarOpen,
        openSidebar,
        closeSidebar
    };

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    );
};

export default SidebarProvider;