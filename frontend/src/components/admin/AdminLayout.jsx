import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-background text-white font-sans selection:bg-orange-500/20">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-64 relative">
                {/* Background Ambience - Distinct for Admin (maybe warmer tones or darker) */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-[-20%] right-[20%] w-[40%] h-[40%] bg-orange-500/5 rounded-full blur-[120px] mix-blend-screen" />
                    <div className="absolute bottom-[-10%] left-[10%] w-[30%] h-[30%] bg-red-500/5 rounded-full blur-[100px] mix-blend-screen" />
                </div>

                <div className="relative z-10 p-6 md:p-10 animate-fade-in">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
