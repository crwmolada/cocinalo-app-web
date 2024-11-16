import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/HomePage/HomePage';
import { Login } from '../pages';
import Calendar from '../components/Calendar/calendar';
import MealDetailsPage from '../pages/MealDetailsPage/MealDetailsPage';
import CategoryPage from '../pages/CategoryPage/CategoryPage';
import ErrorPage from '../pages/ErrorPage/ErrorPage';
import SearchResultsPage from '../pages/SearchResultsPage/SearchResultsPage';
import { useAuth } from '../context/AuthContext';

// Componente para rutas protegidas
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
            <Route path="/" element={
                <MainLayout>
                    <Home />
                </MainLayout>
            } />
            <Route path="/search" element={
                <MainLayout>
                    <SearchResultsPage />
                </MainLayout>
            } />
            <Route path="/meal/:id" element={
                <MainLayout>
                    <MealDetailsPage />
                </MainLayout>
            } />
            <Route path="/meal/category/:name" element={
                <MainLayout>
                    <CategoryPage />
                </MainLayout>
            } />
            <Route path="/login" element={
                <MainLayout>
                    <Login />
                </MainLayout>
            } />
            <Route path="/calendar" element={
                <ProtectedRoute>
                    <MainLayout>
                        <Calendar />
                    </MainLayout>
                </ProtectedRoute>
            } />
            <Route path="*" element={
                <MainLayout>
                    <ErrorPage />
                </MainLayout>
            } />
        </Routes>
    );
};

export default AppRoutes;