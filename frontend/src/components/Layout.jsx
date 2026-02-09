import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

    return (
        <div className="min-h-screen flex flex-col relative bg-background overflow-x-hidden selection:bg-accent/20">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px] mix-blend-screen" />
            </div>

            {!isAuthPage && <Header />}

            <main className="flex-grow z-10 flex flex-col">
                {children}
            </main>

            {!isAuthPage && <Footer />}
        </div>
    );
};

export default Layout;
