import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Trash2,
    Edit,
    X,
    Code,
    ChevronRight,
    CheckCircle,
    Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ManageCodePractice = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        difficulty: 'Medium',
        topic: '',
        companies: '',
        hint: ''
    });

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/code-problems', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setProblems(data);
            }
        } catch (error) {
            console.error("Error fetching code problems:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            difficulty: 'Medium',
            topic: '',
            companies: '',
            hint: ''
        });
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingId
                ? `http://localhost:5000/api/admin/code-problems/${editingId}`
                : 'http://localhost:5000/api/admin/code-problems';

            const response = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            if (response.ok) {
                setShowModal(false);
                fetchProblems();
                resetForm();
            }
        } catch (error) {
            console.error("Error saving code problem:", error);
        }
    };

    const handleEdit = (p) => {
        setEditingId(p.id);
        setFormData({
            title: p.title,
            description: p.description,
            difficulty: p.difficulty,
            topic: p.topic,
            companies: Array.isArray(p.companies) ? p.companies.join(', ') : p.companies,
            hint: p.hint || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this coding problem?")) return;
        try {
            const response = await fetch(`http://localhost:5000/api/admin/code-problems/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                fetchProblems();
            }
        } catch (error) {
            console.error("Error deleting code problem:", error);
        }
    };

    const getDifficultyColor = (diff) => {
        switch (diff) {
            case 'Easy': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'Medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'Hard': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    const filteredProblems = problems.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.topic.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Manage Code Practice</h1>
                    <p className="text-gray-400 mt-1">Add and manage coding challenges for student practice.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all shadow-lg shadow-orange-500/20"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add New Problem</span>
                </button>
            </header>

            <div className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl bg-[#0f172a]/50 backdrop-blur-md border border-white/10">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search problems by title or topic..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                    />
                </div>
            </div>

            <div className="bg-[#0f172a]/50 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Problem</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Topic</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Difficulty</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan="4" className="text-center py-20 text-gray-400"><div className="animate-pulse">Loading problems...</div></td></tr>
                        ) : filteredProblems.length === 0 ? (
                            <tr><td colSpan="4" className="text-center py-20 text-gray-500">No problems found matching your search.</td></tr>
                        ) : (
                            filteredProblems.map((p) => (
                                <tr key={p.id} className="hover:bg-white/5 transition-all group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                                <Code className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-white font-bold group-hover:text-orange-400 transition-colors">{p.title}</p>
                                                <div className="flex gap-2 mt-1">
                                                    {p.companies && Array.isArray(p.companies) && p.companies.slice(0, 2).map(c => (
                                                        <span key={c} className="text-[9px] text-gray-500 uppercase font-black">{c}</span>
                                                    ))}
                                                    {p.companies && Array.isArray(p.companies) && p.companies.length > 2 && <span className="text-[9px] text-gray-600">+{p.companies.length - 2} more</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-sm text-gray-300 font-medium">{p.topic}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border ${getDifficultyColor(p.difficulty)}`}>
                                            {p.difficulty}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0 translate-x-4">
                                            <button
                                                onClick={() => handleEdit(p)}
                                                className="p-2.5 hover:bg-white/10 text-blue-400 rounded-xl transition-all border border-transparent hover:border-white/10"
                                                title="Edit Problem"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                className="p-2.5 hover:bg-red-500/10 text-red-500 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                                                title="Delete Problem"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#0f172a] border border-white/10 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-red-500 to-purple-500" />

                            <div className="flex justify-between items-center p-8 border-b border-white/5">
                                <div>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                                        {editingId ? 'Edit Problem' : 'New Challenge'}
                                    </h2>
                                    <p className="text-gray-500 text-sm mt-1">Setup the coding challenge details</p>
                                </div>
                                <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-colors">
                                    <X className="w-8 h-8" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 mb-2 block">Title</label>
                                        <input
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-orange-500/50 transition-all font-bold"
                                            placeholder="e.g. Reverse Linked List"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 mb-2 block">Topic</label>
                                            <input
                                                name="topic"
                                                value={formData.topic}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-orange-500/50 transition-all"
                                                placeholder="e.g. Data Structures"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 mb-2 block">Difficulty</label>
                                            <select
                                                name="difficulty"
                                                value={formData.difficulty}
                                                onChange={handleInputChange}
                                                className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-orange-500/50 transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="Easy">🟢 Easy</option>
                                                <option value="Medium">🟡 Medium</option>
                                                <option value="Hard">🔴 Hard</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 mb-2 block">Target Companies</label>
                                        <input
                                            name="companies"
                                            value={formData.companies}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-orange-500/50 transition-all"
                                            placeholder="e.g. Google, TCS, Amazon (comma separated)"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 mb-2 block">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            required
                                            rows="4"
                                            className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-orange-500/50 transition-all resize-none"
                                            placeholder="Detail the problem statement..."
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 mb-2 block flex items-center gap-2">
                                            Solution Hint <Info className="w-3 h-3 text-orange-500" />
                                        </label>
                                        <textarea
                                            name="hint"
                                            value={formData.hint}
                                            onChange={handleInputChange}
                                            rows="2"
                                            className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-orange-500/50 transition-all resize-none"
                                            placeholder="A small hint for the user..."
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => { setShowModal(false); resetForm(); }}
                                        className="px-8 py-3 rounded-2xl text-gray-400 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-10 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 active:scale-95 transition-all"
                                    >
                                        {editingId ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageCodePractice;
