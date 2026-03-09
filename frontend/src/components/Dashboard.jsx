import { useProgress } from '../context/ProgressContext';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

const cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    visible: (i) => ({
        opacity: 1, y: 0, scale: 1,
        transition: { delay: i * 0.1, duration: 0.45, ease: 'easeOut' }
    }),
};

const Dashboard = ({ totalQuestions }) => {
    const { solved, userProgress } = useProgress();

    const totalSolved = solved.length;
    const totalStuck = Object.values(userProgress).filter(p => p.status === 'Stuck').length;
    const totalRevisit = Object.values(userProgress).filter(p => p.status === 'Revisit').length;
    const percentage = totalQuestions > 0 ? ((totalSolved / totalQuestions) * 100).toFixed(1) : 0;

    const cards = [
        {
            label: 'Completion',
            value: `${percentage}%`,
            sub: `${totalSolved} of ${totalQuestions} solved`,
            icon: TrendingUp,
            gradient: 'from-blue-500 to-indigo-600',
            glow: 'shadow-blue-500/20',
            textColor: 'text-blue-600 dark:text-blue-400',
            bar: true,
        },
        {
            label: 'Solved',
            value: totalSolved,
            sub: 'Problems completed',
            icon: CheckCircle2,
            gradient: 'from-emerald-500 to-teal-500',
            glow: 'shadow-emerald-500/20',
            textColor: 'text-emerald-600 dark:text-emerald-400',
        },
        {
            label: 'Need Revisit',
            value: totalRevisit,
            sub: 'Marked for review',
            icon: Clock,
            gradient: 'from-amber-500 to-orange-500',
            glow: 'shadow-amber-500/20',
            textColor: 'text-amber-600 dark:text-amber-400',
        },
        {
            label: 'Stuck',
            value: totalStuck,
            sub: 'Need more practice',
            icon: AlertTriangle,
            gradient: 'from-rose-500 to-pink-500',
            glow: 'shadow-rose-500/20',
            textColor: 'text-rose-600 dark:text-rose-400',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {cards.map((card, i) => {
                const Icon = card.icon;
                return (
                    <motion.div
                        key={card.label}
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className={`glass-card rounded-2xl p-5 flex flex-col gap-3 shadow-xl ${card.glow}`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                {card.label}
                            </span>
                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}>
                                <Icon size={17} className="text-white" />
                            </div>
                        </div>

                        {/* Value */}
                        <div>
                            <p className={`text-4xl font-black ${card.textColor} leading-none`}>
                                {card.value}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">{card.sub}</p>
                        </div>

                        {/* Optional Progress bar */}
                        {card.bar && (
                            <div className="w-full bg-slate-200 dark:bg-slate-700/60 rounded-full h-1.5 overflow-hidden mt-1">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                />
                            </div>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
};

export default Dashboard;
