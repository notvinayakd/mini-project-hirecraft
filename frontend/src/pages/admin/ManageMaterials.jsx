import React, { useState, useEffect } from 'react';
import { Plus, Trash2, BookOpen, ExternalLink, X, Edit2, Bookmark, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ManageMaterials = () => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ show: false, materialId: null, materialTitle: '' });

    const [formData, setFormData] = useState({
        title: '',
        type: 'Article',
        subject: '',
        url: '',
        meta: '',
        company: ''
    });

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/materials', { credentials: 'include' });
            if (response.ok) {
                const data = await response.json();
                setMaterials(data);
            }
        } catch (error) {
            console.error("Error fetching materials:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let finalUrl = formData.url.trim();
        if (finalUrl && !/^https?:\/\//i.test(finalUrl)) {
            finalUrl = 'https://' + finalUrl;
        }

        const url = editingMaterial
            ? `http://localhost:5000/api/admin/materials/${editingMaterial.id}`
            : 'http://localhost:5000/api/admin/materials';
        const method = editingMaterial ? 'PUT' : 'POST';

        const submitPayload = { ...formData, url: finalUrl };

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submitPayload),
                credentials: 'include'
            });
            if (response.ok) {
                setShowModal(false);
                setEditingMaterial(null);
                fetchMaterials();
                resetForm();
            }
        } catch (error) {
            console.error("Error saving material:", error);
        }
    };

    const handleEdit = (material) => {
        setEditingMaterial(material);
        setFormData({
            title: material.title,
            type: material.type || 'Article',
            subject: material.subject || '',
            url: material.url || '',
            meta: material.meta || '',
            company: material.company || ''
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            title: '', type: 'Article', subject: '', url: '', meta: '', company: ''
        });
        setEditingMaterial(null);
    };

    const handleDelete = async () => {
        const id = deleteModal.materialId;
        try {
            const response = await fetch(`http://localhost:5000/api/admin/materials/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                setMaterials(prev => prev.filter(m => m.id !== id));
                setDeleteModal({ show: false, materialId: null, materialTitle: '' });
            }
        } catch (error) {
            console.error("Error deleting material:", error);
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Prep Materials</h1>
                    <p className="text-gray-400">Manage study resources, guides, and company preparation materials.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all shadow-lg shadow-orange-500/20"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Material</span>
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="text-white col-span-full text-center py-12">Loading materials...</p>
                ) : materials.length === 0 ? (
                    <p className="text-gray-500 col-span-full text-center py-12">No materials found.</p>
                ) : (
                    materials.map((material) => (
                        <motion.div
                            key={material.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group relative bg-[#0f172a]/40 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/10 hover:border-orange-500/40 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.15)]"
                        >
                            <div className="h-24 relative overflow-hidden bg-gradient-to-br from-orange-500/10 to-blue-500/5">
                                <div className="absolute top-4 right-4 z-20 flex gap-2">
                                    <button
                                        onClick={() => handleEdit(material)}
                                        className="p-2 bg-black/40 backdrop-blur-md rounded-xl text-gray-400 hover:text-white border border-white/10 hover:border-orange-500/40 transition-all"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteModal({ show: true, materialId: material.id, materialTitle: material.title })}
                                        className="p-2 bg-black/40 backdrop-blur-md rounded-xl text-gray-400 hover:text-red-400 border border-white/10 hover:border-red-500/40 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="absolute bottom-3 left-6 z-10">
                                    <div className="flex items-center gap-2">
                                        <div className="h-px w-6 bg-orange-500/50" />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400 drop-shadow-sm">{material.type || 'Material'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 pt-5">
                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-orange-400 transition-colors">
                                    {material.title}
                                </h3>


                                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border bg-white/5 text-secondary border-white/10">
                                        {material.meta || 'Study Now'}
                                    </span>
                                    <a
                                        href={material.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-xl bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-white transition-all duration-300"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.form
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onSubmit={handleSubmit}
                            className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-xl p-8 space-y-6 shadow-2xl shadow-orange-500/5"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-white">
                                    {editingMaterial ? 'Edit Material' : 'Add New Material'}
                                </h2>
                                <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-2 block">Material Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500/50 outline-none transition-all placeholder:text-gray-700"
                                        placeholder="e.g. Master DP for TCS"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-2 block">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500/50 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="Article">Article</option>
                                        <option value="Video">Video</option>
                                        <option value="PDF">PDF</option>
                                        <option value="Guide">Guide</option>
                                        <option value="Company Specific">Company Specific</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-2 block">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500/50 outline-none transition-all placeholder:text-gray-700"
                                        placeholder="e.g. Technical"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-2 block">Resource URL</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.url}
                                        onChange={e => setFormData({ ...formData, url: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500/50 outline-none transition-all placeholder:text-gray-700"
                                        placeholder="https://... or example.com"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-2 block">Target Company (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500/50 outline-none transition-all placeholder:text-gray-700"
                                        placeholder="e.g. TCS"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-2 block">Meta Info (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.meta}
                                        onChange={e => setFormData({ ...formData, meta: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500/50 outline-none transition-all placeholder:text-gray-700"
                                        placeholder="e.g. 15 Topics Covered"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6">
                                <button type="button" onClick={() => { setShowModal(false); setEditingMaterial(null); }} className="px-6 py-3 text-gray-400 hover:text-white font-bold transition-colors">Cancel</button>
                                <button type="submit" className="px-10 py-3 bg-orange-500 rounded-xl text-white font-bold shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                    {editingMaterial ? 'Update Material' : 'Save Material'}
                                </button>
                            </div>
                        </motion.form>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Modal */}
            <AnimatePresence>
                {deleteModal.show && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#0f172a] border border-red-500/20 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 text-center">
                                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Trash2 className="w-10 h-10 text-red-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Delete Material?</h2>
                                <p className="text-gray-400 mb-8 px-4">
                                    Are you sure you want to remove <span className="text-white font-bold">"{deleteModal.materialTitle}"</span>? This will be removed from all student dashboards.
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setDeleteModal({ show: false, materialId: null, materialTitle: '' })}
                                        className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all shadow-lg shadow-red-500/20"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <div className="h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageMaterials;
