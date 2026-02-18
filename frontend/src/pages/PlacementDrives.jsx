import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Building2, Briefcase, DollarSign, Filter } from 'lucide-react';

const PlacementDrives = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const drives = [
        {
            id: 1,
            company: "TCS",
            role: "System Engineer",
            type: "Full Time",
            location: "Pan India",
            ctc: "7 LPA",
            date: "Feb 15, 2026",
            logo: "T",
            color: "bg-blue-500/20 text-blue-300",
            tags: ["Mass Recruiter", "ITServices"]
        },
        {
            id: 2,
            company: "Infosys",
            role: "Power Programmer",
            type: "Full Time",
            location: "Bangalore",
            ctc: "9.5 LPA",
            date: "Feb 18, 2026",
            logo: "I",
            color: "bg-indigo-500/20 text-indigo-300",
            tags: ["Specialist", "Coding"]
        },
        {
            id: 3,
            company: "Accenture",
            role: "Associate Software Engineer",
            type: "Full Time",
            location: "Hyderabad",
            ctc: "4.5 LPA",
            date: "Feb 20, 2026",
            logo: "A",
            color: "bg-purple-500/20 text-purple-300",
            tags: ["MNC", "Support"]
        },
        {
            id: 4,
            company: "Google",
            role: "Software Engineering Intern",
            type: "Internship",
            location: "Bangalore",
            ctc: "80K / Month",
            date: "Mar 01, 2026",
            logo: "G",
            color: "bg-red-500/20 text-red-300",
            tags: ["Product", "FAANG"]
        },
        {
            id: 5,
            company: "Microsoft",
            role: "SDE I",
            type: "Full Time",
            location: "Noida",
            ctc: "45 LPA",
            date: "Mar 10, 2026",
            logo: "M",
            color: "bg-cyan-500/20 text-cyan-300",
            tags: ["Product", "FAANG"]
        },
    ];

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

                        {/* Search & Filter */}
                        <div className="flex items-center gap-3 w-full md:w-auto bg-white/5 p-1 rounded-xl border border-white/10">
                            <div className="flex items-center gap-2 px-3 py-2 flex-1">
                                <Search className="w-4 h-4 text-secondary" />
                                <input
                                    type="text"
                                    placeholder="Search companies, roles..."
                                    className="bg-transparent border-none outline-none text-white text-sm w-full md:w-64 placeholder:text-secondary/50"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-secondary hover:text-white">
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Drives Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredDrives.map((drive) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={drive.id}
                                className="group relative bg-glass rounded-2xl p-6 border border-white/5 hover:border-accent/20 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl ${drive.color} flex items-center justify-center text-xl font-bold font-heading`}>
                                        {drive.logo}
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-secondary border border-white/5">
                                        {drive.type}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-accent transition-colors">{drive.role}</h3>
                                <div className="flex items-center gap-2 text-secondary mb-4">
                                    <Building2 className="w-4 h-4" />
                                    <span className="font-medium">{drive.company}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-secondary/80">
                                        <DollarSign className="w-4 h-4 text-accent/70" />
                                        {drive.ctc}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-secondary/80">
                                        <MapPin className="w-4 h-4 text-accent/70" />
                                        {drive.location}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-secondary/80 col-span-2">
                                        <Calendar className="w-4 h-4 text-accent/70" />
                                        <span className="text-white">Deadline:</span> {drive.date}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mb-6 flex-wrap">
                                    {drive.tags.map((tag, i) => (
                                        <span key={i} className="text-[10px] uppercase tracking-wider font-semibold text-accent/70 bg-accent/5 px-2 py-1 rounded-md">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <button className="w-full py-3 rounded-xl bg-accent text-white font-semibold shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                                    Apply Now
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    {filteredDrives.length === 0 && (
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
        </div>
    );
};

export default PlacementDrives;
