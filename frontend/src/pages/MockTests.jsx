import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, HelpCircle, Trophy, ChevronRight, BookOpen, Code, Brain } from 'lucide-react';

const MockTests = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Aptitude', 'Technical', 'Verbal', 'Coding'];

    const tests = [
        {
            id: 1,
            title: "General Aptitude - Set A",
            category: "Aptitude",
            questions: 30,
            duration: "45 mins",
            difficulty: "Medium",
            attempts: 1250,
            icon: Brain,
            color: "bg-purple-500/20 text-purple-300"
        },
        {
            id: 2,
            title: "Java Core Concepts",
            category: "Technical",
            questions: 50,
            duration: "60 mins",
            difficulty: "Hard",
            attempts: 850,
            icon: Code,
            color: "bg-blue-500/20 text-blue-300"
        },
        {
            id: 3,
            title: "Verbal Ability Practice",
            category: "Verbal",
            questions: 25,
            duration: "30 mins",
            difficulty: "Easy",
            attempts: 2100,
            icon: BookOpen,
            color: "bg-green-500/20 text-green-300"
        },
        {
            id: 4,
            title: "Python Data Structures",
            category: "Coding",
            questions: 15,
            duration: "90 mins",
            difficulty: "Hard",
            attempts: 620,
            icon: Code,
            color: "bg-yellow-500/20 text-yellow-300"
        },
        {
            id: 5,
            title: "Logical Reasoning",
            category: "Aptitude",
            questions: 40,
            duration: "50 mins",
            difficulty: "Medium",
            attempts: 1500,
            icon: Brain,
            color: "bg-pink-500/20 text-pink-300"
        },
        {
            id: 6,
            title: "React JS Fundamentals",
            category: "Technical",
            questions: 30,
            duration: "45 mins",
            difficulty: "Medium",
            attempts: 900,
            icon: Code,
            color: "bg-cyan-500/20 text-cyan-300"
        }
    ];

    const filteredTests = selectedCategory === 'All'
        ? tests
        : tests.filter(test => test.category === selectedCategory);

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

                    {/* Tests Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredTests.map((test) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={test.id}
                                className="group bg-glass rounded-2xl p-6 border border-white/5 hover:border-accent/20 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-12 h-12 rounded-xl ${test.color} flex items-center justify-center`}>
                                        <test.icon className="w-6 h-6" />
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
                                        {test.attempts}+ Students Attempted
                                    </div>
                                </div>

                                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-white font-medium group-hover:bg-accent hover:text-white transition-all duration-300">
                                    Start Test
                                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MockTests;
