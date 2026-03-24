import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Building2, ChevronRight } from 'lucide-react';

const UpcomingEvents = ({ events = [] }) => {
    return (
        <section className="bg-glass p-6 rounded-2xl border border-white/5 h-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-semibold text-white">Upcoming Events and Drives</h2>
                <Link to="/drives" className="text-xs text-accent hover:text-white transition-colors">View All</Link>
            </div>

            <div className="space-y-4">
                {events.length > 0 ? (
                    events.map((event, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold font-heading text-lg">
                                {event.logo || event.company?.[0] || 'C'}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-white font-medium text-sm group-hover:text-accent transition-colors">{event.role} at {event.company}</h4>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-xs text-secondary flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> {event.date}
                                    </span>
                                    <span className="text-xs text-secondary flex items-center gap-1">
                                        <Building2 className="w-3 h-3" /> {event.type}
                                    </span>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-secondary opacity-0 group-hover:opacity-100 transition-opacity self-center" />
                        </div>
                    ))
                ) : (
                    <div className="text-center py-6">
                        <p className="text-secondary text-sm">No upcoming events.</p>
                        <Link to="/drives" className="text-xs text-accent mt-2 inline-block hover:underline">Browse Drives</Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default UpcomingEvents;
