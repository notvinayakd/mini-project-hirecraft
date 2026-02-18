import React from 'react';
import { Book, Code2, Terminal, UserCheck, ArrowRight } from 'lucide-react';

const PreparationMaterials = ({ materialCounts = [] }) => {
    // Map subjects to icons (simple logic for now)
    const getIcon = (title) => {
        if (title.includes('Code') || title.includes('Coding')) return Code2;
        if (title.includes('Technical') || title.includes('DSA')) return Terminal;
        if (title.includes('Interview')) return UserCheck;
        return Book;
    };

    const getColor = (idx) => {
        const colors = ["text-blue-400", "text-emerald-400", "text-purple-400", "text-orange-400"];
        return colors[idx % colors.length];
    };

    return (
        <section className="bg-glass p-6 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-semibold text-white">Preparation Materials</h2>
                <button className="text-xs text-secondary hover:text-white flex items-center gap-1 transition-colors group">
                    View All <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {materialCounts.length > 0 ? (
                    materialCounts.map((item, idx) => {
                        const Icon = getIcon(item.title);
                        return (
                            <div
                                key={idx}
                                className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer group flex flex-col items-center text-center gap-3"
                            >
                                <div className={`p-3 rounded-full bg-white/5 ${getColor(idx)} group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium text-sm">{item.title}</h4>
                                    <p className="text-xs text-secondary mt-1">{item.count}</p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-4 text-center py-4">
                        <p className="text-secondary text-sm">No materials available.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PreparationMaterials;
