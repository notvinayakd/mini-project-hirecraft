import React from 'react';
import AuthCard from '../components/AuthCard';
import Input from '../components/Input';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const Signup = () => {
    return (
        <div className="flex-grow flex items-center justify-center p-6 relative">
            <AuthCard
                title="Create Account"
                subtitle="Join the future of creation."
            >
                <form className="space-y-6">
                    <Input
                        label="Full Name"
                        type="text"
                        id="name"
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        id="email"
                    />
                    <Input
                        label="Password"
                        type="password"
                        id="password"
                    />

                    <Button variant="primary" className="w-full h-12 mt-4">
                        Get Started
                    </Button>

                    <p className="text-center text-sm text-secondary mt-6">
                        Already have an account? {' '}
                        <Link to="/login" className="text-white hover:text-accent font-medium transition-colors">
                            Sign In
                        </Link>
                    </p>
                </form>
            </AuthCard>
        </div>
    );
};

export default Signup;
