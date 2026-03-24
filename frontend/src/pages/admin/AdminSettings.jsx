import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Mail, User, Lock, Shield } from 'lucide-react';

const AdminSettings = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/admins', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setAdmins(data);
            }
        } catch (error) {
            console.error("Error fetching admins:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/admin/admins', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Admin added successfully!');
                setFormData({ name: '', email: '', password: '' });
                fetchAdmins();
            } else {
                setMessage(data.error || 'Failed to add admin');
            }
        } catch (error) {
            setMessage('An error occurred');
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-heading font-bold text-white">Settings</h1>
                <p className="text-gray-400 mt-1">Manage system access and administrators.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Add New Admin Form */}
                <div className="bg-[#0f172a]/50 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                            <UserPlus className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Add New Administrator</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {message && <p className={`text-sm ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>{message}</p>}

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:border-orange-500/50"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:border-orange-500/50"
                                    placeholder="admin@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:border-orange-500/50"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold hover:shadow-lg hover:shadow-orange-500/20 transition-all mt-2"
                        >
                            Create Admin Account
                        </button>
                    </form>
                </div>

                {/* List of Admins */}
                <div className="bg-[#0f172a]/50 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                            <Shield className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Current Administrators</h2>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <p className="text-gray-400 text-center">Loading...</p>
                        ) : admins.length === 0 ? (
                            <p className="text-gray-400 text-center">No admins found.</p>
                        ) : (
                            admins.map((admin) => (
                                <div key={admin.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold border border-white/10">
                                            {admin.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{admin.name}</p>
                                            <p className="text-xs text-gray-400">{admin.email}</p>
                                        </div>
                                    </div>
                                    {/* <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button> */}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
