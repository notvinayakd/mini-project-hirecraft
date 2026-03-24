import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, HelpCircle, Trophy, ChevronRight, BookOpen, Code, Brain, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MockTests = () => {
    const [tests, setTests] = useState([]);
    const [userAttempts, setUserAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Dialog States
    const [showRetakeDialog, setShowRetakeDialog] = useState(false);
    const [selectedTestId, setSelectedTestId] = useState(null);

    const navigate = useNavigate();

    const categories = ['All', 'Aptitude', 'Technical', 'Coding'];

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/student/tests/', {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to fetch tests');
            }
            const data = await response.json();
            setTests(data.tests || []);
            setUserAttempts(data.user_attempts || []);
        } catch (err) {
            console.error(err);
            setError('Failed to load mock tests. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (category) => {
        switch (category) {
            case 'Aptitude': return Brain;
            case 'Technical': return Code;
            case 'Verbal': return BookOpen;
            case 'Coding': return Code;
            default: return BookOpen;
        }
    };

    const getColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return "bg-green-500/20 text-green-300";
            case 'Medium': return "bg-yellow-500/20 text-yellow-300";
            case 'Hard': return "bg-red-500/20 text-red-300";
            default: return "bg-blue-500/20 text-blue-300";
        }
    };

    // Filter tests based on category
    const categoryTests = selectedCategory === 'All'
        ? tests
        : tests.filter(test => test.category === selectedCategory);

    // Separate into Available and Completed
    const completedTestIds = new Set(userAttempts.map(a => a.test_id));

    const availableTests = categoryTests.filter(test => !completedTestIds.has(test.id));
    const completedTests = categoryTests.filter(test => completedTestIds.has(test.id)).map(test => {
        // Attach attempt info
        const attempts = userAttempts.filter(a => a.test_id === test.id);
        // Get best or latest? Let's show Latest for history list.
        const latestAttempt = attempts.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        return { ...test, attempt: latestAttempt };
    });

    const handleStartTest = (testId) => {
        navigate(`/student/test/${testId}`);
    };

    const handleRetakeClick = (testId) => {
        setSelectedTestId(testId);
        setShowRetakeDialog(true);
    };

    const confirmRetake = () => {
        if (selectedTestId) {
            navigate(`/student/test/${selectedTestId}`);
        }
        setShowRetakeDialog(false);
    };

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
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-heading font-bold text-white">Mock Tests</h1>
                            <p className="text-secondary mt-1">Practice and improve your skills with our curated tests</p>
                        </div>

                        <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto max-w-full">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === category
                                        ? 'bg-accent text-white shadow-lg shadow-accent/25'
                                        : 'text-secondary hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-secondary">Loading tests...</div>
                    ) : error ? (
                        <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {/* Available Tests Section */}
                            <section>
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <div className="w-2 h-8 bg-accent rounded-full"></div>
                                    Available Tests
                                    <span className="text-sm font-normal text-secondary ml-2">({availableTests.length})</span>
                                </h2>

                                {availableTests.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {availableTests.map((test) => {
                                            const Icon = getIcon(test.category);
                                            const colorClass = getColor(test.difficulty);

                                            return (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    key={test.id}
                                                    className="group bg-glass rounded-2xl p-6 border border-white/5 hover:border-accent/20 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1"
                                                >
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center`}>
                                                            <Icon className="w-6 h-6" />
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${test.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                            test.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                                'bg-red-500/10 text-red-400 border-red-500/20'
                                                            }`}>
                                                            {test.difficulty}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
                                                        {test.title}
                                                    </h3>

                                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                                        <div className="flex items-center gap-2 text-sm text-secondary/80">
                                                            <HelpCircle className="w-4 h-4 text-accent/70" />
                                                            {test.questions} Questions
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-secondary/80">
                                                            <Clock className="w-4 h-4 text-accent/70" />
                                                            {test.duration}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-secondary/80 col-span-2">
                                                            <Trophy className="w-4 h-4 text-accent/70" />
                                                            {test.attempts} Students Attempted
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => handleStartTest(test.id)}
                                                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-white font-medium group-hover:bg-accent hover:text-white transition-all duration-300"
                                                    >
                                                        Start Test
                                                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                                    </button>
                                                </motion.div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 bg-white/5 rounded-2xl border border-dashed border-white/10">
                                        <p className="text-secondary">No available tests in this category.</p>
                                    </div>
                                )}
                            </section>

                            {/* Completed Tests Section */}
                            {completedTests.length > 0 && (
                                <section>
                                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                                        Completed Tests
                                        <span className="text-sm font-normal text-secondary ml-2">({completedTests.length})</span>
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 opacity-80 hover:opacity-100 transition-opacity">
                                        {completedTests.map((test) => {
                                            const Icon = getIcon(test.category);

                                            // Score Color
                                            let scoreColor = "text-red-400";
                                            if (test.attempt.score >= 80) scoreColor = "text-green-400";
                                            else if (test.attempt.score >= 50) scoreColor = "text-yellow-400";

                                            return (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    key={test.id}
                                                    className="group bg-glass rounded-2xl p-6 border border-white/5 hover:border-green-500/20 transition-all duration-300"
                                                >
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                                                <Icon className="w-5 h-5 text-secondary" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-white group-hover:text-green-400 transition-colors">
                                                                    {test.title}
                                                                </h3>
                                                                <p className="text-xs text-secondary">
                                                                    Taken on {test.attempt.date}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className={`text-xl font-bold ${scoreColor}`}>
                                                            {test.attempt.score}%
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-3 mt-6">
                                                        <button
                                                            onClick={() => navigate(`/student/test/analysis/${test.attempt.attempt_id}`)}
                                                            className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors"
                                                        >
                                                            View Analysis
                                                        </button>
                                                        <button
                                                            onClick={() => handleRetakeClick(test.id)}
                                                            className="flex-1 py-2 rounded-lg border border-white/10 hover:border-white/20 text-xs font-medium text-secondary hover:text-white transition-colors"
                                                        >
                                                            Retake Test
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )
                                        })}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Styled Retake Confirmation Dialog */}
            {showRetakeDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#111] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl scale-100 animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4 text-yellow-500">
                            <AlertCircle className="w-6 h-6" />
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">Retake Mock Test?</h3>
                        <p className="text-secondary text-sm mb-6 leading-relaxed">
                            You are about to retake this test. Please note:
                            <br /><br />
                            <span className="text-yellow-400/90 font-medium">
                                • User analytics are locked to your first attempt.
                            </span>
                            <br />
                            • Your stats will not be updated with this new score.
                            <br />
                            • This is purely for practice purposes.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowRetakeDialog(false)}
                                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmRetake}
                                className="flex-1 py-3 rounded-xl bg-accent hover:bg-accent/90 text-white font-medium transition-colors shadow-lg shadow-accent/20"
                            >
                                I Understand, Retake
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MockTests;
