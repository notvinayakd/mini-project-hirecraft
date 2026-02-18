import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const Landing = () => {
    const containerRef = useRef(null);

    // scroll progress for the whole page
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    return (
        <div ref={containerRef} className="relative bg-background w-full">
            <HeroSection />
            <ManifestoSection />
            {/* <HorizontalScrollSection /> */}
            <CallToActionSection />
        </div>
    );
};

const HeroSection = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
    const blur = useTransform(scrollYProgress, [0, 0.5], ["0px", "10px"]);

    return (
        <section ref={ref} className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
            <motion.div
                style={{ y, opacity, scale, filter: blur ? `blur(${blur})` : "none" }}
                className="z-10 text-center px-4 max-w-6xl mx-auto"
            >
                <motion.h1
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="text-7xl md:text-9xl font-bold font-heading tracking-tighter leading-[0.9] mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40"
                >
                    Skill issue? <br /> we got <br /> you
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-xl md:text-2xl text-secondary max-w-xl mx-auto mb-10 font-light"
                >
                    Building you from root to apex
                </motion.p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link to="/signup">
                        <Button variant="primary" className="h-14 px-10 text-lg shadow-[0_0_40px_-10px_rgba(124,124,255,0.4)]">
                            Start learning
                        </Button>
                    </Link>
                </div>
            </motion.div>

            {/* Floating Background Objects */}
            <BackgroundShapes />

            <motion.div
                style={{ opacity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-secondary/50"
            >
                <span className="text-xs uppercase tracking-[0.3em]">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-secondary to-transparent" />
            </motion.div>
        </section>
    );
};

const ManifestoSection = () => {
    return (
        <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
            <div className="space-y-24">
                <ManifestoLine text="We believe in the power in you" align="left" />
                <ManifestoLine text="Code your future with conviction." align="right" />
            </div>
        </section>
    );
};

const ManifestoLine = ({ text, align }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center"]
    });

    const opacity = useTransform(scrollYProgress, [0, 1], [0.1, 1]);
    const x = useTransform(scrollYProgress, [0, 1], [align === 'left' ? -50 : align === 'right' ? 50 : 0, 0]);

    return (
        <motion.div ref={ref} style={{ opacity, x }} className={`text-4xl md:text-7xl font-heading font-bold tracking-tight text-${align === 'center' ? 'center' : align}`}>
            {text}
        </motion.div>
    );
};


const HorizontalScrollSection = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

    // Keep spring ONLY for the progress bar, not the content
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const cards = [
        { title: "Velocity", desc: "Ship faster than thought.", color: "from-blue-500/20 to-purple-500/20" },
        { title: "Precision", desc: "Pixel-perfect by default.", color: "from-emerald-500/20 to-teal-500/20" },
        { title: "Scale", desc: "From one to a billion.", color: "from-orange-500/20 to-red-500/20" },
        { title: "Ascend", desc: "Beyond the horizon.", color: "from-pink-500/20 to-rose-500/20" },
    ];

    return (
        <section className="relative bg-background">
            <div ref={targetRef} className="relative h-[300vh]">
                <div className="sticky top-0 h-screen flex items-center overflow-hidden">
                    <motion.div style={{ x }} className="flex gap-10 px-12 md:px-32">
                        {cards.map((card, i) => (
                            <div key={i} className={`flex-shrink-0 w-[80vw] md:w-[60vw] h-[70vh] rounded-3xl bg-gradient-to-br ${card.color} border border-white/5 flex flex-col justify-end p-10 md:p-20 relative overflow-hidden group`}>
                                <div className="absolute inset-0 bg-noise opacity-10" />
                                <h3 className="text-6xl md:text-9xl font-bold font-heading mb-4 text-white group-hover:scale-105 transition-transform duration-500">{card.title}</h3>
                                <p className="text-2xl md:text-3xl text-white/70 max-w-xl">{card.desc}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* Progress Bar Container */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-white/10">
                        <motion.div
                            style={{ scaleX }}
                            className="h-full bg-white origin-left"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

const CallToActionSection = () => {
    return (
        <section className="h-screen flex items-center justify-center relative overlow-hidden">
            <div className="absolute inset-0 bg-accent/5 blur-[150px]" />
            <div className="z-10 text-center">
                <h2 className="text-5xl md:text-8xl font-bold font-heading mb-10 tracking-tighter">
                    Ready to <span className="text-accent">Ascend?</span>
                </h2>
                <Link to="/statistics">
                    <Button variant="primary" className="h-16 px-12 text-xl rounded-full">
                        View Our Statistics
                    </Button>
                </Link>
            </div>
        </section>
    )
}

const BackgroundShapes = () => (
    <>
        <motion.div
            animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-[10%] left-[10%] w-[30vh] h-[30vh] bg-accent/10 rounded-full blur-[80px] mix-blend-screen pointer-events-none"
        />
        <motion.div
            animate={{
                rotate: -360,
                x: [0, 100, 0],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[20%] right-[10%] w-[40vh] h-[40vh] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none"
        />
    </>
);

export default Landing;
