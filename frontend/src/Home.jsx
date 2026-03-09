import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Target, ChevronRight, Zap, BarChart2, BookOpen, CheckCircle2,
  Clock, AlertTriangle, Shield
} from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { SiLeetcode, SiGeeksforgeeks } from 'react-icons/si';

const features = [
  { icon: BarChart2, color: 'from-blue-500 to-indigo-600', label: 'Progress Analytics', desc: 'Track completion %, revision queue & stuck problems at a glance.' },
  { icon: BookOpen, color: 'from-violet-500 to-purple-600', label: 'Smart Notes', desc: 'Jot down your approach, edge cases and time complexity per question.' },
  { icon: Zap, color: 'from-amber-500 to-orange-500', label: 'Multi-platform', desc: 'Pulls questions from LeetCode, GFG, HackerRank & more with icons.' },
];

const stats = [
  { label: 'Problems', value: '2500+', icon: CheckCircle2, color: 'text-emerald-500' },
  { label: 'Topics', value: '40+', icon: BookOpen, color: 'text-blue-500' },
  { label: 'Platforms', value: '6', icon: Zap, color: 'text-amber-500' },
  { label: 'Free', value: '100%', icon: Shield, color: 'text-violet-500' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const Home = () => {
  const { user, login } = useAuth();
  if (user) return <Navigate to="/sheet" replace />;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30 flex flex-col relative overflow-hidden transition-colors duration-300"
    >

      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-400/20 dark:bg-indigo-600/10 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-violet-300/10 dark:bg-violet-600/5 blur-[120px]" />
      </div>

      {/* Dot grid */}
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-60" />

      {/* Navbar strip */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-16 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Target size={18} className="text-white" />
          </div>
          <span className="font-extrabold text-lg text-slate-800 dark:text-white tracking-tight">
            DSA<span className="gradient-text">Pro</span>
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-slate-200/50 dark:border-slate-700/50 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm">
          <SiLeetcode size={13} className="text-yellow-500" />
          <SiGeeksforgeeks size={13} className="text-green-500" />
          <span>2500+ Problems</span>
        </div>
      </nav>

      {/* Hero */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-12 pt-6 text-center"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700/50 text-blue-700 dark:text-blue-300 text-xs font-semibold tracking-wider uppercase shadow-sm">
            <Zap size={11} className="fill-current" />
            The Ultimate DSA Tracker
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter max-w-4xl mb-6">
          Crack DSA.<br />
          <span className="gradient-text">Track Every Step.</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-xl mb-10 leading-relaxed">
          A curated sheet of <strong>2500+ problems</strong> from LeetCode, GFG & more — with live progress tracking, smart notes, and platform icons.
        </motion.p>

        {/* CTA */}
        <motion.div variants={itemVariants} className="mb-16">
          <button
            id="google-login-btn"
            onClick={login}
            className="group relative inline-flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold py-4 px-8 rounded-2xl text-base shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:-translate-y-0.5"
          >
            <FcGoogle size={22} />
            <span>Continue with Google</span>
            <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
          </button>
          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">Free forever · No credit card needed</p>
        </motion.div>

        {/* Stats row */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl w-full mb-16">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass-card rounded-2xl p-4 flex flex-col items-center gap-1">
              <Icon size={20} className={color} />
              <span className="text-2xl font-black text-slate-800 dark:text-white">{value}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Feature cards */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-5 max-w-4xl w-full">
          {features.map(({ icon: Icon, color, label, desc }) => (
            <div key={label} className="glass-card rounded-2xl p-6 text-left hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
                <Icon size={20} className="text-white" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white mb-2">{label}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </motion.div>
      </motion.main>
    </motion.div>
  );
};

export default Home;