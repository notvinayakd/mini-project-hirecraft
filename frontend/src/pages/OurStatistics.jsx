import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const OurStatistics = () => {
    return (
        <div className="min-h-screen bg-background text-white pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
                <HeaderSection />
                <KeyMetricsSection />
                <PlacedStudentsSection />
                <VisitingCompaniesSection />
                <FooterSection />
            </div>
        </div>
    );
};

const HeaderSection = () => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
    >
        <h1 className="text-5xl md:text-7xl font-bold font-heading tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
            Our Statistics
        </h1>
        <p className="text-xl text-secondary max-w-2xl mx-auto">
            Empowering the next generation of engineers at College of Engineering Chengannur.
            Witness our journey from campus to corporate.
        </p>
    </motion.div>
);

const KeyMetricsSection = () => {
    const metrics = [
        { label: "Total Offers", value: "450+", color: "text-blue-400" },
        { label: "Highest Package", value: "32 LPA", color: "text-purple-400" },
        { label: "Average Package", value: "8.5 LPA", color: "text-emerald-400" },
        { label: "Companies Visited", value: "120+", color: "text-orange-400" },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
            {metrics.map((metric, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center hover:bg-white/10 transition-colors"
                >
                    <h3 className={`text-4xl md:text-5xl font-bold font-heading mb-2 ${metric.color}`}>
                        {metric.value}
                    </h3>
                    <p className="text-secondary uppercase tracking-wider text-sm">{metric.label}</p>
                </motion.div>
            ))}
        </div>
    );
};

const PlacedStudentsSection = () => {
    const students = [
        { name: "Aditya Kumar", branch: "CSE", company: "Google", package: "32 LPA", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya" },
        { name: "Sarah John", branch: "ECE", company: "Microsoft", package: "28 LPA", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
        { name: "Rahul V", branch: "CSE", company: "Amazon", package: "25 LPA", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul" },
        { name: "Anjali P", branch: "EEE", company: "Texas Instruments", package: "22 LPA", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali" },
        { name: "Karthik R", branch: "ME", company: "L&T", package: "12 LPA", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karthik" },
        { name: "Sneha M", branch: "CS", company: "Oracle", package: "18 LPA", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha" },
        { name: "David T", branch: "EC", company: "Qualcomm", package: "20 LPA", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David" },
        { name: "Priya S", branch: "CSE", company: "Salesforce", package: "24 LPA", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" },
    ];

    return (
        <section className="mb-24">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-10 text-center">Top Placements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {students.map((student, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05, duration: 0.5 }}
                        className="p-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 flex flex-col items-center text-center hover:border-accent/50 transition-colors group"
                    >
                        <div className="w-20 h-20 mb-4 rounded-full overflow-hidden bg-white/10 ring-2 ring-white/20 group-hover:ring-accent transition-all">
                            <img src={student.image} alt={student.name} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{student.name}</h3>
                        <p className="text-sm text-secondary mb-3">{student.branch}</p>
                        <div className="mt-auto w-full pt-4 border-t border-white/10">
                            <p className="text-lg font-semibold text-accent">{student.company}</p>
                            <p className="text-sm text-white/60">{student.package}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

const VisitingCompaniesSection = () => {
    const companies = [
        "Google", "Microsoft", "Amazon", "Oracle", "IBM",
        "Infosys", "TCS", "Wipro", "Cognizant", "Accenture",
        "Zoho", "KeyValue", "Envestnet", "SOTI", "Experion"
    ];

    return (
        <section className="mb-24">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-10 text-center">Our Recruiters</h2>
            <div className="flex flex-wrap justify-center gap-4">
                {companies.map((company, index) => (
                    <span
                        key={index}
                        className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-default"
                    >
                        {company}
                    </span>
                ))}
            </div>
        </section>
    );
};

const FooterSection = () => (
    <div className="text-center mt-20 border-t border-white/10 pt-10">
        <h2 className="text-2xl font-bold font-heading mb-6">Ready to start your journey?</h2>
        <Link to="/signup">
            <Button variant="primary" className="h-12 px-8">
                Join HireCraft
            </Button>
        </Link>
    </div>
);

export default OurStatistics;
