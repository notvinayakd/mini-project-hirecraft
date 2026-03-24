import React, { useState, useEffect } from 'react';
import { Mail, Phone, BookOpen, Trash2, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/students', { credentials: 'include' });
            if (response.ok) {
                const data = await response.json();
                console.log("Fetched students data:", data);
                setStudents(data);
            } else {
                console.error("Failed to fetch. Status:", response.status);
            }
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this student account?")) return;
        try {
            const response = await fetch(`http://localhost:5000/api/admin/students/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                setStudents(prev => prev.filter(s => s.id !== id));
            }
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    };

    const filteredStudents = students.filter(s =>
        (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-white">Student Directory</h1>
                <p className="text-gray-400">Overview of all registered students and their details.</p>
            </header>

            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl py-2 pl-12 pr-4 text-white focus:border-blue-500 outline-none"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <p className="text-white text-center py-12">Loading directory...</p>
                ) : students.length === 0 ? (
                    <p className="text-gray-500 text-center py-12">No students registered yet.</p>
                ) : filteredStudents.length === 0 ? (
                    <p className="text-gray-500 text-center py-12">No students matched your search.</p>
                ) : (
                    filteredStudents.map((student) => (
                        <motion.div
                            key={student.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-[#0f172a]/50 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-blue-500/30 transition-all"
                        >
                            <div className="flex gap-4 items-center">
                                <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-xl font-bold border border-blue-500/20">
                                    {(student.name && student.name.length > 0) ? student.name[0].toUpperCase() : '?'}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{student.name || 'Unknown Student'}</h3>
                                    <div className="flex gap-3 mt-1 text-sm text-gray-400">
                                        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {student.branch || 'No Branch'}</span>
                                        <span>•</span>
                                        <span>Sem {student.semester || 'N/A'}</span>
                                        <span>•</span>
                                        <span className="text-green-400 font-medium">{student.gpa} CGPA</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6 text-sm text-gray-400">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-500" /> {student.email}</div>
                                    <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-500" /> {student.phone || 'No phone'}</div>
                                </div>
                                <button
                                    onClick={() => handleDelete(student.id)}
                                    className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all self-center md:self-auto"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StudentList;
