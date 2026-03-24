import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Search, Filter, ChevronRight, CheckCircle, Database } from 'lucide-react';

import Sidebar from '../components/Sidebar';

const CodePractice = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [filter, setFilter] = useState({ difficulty: 'All', topic: 'All' });

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/student/practice/problems', {
                credentials: 'include'
            });
            const data = await response.json();
            setProblems(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch problems:", error);
            setLoading(false);
        }
    };

    const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
    const topics = ['All', 'Arrays', 'Strings', 'Linked List', 'DP', 'Tree', 'Stack'];

    const filteredProblems = problems.filter(p => {
        return (filter.difficulty === 'All' || p.difficulty === filter.difficulty) &&
            (filter.topic === 'All' || p.topic === filter.topic);
    });

    const getDifficultyColor = (diff) => {
        switch (diff) {
            case 'Easy': return 'text-green-400 bg-green-400/10';
            case 'Medium': return 'text-yellow-400 bg-yellow-400/10';
            case 'Hard': return 'text-red-400 bg-red-400/10';
            default: return 'text-white bg-white/10';
        }
    };

    return (
        <div className="flex min-h-screen bg-background text-white font-sans selection:bg-accent/20">
            <Sidebar />
            <div className="flex-1 lg:ml-64 relative">
                {/* Background Ambience */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-[-20%] left-[20%] w-[30%] h-[30%] bg-accent/5 rounded-full blur-[100px] mix-blend-screen" />
                    <div className="absolute bottom-[-20%] right-[10%] w-[25%] h-[25%] bg-blue-500/5 rounded-full blur-[100px] mix-blend-screen" />
                </div>

                <div className="relative z-10 space-y-8 p-6 lg:p-10">
                    {/* Enhanced Header */}
                    <header className="relative bg-glass border border-white/5 rounded-2xl p-8 overflow-hidden">
                        {/* Decorative background glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[100px] rounded-full pointer-events-none" />

                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-accent/10 rounded-lg">
                                        <Code className="w-6 h-6 text-accent" />
                                    </div>
                                    <h1 className="text-3xl font-heading font-bold text-white">Question Bank</h1>
                                </div>
                                <p className="text-secondary text-lg max-w-xl">
                                    Master technical interviews with problems from top product-based companies.
                                </p>
                            </div>

                            {/* Styled Filters */}
                            <div className="flex flex-wrap gap-3">
                                <div className="relative group">
                                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary group-hover:text-white transition-colors pointer-events-none" />
                                    <select
                                        className="appearance-none bg-black/20 border border-white/10 text-white pl-10 pr-8 py-2.5 rounded-xl text-sm focus:outline-none focus:border-accent/50 cursor-pointer hover:bg-white/5 transition-all min-w-[140px]"
                                        value={filter.difficulty}
                                        onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
                                    >
                                        {difficulties.map(d => <option key={d} value={d} className="bg-gray-900 text-white">{d === 'All' ? 'Difficulty: All' : d}</option>)}
                                    </select>
                                    {/* Custom Arrow */}
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <ChevronRight className="w-3 h-3 text-secondary rotate-90" />
                                    </div>
                                </div>

                                <div className="relative group">
                                    <Database className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary group-hover:text-white transition-colors pointer-events-none" />
                                    <select
                                        className="appearance-none bg-black/20 border border-white/10 text-white pl-10 pr-8 py-2.5 rounded-xl text-sm focus:outline-none focus:border-accent/50 cursor-pointer hover:bg-white/5 transition-all min-w-[140px]"
                                        value={filter.topic}
                                        onChange={(e) => setFilter({ ...filter, topic: e.target.value })}
                                    >
                                        {topics.map(t => <option key={t} value={t} className="bg-gray-900 text-white">{t === 'All' ? 'Topic: All' : t}</option>)}
                                    </select>
                                    {/* Custom Arrow */}
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <ChevronRight className="w-3 h-3 text-secondary rotate-90" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="max-w-4xl mx-auto space-y-4">
                        {loading ? (
                            <div className="text-white text-center py-20">Loading problems...</div>
                        ) : (
                            <AnimatePresence>
                                {filteredProblems.map((problem) => {
                                    const isSelected = selectedProblem?.id === problem.id;
                                    return (
                                        <motion.div
                                            key={problem.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            onClick={() => setSelectedProblem(isSelected ? null : problem)}
                                            className={`bg-glass border rounded-2xl cursor-pointer transition-all overflow-hidden ${isSelected
                                                ? 'border-accent ring-1 ring-accent/20 shadow-2xl shadow-accent/10'
                                                : 'border-white/5 hover:border-white/20'
                                                }`}
                                        >
                                            <div className="p-6">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-accent/20 text-accent' : 'bg-white/5 text-secondary'}`}>
                                                            <Code className="w-5 h-5" />
                                                        </div>
                                                        <h3 className={`text-xl font-bold transition-colors ${isSelected ? 'text-accent' : 'text-white'}`}>
                                                            {problem.title}
                                                        </h3>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                                                            {problem.difficulty}
                                                        </span>
                                                        <motion.div
                                                            animate={{ rotate: isSelected ? 90 : 0 }}
                                                            className="text-secondary"
                                                        >
                                                            <ChevronRight className="w-5 h-5" />
                                                        </motion.div>
                                                    </div>
                                                </div>

                                                <AnimatePresence>
                                                    {isSelected && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="pt-6 mt-6 border-t border-white/5 space-y-6">
                                                                <div>
                                                                    <span className="text-secondary text-xs font-bold uppercase tracking-widest mb-2 block">{problem.topic}</span>
                                                                    <p className="text-gray-300 leading-relaxed text-lg">
                                                                        {problem.description}
                                                                    </p>
                                                                </div>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                                                                        <h4 className="text-white font-bold mb-3 text-sm flex items-center gap-2">
                                                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                                                            Companies
                                                                        </h4>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {problem.companies.map(c => (
                                                                                <span key={c} className="text-xs bg-black/40 text-gray-400 px-3 py-1.5 rounded-xl border border-white/5 hover:border-accent/30 transition-colors">
                                                                                    {c}
                                                                                </span>
                                                                            )) || <span className="text-xs text-gray-500">No specific company tags</span>}
                                                                        </div>
                                                                    </div>

                                                                    {problem.hint && (
                                                                        <div className="bg-accent/5 p-5 rounded-2xl border border-accent/10">
                                                                            <h4 className="text-accent font-bold mb-3 text-sm flex items-center gap-2">
                                                                                <span className="text-lg">💡</span>
                                                                                Hint
                                                                            </h4>
                                                                            <p className="text-sm text-gray-400 leading-relaxed">
                                                                                {problem.hint}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodePractice;
