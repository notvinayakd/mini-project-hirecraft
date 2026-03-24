import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, MapPin, DollarSign, X, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ManageDrives = () => {
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingDrive, setEditingDrive] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ show: false, driveId: null, driveName: '' });
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        ctc: '',
        location: '',
        date: '',
        type: 'Full Time',
        description: '',
        criteria: '',
        googleFormLink: '',
        isActive: true,
        minCGPA: '0.0'
    });

    useEffect(() => {
        fetchDrives();
    }, []);

    const fetchDrives = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/drives', { credentials: 'include' });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingDrive
            ? `http://localhost:5000/api/admin/drives/${editingDrive.id}`
            : 'http://localhost:5000/api/admin/drives';
        const method = editingDrive ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });
            if (response.ok) {
                setShowModal(false);
                setEditingDrive(null);
                fetchDrives();
                resetForm();
            }
        } catch (error) {
            console.error("Error saving drive:", error);
        }
    };

    const handleEdit = (drive) => {
        setEditingDrive(drive);
        setFormData({
            company: drive.company,
            role: drive.role,
            ctc: drive.ctc || '',
            location: drive.location || '',
            date: drive.date,
            type: drive.type || 'Full Time',
            description: drive.description || '',
            criteria: drive.criteria || '',
            googleFormLink: drive.googleFormLink || '',
            isActive: drive.isActive,
            minCGPA: drive.minCGPA || '0.0'
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            company: '', role: '', ctc: '', location: '', date: '', type: 'Full Time', description: '', criteria: '', googleFormLink: '', isActive: true, minCGPA: '0.0'
        });
        setEditingDrive(null);
    };

    const handleDelete = async () => {
        const id = deleteModal.driveId;
        try {
            const response = await fetch(`http://localhost:5000/api/admin/drives/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                setDrives(prev => prev.filter(d => d.id !== id));
                setDeleteModal({ show: false, driveId: null, driveName: '' });
            }
        } catch (error) {
            console.error("Error deleting drive:", error);
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Placement Drives</h1>
                    <p className="text-gray-400">Manage upcoming company visits and recruitment drives.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all shadow-lg shadow-orange-500/20"
                >
                    <Plus className="w-5 h-5" />
                    <span>Post New Drive</span>
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="text-white col-span-full text-center py-12">Loading drives...</p>
                ) : drives.length === 0 ? (
                    <p className="text-gray-500 col-span-full text-center py-12">No drives found.</p>
                ) : (
                    drives.map((drive) => (
                        <motion.div
                            key={drive.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group relative bg-[#0f172a]/40 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/10 hover:border-orange-500/40 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.15)]"
                        >
                            {/* Abstract Multi-layered Header (Admin Style) */}
                            <div className="h-24 relative overflow-hidden bg-gradient-to-br from-orange-500/20 to-red-500/10">
                                <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-700">
                                    <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle,rgba(249,115,22,0.2)_0%,transparent_70%)] animate-pulse" />
                                    <div className="absolute bottom-[-50%] right-[-20%] w-[120%] h-[120%] bg-[radial-gradient(circle,rgba(239,68,68,0.1)_0%,transparent_60%)] animate-pulse" style={{ animationDelay: '1s' }} />
                                </div>
                                <div className="absolute top-4 right-4 z-20 flex gap-2">
                                    <button
                                        onClick={() => handleEdit(drive)}
                                        className="p-2 bg-black/40 backdrop-blur-md rounded-xl text-gray-400 hover:text-white border border-white/10 hover:border-orange-500/40 transition-all"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteModal({ show: true, driveId: drive.id, driveName: drive.company })}
                                        className="p-2 bg-black/40 backdrop-blur-md rounded-xl text-gray-400 hover:text-red-400 border border-white/10 hover:border-red-500/40 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="absolute bottom-3 left-6 z-10">
                                    <div className="flex items-center gap-2">
                                        <div className="h-px w-6 bg-orange-500/50" />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400 drop-shadow-sm">{drive.company}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 pt-5">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-white tracking-tight lead-tight group-hover:text-orange-400 transition-colors">
                                        {drive.role}
                                    </h3>
                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border ${drive.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                        {drive.isActive ? 'Active' : 'Closed'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-3 mb-6">
                                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                                        <p className="text-[9px] uppercase text-gray-500 font-bold tracking-wider">Package</p>
                                        <p className="text-sm font-bold text-white">{drive.ctc || 'N/A'}</p>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                                        <p className="text-[9px] uppercase text-gray-500 font-bold tracking-wider">Min. CGPA</p>
                                        <p className="text-sm font-bold text-white">{drive.minCGPA || '0.0'}</p>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                                        <p className="text-[9px] uppercase text-gray-500 font-bold tracking-wider">Location</p>
                                        <p className="text-sm font-bold text-white truncate">{drive.location || 'Remote'}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 text-xs text-gray-400 mb-6">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-orange-500/60" />
                                        <span>Drive Date: <span className="text-white font-medium">{drive.date}</span></span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Plus className="w-4 h-4 text-orange-500/60" />
                                        <span>Type: <span className="text-white font-medium">{drive.type}</span></span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5">
                                    {drive.googleFormLink ? (
                                        <a
                                            href={drive.googleFormLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full relative group/btn inline-flex items-center justify-center gap-3 py-3 rounded-2xl bg-orange-500/10 text-orange-400 font-bold overflow-hidden border border-orange-500/20 hover:bg-orange-500 hover:text-white transition-all duration-300"
                                        >
                                            <span className="relative z-10 uppercase tracking-widest text-[10px]">Open Registration</span>
                                            <Calendar className="w-4 h-4 relative z-10" />
                                        </a>
                                    ) : (
                                        <div className="w-full py-3 rounded-2xl bg-white/5 border border-white/5 text-gray-500 text-center text-[10px] uppercase font-bold tracking-widest">
                                            No External Link
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Decorative Side Glow */}
                            <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-orange-500/20 to-transparent" />
                        </motion.div>
                    ))
                )}
            </div>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            onSubmit={handleSubmit}
                            className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-xl p-6 space-y-4"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xl font-bold text-white">
                                    {editingDrive ? 'Edit Placement Drive' : 'Post New Drive'}
                                </h2>
                                <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="text-sm text-gray-400">Company Name</label>
                                    <input type="text" required value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white mt-1" />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Job Role</label>
                                    <input type="text" required value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white mt-1" />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">CTC Packages</label>
                                    <input type="text" value={formData.ctc} onChange={e => setFormData({ ...formData, ctc: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white mt-1" placeholder="e.g. 12 LPA" />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Date</label>
                                    <input type="date" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white mt-1" />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Location</label>
                                    <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white mt-1" />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-sm text-gray-400">Google Form Link (Registration)</label>
                                    <input type="url" placeholder="https://forms.gle/..." value={formData.googleFormLink} onChange={e => setFormData({ ...formData, googleFormLink: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white mt-1" />
                                </div>
                                <div className="col-span-2 grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/10">
                                        <input
                                            type="checkbox"
                                            id="isActive"
                                            checked={formData.isActive}
                                            onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                            className="w-5 h-5 accent-orange-500"
                                        />
                                        <label htmlFor="isActive" className="text-sm text-white font-bold cursor-pointer">
                                            Status: {formData.isActive ? 'Active' : 'Closed'}
                                        </label>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400">Min. CGPA Criteria</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 7.5"
                                            value={formData.minCGPA}
                                            onChange={e => setFormData({ ...formData, minCGPA: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white mt-1"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => { setShowModal(false); setEditingDrive(null); }} className="px-6 py-2 text-gray-400 hover:text-white">Cancel</button>
                                <button type="submit" className="px-8 py-2 bg-orange-500 rounded-xl text-white font-bold shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all">
                                    {editingDrive ? 'Update Drive' : 'Post Drive'}
                                </button>
                            </div>
                        </motion.form>
                    </div>
                )}
            </AnimatePresence>

            {/* Custom Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteModal.show && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0f172a] border border-red-500/20 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl shadow-red-500/10"
                        >
                            <div className="p-8 text-center">
                                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Trash2 className="w-10 h-10 text-red-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Are you sure?</h2>
                                <p className="text-gray-400 mb-8">
                                    You are about to delete the placement drive for <span className="text-white font-bold">{deleteModal.driveName}</span>. This action cannot be undone.
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setDeleteModal({ show: false, driveId: null, driveName: '' })}
                                        className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all shadow-lg shadow-red-500/20"
                                    >
                                        Delete Drive
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

export default ManageDrives;
