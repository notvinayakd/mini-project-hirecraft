import React from 'react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import StatsCard from './StatsCard';
import { Trophy, Activity, FileText } from 'lucide-react';

const PerformanceSection = ({ stats, graphData }) => {
    // Fallback data to prevent crashes if data is missing
    const pieData = graphData?.pie || [];
    const barData = graphData?.bar || [];

    // Check if we have data to show empty states or graphs
    const hasPieData = pieData.length > 0;
    const hasBarData = barData.length > 0;

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
                    value={stats?.testsAttended || 0}
                    subtext="Total attempts"
                    icon={FileText}
                    delay={0.1}
                />
                <StatsCard
                    title="Average Score"
                    value={`${stats?.averageScore || 0}%`}
                    subtext="Across all tests"
                    icon={Activity}
                    delay={0.2}
                />
                <StatsCard
                    title="Best Score"
                    value={`${stats?.bestScore || 0}%`}
                    subtext="Your personal best"
                    icon={Trophy}
                    delay={0.3}
                />
            </div>

            {/* Graphs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Subject Performance */}
                <div className="p-6 rounded-2xl bg-glass border border-white/5">
                    <h3 className="text-lg font-medium text-white mb-6">Subject Performance</h3>
                    <div className="h-64 w-full flex items-center justify-center">
                        {hasPieData ? (
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
                        ) : (
                            <p className="text-secondary text-sm">No performance data available yet.</p>
                        )}
                    </div>
                </div>

                {/* Score Trend */}
                <div className="p-6 rounded-2xl bg-glass border border-white/5">
                    <h3 className="text-lg font-medium text-white mb-6">Score Trend</h3>
                    <div className="h-64 w-full flex items-center justify-center">
                        {hasBarData ? (
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
                        ) : (
                            <p className="text-secondary text-sm">Attempt tests to see your progress trend.</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};


export default PerformanceSection;
