import React, { useState, useEffect } from 'react';
import {
    Users,
    BookOpen,
    Briefcase,
    Activity,
    Plus,
    Clock,
    UserPlus,
    Trophy
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalQuestions: 0,
        activeDrives: 0,
        totalAttempts: 0,
        averageScore: 0,
        weeklyGrowth: 0,
        popularTest: 'None'
    });
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([fetchStats(), fetchActivity()]).finally(() => setLoading(false));
    }, []);

    const fetchActivity = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/activity', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setActivities(data);
            }
        } catch (error) {
            console.error("Failed to load activities", error);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/stats', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error("Failed to load admin stats", error);
        }
    };

    const statsCards = [
        { title: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        { title: 'Active Drives', value: stats.activeDrives, icon: Briefcase, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
        { title: 'Total Attempts', value: stats.totalAttempts, icon: Activity, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
        { title: 'New Students', value: `+${stats.weeklyGrowth}`, icon: UserPlus, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    ];

    if (loading) {
        return <div className="flex items-center justify-center h-64 text-white">Loading Dashboard...</div>;
    }

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-heading font-bold text-white">Admin Console</h1>
                <p className="text-gray-400 mt-1">Overview of system performance and content.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {statsCards.map((stat, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        key={stat.title}
                        className={`group relative p-6 rounded-3xl bg-[#0f172a]/40 backdrop-blur-2xl border ${stat.border} hover:border-white/20 transition-all duration-300 overflow-hidden shadow-2xl hover:shadow-accent/10`}
                    >
                        {/* Interactive Light Sweep */}
                        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg]" />

                        <div className="relative z-10 flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-black group-hover:text-gray-400 transition-colors">{stat.title}</p>
                                <h3 className="text-4xl font-black text-white tracking-tighter drop-shadow-md">
                                    {stat.value}
                                </h3>
                            </div>
                            <div className={`p-4 rounded-2xl ${stat.bg} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner`}>
                                <stat.icon className={`w-7 h-7 ${stat.color} filter drop-shadow-[0_0_8px_currentColor]`} />
                            </div>
                        </div>

                        {/* Mini Gradient Glow */}
                        <div className={`absolute bottom-0 right-0 w-16 h-16 opacity-10 group-hover:opacity-30 transition-opacity blur-3xl pointer-events-none rounded-full ${stat.bg}`} />
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-2 bg-[#0f172a]/50 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <button
                            onClick={() => navigate('/admin/code-practice')}
                            className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                                <Plus className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-medium text-gray-300 group-hover:text-white">Add Question</span>
                        </button>

                        <button
                            onClick={() => navigate('/admin/drives')}
                            className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-medium text-gray-300 group-hover:text-white">Post Drive</span>
                        </button>

                        <button
                            onClick={() => navigate('/admin/students')}
                            className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                <Users className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-medium text-gray-300 group-hover:text-white">View Students</span>
                        </button>
                    </div>
                </div>

                {/* Recent Activity Feed (Static for now) */}
                <div className="bg-[#0f172a]/50 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">Impact Highlights</h2>
                        <span className="text-[10px] text-accent uppercase tracking-widest px-2 py-1 bg-accent/10 rounded-full">Live Feed</span>
                    </div>
                    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                        {activities.length === 0 ? (
                            <p className="text-gray-500 text-sm">No recent high-impact activity.</p>
                        ) : (
                            activities
                                .filter(item => {
                                    const action = item.text.toLowerCase();
                                    const highScorer = action.includes('scored') && parseInt(item.text.match(/\d+/)?.[0] || '0') >= 80;
                                    const signup = action.includes('registered') || action.includes('joined');
                                    const driveUpdate = action.includes('drive');
                                    const opsSuccess = action.includes('successfully');
                                    return highScorer || signup || driveUpdate || opsSuccess;
                                })
                                .map((item, i) => {
                                    const Icon = item.type === 'attempt' ? Trophy : (item.type === 'registration' ? UserPlus : Briefcase);
                                    const color = item.type === 'attempt' ? 'text-yellow-400' : (item.type === 'registration' ? 'text-blue-400' : 'text-orange-400');
                                    const bg = item.type === 'attempt' ? 'bg-yellow-500/10' : (item.type === 'registration' ? 'bg-blue-500/10' : 'bg-orange-500/10');

                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="group relative flex items-start gap-4 p-4 rounded-2xl hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5"
                                        >
                                            <div className={`p-2.5 rounded-xl ${bg} shrink-0 group-hover:scale-110 transition-transform`}>
                                                <Icon className={`w-4 h-4 ${color}`} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-200 leading-relaxed font-medium">{item.text}</p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <p className="text-[9px] text-gray-500 flex items-center gap-1 uppercase tracking-widest font-bold">
                                                        <Clock className="w-3 h-3 text-orange-500/50" /> {item.time}
                                                    </p>
                                                    {item.category && (
                                                        <span className="text-[9px] text-accent/60 uppercase tracking-widest font-bold border border-accent/20 px-2 py-0.5 rounded-full bg-accent/5">
                                                            {item.category}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 group-hover:h-1/2 bg-accent transition-all duration-300" />
                                        </motion.div>
                                    );
                                })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
