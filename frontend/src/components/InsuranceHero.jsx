import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
    Shield,
    Play,
    Star,
    Car,
    Home,
    Users,
    Sparkles,
    CheckCircle2,
    Globe2,
    HeartHandshake,
    ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Continuous floating element animations
const floatingAnimation = {
    animate: {
        y: [0, -10, 0],
    },
    transition: {
        duration: 5,
        ease: "easeInOut",
    },
};

// Global scroll reveal config
const fadeUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.8, ease: [0.215, 0.61, 0.355, 1] },
};

const InsuranceHero = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

    const navigate = useNavigate()

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-zinc-50 text-zinc-900 selection:bg-violet-500 selection:text-white">
            {/* Top Scroll Progress Bar */}
            <motion.div
                style={{ scaleX }}
                className="fixed left-0 right-0 top-0 z-[999] h-1 origin-left bg-gradient-to-r from-violet-600 to-indigo-600"
            />

            {/* Modern Blurred Ambient Background Circles */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
                <motion.div
                    animate={{ x: [0, 40, 0], y: [0, -60, 0] }}
                    transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-[-10%] top-10 h-[500px] w-[500px] rounded-full bg-violet-400/20 blur-[140px]"
                />
                <motion.div
                    animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
                    transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-1/4 right-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-300/25 blur-[160px]"
                />
                <motion.div
                    animate={{ x: [0, 30, 0], y: [0, 40, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-1/3 top-1/2 h-[400px] w-[400px] rounded-full bg-yellow-200/15 blur-[120px]"
                />
            </div>

            {/* Navbar */}
            <nav className="sticky top-4 z-50 mx-auto max-w-7xl px-4 sm:px-6">
                <div className="mt-4 flex items-center justify-between rounded-full border border-white/80 bg-white/60 px-5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-xl sm:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white shadow-md">
                            <Shield size={18} />
                        </div>
                        <h2 className="text-xl font-black sm:text-2xl tracking-tight">
                            INSURE<span className="text-violet-600">X</span>
                        </h2>
                    </div>

                    <div className="hidden items-center gap-8 text-sm font-semibold text-zinc-600 md:flex">
                        {["Coverage", "Plans", "Claims", "Partners"].map((link) => (
                            <a key={link} href="#" className="relative transition hover:text-violet-600 group">
                                {link}
                                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-violet-600 transition-all group-hover:w-full" />
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <button className="rounded-full border cursor-pointer border-zinc-200 bg-white/50 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100" onClick={() => navigate("/login")}>
                            Login
                        </button>
                        <button className="rounded-full bg-zinc-900 cursor-pointer px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:scale-105 hover:bg-zinc-800" onClick={() => navigate("/register")}>
                            Sign Up
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Content Section */}
            <section className="relative z-20 mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:pt-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8 flex justify-center"
                >
                    <div className="flex items-center gap-2 rounded-full border border-zinc-200/60 bg-white px-5 py-2 shadow-sm">
                        <Sparkles className="animate-pulse text-yellow-500" size={16} />
                        <span className="text-sm font-semibold text-zinc-700">
                            Protection For Everyone
                        </span>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center text-[48px] font-black leading-[0.95] tracking-tight sm:text-[72px] md:text-[110px] lg:text-[140px] bg-gradient-to-r from-zinc-900 via-zinc-800 to-indigo-600 bg-clip-text text-transparent"
                >
                    Insurance For
                    <br />
                    Everything
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="mx-auto mt-8 max-w-2xl text-center text-base text-zinc-600 sm:text-xl leading-relaxed"
                >
                    Protect your home, car, family, and future with smart insurance
                    solutions powered by modern technology.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative w-full sm:w-auto overflow-hidden rounded-full bg-zinc-900 px-8 py-4 font-bold text-white shadow-xl"
                    >
                        <span className="relative z-10 cursor-pointer" onClick={() => navigate("/login")}>Get Started</span>
                        <motion.div
                            initial={{ x: "-120%" }}
                            whileHover={{ x: "120%" }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0 z-0 skew-x-12 bg-white/20"
                        />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-8 py-4 font-bold text-zinc-800 shadow-md transition hover:bg-zinc-50"
                    >
                        <Play size={18} className="fill-zinc-800" />
                        Watch Demo
                    </motion.button>
                </motion.div>

                {/* Feature Cards Grid */}
                <div className="mt-24 grid gap-8 lg:grid-cols-3">
                    {/* Card 1: Rating */}
                    <motion.div
                        {...fadeUp}
                        {...floatingAnimation}
                        whileHover={{ y: -8, scale: 1.02, rotate: -0.5 }}
                        className="rounded-[32px] border border-zinc-100 bg-white p-8 shadow-xl transition-shadow hover:shadow-2xl"
                    >
                        <Star className="fill-yellow-500 text-yellow-500" size={40} />
                        <h2 className="mt-6 text-5xl font-black sm:text-6xl tracking-tight">4.9</h2>
                        <p className="text-lg font-medium text-zinc-500">Customer Rating</p>

                        <div className="mt-10 flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <img
                                    key={i}
                                    src={`https://i.pravatar.cc/150?img=${i + 10}`}
                                    alt={`Customer ${i}`}
                                    className="h-12 w-12 rounded-full border-4 border-white object-cover shadow-sm"
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* Card 2: Claims (Premium Gradient) */}
                    <motion.div
                        {...fadeUp}
                        {...floatingAnimation}
                        whileHover={{ y: -4, scale: 1.02, rotate: 0.5 }}
                        className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-violet-600 to-indigo-700 p-8 text-white shadow-2xl"
                    >
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <div className="absolute left-10 top-10 h-[300px] w-[300px] rounded-full border border-white" />
                            <div className="absolute -left-20 -top-10 h-[400px] w-[400px] rounded-full border border-white" />
                        </div>

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <h2 className="text-6xl font-black sm:text-7xl tracking-tight">87%</h2>
                                <p className="mt-2 text-lg font-medium text-violet-100">Claims Approved Fast</p>
                            </div>
                            <div className="mt-12 flex justify-between items-center opacity-90">
                                <Users size={28} />
                                <Shield size={28} />
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 3: Vehicle Saving */}
                    <motion.div
                        {...fadeUp}
                        {...floatingAnimation}
                        whileHover={{ y: -8, scale: 1.02, rotate: 0.5 }}
                        className="rounded-[32px] border border-zinc-100 bg-white p-8 shadow-xl transition-shadow hover:shadow-2xl"
                    >
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-100/80">
                            <Car size={32} className="text-yellow-600" />
                        </div>

                        <p className="mt-8 font-bold text-violet-600 uppercase tracking-wider text-xs">Special Promotion</p>
                        <h2 className="mt-1 text-3xl font-extrabold sm:text-4xl tracking-tight">
                            Save up to <span className="text-violet-600">30%</span>
                        </h2>
                        <p className="mt-2 text-zinc-500 font-medium">On Vehicle Insurance policies this month.</p>

                        <button className="mt-8 flex items-center gap-2 border-b-2 border-zinc-900 pb-1 font-bold text-sm transition hover:text-violet-600 hover:border-violet-600 group">
                            Learn More <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                        </button>
                    </motion.div>
                </div>

                {/* Bottom Wide Cards Section */}
                <div className="mt-8 grid gap-8 lg:grid-cols-2">
                    {/* Global Presence */}
                    <motion.div
                        {...fadeUp}
                        whileHover={{ scale: 1.01 }}
                        className="rounded-[32px] bg-yellow-400 p-10 shadow-xl text-zinc-950 flex flex-col justify-between"
                    >
                        <div>
                            <h2 className="text-5xl font-black sm:text-6xl tracking-tight">530+</h2>
                            <p className="mt-4 text-xl font-bold sm:text-2xl max-w-xs leading-snug">
                                Offices & Hubs Operating Around The Globe
                            </p>
                        </div>
                        <button className="mt-10 self-start border-b-2 border-zinc-950 pb-1 font-bold transition hover:text-zinc-700">
                            Find Your Local City
                        </button>
                    </motion.div>

                    {/* Fixed Home Insurance Card (Enhanced design parity) */}
                    <motion.div
                        {...fadeUp}
                        whileHover={{ scale: 1.01 }}
                        className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 p-10 text-white shadow-2xl"
                    >
                        {/* Structural abstract background shapes */}
                        <div className="absolute right-0 bottom-0 top-0 left-1/2 opacity-5 pointer-events-none">
                            <div className="w-full h-full border-l border-t border-white rounded-tl-[120px]" />
                        </div>

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-md">
                                    <Home size={28} />
                                </div>
                                <h2 className="mt-6 text-3xl font-extrabold sm:text-4xl tracking-tight">
                                    Home Insurance
                                </h2>
                                <p className="mt-3 max-w-sm text-zinc-400 leading-relaxed">
                                    Secure your properties and valuables with modern, hyper-customized digital asset protection and rapid payout solutions.
                                </p>
                            </div>

                            <div className="mt-10">
                                <button className="rounded-full bg-white px-6 py-3 text-sm font-bold text-zinc-950 shadow-md transition hover:scale-105 hover:bg-zinc-100">
                                    Explore Plans
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
                <motion.h2
                    {...fadeUp}
                    className="mb-12 text-center text-xs font-bold uppercase tracking-[0.3em] text-zinc-400"
                >
                    Trusted by tech leaders globally
                </motion.h2>

                <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
                    {["Google", "Microsoft", "Amazon", "Netflix", "Adobe", "Spotify"].map(
                        (item, index) => (
                            <motion.div
                                key={item}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05, duration: 0.5 }}
                                whileHover={{ y: -4, scale: 1.03 }}
                                className="rounded-2xl border border-zinc-200/50 bg-white px-6 py-4 text-base font-extrabold shadow-sm text-zinc-700 sm:px-8"
                            >
                                {item}
                            </motion.div>
                        )
                    )}
                </div>
            </section>

            {/* Dynamic Stats Grid */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        ["25K+", "Happy Customers"],
                        ["530+", "Global Offices"],
                        ["87%", "Claims Approved"],
                        ["4.9", "Top Rating Star"],
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            whileHover={{ scale: 1.03, y: -4 }}
                            className="rounded-3xl border border-zinc-100 bg-white p-8 text-center shadow-md"
                        >
                            <h2 className="text-4xl font-black text-violet-600 sm:text-5xl tracking-tight">
                                {item[0]}
                            </h2>
                            <p className="mt-2 text-sm font-semibold text-zinc-500 uppercase tracking-wider">{item[1]}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Core Micro-Features */}
            <section className="mx-auto mt-32 max-w-7xl px-4 sm:px-6">
                <div className="grid gap-8 md:grid-cols-3">
                    {[
                        {
                            icon: <CheckCircle2 className="text-violet-600" size={28} />,
                            title: "Fast Claim Process",
                            desc: "Submit and track claims seamlessly with an instant-approval engine dashboard.",
                        },
                        {
                            icon: <Globe2 className="text-violet-600" size={28} />,
                            title: "Global Support",
                            desc: "Access localized real-time dynamic customer support in over 40 languages around the clock.",
                        },
                        {
                            icon: <HeartHandshake className="text-violet-600" size={28} />,
                            title: "Trusted Protection",
                            desc: "Built with high-end asset security structures prioritizing modern family ecosystems.",
                        },
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            whileHover={{ y: -6 }}
                            className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
                        >
                            <div className="mb-6 inline-flex rounded-2xl bg-violet-50 p-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold tracking-tight">{feature.title}</h3>
                            <p className="mt-3 text-zinc-500 leading-relaxed text-sm">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* High Conversion CTA Section */}
            <section className="mx-auto mb-28 mt-32 max-w-6xl px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-violet-600 to-indigo-600 p-10 text-center text-white shadow-2xl sm:p-16"
                >
                    <h2 className="text-4xl font-black sm:text-5xl lg:text-6xl tracking-tight">
                        Ready To Get Protected?
                    </h2>
                    <p className="mt-4 text-violet-100 text-base sm:text-lg max-w-md mx-auto">
                        Join over 25,000 corporate partners and individuals securing modern lifestyles today.
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-8 rounded-full cursor-pointer bg-white px-8 py-4 font-extrabold text-zinc-950 shadow-lg transition hover:bg-zinc-50"
                        onClick={() => navigate("/login")}
                    >
                        Get Started Today
                    </motion.button>
                </motion.div>
            </section>

            {/* Premium Dark Footer */}
            <footer className="rounded-t-[40px] bg-zinc-950 text-white sm:rounded-t-[60px]">
                <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20">
                    <div className="grid gap-10 md:grid-cols-4">
                        <div className="md:col-span-1">
                            <h2 className="text-3xl font-black tracking-tight">
                                INSURE<span className="text-violet-500">X</span>
                            </h2>
                            <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
                                Reimagining insurance workflows for high-growth modern generations globally.
                            </p>
                        </div>

                        {[
                            { title: "Products", links: ["Health", "Vehicle", "Life", "Home"] },
                            { title: "Company", links: ["About", "Claims", "Partners", "Careers"] },
                            { title: "Support", links: ["Help Center", "Contact", "Privacy", "Terms"] },
                        ].map((col) => (
                            <div key={col.title}>
                                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-200">{col.title}</h3>
                                <ul className="space-y-3 text-sm text-zinc-400">
                                    {col.links.map((link) => (
                                        <li key={link}>
                                            <a href="#" className="transition hover:text-white">
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default InsuranceHero;