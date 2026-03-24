import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Award, Target, ChevronLeft, ArrowRight } from 'lucide-react';

const TestAnalysis = () => {
    const { attemptId } = useParams();
    const navigate = useNavigate();

    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalysis();
    }, [attemptId]);

    const fetchAnalysis = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/student/tests/attempt/${attemptId}`, {
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to load analysis');

            const data = await response.json();
            setAnalysis(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-background text-white flex items-center justify-center">Loading Analysis...</div>;
    if (error) return <div className="min-h-screen bg-background text-white flex items-center justify-center text-red-400">{error}</div>;

    const { attempt, test, questions } = analysis;
    const accuracy = Math.round((attempt.correctCount / attempt.totalQuestions) * 100);

    return (
        <div className="min-h-screen bg-background text-white font-sans selection:bg-accent/20">
            {/* Header */}
            <div className="bg-glass border-b border-white/5 sticky top-0 z-50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-secondary hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" /> Back to Dashboard
                    </button>
                    <h1 className="text-xl font-bold">{test.title} - Analysis</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
                {/* Performance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-glass rounded-2xl p-6 border border-white/5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-secondary text-sm">Score</p>
                            <p className="text-2xl font-bold">{attempt.score}%</p>
                        </div>
                    </div>

                    <div className="bg-glass rounded-2xl p-6 border border-white/5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                            <Target className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-secondary text-sm">Accuracy</p>
                            <p className="text-2xl font-bold">{accuracy}%</p>
                        </div>
                    </div>

                    <div className="bg-glass rounded-2xl p-6 border border-white/5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-secondary text-sm">Date Taken</p>
                            <p className="text-lg font-bold">{attempt.date}</p>
                        </div>
                    </div>
                </div>

                {/* Question Review */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Question Review</h2>

                    {questions.map((q, index) => {
                        const isCorrect = q.userAnswer !== null && ['A', 'B', 'C', 'D'][q.userAnswer] === q.correctOption;
                        const isSkipped = q.userAnswer === null;

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                key={q.id}
                                className={`bg-glass rounded-2xl p-6 border ${isCorrect ? 'border-green-500/30' :
                                        isSkipped ? 'border-yellow-500/30' : 'border-red-500/30'
                                    }`}
                            >
                                <div className="flex gap-4">
                                    <span className="text-secondary font-mono">Q{index + 1}.</span>
                                    <div className="flex-1 space-y-4">
                                        <p className="text-lg font-medium">{q.text}</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {q.options.map((option, optIdx) => {
                                                const optChar = String.fromCharCode(65 + optIdx);
                                                const isUserSelected = q.userAnswer === optIdx;
                                                const isCorrectOption = optChar === q.correctOption;

                                                let styleClass = "bg-white/5 border-transparent text-secondary";

                                                if (isCorrectOption) {
                                                    styleClass = "bg-green-500/20 border-green-500 text-green-200";
                                                } else if (isUserSelected && !isCorrectOption) {
                                                    styleClass = "bg-red-500/20 border-red-500 text-red-200";
                                                }

                                                return (
                                                    <div
                                                        key={optIdx}
                                                        className={`p-3 rounded-lg border flex items-center justify-between ${styleClass}`}
                                                    >
                                                        <span className="flex items-center gap-3">
                                                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs border border-current opacity-70">
                                                                {optChar}
                                                            </span>
                                                            {option}
                                                        </span>
                                                        {isUserSelected && (
                                                            isCorrectOption
                                                                ? <CheckCircle className="w-5 h-5 text-green-400" />
                                                                : <XCircle className="w-5 h-5 text-red-400" />
                                                        )}
                                                        {!isUserSelected && isCorrectOption && (
                                                            <CheckCircle className="w-5 h-5 text-green-400 opacity-50" />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {!isCorrect && !isSkipped && (
                                            <p className="text-sm text-red-300 mt-2 flex items-center gap-2">
                                                <XCircle className="w-4 h-4" /> Incorrect Answer
                                            </p>
                                        )}
                                        {isSkipped && (
                                            <p className="text-sm text-yellow-300 mt-2 flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4" /> Not Attempted
                                            </p>
                                        )}
                                        {isCorrect && (
                                            <p className="text-sm text-green-300 mt-2 flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" /> Correct Answer (+{q.marks} marks)
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

import { AlertCircle } from 'lucide-react';

export default TestAnalysis;
