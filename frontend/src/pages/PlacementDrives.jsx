import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Building2, Briefcase, DollarSign, Filter, ExternalLink } from 'lucide-react';

const PlacementDrives = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDrives();
    }, []);

    const fetchDrives = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/student/drives', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setDrives(data);
            }
        } catch (error) {
            console.error("Error fetching drives:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredDrives = drives.filter(drive =>
        drive.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drive.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-background text-white font-sans selection:bg-accent/20">
            <Sidebar />
            <div className="flex-1 lg:ml-64 p-6 md:p-10 relative">
                {/* Background Ambience */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-[-20%] left-[20%] w-[30%] h-[30%] bg-accent/5 rounded-full blur-[100px] mix-blend-screen" />
                    <div className="absolute bottom-[-20%] right-[10%] w-[25%] h-[25%] bg-blue-500/5 rounded-full blur-[100px] mix-blend-screen" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto space-y-8 animate-fade-in pb-24">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-heading font-bold text-white">Placement Drives</h1>
                            <p className="text-secondary mt-1">Discover and apply to top tier companies</p>
                        </div>

                        {/* Improved Search & Filter */}
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:flex-initial group">
                                <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl group-focus-within:bg-accent/10 transition-colors" />
                                <div className="relative flex items-center gap-3 px-5 py-3 bg-[#0f172a]/40 backdrop-blur-xl rounded-2xl border border-white/10 group-focus-within:border-accent/40 transition-all duration-300">
                                    <Search className="w-4 h-4 text-secondary/50 group-focus-within:text-accent transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Search opportunities..."
                                        className="bg-transparent border-none outline-none text-white text-sm w-full md:w-72 placeholder:text-secondary/30"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all duration-300 text-secondary hover:text-white group relative overflow-hidden">
                                <div className="absolute inset-0 bg-accent/10 translate-y-full group-hover:translate-y-0 transition-transform" />
                                <Filter className="w-4 h-4 relative z-10" />
                            </button>
                        </div>
                    </div>

                    {/* Drives Grid */}
                    {loading ? (
                        <div className="text-center py-20 text-secondary">Loading drives...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredDrives.map((drive) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={drive.id}
                                    className="group relative bg-glass rounded-2xl p-6 border border-white/5 hover:border-accent/20 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1"
                                >
                                    <div className="mb-4">
                                        <div className={`w-12 h-12 rounded-xl bg-accent/20 text-accent flex items-center justify-center text-xl font-bold font-heading shadow-lg shadow-accent/10 group-hover:bg-accent group-hover:text-white transition-all`}>
                                            {drive.logo}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-accent transition-colors">{drive.role}</h3>
                                    <div className="flex items-center gap-2 text-secondary mb-4">
                                        <Building2 className="w-4 h-4" />
                                        <span className="font-medium">{drive.company}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6">
                                        <div className="flex items-center gap-2 text-sm text-secondary/80">
                                            <DollarSign className="w-4 h-4 text-accent/70" />
                                            {drive.ctc || 'Not Specified'}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-secondary/80">
                                            <MapPin className="w-4 h-4 text-accent/70" />
                                            {drive.location || 'Remote'}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-secondary/80">
                                            <Briefcase className="w-4 h-4 text-accent/70" />
                                            <span className="text-white">Min CGPA:</span> {drive.minCGPA || '0.0'}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-secondary/80 col-span-2">
                                            <Calendar className="w-4 h-4 text-accent/70" />
                                            <span className="text-white">Deadline:</span> {drive.date}
                                        </div>
                                    </div>

                                    {drive.googleFormLink && drive.isActive ? (
                                        <a
                                            href={drive.googleFormLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-white font-semibold shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                                        >
                                            Apply via Google Form
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    ) : (
                                        <button className="w-full py-3 rounded-xl bg-white/10 text-white/50 font-semibold cursor-not-allowed">
                                            Applications Closed
                                        </button>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {!loading && filteredDrives.length === 0 && (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-secondary" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No drives found</h3>
                            <p className="text-secondary">Try adjusting your search criteria</p>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default PlacementDrives;
