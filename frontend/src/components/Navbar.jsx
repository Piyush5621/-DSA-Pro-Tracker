import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Sun, Moon, Target, BarChart2, Users, UserCircle, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
    withCredentials: true,
});


const Navbar = ({ totalQuestions, searchQuery, setSearchQuery }) => {
    const { user, logout } = useAuth();
    const { solved } = useProgress();
    const { theme, toggleTheme } = useTheme();
    const [activeUsers, setActiveUsers] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        socket.on('activeUsers', (count) => {
            setActiveUsers(count);
        });
        return () => {
            socket.off('activeUsers');
        };
    }, []);

    const pct = totalQuestions > 0 ? ((solved.length / totalQuestions) * 100).toFixed(0) : 0;

    return (
        <header className="w-full bg-white dark:bg-[#0B1120] border-b border-slate-200 dark:border-white/5 sticky top-0 z-50 shadow-sm dark:shadow-none">
            <div className="flex h-[73px] items-center justify-between px-4 sm:px-6">

                {/* Left: Animated Logo */}
                <div
                    onClick={() => navigate('/sheet')}
                    className="flex items-center gap-3 cursor-pointer group w-48 lg:w-64 flex-shrink-0"
                >
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shadow-inner overflow-hidden">
                        <Target size={16} className="text-emerald-500 relative z-10 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex items-center gap-1.5 leading-none">
                        <span className="font-black text-[15px] sm:text-[17px] text-slate-800 dark:text-slate-100 tracking-tight">
                            DSA<span className="text-emerald-500 font-black">Pro</span>
                        </span>
                    </div>
                </div>

                {/* Center: Global Search */}
                {setSearchQuery !== undefined && (
                    <div className="flex-1 max-w-xl mx-4 hidden md:block">
                        <div className="relative w-full">
                            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search problems globally..."
                                value={searchQuery || ''}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-100 dark:bg-[#121826] border border-slate-200 dark:border-white/5 rounded-xl pl-10 pr-9 py-2.5 text-[13px] outline-none focus:ring-1 focus:ring-emerald-500/50 dark:focus:ring-emerald-500/30 focus:border-emerald-500/50 text-slate-700 dark:text-slate-300 transition-all placeholder:text-slate-500 dark:placeholder:text-slate-600 shadow-inner"
                            />
                            <AnimatePresence>
                                {searchQuery && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.7 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.7 }}
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                    >
                                        <X size={14} />
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {/* Right section */}
                <div className="flex items-center justify-end gap-3 lg:gap-5 flex-shrink-0">
                    
                    {/* Top Right Progress Stats */}
                    <div className="hidden lg:flex items-center gap-4 text-[11px] font-bold tracking-widest uppercase mr-4">
                        <span className="text-slate-500 font-medium">Topics <span className="text-slate-700 dark:text-slate-200">17</span></span>
                        <span className="text-slate-500 font-medium">Problems <span className="text-slate-700 dark:text-slate-200">{totalQuestions}</span></span>
                        <span className="text-slate-500 font-medium">Solved <span className="text-emerald-500">{solved.length}</span></span>
                    </div>

                    {/* Active Users Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    >
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                        <Users size={14} className="opacity-80" />
                        <span className="text-[11px] font-bold tracking-wide uppercase leading-none">{activeUsers} Online</span>
                    </motion.div>
                    
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleTheme}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-[#121826] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors shadow-inner"
                        aria-label="Toggle Theme"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={theme}
                                initial={{ opacity: 0, rotate: -90 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: 90 }}
                                transition={{ duration: 0.2 }}
                            >
                                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                            </motion.div>
                        </AnimatePresence>
                    </motion.button>

                    {user && (
                        <div className="flex items-center gap-3 pl-3 sm:pl-5 border-l border-slate-200 dark:border-white/10">
                            <button
                                onClick={() => navigate('/profile')}
                                className="w-9 h-9 rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 hover:border-emerald-500/50 transition-colors relative group"
                            >
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt="User"
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                        {(user.displayName || (user.email ? user.email : 'U')).charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                     <UserCircle size={16} className="text-white" />
                                </div>
                            </button>

                            <button
                                onClick={logout}
                                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-[#121826] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-400 dark:hover:border-rose-500/30 transition-colors shadow-inner"
                            >
                                <LogOut size={15} className="relative -ml-0.5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
