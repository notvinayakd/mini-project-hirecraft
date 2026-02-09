import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const Header = () => {
    return (
        <header className="fixed top-0 left-0 w-full z-50 px-6 py-6 md:px-12 flex justify-between items-center backdrop-blur-sm bg-background/50 border-b border-white/5">
            <Link to="/" className="text-xl font-heading font-bold tracking-tighter text-white z-50">
                brand.
            </Link>

            <nav className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-sm text-secondary hover:text-white transition-colors">features</a>
                <a href="#about" className="text-sm text-secondary hover:text-white transition-colors">about</a>
            </nav>

            <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-white hover:text-accent transition-colors">
                    Login
                </Link>
                <Link to="/signup">
                    <Button variant="primary" className="px-5 py-2 text-xs">Sign Up</Button>
                </Link>
            </div>
        </header>
    );
};

export default Header;
