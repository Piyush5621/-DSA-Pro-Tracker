import { useAuth } from './context/AuthContext';
import { useProgress } from './context/ProgressContext';
import Dashboard from './components/Dashboard';
import QuestionLink from './components/Sheet/QuestionLink';
import Navbar from './components/Navbar';
import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import dsaDataLocal from './data/dsaData.json';
import { ShieldAlert, RefreshCcw } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { userProgress } = useProgress();
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [allLinks, setAllLinks] = useState([]);

  useEffect(() => {
    const getLinks = (nodes, path = '') => {
      let res = [];
      nodes.forEach(n => {
        if (n.type === 'link') {
          res.push({ ...n, path });
        } else {
          const separator = ' / ';
          const newPath = path ? `${path}${separator}${n.name}` : n.name;
          if (n.links?.length) {
            n.links.forEach(l => res.push({ ...l, path: newPath }));
          }
          if (n.children?.length) {
            res.push(...getLinks(n.children, newPath));
          }
        }
      });
      return res;
    };
    
    const links = getLinks(dsaDataLocal);
    setAllLinks(links);
    setTotalQuestions(links.length);
  }, []);

  const stuckProblems = useMemo(() => {
    return allLinks.filter(q => userProgress[q.url]?.status === 'Stuck');
  }, [allLinks, userProgress]);

  const revisitProblems = useMemo(() => {
    return allLinks.filter(q => userProgress[q.url]?.status === 'Revisit');
  }, [allLinks, userProgress]);

  if (!user) {
    if (typeof window !== 'undefined') window.location.href = '/';
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a] transition-colors duration-300 relative"
    >
      <Navbar totalQuestions={totalQuestions} />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
               {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-16 h-16 rounded-2xl object-cover" />
               ) : (
                  <span className="text-3xl font-bold text-white">{(user.displayName || (user.email ? user.email : 'U')).charAt(0).toUpperCase()}</span>
               )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {user.displayName || (user.email ? user.email.split('@')[0] : 'User')}'s Core Data
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Analytics & Target Operations</p>
            </div>
          </div>
        </motion.div>

        <Dashboard totalQuestions={totalQuestions} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
            {/* Stuck Region */}
            <div className="rounded-3xl p-6 shadow-2xl shadow-rose-500/5 border border-rose-500/20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl group-hover:bg-rose-500/20 transition-all duration-500" />
                <h3 className="text-xl font-black text-rose-600 dark:text-rose-400 mb-6 flex items-center gap-2 tracking-tight">
                    <ShieldAlert size={22} className="text-rose-500" />
                    STUCK PROTOCOL
                </h3>
                {stuckProblems.length > 0 ? (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2 relative z-10">
                        {stuckProblems.map((p, i) => (
                            <motion.div key={p.url} initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{delay: i*0.05}}>
                                <QuestionLink name={p.name} url={p.url} path={p.path} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 text-center relative z-10">
                         <div className="w-16 h-16 mx-auto bg-rose-50 dark:bg-rose-900/20 rounded-full flex justify-center items-center mb-4">
                            <ShieldAlert size={28} className="text-rose-400 dark:text-rose-500/50" />
                         </div>
                         <p className="text-slate-500 dark:text-slate-400 font-medium">Systems nominal. No stuck patterns detected.</p>
                    </div>
                )}
            </div>

            {/* Revisit Region */}
            <div className="rounded-3xl p-6 shadow-2xl shadow-amber-500/5 border border-amber-500/20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-500" />
                <h3 className="text-xl font-black text-amber-600 dark:text-amber-400 mb-6 flex items-center gap-2 tracking-tight">
                    <RefreshCcw size={22} className="text-amber-500" />
                    REVISION CACHE
                </h3>
                {revisitProblems.length > 0 ? (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2 relative z-10">
                        {revisitProblems.map((p, i) => (
                             <motion.div key={p.url} initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{delay: i*0.05}}>
                                <QuestionLink name={p.name} url={p.url} path={p.path} />
                             </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 text-center relative z-10">
                         <div className="w-16 h-16 mx-auto bg-amber-50 dark:bg-amber-900/20 rounded-full flex justify-center items-center mb-4">
                            <RefreshCcw size={28} className="text-amber-400 dark:text-amber-500/50" />
                         </div>
                         <p className="text-slate-500 dark:text-slate-400 font-medium">Cache cleared. No revision targets pending.</p>
                    </div>
                )}
            </div>
        </div>

      </main>
    </motion.div>
  );
};

export default Profile;
