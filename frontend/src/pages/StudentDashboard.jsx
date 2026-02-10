import React from 'react';
import Sidebar from '../components/Sidebar';
import PerformanceSection from '../components/dashboard/PerformanceSection';
import MockTestProgress from '../components/dashboard/MockTestProgress';
import UpcomingEvents from '../components/dashboard/UpcomingEvents';
import InterestedCompanies from '../components/dashboard/InterestedCompanies';
import PreparationMaterials from '../components/dashboard/PreparationMaterials';
import { Bell, Search, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentDashboard = () => {
    return (
        <div className="flex min-h-screen bg-background text-white font-sans selection:bg-accent/20">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-64 p-6 md:p-10 relative">
                {/* Background Ambience tailored for Dashboard */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-[-20%] left-[20%] w-[30%] h-[30%] bg-accent/5 rounded-full blur-[100px] mix-blend-screen" />
                    <div className="absolute bottom-[-20%] right-[10%] w-[25%] h-[25%] bg-blue-500/5 rounded-full blur-[100px] mix-blend-screen" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto space-y-8">
                    {/* Header Section */}
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-heading font-bold">Student Dashboard</h1>
                            <p className="text-secondary mt-1">Welcome back, Alex. Ready to level up?</p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Search Bar (Visual only for now) */}
                            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 focus-within:border-accent/30 transition-colors w-64">
                                <Search className="w-4 h-4 text-secondary" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-transparent border-none outline-none text-sm text-white placeholder:text-secondary/50 w-full"
                                />
                            </div>

                            <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-secondary hover:text-white transition-colors relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-background" />
                            </button>

                            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                                <div className="text-right hidden sm:block">
                                    <h4 className="text-sm font-medium">Alex Morgan</h4>
                                    <p className="text-xs text-secondary">CSE - 7th Sem</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-blue-500 p-[2px]">
                                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                                        <UserCircle className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Performance Summary */}
                    <PerformanceSection />

                    {/* Middle Section: Mock Tests & Upcoming Events */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="space-y-6">
                                <MockTestProgress />
                                <InterestedCompanies />
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            <UpcomingEvents />
                        </div>
                    </div>

                    {/* Bottom Section: Prep Materials */}
                    <PreparationMaterials />

                    <footer className="text-center text-secondary/50 text-xs py-8">
                        &copy; 2026 HireCraft. All rights reserved.
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
