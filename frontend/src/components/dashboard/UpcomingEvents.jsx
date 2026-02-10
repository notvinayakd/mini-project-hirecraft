import React from 'react';
import { Calendar, Building2, ChevronRight } from 'lucide-react';

const UpcomingEvents = () => {
    const events = [
        {
            title: "TCS National Qualifier Test",
            date: "Feb 15, 2026",
            type: "Placement Drive",
            company: "TCS",
            logo: "T"
        },
        {
            title: "Infosys Power Programmer",
            date: "Feb 18, 2026",
            type: "Coding Challenge",
            company: "Infosys",
            logo: "I"
        },
        {
            title: "Accenture Mock Interview",
            date: "Feb 20, 2026",
            type: "Mock Interview",
            company: "Accenture",
            logo: "A"
        }
    ];

    return (
        <section className="bg-glass p-6 rounded-2xl border border-white/5 h-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-semibold text-white">Upcoming Events</h2>
                <button className="text-xs text-accent hover:text-white transition-colors">View All</button>
            </div>

            <div className="space-y-4">
                {events.map((event, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold font-heading text-lg">
                            {event.logo}
                        </div>
                        <div className="flex-1">
                            <h4 className="text-white font-medium text-sm group-hover:text-accent transition-colors">{event.title}</h4>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-secondary flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> {event.date}
                                </span>
                                <span className="text-xs text-secondary flex items-center gap-1">
                                    <Building2 className="w-3 h-3" /> {event.company}
                                </span>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-secondary opacity-0 group-hover:opacity-100 transition-opacity self-center" />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default UpcomingEvents;
