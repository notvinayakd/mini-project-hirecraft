import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Plus, Trash2, Edit2, Clock, Brain, Trophy, X, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ManageTests = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTest, setEditingTest] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Aptitude',
        difficulty: 'Medium',
        duration: 30,
        description: ''
    });

    // Questions Modal State
    const [showQuestionsModal, setShowQuestionsModal] = useState(false);
    const [testForQuestions, setTestForQuestions] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [questionFormData, setQuestionFormData] = useState({
        text: '',
        options: ['', '', '', ''],
        correctOption: 'A',
        marks: 1
    });

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/tests', { credentials: 'include' });
            if (response.ok) {
                const data = await response.json();
                setTests(data);
            }
        } catch (error) {
            console.error("Error fetching tests:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingTest
            ? `http://localhost:5000/api/admin/tests/${editingTest.id}`
            : 'http://localhost:5000/api/admin/tests';

        const method = editingTest ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });
            if (response.ok) {
                setShowModal(false);
                setEditingTest(null);
                fetchTests();
                resetForm();
            }
        } catch (error) {
            console.error("Error saving test:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this test? This will only work if it has no questions or if backend supports cascading.")) return;
        try {
            const response = await fetch(`http://localhost:5000/api/admin/tests/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                setTests(prev => prev.filter(t => t.id !== id));
            } else {
                const err = await response.json();
                alert(`Error: ${err.error}`);
            }
        } catch (error) {
            console.error("Error deleting test:", error);
        }
    };

    const handleEdit = (test) => {
        setEditingTest(test);
        setFormData({
            title: test.title,
            category: test.category,
            difficulty: test.difficulty,
            duration: parseInt(test.duration) || 30,
            description: test.description || ''
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            category: 'Aptitude',
            difficulty: 'Medium',
            duration: 30,
            description: ''
        });
        setEditingTest(null);
    };

    // --- Questions Management ---
    const fetchQuestions = async (testId) => {
        setLoadingQuestions(true);
        try {
            const response = await fetch('http://localhost:5000/api/admin/questions', { credentials: 'include' });
            if (response.ok) {
                const data = await response.json();
                // Filter questions for this test
                setQuestions(data.filter(q => q.test_id === testId));
            }
        } catch (error) {
            console.error("Error fetching questions:", error);
        } finally {
            setLoadingQuestions(false);
        }
    };

    const handleOpenQuestions = (test) => {
        setTestForQuestions(test);
        fetchQuestions(test.id);
        setShowQuestionsModal(true);
    };

    const handleCloseQuestions = () => {
        setShowQuestionsModal(false);
        setTestForQuestions(null);
        setQuestions([]);
        resetQuestionForm();
        fetchTests(); // Refresh the test list to get the updated question count
    };

    const resetQuestionForm = () => {
        setQuestionFormData({
            text: '',
            options: ['', '', '', ''],
            correctOption: 'A',
            marks: 1
        });
        setEditingQuestion(null);
    };

    const handleQuestionSubmit = async (e) => {
        e.preventDefault();

        // Validate options
        if (questionFormData.options.some(opt => !opt.trim())) {
            alert("Please fill in all 4 options.");
            return;
        }

        const url = editingQuestion
            ? `http://localhost:5000/api/admin/questions/${editingQuestion.id}`
            : 'http://localhost:5000/api/admin/questions';

        const method = editingQuestion ? 'PUT' : 'POST';

        const payload = {
            test_id: testForQuestions.id,
            text: questionFormData.text,
            options: questionFormData.options,
            correctOption: questionFormData.correctOption,
            marks: parseInt(questionFormData.marks) || 1
        };

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include'
            });

            if (response.ok) {
                fetchQuestions(testForQuestions.id);
                resetQuestionForm();
            } else {
                const err = await response.json();
                alert(`Error: ${err.error || 'Failed to save question'}`);
            }
        } catch (error) {
            console.error("Error saving question:", error);
        }
    };

    const handleDeleteQuestion = async (id) => {
        if (!window.confirm("Delete this question?")) return;
        try {
            const response = await fetch(`http://localhost:5000/api/admin/questions/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                setQuestions(prev => prev.filter(q => q.id !== id));
            } else {
                const err = await response.json();
                alert(`Error: ${err.error || 'Failed to delete question'}`);
            }
        } catch (error) {
            console.error("Error deleting question:", error);
        }
    };

    const handleEditQuestion = (question) => {
        setEditingQuestion(question);
        setQuestionFormData({
            text: question.text,
            options: question.options || ['', '', '', ''],
            correctOption: question.correctOption || 'A',
            marks: question.marks || 1
        });
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...questionFormData.options];
        newOptions[index] = value;
        setQuestionFormData({ ...questionFormData, options: newOptions });
    };

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Manage Mock Tests</h1>
                    <p className="text-gray-400">Create and configure test containers for students.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold transition-all shadow-lg shadow-purple-500/20"
                >
                    <Plus className="w-5 h-5" />
                    <span>Create New Test</span>
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="text-white col-span-full text-center py-12">Loading tests...</p>
                ) : tests.length === 0 ? (
                    <p className="text-gray-500 col-span-full text-center py-12">No tests configured yet.</p>
                ) : (
                    tests.map((test) => (
                        <motion.div
                            key={test.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group relative bg-[#0f172a]/40 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/10 hover:border-purple-500/40 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.15)]"
                        >
                            {/* Abstract Multi-layered Header (Test Style) */}
                            <div className="h-24 relative overflow-hidden bg-gradient-to-br from-purple-500/20 to-indigo-500/10">
                                <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-700">
                                    <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle,rgba(168,85,247,0.2)_0%,transparent_70%)] animate-pulse" />
                                    <div className="absolute bottom-[-50%] right-[-20%] w-[120%] h-[120%] bg-[radial-gradient(circle,rgba(79,70,229,0.1)_0%,transparent_60%)] animate-pulse" style={{ animationDelay: '1s' }} />
                                </div>
                                <div className="absolute top-4 right-4 z-20 flex gap-2">
                                    <button
                                        onClick={() => handleOpenQuestions(test)}
                                        title="Manage Questions"
                                        className="p-2 bg-black/40 backdrop-blur-md rounded-xl text-gray-400 hover:text-white border border-white/10 hover:border-blue-500/40 transition-all"
                                    >
                                        <Layout className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(test.id)}
                                        className="p-2 bg-black/40 backdrop-blur-md rounded-xl text-gray-400 hover:text-red-400 border border-white/10 hover:border-red-500/40 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="absolute bottom-3 left-6 z-10">
                                    <div className="flex items-center gap-2">
                                        <div className="h-px w-6 bg-purple-500/50" />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400 drop-shadow-sm">{test.category}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 pt-5">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-white tracking-tight lead-tight group-hover:text-purple-400 transition-colors">
                                        {test.title}
                                    </h3>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                                        <p className="text-[9px] uppercase text-gray-500 font-bold tracking-wider">Duration</p>
                                        <p className="text-sm font-bold text-white">{test.duration} mins</p>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                                        <p className="text-[9px] uppercase text-gray-500 font-bold tracking-wider">Questions</p>
                                        <p className="text-sm font-bold text-white">{test.questions}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-6">
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border ${test.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                        test.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                            'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                        }`}>
                                        {test.difficulty}
                                    </span>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Trophy className="w-4 h-4" />
                                        <span>{test.attempts} attempts</span>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative Side Glow */}
                            <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent" />
                        </motion.div>
                    ))
                )}
            </div>

            <AnimatePresence>
                {/* Create/Edit Test Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            onSubmit={handleSubmit}
                            className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xl font-bold text-white">
                                    {editingTest ? 'Edit Mock Test' : 'Create New Mock Test'}
                                </h2>
                                <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-400">Test Title</label>
                                    <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white mt-1 outline-none focus:border-purple-500/50" placeholder="e.g. TCS Ninja Aptitude Batch-1" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-400">Category</label>
                                        <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white mt-1 outline-none focus:border-purple-500/50">
                                            <option value="Aptitude">Aptitude</option>
                                            <option value="Technical">Technical</option>
                                            <option value="Verbal">Verbal</option>
                                            <option value="Coding">Coding</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400">Difficulty</label>
                                        <select value={formData.difficulty} onChange={e => setFormData({ ...formData, difficulty: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white mt-1 outline-none focus:border-purple-500/50">
                                            <option value="Easy">Easy</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Hard">Hard</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400">Duration (Minutes)</label>
                                        <input required type="number" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white mt-1 outline-none focus:border-purple-500/50" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Description</label>
                                    <textarea rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white mt-1 outline-none focus:border-purple-500/50 resize-none" placeholder="Details about this test..."></textarea>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                                <button type="submit" className="px-8 py-2 bg-purple-500 rounded-lg text-white font-bold shadow-lg shadow-purple-500/20 hover:bg-purple-600 transition-all">
                                    {editingTest ? 'Update Test' : 'Create Test'}
                                </button>
                            </div>
                        </motion.form>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {/* Questions Management Modal */}
                {showQuestionsModal && testForQuestions && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
                        >
                            {/* Modal Header */}
                            <div className="flex justify-between items-center p-6 border-b border-white/10">
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        Manage Questions: <span className="text-purple-400">{testForQuestions.title}</span>
                                    </h2>
                                    <p className="text-sm text-gray-400 mt-1">Total Questions: {questions.length}</p>
                                </div>
                                <button type="button" onClick={handleCloseQuestions} className="text-gray-400 hover:text-white p-2">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="flex flex-1 overflow-hidden">
                                {/* Left Side: Question List */}
                                <div className="w-1/2 border-r border-white/10 flex flex-col overflow-hidden">
                                    <div className="p-4 bg-white/5 border-b border-white/10">
                                        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Existing Questions</h3>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        {loadingQuestions ? (
                                            <p className="text-center text-gray-500 py-8">Loading questions...</p>
                                        ) : questions.length === 0 ? (
                                            <p className="text-center text-gray-500 py-8">No questions added yet.</p>
                                        ) : (
                                            questions.map((q, idx) => (
                                                <div key={q.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-purple-500/30 transition-all">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <span className="text-purple-400 font-bold shrink-0">Q{idx + 1}.</span>
                                                        <p className="text-white text-sm flex-1 line-clamp-2">{q.text}</p>
                                                        <div className="flex gap-2 shrink-0">
                                                            <button onClick={() => handleEditQuestion(q)} className="text-gray-400 hover:text-white transition-colors">
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => handleDeleteQuestion(q.id)} className="text-gray-400 hover:text-red-400 transition-colors">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Right Side: Question Form */}
                                <div className="w-1/2 flex flex-col overflow-hidden bg-black/20">
                                    <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
                                        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                                            {editingQuestion ? 'Edit Question' : 'Add New Question'}
                                        </h3>
                                        {editingQuestion && (
                                            <button onClick={resetQuestionForm} className="text-xs text-purple-400 hover:text-white">
                                                Cancel Edit
                                            </button>
                                        )}
                                    </div>
                                    <form onSubmit={handleQuestionSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                                        <div>
                                            <label className="text-sm text-gray-400 mb-2 block">Question Text</label>
                                            <textarea
                                                required
                                                rows="3"
                                                value={questionFormData.text}
                                                onChange={e => setQuestionFormData({ ...questionFormData, text: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-purple-500/50 resize-y"
                                                placeholder="Enter the question here..."
                                            ></textarea>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-sm text-gray-400 block">Options</label>
                                            {questionFormData.options.map((opt, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <span className="text-gray-500 font-bold w-6">{String.fromCharCode(65 + idx)}.</span>
                                                    <input
                                                        type="text"
                                                        value={opt}
                                                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                                                        className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-purple-500/50"
                                                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm text-gray-400 mb-1 block">Correct Option</label>
                                                <select
                                                    value={questionFormData.correctOption}
                                                    onChange={e => setQuestionFormData({ ...questionFormData, correctOption: e.target.value })}
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white outline-none"
                                                >
                                                    <option value="A">Option A</option>
                                                    <option value="B">Option B</option>
                                                    <option value="C">Option C</option>
                                                    <option value="D">Option D</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-400 mb-1 block">Marks</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={questionFormData.marks}
                                                    onChange={e => setQuestionFormData({ ...questionFormData, marks: e.target.value })}
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-white/10">
                                            <button
                                                type="submit"
                                                className="w-full py-3 bg-purple-500 rounded-lg text-white font-bold shadow-lg shadow-purple-500/20 hover:bg-purple-600 transition-all"
                                            >
                                                {editingQuestion ? 'Save Changes' : 'Add Question'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageTests;
