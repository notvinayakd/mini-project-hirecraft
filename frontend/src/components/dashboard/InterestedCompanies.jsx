import React from 'react';
import { Plus } from 'lucide-react';

const InterestedCompanies = () => {
    const companies = [
        { name: "Google", role: "SWE", logo: "G", color: "bg-blue-500/20 text-blue-300" },
        { name: "Microsoft", role: "SDE-1", logo: "M", color: "bg-green-500/20 text-green-300" },
        { name: "Amazon", role: "SDE", logo: "A", color: "bg-yellow-500/20 text-yellow-300" },
        { name: "Uber", role: "Backend", logo: "U", color: "bg-black/40 text-white border border-white/20" },
        { name: "Netflix", role: "Frontend", logo: "N", color: "bg-red-500/20 text-red-300" },
    ];

    return (
        <section className="bg-glass p-6 rounded-2xl border border-white/5">
            <h2 className="text-xl font-heading font-semibold text-white mb-4">Interested Companies</h2>

            <div className="flex flex-wrap gap-4">
                {companies.map((company, idx) => (
                    <div
                        key={idx}
                        className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-accent/30 transition-all cursor-pointer group"
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${company.color}`}>
                            {company.logo}
                        </div>
                        <div>
                            <h4 className="text-sm text-white font-medium group-hover:text-accent transition-colors">{company.name}</h4>
                            <p className="text-[10px] text-secondary uppercase tracking-wider">{company.role}</p>
                        </div>
                    </div>
                ))}

                <button className="flex items-center justify-center w-10 h-10 rounded-full border border-dashed border-white/20 text-secondary hover:text-white hover:border-white/50 transition-colors">
                    <Plus className="w-5 h-5" />
                </button>
            </div>
        </section>
    );
};

export default InterestedCompanies;
