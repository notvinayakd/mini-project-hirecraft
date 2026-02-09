import React from 'react';
import AuthCard from '../components/AuthCard';
import Input from '../components/Input';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div className="flex-grow flex items-center justify-center p-6 relative">
            <AuthCard
                title="Welcome Back"
                subtitle="Sign in to continue your journey."
            >
                <form className="space-y-6">
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

                    <div className="flex justify-end">
                        <a href="#" className="text-xs text-secondary hover:text-white transition-colors">Forgot Password?</a>
                    </div>

                    <Button variant="primary" className="w-full h-12">
                        Sign In
                    </Button>

                    <p className="text-center text-sm text-secondary mt-6">
                        Don't have an account? {' '}
                        <Link to="/signup" className="text-white hover:text-accent font-medium transition-colors">
                            Sign Up
                        </Link>
                    </p>
                </form>
            </AuthCard>
        </div>
    );
};

export default Login;
