import { useEffect, useState, useMemo } from 'react';
import { useAuth } from './context/AuthContext';
import { useProgress } from './context/ProgressContext';
import TopicTree from './components/Sheet/TopicTree';
import QuestionLink from './components/Sheet/QuestionLink';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import axios from 'axios';
import { Search, BookOpen, X, Loader2, ListFilter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import dsaDataLocal from './data/dsaData.json';

const FILTERS = [
  { id: 'All', label: 'All Topics' },
  { id: 'Unsolved', label: 'Unsolved' },
  { id: 'Solved', label: 'Solved' },
  { id: 'Revisit', label: 'Need Review' },
  { id: 'Stuck', label: 'Stuck' },
];

const Sheet = () => {
  const { user } = useAuth();
  const { solved, userProgress, loading } = useProgress();
  const [sheetData, setSheetData] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    // Load local static data instantly without waiting for backend
    setSheetData(dsaDataLocal);

    // Calculate total questions
    const countLinks = (nodes) => {
      let count = 0;
      nodes.forEach(node => {
        if (node.type === 'link') count++;
        else {
          count += node.links?.length || 0;
          count += countLinks(node.children || []);
        }
      });
      return count;
    };

    setTotalQuestions(countLinks(dsaDataLocal));
  }, []);

  // Flatten the tree for advanced filtering
  const allLinks = useMemo(() => {
    const getLinks = (nodes, path = '') => {
      let res = [];
      nodes.forEach(n => {
        if (n.type === 'link') {
          res.push({ ...n, path });
        } else {
          const separator = '<span class="text-slate-300 dark:text-slate-600 mx-1">/</span>';
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
    return getLinks(sheetData);
  }, [sheetData]);

  // Derived view (Tree vs Flat) based on active search/filter
  const viewData = useMemo(() => {
    if (filterType === 'All' && !searchQuery) {
      return { type: 'tree', data: sheetData };
    }

    let processed = allLinks;

    if (filterType !== 'All') {
      processed = processed.filter(q => {
        const isSolved = solved.includes(q.url);
        const st = userProgress[q.url]?.status;

        if (filterType === 'Unsolved') return !isSolved;
        if (filterType === 'Solved') return isSolved;
        if (filterType === 'Revisit') return !isSolved && st === 'Revisit';
        if (filterType === 'Stuck') return !isSolved && st === 'Stuck';
        return true;
      });
    }

    if (searchQuery) {
      const qs = searchQuery.toLowerCase();
      processed = processed.filter(q =>
        q.name.toLowerCase().includes(qs) || q.path.toLowerCase().includes(qs)
      );
    }

    return { type: 'flat', data: processed };
  }, [sheetData, allLinks, filterType, searchQuery, solved, userProgress]);

  if (!user) {
    if (typeof window !== 'undefined') window.location.href = '/';
    return null;
  }

  // Loading state
  if (loading || sheetData.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 animate-pulse">
          <BookOpen size={28} className="text-white" />
        </div>
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm font-medium">Loading your DSA sheet...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300"
    >
      {/* Subtle background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/5 dark:bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/5 dark:bg-indigo-600/5 rounded-full blur-3xl" />
      </div>

      <Navbar totalQuestions={totalQuestions} />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Analytics */}
        <Dashboard totalQuestions={totalQuestions} />

        {/* Sheet Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-card rounded-3xl overflow-hidden shadow-2xl shadow-black/5"
        >
          {/* Panel Header */}
          <div className="px-6 sm:px-8 py-6 border-b border-slate-200/80 dark:border-slate-700/60 bg-white/40 dark:bg-slate-900/40">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <ListFilter size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                    Problem Directory
                  </h2>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                    {totalQuestions} total problems available
                  </p>
                </div>
              </div>

              {/* Controls: Tabs & Search */}
              <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

                {/* Filter Tabs */}
                <div className="flex bg-slate-100 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700 w-full sm:w-auto overflow-x-auto custom-scrollbar">
                  {FILTERS.map(f => {
                    const isActive = filterType === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => setFilterType(f.id)}
                        className={`relative px-4 py-1.5 text-[13px] font-semibold rounded-lg transition-colors whitespace-nowrap
                          ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}
                        `}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200/50 dark:border-slate-700"
                            initial={false}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10">{f.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-64 flex-shrink-0">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="topic-search"
                    type="text"
                    placeholder="Search anything…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-9 py-2 text-[13px] outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 dark:focus:border-blue-600 text-slate-700 dark:text-slate-300 transition-all placeholder:text-slate-400 shadow-sm"
                  />
                  <AnimatePresence>
                    {searchQuery && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      >
                        <X size={14} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </div>
          </div>

          {/* Topics View */}
          <div className="p-4 sm:p-6 pb-12 min-h-[400px]">
            <AnimatePresence mode="wait">
              {viewData.data.length > 0 ? (
                <motion.div
                  key={filterType + searchQuery + viewData.type}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={viewData.type === 'flat' ? 'space-y-2' : ''}
                >
                  {viewData.type === 'tree' ? (
                    // Render Folders
                    viewData.data.map((topic, idx) => (
                      <TopicTree key={idx} node={topic} />
                    ))
                  ) : (
                    // Render Flat Links
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {viewData.data.map((link, idx) => (
                        <div key={idx} className="h-full">
                          <QuestionLink name={link.name} url={link.url} path={link.path} />
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-24 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-5">
                    <ListFilter size={32} className="text-slate-300 dark:text-slate-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">
                    No problems found
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm">
                    {searchQuery
                      ? `We couldn't find any questions matching "${searchQuery}".`
                      : `You don't have any questions marked as "${filterType}" yet.`}
                  </p>
                  {(searchQuery || filterType !== 'All') && (
                    <button
                      onClick={() => { setSearchQuery(''); setFilterType('All'); }}
                      className="mt-6 px-5 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      Clear all filters
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default Sheet;