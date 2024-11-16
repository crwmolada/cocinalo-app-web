import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';

const MainLayout = () => {
    const location = useLocation();
    const noHeaderRoutes = ['/calendar', '/login', '/register'];
    const hideHeader = noHeaderRoutes.includes(location.pathname);

    return (
        <>
            <Navbar />
            <Sidebar />
            {!hideHeader && <Header />}
            <main className="main-content">
                <Outlet />
            </main>
        </>
    );
};

export default MainLayout;