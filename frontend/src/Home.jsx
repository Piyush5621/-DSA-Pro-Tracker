import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BlueprintGridBackground,
  MockupDashboard,
  BentoBox,
  BentoChart,
  BentoPlatforms,
  BentoNotes
} from './components/HomeElements';

const Home = () => {
  const { user, login } = useAuth();
  const [stats, setStats] = useState({ activeUsers: 1, totalRegistered: 1 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchStats();
    // Refresh stats periodically
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  if (user) return <Navigate to="/sheet" replace />;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-200 overflow-x-hidden relative selection:bg-[#8B5CF6]/30">
      <BlueprintGridBackground />

      {/* Top navbar-ish metrics */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center top-0">
        <div className="font-black text-2xl tracking-tighter text-white uppercase drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]">
          DSA<span className="text-[#2DD4BF]">Pro</span>
        </div>
        <div className="hidden md:flex items-center gap-6 font-mono text-sm text-slate-500 bg-[#111] py-2 px-5 rounded-full border border-slate-800 shadow-md">
          <span>registered_accounts: <span className="text-[#8B5CF6]">{stats.totalRegistered.toLocaleString()}</span></span>
          <span className="flex items-center gap-2">
            live_users: <span className="w-2 h-2 bg-[#2DD4BF] rounded-full animate-pulse shadow-[0_0_8px_#2DD4BF]"></span> <span className="text-[#2DD4BF]">{stats.activeUsers}</span>
          </span>
          <span>// 2500_PROBLEMS_INDEXED</span>
        </div>
      </div>

      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-24 pt-8 lg:pt-16 mb-12">

        {/* Asymmetrical Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8 mb-24 lg:mb-32">

          {/* Left Side: Hook */}
          <div className="flex-1 flex flex-col items-start gap-8 text-left z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 text-[#8B5CF6] text-xs font-mono font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(139,92,246,0.15)]"
            >
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse shadow-[0_0_8px_#8B5CF6]" />
              Dev Command Center
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tighter drop-shadow-lg"
            >
              Stop coding <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-tr from-[#8B5CF6] via-purple-500 to-[#2DD4BF] filter drop-shadow-[0_0_20px_rgba(139,92,246,0.3)]">in the dark.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-400 max-w-xl font-medium leading-relaxed drop-shadow-sm"
            >
              The ultimate command center for your DSA grind. Track 2500+ problems, map your progress, and crack the technical interview.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative z-30"
            >
              <button
                onClick={login}
                className="group relative inline-flex items-center gap-4 bg-[#111] hover:bg-[#1a1a1a] border border-slate-700 hover:border-[#2DD4BF]/60 text-white font-bold py-4 px-8 rounded-full text-lg shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_35px_rgba(45,212,191,0.25)] transition-all duration-300"
              >
                <FcGoogle size={26} className="bg-white rounded-full p-0.5" />
                <span>Continue with Google</span>
                <ChevronRight size={20} className="text-slate-500 group-hover:text-[#2DD4BF] group-hover:translate-x-1 transition-all duration-200" />
              </button>
              <p className="mt-5 text-xs font-mono text-slate-500 pl-4 border-l-2 border-slate-800">
                {'>'} init --auth --provider=google
              </p>
            </motion.div>
          </div>

          {/* Right Side: Proof Mockup */}
          <div className="flex-1 w-full lg:max-w-xl" style={{ perspective: '1200px' }}>
            <MockupDashboard />
          </div>

        </div>

        {/* Bento Box Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min"
        >
          {/* Wide Box (spans 2 columns on mostly md+ screens) */}
          <BentoBox className="md:col-span-2 md:row-span-1 min-h-[300px]">
            <BentoNotes />
          </BentoBox>

          {/* Tall Box (spans 1 col, 2 rows) */}
          <BentoBox className="md:col-span-1 md:row-span-2 min-h-[400px]">
            <BentoPlatforms />
          </BentoBox>

          {/* Large Box (spans 2 col, 1 row) */}
          <BentoBox className="md:col-span-2 md:row-span-1 min-h-[350px]">
            <BentoChart />
          </BentoBox>

        </motion.div>

      </main>
    </div>
  );
};

export default Home;