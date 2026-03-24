import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Code,
    Users,
    Briefcase,
    LogOut,
    Settings,
    FileText,
    Bookmark
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
    const { logout } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Code, label: 'Code Practice', path: '/admin/code-practice' },
        { icon: FileText, label: 'Mock Tests', path: '/admin/tests' },
        { icon: Briefcase, label: 'Placement Drives', path: '/admin/drives' },
        { icon: Bookmark, label: 'Prep Materials', path: '/admin/materials' },
        { icon: Users, label: 'Students', path: '/admin/students' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    return (
        <>
            <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#0f172a] border-r border-white/10 z-50">
                <div className="p-6">
                    <div className="flex items-center px-2">
                        <h1 className="text-2xl font-heading font-bold text-white tracking-tighter">
                            hire<span className="text-orange-500">craft.</span>
                        </h1>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden
                                ${isActive
                                    ? 'text-white bg-white/10 shadow-lg shadow-orange-500/10 border border-white/10'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }
                            `}
                        >
                            <item.icon className="w-5 h-5 relative z-10" />
                            <span className="font-medium relative z-10">{item.label}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-orange-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:text-white hover:bg-red-500/10 transition-all duration-300 group"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
