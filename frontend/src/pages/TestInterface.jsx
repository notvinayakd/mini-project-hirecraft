import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, AlertCircle, ChevronRight, ChevronLeft, Flag, X } from 'lucide-react';

const TestInterface = () => {
    const { testId } = useParams();
    const navigate = useNavigate();

    const [test, setTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionId: optionIndex }
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showTimeUp, setShowTimeUp] = useState(false);
    const [flaggedQuestions, setFlaggedQuestions] = useState({}); // { questionId: true }
    const [showExitConfirm, setShowExitConfirm] = useState(false);

    const [showSubmitDialog, setShowSubmitDialog] = useState(false);

    useEffect(() => {
        fetchTestDetails();
    }, [testId]);

    useEffect(() => {
        if (timeLeft > 0 && !submitting) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && test && !submitting && !showTimeUp) {
            handleTimeUp();
        }
    }, [timeLeft, submitting, test, showTimeUp]);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (!submitting) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [submitting]);

    const fetchTestDetails = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/student/tests/${testId}`, {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to load test');

            const data = await response.json();
            setTest(data.test);
            setQuestions(data.questions);

            // Parse duration "30 mins" -> 1800 seconds
            const durationMins = parseInt(data.test.duration.split(' ')[0]) || 30;
            setTimeLeft(durationMins * 60);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (optionIndex) => {
        setAnswers({
            ...answers,
            [questions[currentQuestion].id]: optionIndex
        });
    };

    const toggleFlag = () => {
        const qId = questions[currentQuestion].id;
        setFlaggedQuestions(prev => ({
            ...prev,
            [qId]: !prev[qId]
        }));
    };

    const handleTimeUp = () => {
        setShowTimeUp(true);
        setShowSubmitDialog(false); // Close confirmation if open
        setTimeout(() => {
            handleSubmit();
        }, 3000); // Wait 3 seconds to show the dialog
    };

    // Trigger the confirmation dialog
    const handlePreSubmit = () => {
        setShowSubmitDialog(true);
    };

    const handleSubmit = async () => {
        if (submitting) return;
        setSubmitting(true);
        setShowSubmitDialog(false);

        try {
            const response = await fetch('http://localhost:5000/api/student/tests/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    testId,
                    answers
                })
            });

            if (!response.ok) throw new Error('Submit failed');

            const result = await response.json();
            // Redirect to Analytics page
            navigate(`/student/test/analysis/${result.attemptId}`);

        } catch (err) {
            alert('Failed to submit test');
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (loading) return <div className="min-h-screen bg-background text-white flex items-center justify-center">Loading Test...</div>;
    if (error) return <div className="min-h-screen bg-background text-white flex items-center justify-center text-red-400">{error}</div>;

    const question = questions[currentQuestion];
    const progress = ((Object.keys(answers).length) / questions.length) * 100;
    const answeredCount = Object.keys(answers).length;

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-accent/30 selection:text-accent group/test">
            {/* Exit Confirmation Dialog */}
            <AnimatePresence>
                {showExitConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center backdrop-blur-md p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-glass border border-red-500/20 p-8 rounded-3xl text-center max-w-sm w-full"
                        >
                            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">Abandon Test?</h3>
                            <p className="text-secondary text-sm mb-6">Your progress will not be saved if you leave now.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-3 rounded-xl bg-white/5 font-bold hover:bg-white/10 transition-colors">Stay</button>
                                <button onClick={() => navigate('/dashboard')} className="flex-1 py-3 rounded-xl bg-red-500/20 text-red-400 font-bold border border-red-500/50 hover:bg-red-500/30 transition-colors">Leave</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Submit Confirmation Dialog */}
            <AnimatePresence>
                {showSubmitDialog && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center backdrop-blur-md p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-glass border border-accent/20 p-8 rounded-3xl text-center max-w-sm w-full"
                        >
                            <CheckCircle className="w-12 h-12 text-accent mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">Submit Test?</h3>
                            <p className="text-secondary text-sm mb-6">Are you sure you want to submit? You have answered {answeredCount} of {questions.length} questions.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowSubmitDialog(false)} className="flex-1 py-3 rounded-xl bg-white/5 font-bold hover:bg-white/10 transition-colors">Cancel</button>
                                <button onClick={handleSubmit} disabled={submitting} className="flex-1 py-3 rounded-xl bg-accent hover:bg-accent/80 text-white font-bold transition-colors disabled:opacity-50">
                                    {submitting ? 'Submitting...' : 'Confirm'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="bg-glass border-b border-white/5 p-4 sticky top-0 z-50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setShowExitConfirm(true)} className="p-2 hover:bg-white/5 rounded-lg text-secondary">
                            <X className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold">{test.title}</h1>
                            <p className="text-sm text-secondary">Question {currentQuestion + 1} of {questions.length}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-secondary uppercase tracking-wider">Time Left</span>
                            <div className={`text-xl font-mono font-bold flex items-center justify-end gap-2 ${timeLeft < 300 ? 'text-red-400 animate-pulse' : 'text-accent'}`}>
                                <Clock className="w-5 h-5" />
                                {formatTime(timeLeft)}
                            </div>
                        </div>

                        <button
                            onClick={handlePreSubmit}
                            disabled={submitting}
                            className="bg-accent hover:bg-accent/80 text-white px-6 py-2 rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                            {submitting ? 'Submitting...' : 'Submit Test'}
                        </button>
                    </div>
                </div>
                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 h-1 bg-white/5 w-full">
                    <div
                        className="h-full bg-accent transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </header>

            {/* Content Layout */}
            <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
                {/* Main Question Area */}
                <main className="flex-1 p-6 md:p-10 flex flex-col">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestion}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-8 h-full flex flex-col"
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-accent">
                                        Question {currentQuestion + 1}
                                    </span>
                                    <button
                                        onClick={toggleFlag}
                                        className={`flex items-center gap-2 px-4 py-1.5 rounded-lg border transition-all ${flaggedQuestions[question.id] ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-white/5 border-white/10 text-secondary hover:text-white'}`}
                                    >
                                        <Flag className={`w-4 h-4 ${flaggedQuestions[question.id] ? 'fill-orange-400' : ''}`} />
                                        <span className="text-sm font-medium">{flaggedQuestions[question.id] ? 'Flagged' : 'Flag for Review'}</span>
                                    </button>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-medium leading-relaxed text-white">
                                    {question.text}
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 gap-4 mt-4">
                                {JSON.parse(question.options).map((option, index) => {
                                    const isSelected = answers[question.id] === index;
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleOptionSelect(index)}
                                            className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 flex items-center justify-between group ${isSelected
                                                ? 'bg-accent/10 border-accent text-white shadow-[0_0_20px_-10px_var(--accent)]'
                                                : 'bg-white/5 border-transparent hover:border-white/10 text-secondary hover:text-white'
                                                }`}
                                        >
                                            <span className="flex items-center gap-4">
                                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${isSelected ? 'bg-accent text-white border-accent' : 'bg-white/10 border-white/5 text-secondary'
                                                    }`}>
                                                    {String.fromCharCode(65 + index)}
                                                </span>
                                                <span className="text-lg">{option}</span>
                                            </span>
                                            {isSelected && <CheckCircle className="w-5 h-5 text-accent" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </main>

                {/* Question Palette Sidebar */}
                <aside className="w-full lg:w-80 bg-glass/50 border-l border-white/5 p-6 space-y-6">
                    <div>
                        <h3 className="text-sm font-bold text-secondary uppercase tracking-widest mb-4">Question Palette</h3>
                        <div className="grid grid-cols-5 gap-3">
                            {questions.map((q, idx) => {
                                const isCurrent = idx === currentQuestion;
                                const isAnswered = answers[q.id] !== undefined;
                                const isFlagged = flaggedQuestions[q.id];

                                let statusClass = "bg-white/5 border-white/5 text-secondary";
                                if (isCurrent) statusClass = "bg-accent border-accent text-white ring-2 ring-accent ring-offset-2 ring-offset-[#050505]";
                                else if (isFlagged) statusClass = "bg-orange-500/20 border-orange-500/50 text-orange-400";
                                else if (isAnswered) statusClass = "bg-green-500/20 border-green-500/50 text-green-400";

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentQuestion(idx)}
                                        className={`w-10 h-10 rounded-xl border flex items-center justify-center text-sm font-bold transition-all hover:scale-110 ${statusClass} relative`}
                                    >
                                        {idx + 1}
                                        {isFlagged && !isCurrent && <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-[#111]" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 space-y-3">
                        <h4 className="text-xs font-bold text-secondary uppercase tracking-widest">Legend</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-[10px] text-secondary">
                                <div className="w-3 h-3 rounded bg-accent" /> Current
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-secondary">
                                <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/50" /> Answered
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-secondary">
                                <div className="w-3 h-3 rounded bg-orange-500/20 border border-orange-500/50" /> Flagged
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-secondary">
                                <div className="w-3 h-3 rounded bg-white/5 border border-white/10" /> Unvisited
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Footer Navigation */}
            <footer className="bg-glass border-t border-white/5 p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <button
                        onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestion === 0}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-white"
                    >
                        <ChevronLeft className="w-5 h-5" /> Previous
                    </button>

                    <div className="flex gap-2">
                        {questions.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-colors ${idx === currentQuestion ? 'bg-accent scale-125' :
                                    answers[questions[idx].id] !== undefined ? 'bg-accent/50' : 'bg-white/10'
                                    }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                        disabled={currentQuestion === questions.length - 1}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-white"
                    >
                        Next <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </footer>
        </div >
    );
};

export default TestInterface;
