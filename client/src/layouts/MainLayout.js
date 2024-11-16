import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';

const MainLayout = ({ children }) => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';
    const isCalendarPage = location.pathname === '/calendar';

    return (
        <>
            <Navbar />
            <Sidebar />
            {!isLoginPage && !isCalendarPage && <Header />}
            <main className="main-content">
                {children}
            </main>
        </>
    );
};

export default MainLayout;