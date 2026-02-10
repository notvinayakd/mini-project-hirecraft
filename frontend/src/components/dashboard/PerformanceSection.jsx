import React from 'react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import StatsCard from './StatsCard';
import { Target, Trophy, FileBarChart, Activity } from 'lucide-react';

const PerformanceSection = () => {
    const pieData = [
        { name: 'Aptitude', value: 400 },
        { name: 'Technical', value: 300 },
        { name: 'Verbal', value: 300 },
        { name: 'Coding', value: 200 },
    ];

    const barData = [
        { name: 'Test 1', score: 65 },
        { name: 'Test 2', score: 59 },
        { name: 'Test 3', score: 80 },
        { name: 'Test 4', score: 81 },
        { name: 'Test 5', score: 90 },
    ];

    const COLORS = ['#7C7CFF', '#A1A1AA', '#EDEDED', '#6366f1'];

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-heading font-semibold text-white">Performance Summary</h2>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Tests Attended"
                    value="12"
                    subtext="+2 this week"
                    icon={FileText}
                    delay={0.1}
                />
                <StatsCard
                    title="Average Score"
                    value="78%"
                    subtext="Top 15% of students"
                    icon={Activity}
                    delay={0.2}
                />
                <StatsCard
                    title="Best Score"
                    value="92%"
                    subtext="In Technical Mock #3"
                    icon={Trophy}
                    delay={0.3}
                />
                <StatsCard
                    title="Current Rank"
                    value="#42"
                    subtext="Out of 120 students"
                    icon={Target}
                    delay={0.4}
                />
            </div>

            {/* Graphs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Subject Performance */}
                <div className="p-6 rounded-2xl bg-glass border border-white/5">
                    <h3 className="text-lg font-medium text-white mb-6">Subject Performance</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0B0D10', borderColor: '#333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Score Trend */}
                <div className="p-6 rounded-2xl bg-glass border border-white/5">
                    <h3 className="text-lg font-medium text-white mb-6">Score Trend</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#A1A1AA"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#A1A1AA"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#0B0D10', borderColor: '#333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="score" fill="#7C7CFF" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Quick fix for missing import
import { FileText } from 'lucide-react';

export default PerformanceSection;
