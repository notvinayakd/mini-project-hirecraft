import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, subtext, icon: Icon, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="group relative bg-glass p-6 rounded-2xl border border-white/5 hover:border-accent/20 transition-colors overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <h3 className="text-secondary text-sm font-medium mb-1">{title}</h3>
                    <div className="text-2xl font-bold text-white font-heading">{value}</div>
                    {subtext && <p className="text-xs text-secondary/70 mt-1">{subtext}</p>}
                </div>
                {Icon && (
                    <div className="p-2 rounded-lg bg-white/5 text-accent group-hover:bg-accent/10 transition-colors">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default StatsCard;
