import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useLocation, Outlet } from 'react-router-dom';

const Layout = () => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
    const dashboardRoutes = ['/dashboard', '/drives', '/mock-tests', '/materials', '/profile', '/code-practice'];

    // Hide nav for auth pages, dashboard pages (which have sidebar), and test interface
    const shouldHideNav = isAuthPage ||
        dashboardRoutes.includes(location.pathname) ||
        location.pathname.startsWith('/student/test/');

    return (
        <div className="min-h-screen flex flex-col relative bg-background overflow-x-hidden selection:bg-accent/20">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px] mix-blend-screen" />
            </div>

            {!shouldHideNav && <Header />}

            <main className="flex-grow z-10 flex flex-col">
                <Outlet />
            </main>

            {!shouldHideNav && <Footer />}
        </div>
    );
};

export default Layout;
