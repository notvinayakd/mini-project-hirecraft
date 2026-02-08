import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full px-6 py-12 md:px-12 border-t border-white/5 mt-auto z-10 bg-background">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-secondary text-sm">
                    © {new Date().getFullYear()} Brand Inc. All rights reserved.
                </div>
                <div className="flex gap-8">
                    <a href="#" className="text-sm text-secondary hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="text-sm text-secondary hover:text-white transition-colors">Terms</a>
                    <a href="#" className="text-sm text-secondary hover:text-white transition-colors">Twitter</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
