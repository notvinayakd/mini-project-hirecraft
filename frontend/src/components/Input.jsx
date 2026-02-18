import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Input = ({ label, type = "text", id, error, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const handleBlur = (e) => {
        setIsFocused(false);
        setHasValue(e.target.value.length > 0);
        if (props.onBlur) props.onBlur(e);
    };

    return (
        <div className="relative pt-8">
            <motion.label
                htmlFor={id}
                initial={false}
                animate={{
                    y: isFocused || hasValue ? -32 : 0,
                    scale: isFocused || hasValue ? 0.85 : 1,
                    color: isFocused ? '#7C7CFF' : '#A1A1AA'
                }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 top-10 text-secondary origin-left cursor-text pointer-events-none"
            >
                {label}
            </motion.label>
            <input
                type={type}
                id={id}
                className={`
          w-full bg-transparent border-b-2 py-2 text-primary outline-none transition-all duration-300
          ${error ? 'border-red-500' : isFocused ? 'border-accent shadow-[0_10px_20px_-10px_rgba(124,124,255,0.2)]' : 'border-white/10 hover:border-white/30'}
        `}
                onFocus={() => setIsFocused(true)}
                onBlur={handleBlur}
                onChange={(e) => setHasValue(e.target.value.length > 0)}
                {...props}
            />
            {error && (
                <span className="absolute -bottom-5 left-0 text-xs text-red-500">
                    {error}
                </span>
            )}
        </div>
    );
};

export default Input;
