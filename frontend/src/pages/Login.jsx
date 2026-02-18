import React, { useState } from 'react';
import AuthCard from '../components/AuthCard';
import Input from '../components/Input';
import Button from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Login successful
                console.log('Login successful:', data);
                // You might want to store the user data or token here
                // localStorage.setItem('user', JSON.stringify(data.user)); // Example
                navigate('/dashboard');
            } else {
                // Login failed
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center p-6 relative">
            <AuthCard
                title="Welcome Back"
                subtitle="Sign in to continue your journey."
            >
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <Input
                        label="Email Address"
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <div className="flex justify-end">
                        <a href="#" className="text-xs text-secondary hover:text-white transition-colors">Forgot Password?</a>
                    </div>

                    <Button variant="primary" className="w-full h-12" type="submit">
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
