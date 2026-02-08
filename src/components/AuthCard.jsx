import React from 'react';
import { motion } from 'framer-motion';

const AuthCard = ({ children, title, subtitle }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md p-10 glass-panel rounded-2xl relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />

            <div className="mb-10 text-center">
                <h2 className="text-3xl font-heading font-bold text-primary mb-3 tracking-tight">{title}</h2>
                {subtitle && <p className="text-secondary text-sm">{subtitle}</p>}
            </div>

            {children}
        </motion.div>
    );
};

export default AuthCard;
