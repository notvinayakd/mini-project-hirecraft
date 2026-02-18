import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
    children,
    variant = 'primary',
    className = '',
    ...props
}) => {
    const baseStyles = "relative inline-flex items-center justify-center px-8 py-3 text-sm font-medium transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-accent text-white hover:bg-accent/90 shadow-[0_0_20px_-5px_rgba(124,124,255,0.5)] border border-accent/20",
        secondary: "bg-white/5 text-primary hover:bg-white/10 border border-white/10 backdrop-blur-sm",
        outline: "bg-transparent border border-white/20 text-primary hover:border-white/40",
        ghost: "bg-transparent text-secondary hover:text-white"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;
