import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/HomePage/HomePage';
import { Login, Register } from '../pages';
import Calendar from '../components/Calendar/calendar';
import MealDetailsPage from '../pages/MealDetailsPage/MealDetailsPage';
import CategoryPage from '../pages/CategoryPage/CategoryPage';
import ErrorPage from '../pages/ErrorPage/ErrorPage';
import SearchResultsPage from '../pages/SearchResultsPage/SearchResultsPage';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" />;
    }
    return children;
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* Todas las rutas bajo MainLayout */}
            <Route element={<MainLayout />}>
                {/* Rutas públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/meal/:id" element={<MealDetailsPage />} />
                <Route path="/meal/category/:name" element={<CategoryPage />} />
                
                {/* Rutas protegidas */}
                <Route path="/calendar" element={
                    <ProtectedRoute>
                        <Calendar />
                    </ProtectedRoute>
                } />
            </Route>

            {/* Ruta de error */}
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    );
};

export default AppRoutes;