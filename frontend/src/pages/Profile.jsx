import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { UserCircle, Mail, Phone, MapPin, GraduationCap, Award, BookOpen, Edit, Save, X } from 'lucide-react';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/student/profile', {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to load profile');
            const data = await response.json();
            setUser(data);
        } catch (err) {
            console.error("Profile Fetch Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setFormData({
            phone: user?.phone || '',
            location: user?.location || '',
            skills: user?.skills ? user.skills.join(', ') : '',
            about: user?.about || ''
        });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({});
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch('http://localhost:5000/api/student/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    ...formData,
                    skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
                })
            });

            if (!response.ok) throw new Error('Failed to update profile');

            await fetchProfile(); // Reload data
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
        );
    }

    if (error && !user) {
        return (
            <div className="min-h-screen bg-background text-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2 text-red-400">Error Loading Profile</h2>
                    <p className="text-secondary">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-background text-white font-sans selection:bg-accent/20">
            <Sidebar />
            <div className="flex-1 lg:ml-64 p-6 md:p-10 relative">
                {/* Background Ambience */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-[-20%] left-[20%] w-[30%] h-[30%] bg-accent/5 rounded-full blur-[100px] mix-blend-screen" />
                    <div className="absolute bottom-[-20%] right-[10%] w-[25%] h-[25%] bg-blue-500/5 rounded-full blur-[100px] mix-blend-screen" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="bg-glass rounded-2xl p-8 border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-accent/20 to-blue-500/20" />

                        <div className="relative flex flex-col md:flex-row gap-6 items-start md:items-end mt-12">
                            <div className="w-32 h-32 rounded-full p-1 bg-background shrink-0">
                                <div className="w-full h-full rounded-full bg-gradient-to-tr from-accent to-blue-500 flex items-center justify-center">
                                    <UserCircle className="w-20 h-20 text-white" />
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h1 className="text-3xl font-heading font-bold truncate">{user?.name}</h1>
                                <p className="text-secondary">{user?.role} &bull; {user?.branch}</p>
                                <div className="flex flex-wrap items-center gap-4 mt-4">
                                    <span className="flex items-center gap-1 text-sm bg-accent/10 text-accent px-3 py-1 rounded-full border border-accent/20">
                                        <GraduationCap className="w-4 h-4" /> {user?.year}
                                    </span>
                                    <span className="flex items-center gap-1 text-sm bg-white/5 text-secondary px-3 py-1 rounded-full border border-white/5">
                                        <Award className="w-4 h-4" /> {user?.gpa}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/80 rounded-xl transition-colors text-sm font-medium text-white disabled:opacity-50"
                                        >
                                            <Save className="w-4 h-4" />
                                            {saving ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            disabled={saving}
                                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-sm font-medium"
                                        >
                                            <X className="w-4 h-4" /> Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleEdit}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-sm font-medium"
                                    >
                                        <Edit className="w-4 h-4" /> Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column: Personal Info */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-glass rounded-2xl p-6 border border-white/5">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <UserCircle className="w-5 h-5 text-accent" /> Personal Details
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-secondary hover:text-white transition-colors">
                                        <Mail className="w-4 h-4 shrink-0" />
                                        <span className="text-sm truncate">{user?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-secondary">
                                        <Phone className="w-4 h-4 shrink-0" />
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white focus:border-accent outline-none w-full"
                                                placeholder="Phone Number"
                                            />
                                        ) : (
                                            <span className="text-sm">{user?.phone || 'No phone added'}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-secondary">
                                        <MapPin className="w-4 h-4 shrink-0" />
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white focus:border-accent outline-none w-full"
                                                placeholder="Location"
                                            />
                                        ) : (
                                            <span className="text-sm">{user?.location || 'No location added'}</span>
                                        )}
                                    </div>
                                </div>
                            </div>


                        </div>

                        {/* Right Column: Skills & Stats */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* About Section */}
                            <div className="bg-glass rounded-2xl p-6 border border-white/5">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <UserCircle className="w-5 h-5 text-accent" /> About Me
                                </h3>
                                {isEditing ? (
                                    <textarea
                                        value={formData.about}
                                        onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-accent outline-none h-24 resize-none"
                                        placeholder="Tell us about yourself..."
                                    />
                                ) : (
                                    <p className="text-secondary text-sm leading-relaxed">
                                        {user?.about || 'No bio added yet.'}
                                    </p>
                                )}
                            </div>

                            {/* Skills Section */}
                            <div className="bg-glass rounded-2xl p-6 border border-white/5">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-accent" /> Skills & Expertise
                                </h3>
                                {isEditing ? (
                                    <div>
                                        <p className="text-xs text-secondary mb-2">Separate skills with commas (e.g. React, Python, SQL)</p>
                                        <textarea
                                            value={formData.skills}
                                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-accent outline-none h-32 resize-none"
                                            placeholder="React, Node.js, Python..."
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {user?.skills?.length > 0 ? (
                                            user.skills.map((skill, index) => (
                                                <span key={index} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-sm text-secondary hover:text-white hover:border-accent/30 hover:bg-accent/5 transition-all cursor-default">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-secondary text-sm italic">No skills added yet.</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
