import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, 
    FileText, 
    Briefcase, 
    BookOpen, 
    Building2, 
    User, 
    LogOut 
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: FileText, label: 'Mock Tests', path: '/mock-tests' },
        { icon: Briefcase, label: 'Placement Drives', path: '/drives' },
        { icon: BookOpen, label: 'Prep Materials', path: '/materials' },
        { icon: Building2, label: 'Interested Companies', path: '/companies' },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-background/50 backdrop-blur-xl border-r border-white/5 flex flex-col z-40 hidden lg:flex">
            <div className="p-8">
                <h1 className="text-2xl font-heading font-bold text-white tracking-tighter">
                    hire<span className="text-accent">craft.</span>
                </h1>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                                isActive 
                                    ? 'bg-accent/10 text-accent border border-accent/20' 
                                    : 'text-secondary hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium text-sm">{item.label}</span>
                        {/* Hover glow effect */}
                        <div className="absolute inset-0 rounded-xl bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-white/5">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors group">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
