import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

const MockTestProgress = ({ recentAttempts = [] }) => {
    return (
        <section className="bg-glass p-6 rounded-2xl border border-white/5">
            <h2 className="text-xl font-heading font-semibold text-white mb-6">Recent Mock Tests</h2>

            <div className="space-y-6">
                {recentAttempts.length > 0 ? (
                    recentAttempts.map((attempt) => (
                        <div key={attempt.id} className="flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-full ${attempt.status === 'Completed' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                                    }`}>
                                    {attempt.status === 'Completed' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h4 className="text-white font-medium">{attempt.testName}</h4>
                                    <p className="text-xs text-secondary">{attempt.status === 'Completed' ? `Completed on ${attempt.date}` : 'In Progress'}</p>
                                </div>
                            </div>
                            {attempt.status === 'Completed' ? (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                    Score: {attempt.score}%
                                </span>
                            ) : (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                    Resuming...
                                </span>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-6">
                        <p className="text-secondary text-sm">No tests attempted yet.</p>
                        <p className="text-xs text-secondary/50 mt-1">Start a mock test to track your progress.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default MockTestProgress;
