import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { UserCircle, Mail, Phone, MapPin, Award, BookOpen, Upload, Edit, ExternalLink, GraduationCap, Briefcase } from 'lucide-react';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('personal');

    const user = {
        name: "Alex Morgan",
        role: "Student",
        branch: "Computer Science Engineering",
        year: "4th Year (7th Sem)",
        email: "alex.morgan@example.com",
        phone: "+91 98765 43210",
        location: "Mumbai, India",
        gpa: "8.9 CGPA",
        skills: ["React.js", "Node.js", "Python", "Java", "SQL", "Figma"],
        resume: "alex_morgan_resume.pdf"
    };

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
                            <div className="w-32 h-32 rounded-full p-1 bg-background">
                                <div className="w-full h-full rounded-full bg-gradient-to-tr from-accent to-blue-500 flex items-center justify-center">
                                    <UserCircle className="w-20 h-20 text-white" />
                                </div>
                            </div>

                            <div className="flex-1">
                                <h1 className="text-3xl font-heading font-bold">{user.name}</h1>
                                <p className="text-secondary">{user.role} &bull; {user.branch}</p>
                                <div className="flex items-center gap-4 mt-4">
                                    <span className="flex items-center gap-1 text-sm bg-accent/10 text-accent px-3 py-1 rounded-full border border-accent/20">
                                        <GraduationCap className="w-4 h-4" /> {user.year}
                                    </span>
                                    <span className="flex items-center gap-1 text-sm bg-white/5 text-secondary px-3 py-1 rounded-full border border-white/5">
                                        <Award className="w-4 h-4" /> {user.gpa}
                                    </span>
                                </div>
                            </div>

                            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-sm font-medium">
                                <Edit className="w-4 h-4" /> Edit Profile
                            </button>
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
                                        <Mail className="w-4 h-4" />
                                        <span className="text-sm truncate">{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-secondary hover:text-white transition-colors">
                                        <Phone className="w-4 h-4" />
                                        <span className="text-sm">{user.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-secondary hover:text-white transition-colors">
                                        <MapPin className="w-4 h-4" />
                                        <span className="text-sm">{user.location}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-glass rounded-2xl p-6 border border-white/5">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-accent" /> Resume
                                </h3>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between group cursor-pointer hover:border-accent/30 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-500/20 text-red-400 rounded-lg">
                                            <Upload className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-white group-hover:text-accent transition-colors">My Resume</p>
                                            <p className="text-xs text-secondary">PDF • 2.4 MB</p>
                                        </div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-secondary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Skills & Stats */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-glass rounded-2xl p-6 border border-white/5">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-accent" /> Skills & Expertise
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {user.skills.map((skill, index) => (
                                        <span key={index} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-sm text-secondary hover:text-white hover:border-accent/30 hover:bg-accent/5 transition-all cursor-default">
                                            {skill}
                                        </span>
                                    ))}
                                    <button className="px-4 py-2 border border-dashed border-white/20 rounded-xl text-sm text-secondary hover:text-white hover:border-white/40 transition-all flex items-center gap-2">
                                        + Add Skill
                                    </button>
                                </div>
                            </div>

                            {/* Activity Placeholder */}
                            <div className="bg-glass rounded-2xl p-6 border border-white/5 h-64 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                    <Award className="w-8 h-8 text-secondary" />
                                </div>
                                <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                                <p className="text-secondary text-sm max-w-xs mx-auto mt-2">
                                    Your recent test scores and application updates will appear here.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
