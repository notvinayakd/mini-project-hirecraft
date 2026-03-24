import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/me', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                if (data.authenticated) {
                    setUser(data.user);
                }
            } else if (response.status === 401) {
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = (userData) => {
        setUser(userData);
        if (userData.role === 'admin') {
            navigate('/admin/dashboard');
        } else {
            navigate('/dashboard');
        }
    };

    const logout = async () => {
        try {
            await fetch('http://localhost:5000/api/auth/logout', { method: 'POST', credentials: 'include' });
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
