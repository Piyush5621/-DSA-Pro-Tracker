import { useAuth } from './context/AuthContext';
import { useProgress } from './context/ProgressContext';
import Dashboard from './components/Dashboard';
import QuestionLink from './components/Sheet/QuestionLink';
import Navbar from './components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import dsaDataLocal from './data/dsaData.json';
import { ShieldAlert, RefreshCcw, Play, ChevronLeft, Sparkles, X, ExternalLink, BookOpen, Code } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { userProgress, updateQuestionData } = useProgress();
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [allLinks, setAllLinks] = useState([]);

  const [reviewSession, setReviewSession] = useState(null); // { type: 'stuck' | 'revisit', currentIndex: 0, items: [] }
  const [revealNotes, setRevealNotes] = useState(false);
  const [revealCode, setRevealCode] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const startSession = (type, items) => {
    setReviewSession({
      type,
      currentIndex: 0,
      items: [...items]
    });
    setRevealNotes(false);
    setRevealCode(false);
    setSessionCompleted(false);
  };

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
            <div className="rounded-3xl p-6 shadow-2xl shadow-rose-500/5 border border-rose-500/20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md relative overflow-hidden group flex flex-col justify-between min-h-[250px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl group-hover:bg-rose-500/20 transition-all duration-500" />
                <div className="relative z-10 w-full">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-rose-600 dark:text-rose-400 flex items-center gap-2 tracking-tight">
                            <ShieldAlert size={22} className="text-rose-500" />
                            STUCK PROTOCOL
                        </h3>
                        {stuckProblems.length > 0 && (
                            <button
                                onClick={() => startSession('stuck', stuckProblems)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-xs font-bold uppercase tracking-wider transition-all border border-rose-500/20 cursor-pointer"
                            >
                                <Play size={12} fill="currentColor" />
                                Review
                            </button>
                        )}
                    </div>
                    {stuckProblems.length > 0 ? (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2 relative z-10">
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
            </div>

            {/* Revisit Region */}
            <div className="rounded-3xl p-6 shadow-2xl shadow-amber-500/5 border border-amber-500/20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md relative overflow-hidden group flex flex-col justify-between min-h-[250px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-500" />
                <div className="relative z-10 w-full">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-amber-600 dark:text-amber-400 flex items-center gap-2 tracking-tight">
                            <RefreshCcw size={22} className="text-amber-500" />
                            REVISION CACHE
                        </h3>
                        {revisitProblems.length > 0 && (
                            <button
                                onClick={() => startSession('revisit', revisitProblems)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 text-xs font-bold uppercase tracking-wider transition-all border border-amber-500/20 cursor-pointer"
                            >
                                <Play size={12} fill="currentColor" />
                                Review
                            </button>
                        )}
                    </div>
                    {revisitProblems.length > 0 ? (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2 relative z-10">
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
        </div>

        {/* Interactive Revision Modal */}
        <AnimatePresence>
          {reviewSession && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6"
              >
                {/* Close Button */}
                <button
                  onClick={() => setReviewSession(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                >
                  <X size={20} />
                </button>

                {!sessionCompleted ? (
                  <>
                    {/* Header Info */}
                    <div className="flex flex-col gap-1 pr-6 border-b border-slate-200/50 dark:border-white/5 pb-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${
                          reviewSession.type === 'stuck'
                            ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }`}>
                          {reviewSession.type === 'stuck' ? 'Stuck Review' : 'Revision Review'}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          Card {reviewSession.currentIndex + 1} of {reviewSession.items.length}
                        </span>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full bg-slate-100 dark:bg-white/5 h-1.5 rounded-full overflow-hidden mt-3">
                        <div
                          className={`h-full transition-all duration-300 ${
                            reviewSession.type === 'stuck' ? 'bg-rose-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${((reviewSession.currentIndex) / reviewSession.items.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Central Active Question Card */}
                    {reviewSession.items[reviewSession.currentIndex] && (() => {
                      const currentQuestion = reviewSession.items[reviewSession.currentIndex];
                      const qData = userProgress[currentQuestion.url] || {};
                      const qNotes = qData.notes || '';
                      const qCode = qData.code || '';
                      const qLanguage = qData.language || 'cpp';

                      const handleMarkCompleted = async () => {
                        // Mark as completed
                        await updateQuestionData(currentQuestion.url, { status: 'Completed' });
                        
                        // Move next
                        if (reviewSession.currentIndex + 1 < reviewSession.items.length) {
                          setReviewSession(prev => ({
                            ...prev,
                            currentIndex: prev.currentIndex + 1
                          }));
                          setRevealNotes(false);
                          setRevealCode(false);
                        } else {
                          setSessionCompleted(true);
                        }
                      };

                      const handleKeepStatus = () => {
                        // Advance without changing status
                        if (reviewSession.currentIndex + 1 < reviewSession.items.length) {
                          setReviewSession(prev => ({
                            ...prev,
                            currentIndex: prev.currentIndex + 1
                          }));
                          setRevealNotes(false);
                          setRevealCode(false);
                        } else {
                          setSessionCompleted(true);
                        }
                      };

                      const handlePrev = () => {
                        if (reviewSession.currentIndex > 0) {
                          setReviewSession(prev => ({
                            ...prev,
                            currentIndex: prev.currentIndex - 1
                          }));
                          setRevealNotes(false);
                          setRevealCode(false);
                        }
                      };

                      return (
                        <div className="flex flex-col gap-6 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                          <div className="flex flex-col gap-2">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                              {currentQuestion.path.replace(/\//g, ' • ')}
                            </span>
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white leading-tight tracking-tight">
                              {currentQuestion.name}
                            </h2>
                            <a
                              href={currentQuestion.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 self-start text-xs font-bold text-blue-500 hover:text-blue-600 dark:text-emerald-400 dark:hover:text-emerald-300 mt-1"
                            >
                              Solve on External Platform
                              <ExternalLink size={12} />
                            </a>
                          </div>

                          {/* Expandable/Revealable Sections */}
                          <div className="flex flex-col gap-3">
                            {/* Approach Notes Card */}
                            <div className="border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900/20">
                              <button
                                onClick={() => setRevealNotes(!revealNotes)}
                                className="w-full flex items-center justify-between px-5 py-4 font-bold text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                              >
                                <span className="flex items-center gap-2">
                                  <BookOpen size={16} className="text-blue-500" />
                                  Approach Notes
                                </span>
                                <span className="text-xs text-slate-400 uppercase tracking-wider">
                                  {revealNotes ? 'Hide' : 'Reveal'}
                                </span>
                              </button>
                              <AnimatePresence>
                                {revealNotes && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-slate-200/50 dark:border-white/5 p-5 text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-[#070b16] whitespace-pre-wrap leading-relaxed"
                                  >
                                    {qNotes ? qNotes : 'No notes written for this problem.'}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            {/* Saved Code Card */}
                            <div className="border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900/20">
                              <button
                                onClick={() => setRevealCode(!revealCode)}
                                className="w-full flex items-center justify-between px-5 py-4 font-bold text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                              >
                                <span className="flex items-center gap-2">
                                  <Code size={16} className="text-emerald-500" />
                                  Code Solution
                                </span>
                                <span className="text-xs text-slate-400 uppercase tracking-wider">
                                  {revealCode ? 'Hide' : 'Reveal'}
                                </span>
                              </button>
                              <AnimatePresence>
                                {revealCode && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-slate-200/50 dark:border-white/5 p-4 bg-slate-950 dark:bg-[#070b16] text-[13px] font-mono text-emerald-400/90 dark:text-emerald-400/80 overflow-x-auto leading-relaxed"
                                  >
                                    {qCode ? (
                                      <div className="relative">
                                        <div className="absolute top-0 right-0 text-[10px] text-slate-600 dark:text-slate-600 font-bold uppercase tracking-widest pointer-events-none select-none">
                                          {qLanguage}
                                        </div>
                                        <pre className="whitespace-pre">{qCode}</pre>
                                      </div>
                                    ) : (
                                      <span className="text-slate-600 dark:text-slate-600 italic">No solution code saved.</span>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>

                          {/* Actions Row */}
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/50 dark:border-white/5 pt-5 mt-4">
                            <button
                              onClick={handlePrev}
                              disabled={reviewSession.currentIndex === 0}
                              className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                                reviewSession.currentIndex > 0
                                  ? 'text-slate-700 border-slate-200 dark:text-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer'
                                  : 'text-slate-300 dark:text-slate-800 border-transparent cursor-not-allowed'
                              }`}
                            >
                              <ChevronLeft size={14} />
                              Prev
                            </button>

                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                              <button
                                onClick={handleKeepStatus}
                                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-center"
                              >
                                Keep in List & Next
                              </button>

                              <button
                                onClick={handleMarkCompleted}
                                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-white text-xs font-bold uppercase tracking-wider transition-all hover:shadow-lg shadow-md cursor-pointer text-center ${
                                  reviewSession.type === 'stuck'
                                    ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'
                                    : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                                }`}
                              >
                                Mark Completed & Next
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </>
                ) : (
                  /* Session Completion Card */
                  <div className="flex flex-col items-center justify-center text-center py-10 gap-5">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
                      <Sparkles size={32} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                        Review Session Complete!
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
                        Excellent effort. Keep polishing those skills and tracking your targets.
                      </p>
                    </div>
                    <button
                      onClick={() => setReviewSession(null)}
                      className="mt-4 px-6 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 text-xs font-bold uppercase tracking-wider hover:shadow-md transition-all cursor-pointer"
                    >
                      Return to Core Data
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </motion.div>
  );
};

export default Profile;
