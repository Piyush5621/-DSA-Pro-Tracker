import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Sun, Moon, Target, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const Navbar = ({ totalQuestions }) => {
    const { user, logout } = useAuth();
    const { solved } = useProgress();
    const { theme, toggleTheme } = useTheme();

    const pct = totalQuestions > 0 ? ((solved.length / totalQuestions) * 100).toFixed(0) : 0;

    return (
        <div className="w-full pt-4 px-4 sm:px-6 sticky top-0 z-50 pointer-events-none">
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="max-w-7xl mx-auto rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-xl shadow-blue-500/5 dark:shadow-black/20 pointer-events-auto"
            >
                <div className="px-4 py-3 flex justify-between items-center">

                    {/* Left: Animated Logo */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 cursor-pointer"
                    >
                        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 overflow-hidden">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100"
                            />
                            <Target size={20} className="text-white relative z-10" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight">
                                DSA<span className="gradient-text">Pro</span>
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-widest uppercase mt-0.5">Tracker</span>
                        </div>
                    </motion.div>

                    {/* Middle: Progress Indicator */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="hidden md:flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 shadow-inner"
                    >
                        <BarChart2 size={16} className="text-blue-500 dark:text-blue-400" />
                        <div className="flex items-center gap-1.5 text-[13px]">
                            <span className="font-extrabold text-blue-600 dark:text-blue-400">{solved.length}</span>
                            <span className="text-slate-400 font-light">/</span>
                            <span className="text-slate-600 dark:text-slate-300 font-semibold">{totalQuestions}</span>
                        </div>
                        <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden ml-2 shadow-inner">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                            </motion.div>
                        </div>
                        <span className="text-xs font-black text-slate-500 dark:text-slate-400 ml-1">{pct}%</span>
                    </motion.div>

                    {/* Right section */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 10 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleTheme}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-sm"
                            aria-label="Toggle Theme"
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={theme}
                                    initial={{ y: -20, opacity: 0, rotate: -90 }}
                                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                                    exit={{ y: 20, opacity: 0, rotate: 90 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                                </motion.div>
                            </AnimatePresence>
                        </motion.button>

                        {user && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-slate-200 dark:border-slate-700"
                            >
                                <motion.div whileHover={{ scale: 1.05 }} className="relative">
                                    {user.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt="User avatar"
                                            referrerPolicy="no-referrer"
                                            className="w-10 h-10 rounded-xl object-cover shadow-sm ring-2 ring-white dark:ring-slate-800"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-sm ring-2 ring-white dark:ring-slate-800">
                                            {(user.displayName || user.email).charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full" />
                                </motion.div>

                                <div className="hidden lg:flex flex-col mr-2">
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-none">
                                        {user.displayName?.split(' ')[0] || user.email.split('@')[0]}
                                    </p>
                                </div>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 hover:border-rose-200 dark:hover:border-rose-800 transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    <LogOut size={15} />
                                    <span className="hidden sm:inline">Sign out</span>
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.nav>
        </div>
    );
};

export default Navbar;
