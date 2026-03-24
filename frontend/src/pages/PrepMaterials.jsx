import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { Search, Filter, FileText, Video, Link as LinkIcon, Download, ExternalLink, PlayCircle, Book, Github, Layout } from 'lucide-react';

const PrepMaterials = () => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedType, setSelectedType] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const types = ['All', ...new Set(materials.map(m => m.company).filter(c => c && c.toLowerCase() !== 'all'))];

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/student/prep/materials', {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch materials');
            const data = await response.json();
            setMaterials(data);
        } catch (err) {
            console.error(err);
            setError('Failed to load materials.');
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'PDF': return FileText;
            case 'Video': return PlayCircle;
            case 'Article': return LinkIcon;
            case 'Repo': return Github;
            case 'Practice': return Layout;
            case 'Sheet': return FileText;
            case 'Course': return Book;
            default: return LinkIcon;
        }
    };

    const getColor = (company) => {
        switch (company) {
            case 'TCS': return "bg-red-500/20 text-red-300";
            case 'Infosys': return "bg-blue-500/20 text-blue-300";
            case 'IBM': return "bg-green-500/20 text-green-300";
            case 'Google': return "bg-cyan-500/20 text-cyan-300";
            case 'Amazon': return "bg-purple-500/20 text-purple-300";
            default: return "bg-orange-500/20 text-orange-300";
        }
    };

    const filteredMaterials = materials.filter(item => {
        const matchesType = selectedType === 'All' || item.company === selectedType;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.subject.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

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
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <h1 className="text-3xl font-heading font-bold text-white">Prep Materials</h1>
                            <p className="text-secondary mt-1">Curated resources to help you ace your interviews</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            {/* Search */}
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary group-focus-within:text-accent transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search resources..."
                                    className="w-full sm:w-64 bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent/50 transition-all placeholder:text-secondary/50"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Filters */}
                            <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto">
                                {types.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedType(type)}
                                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${selectedType === type
                                            ? 'bg-accent text-white shadow-lg shadow-accent/25'
                                            : 'text-secondary hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Materials Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {filteredMaterials.map((item) => {
                            const Icon = getIcon(item.type);
                            const colorClass = getColor(item.company);

                            return (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={item.id}
                                    className="group bg-glass rounded-2xl p-5 border border-white/5 hover:border-accent/20 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1 flex flex-col"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/5 text-secondary border border-white/5">
                                            {item.company}
                                        </span>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-white mb-1 line-clamp-2 group-hover:text-accent transition-colors">
                                            {item.title}
                                        </h3>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-2">
                                        <span className="text-xs text-secondary font-medium">
                                            {item.meta}
                                        </span>
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-lg hover:bg-white/10 text-secondary hover:text-accent transition-colors"
                                        >
                                            {item.type === 'PDF' ? <Download className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                                        </a>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {filteredMaterials.length === 0 && (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Book className="w-8 h-8 text-secondary" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No materials found</h3>
                            <p className="text-secondary">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PrepMaterials;
