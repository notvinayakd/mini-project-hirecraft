import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

const MockTestProgress = () => {
    return (
        <section className="bg-glass p-6 rounded-2xl border border-white/5">
            <h2 className="text-xl font-heading font-semibold text-white mb-6">Mock Test Progress</h2>

            <div className="space-y-6">
                {/* Progress Item */}
                <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-green-500/10 text-green-400">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-white font-medium">Full Stack Development - Mock 1</h4>
                            <p className="text-xs text-secondary">Completed on Feb 10, 2026</p>
                        </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                        Score: 85/100
                    </span>
                </div>

                {/* Progress Item */}
                <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-yellow-500/10 text-yellow-400">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-white font-medium">Data Structures - Mock 2</h4>
                            <p className="text-xs text-secondary">In Progress • 45 mins remaining</p>
                        </div>
                    </div>
                    <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 w-[60%]" />
                    </div>
                </div>

                {/* Progress Item */}
                <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-secondary/10 text-secondary">
                            <Circle className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-white font-medium">Aptitude Test - Level 3</h4>
                            <p className="text-xs text-secondary">Unlock in 2 days</p>
                        </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
                        Pending
                    </span>
                </div>
            </div>
        </section>
    );
};

export default MockTestProgress;
