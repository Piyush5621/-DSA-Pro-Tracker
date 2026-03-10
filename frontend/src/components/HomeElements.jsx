import React from 'react';
import { motion } from 'framer-motion';
import { SiLeetcode, SiGeeksforgeeks, SiHackerrank, SiCodechef, SiCodeforces } from 'react-icons/si';

export const BlueprintGridBackground = () => {
    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0A0A0A]">
            <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                    backgroundImage: `
            linear-gradient(to right, #2DD4BF 1px, transparent 1px),
            linear-gradient(to bottom, #2DD4BF 1px, transparent 1px)
          `,
                    backgroundSize: '40px 40px',
                }}
            />
            {/* Animated scanline */}
            <motion.div
                className="absolute inset-0 h-[2px] bg-gradient-to-r from-transparent via-[#2DD4BF] to-transparent opacity-20"
                animate={{ y: ['0vh', '100vh'] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            {/* Radial fade to hide grid edges */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 50% 50%, transparent 20%, #0A0A0A 90%)' }}
            />
        </div>
    );
};

export const MockupDashboard = () => {
    return (
        <motion.div
            initial={{ opacity: 0, rotateY: 10, rotateX: 5, x: 30 }}
            animate={{ opacity: 1, rotateY: -2, rotateX: 2, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col gap-4 p-6 bg-[#0f0f0f] border border-slate-800 rounded-3xl relative w-full shadow-2xl"
            style={{
                boxShadow: '-20px 20px 60px rgba(139, 92, 246, 0.1), 0 0 40px rgba(45, 212, 191, 0.05)',
                transformStyle: 'preserve-3d',
            }}
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-2 pb-4 border-b border-slate-800/50">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-xs font-mono text-slate-500">// dashboard.tsx</span>
            </div>

            {/* Heatmap */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400">Activity_Map()</span>
                    <span className="text-[10px] font-mono font-bold text-[#2DD4BF] select-none uppercase tracking-wider bg-[#2DD4BF]/10 px-2 py-0.5 rounded">Live</span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="flex flex-col gap-1.5">
                            {[...Array(6)].map((_, j) => {
                                const intensity = Math.random();
                                const colorClass = intensity > 0.85 ? 'bg-[#2DD4BF]' : intensity > 0.5 ? 'bg-[#2DD4BF]/60' : intensity > 0.2 ? 'bg-[#2DD4BF]/30' : 'bg-slate-800/60';
                                return <div key={j} className={`w-3.5 h-3.5 rounded-[3px] ${colorClass}`} />;
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Code Snippet */}
            <div className="mt-4 bg-[#050505] p-5 rounded-xl border border-slate-800/80">
                <pre className="text-xs sm:text-sm font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    <code className="text-[#8B5CF6]">function</code> <code className="text-[#2DD4BF]">solveDP</code>(n) {'{\n'}
                    {'  '}const dp = <code className="text-[#8B5CF6]">new</code> Array(n).fill(<code className="text-yellow-300">0</code>);{'\n'}
                    {'  '}dp[<code className="text-yellow-300">0</code>] = <code className="text-yellow-300">1</code>;{'\n'}
                    {'  '}<code className="text-[#8B5CF6]">for</code> (let i = <code className="text-yellow-300">1</code>; i &lt; n; i++) {'{\n'}
                    {'    '}<span className="text-slate-500 italic">// Calculate transitions</span>{'\n'}
                    {'    '}dp[i] = dp[i-<code className="text-yellow-300">1</code>] + cost(i);{'\n'}
                    {'  }\n'}
                    {'  '}<code className="text-[#8B5CF6]">return</code> dp[n-<code className="text-yellow-300">1</code>];{'\n'}
                    {'}'}
                </pre>
            </div>

            {/* Hover overlay glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#8B5CF6]/5 to-[#2DD4BF]/5 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
        </motion.div>
    );
};

export const BentoBox = ({ className, children }) => {
    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.005 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`bg-[#111111] border border-slate-800/70 rounded-3xl p-6 md:p-8 relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.5)] ${className}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/10 to-[#2DD4BF]/10 opacity-0 group-hover:opacity-100 transition-duration-500 ease-out pointer-events-none" />
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </motion.div>
    );
};

export const BentoChart = () => {
    return (
        <div className="flex flex-col h-full justify-between">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-white tracking-tight mb-1">Problems Solved Over Time</h3>
                <span className="text-sm font-mono text-[#2DD4BF]">// CONSISTENCY_TREND</span>
            </div>
            <div className="flex-1 flex items-end gap-2 md:gap-3 border-b-2 border-l-2 border-slate-800 p-3 pb-0 relative">
                <div className="absolute left-[-30px] bottom-0 text-[10px] font-mono text-slate-600">0</div>
                <div className="absolute left-[-35px] top-0 text-[10px] font-mono text-slate-600">100</div>
                {[20, 35, 25, 50, 45, 70, 60, 85, 95, 80, 100].map((h, i) => (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 1.2, delay: i * 0.05, ease: "easeOut" }}
                        key={i}
                        className="flex-1 bg-gradient-to-t from-[#8B5CF6] to-[#2DD4BF] rounded-t-sm opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                ))}
            </div>
        </div>
    );
}

export const BentoPlatforms = () => {
    const platforms = [
        { icon: SiLeetcode, color: 'text-[#FFA116]', name: 'LeetCode' },
        { icon: SiGeeksforgeeks, color: 'text-[#2f8D46]', name: 'GFG' },
        { icon: SiHackerrank, color: 'text-[#00EA64]', name: 'HackerRank' },
        { icon: SiCodeforces, color: 'text-red-500', name: 'Codeforces' },
        { icon: SiCodechef, color: 'text-orange-500', name: 'CodeChef' }
    ];
    return (
        <div className="flex flex-col h-full gap-5">
            <div>
                <h3 className="text-xl font-bold text-white tracking-tight mb-1">Sync Platforms</h3>
                <span className="text-sm font-mono text-[#8B5CF6]">// MULTIPLE_SOURCES_SUPPORTED</span>
            </div>
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1 no-scrollbar pt-2">
                {platforms.map((p, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-[#0a0a0a] border border-slate-800/80 hover:border-[#8B5CF6]/50 transition-colors shadow-inner">
                        <p.icon size={26} className={p.color} style={{ filter: 'drop-shadow(0 0 8px currentColor)' }} />
                        <span className="font-semibold text-slate-200">{p.name}</span>
                        <div className="ml-auto w-2 h-2 rounded-full bg-[#2DD4BF] shadow-[0_0_8px_#2DD4BF] animate-pulse" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export const BentoNotes = () => {
    return (
        <div className="flex flex-col h-full gap-5">
            <div>
                <h3 className="text-xl font-bold text-white tracking-tight mb-1">Smart Notes</h3>
                <span className="text-sm font-mono text-[#2DD4BF]">// RETAIN_KNOWLEDGE()</span>
            </div>
            <div className="bg-[#050505] p-6 rounded-2xl border border-slate-800 font-mono text-sm md:text-base text-slate-400 flex-1 flex flex-col justify-center leading-relaxed shadow-inner">
                <p className="text-[#8B5CF6] mb-3 font-bold select-none cursor-default opacity-80">/* Approach: 0/1 Knapsack */</p>
                <div className="space-y-1">
                    <p><span className="text-slate-500">1.</span> State: dp[i][w] = max val using first i items.</p>
                    <p><span className="text-slate-500">2.</span> Transition:</p>
                    <p className="pl-6"><code className="text-[#8B5CF6]">if</code> (wt[i] &le; w) {'{'}</p>
                    <p className="pl-12 text-slate-200">dp[i][w] = Math.max(dp[i-1][w], val[i] + dp[i-1][w-wt[i]]);</p>
                    <p className="pl-6">{'}'} <code className="text-[#8B5CF6]">else</code> {'{'}</p>
                    <p className="pl-12 text-slate-200">dp[i][w] = dp[i-1][w];</p>
                    <p className="pl-6">{'}'}</p>
                </div>
                <p className="mt-4 text-yellow-500/80 border-l-2 border-yellow-500/50 pl-3">// Edge case: empty wt array returns 0</p>
            </div>
        </div>
    );
}
