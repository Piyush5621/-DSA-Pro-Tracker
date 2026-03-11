import { useState, useMemo, memo, useCallback } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ListFilter, Clock, AlertTriangle, PenSquare } from 'lucide-react';

const QuestionRow = memo(({ 
  link, 
  idx, 
  isSolved, 
  qData, 
  openNotes, 
  setOpenNotes, 
  handleToggle, 
  updateQuestionData, 
  getBadges 
}) => {
  const { platform, type } = getBadges(link.url);
  const currentStatus = isSolved ? 'Completed' : (qData.status || null);
  const currentNotes = qData.notes || '';

  return (
    <div className="mb-2 w-full">
      <div className="grid grid-cols-12 gap-3 sm:gap-4 px-4 sm:px-6 py-3.5 sm:py-3 rounded-2xl bg-white/60 dark:bg-[#0E1525]/60 backdrop-blur-md border border-slate-200 dark:border-white/5 hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:bg-white dark:hover:bg-[#131b2c]/80 transition-all duration-300 group items-center shadow-sm hover:shadow-lg dark:hover:shadow-blue-500/5 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        {/* Index */}
        <div className="col-span-1 hidden sm:flex items-center">
          <span className="text-xs font-mono font-bold text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-400 transition-colors">
            {String(idx + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Problem Name & Path */}
        <div className="col-span-9 sm:col-span-6 flex flex-col justify-center">
          <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-[13px] sm:text-[14px] font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-emerald-400 truncate tracking-tight transition-colors">
            {link.name}
          </a>
          {link.path && (
            <span className="text-[10px] text-slate-400 truncate font-semibold uppercase tracking-widest mt-0.5">
              {link.path.replace(/\//g, '•')}
            </span>
          )}
        </div>

        {/* Platform/Type Badges */}
        <div className="col-span-3 hidden sm:flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${platform.color}`}>
            {platform.text}
          </span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border hidden md:inline-block ${type.color}`}>
            {type.text}
          </span>
        </div>

        {/* Actions & Status Checkbox */}
        <div className="col-span-3 sm:col-span-2 flex items-center justify-end gap-2 pr-2 md:pr-0">
          {/* Status Buttons */}
          <div className="hidden lg:flex items-center gap-1 mr-2">
            {STATUS_OPTIONS.map(opt => {
              const Icon = opt.icon;
              const isOptActive = currentStatus === opt.value;
              return (
                <button
                  key={opt.value}
                  title={opt.label}
                  onClick={() => updateQuestionData(link.url, { status: isOptActive ? null : opt.value })}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 border
                    ${isOptActive 
                      ? `bg-slate-100 dark:bg-white/10 ${opt.colorClass} border-transparent` 
                      : `text-slate-300 dark:text-slate-600 border-transparent hover:text-slate-500 dark:hover:text-slate-400 ${opt.bg}`}`}
                >
                  <Icon size={14} />
                </button>
              )
            })}
            <button
              title="Notes"
              onClick={() => setOpenNotes(openNotes === link.url ? null : link.url)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 border
                ${openNotes === link.url || currentNotes
                  ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-500 border-transparent'
                  : 'text-slate-300 dark:text-slate-600 border-transparent hover:text-slate-500 dark:hover:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}
            >
              <PenSquare size={14} />
            </button>
          </div>

          <button
            onClick={() => handleToggle(link.url)}
            className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-300 border shadow-sm flex-shrink-0
              ${isSolved 
                ? 'bg-emerald-500 border-emerald-500 dark:bg-emerald-500/20 dark:border-emerald-500/50 text-white dark:text-emerald-400 shadow-emerald-500/20' 
                : 'bg-white border-slate-300 dark:bg-transparent dark:border-slate-700 text-transparent hover:border-emerald-500/50 dark:hover:border-emerald-500/50'}`}
          >
            {isSolved && <Check size={14} strokeWidth={3} />}
          </button>
        </div>
      </div>
      
      {/* Notes Expandable Row */}
      <AnimatePresence>
        {openNotes === link.url && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/30 overflow-hidden"
          >
            <div className="px-14 py-4">
              <textarea
                value={currentNotes}
                onChange={(e) => updateQuestionData(link.url, { notes: e.target.value })}
                placeholder="Write your approach, edge cases, time & space complexity..."
                rows={2}
                className="w-full bg-white dark:bg-[#121826] border border-slate-200 dark:border-white/10 rounded-xl p-3 text-[13px] text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all resize-none shadow-sm"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}, (prev, next) => {
  return prev.isSolved === next.isSolved && 
         prev.qData === next.qData && 
         prev.openNotes === next.openNotes &&
         prev.idx === next.idx &&
         prev.link.url === next.link.url &&
         prev.link.name === next.link.name;
});

const STATUS_OPTIONS = [
  { value: 'Revisit', icon: Clock, label: 'Need Revisit', colorClass: 'text-amber-500', bg: 'hover:bg-amber-500/10 border-amber-500/20' },
  { value: 'Stuck', icon: AlertTriangle, label: 'Stuck', colorClass: 'text-rose-500', bg: 'hover:bg-rose-500/10 border-rose-500/20' },
];

const DataTable = ({ topic, searchQuery, solved }) => {
  const { userProgress, toggleSolved, updateQuestionData } = useProgress();
  const [activeSubTab, setActiveSubTab] = useState('All');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [openNotes, setOpenNotes] = useState(null);

  // Derive Platform and Type from URL
  const getBadges = useCallback((url) => {
    const u = url.toLowerCase();
    let platform = { text: 'SC', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20' };
    let type = { text: 'Theory', color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' };

    if (u.includes('leetcode')) {
        platform = { text: 'LC', color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' };
        type.text = 'Coding';
        type.color = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
    } else if (u.includes('geeksforgeeks')) {
        platform = { text: 'GFG', color: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-200 dark:border-green-500/20' };
        type.text = 'Coding';
        type.color = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
    } else if (u.includes('hackerrank')) {
        platform = { text: 'HR', color: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-200 dark:border-green-500/20' };
        type.text = 'Coding';
        type.color = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
    } else if (u.includes('codechef') || u.includes('codeforces')) {
        platform = { text: 'CF', color: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20' };
        type.text = 'Coding';
        type.color = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
    }

    if (u.includes('problem') || u.includes('practice')) {
        type.text = 'Coding';
        type.color = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
    }

    return { platform, type };
  }, []);

  // Extract all subtopics and flat links
  const { subTopics, allLinks } = useMemo(() => {
    if (!topic) return { subTopics: [], allLinks: [] };

    const subs = [];
    const links = [];

    if (topic.children) {
      topic.children.forEach(c => {
        subs.push({ name: c.name, links: [] });
        // Calculate links specifically for this subtopic
        const cLinks = [];
        if (c.links) c.links.forEach(l => { cLinks.push({ ...l, path: c.name }); links.push({ ...l, path: c.name }); });
        if (c.children) {
          const deepExtract = (nodes) => {
            nodes.forEach(n => {
              if (n.type === 'link') { cLinks.push(n); links.push({ ...n, path: c.name }); }
              else {
                if (n.links) { n.links.forEach(l => { cLinks.push(l); links.push({ ...l, path: c.name }); }); }
                if (n.children) deepExtract(n.children);
              }
            });
          };
          deepExtract(c.children);
        }
        subs[subs.length - 1].links = cLinks;
      });
    }

    if (topic.links) {
      topic.links.forEach(l => links.push({ ...l, path: topic.name }));
    }

    return { subTopics: subs, allLinks: links };
  }, [topic]);

  // Filter links based on subTab and Search
  const displayLinks = useMemo(() => {
    let result = allLinks;

    if (searchQuery) {
      result = result.filter(q => q.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return result;
    }

    if (activeSubTab !== 'All') {
      const activeSub = subTopics.find(s => s.name === activeSubTab);
      if (activeSub) result = activeSub.links;
    }

    if (platformFilter !== 'All') {
      result = result.filter(link => {
        const { platform } = getBadges(link.url);
        return platform.text === platformFilter;
      });
    }

    if (typeFilter !== 'All') {
      result = result.filter(link => {
        const { type } = getBadges(link.url);
        return type.text === typeFilter;
      });
    }

    return result;
  }, [allLinks, subTopics, activeSubTab, searchQuery, platformFilter, typeFilter, getBadges]);

  // Handle toggling solved state
  const handleToggle = useCallback((url) => {
    toggleSolved(url);
  }, [toggleSolved]);

  if (!topic && !searchQuery) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 py-32">
        <ListFilter size={48} className="text-slate-200 dark:text-slate-800 mb-4" />
        <p className="text-lg font-bold">Select a topic to view problems</p>
      </div>
    );
  }

  const solvedCount = displayLinks.filter(l => solved.includes(l.url)).length;

  return (
    <div className="flex-1 flex flex-col w-full animate-in fade-in zoom-in-95 duration-300">
      
      {/* Topic Header */}
      {!searchQuery && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                {topic.name}
             </h2>
             <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 py-1 px-3 rounded-full border border-slate-200 dark:border-white/5">
                <span className="text-emerald-500">{solvedCount}</span>
                <span>/</span>
                <span>{displayLinks.length}</span>
             </div>
          </div>

          {/* Subtabs horizontal scrolling */}
          {subTopics.length > 0 && (
            <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
              <button
                onClick={() => setActiveSubTab('All')}
                className={`flex-none px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all whitespace-nowrap border
                  ${activeSubTab === 'All' 
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20' 
                    : 'bg-slate-100 dark:bg-[#121826] text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'}`}
              >
                All ({allLinks.length})
              </button>
              {subTopics.map(sub => (
                <button
                  key={sub.name}
                  onClick={() => setActiveSubTab(sub.name)}
                  className={`flex-none px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all whitespace-nowrap border
                    ${activeSubTab === sub.name 
                      ? 'bg-blue-600 dark:bg-white/10 text-white border-transparent shadow-md' 
                      : 'bg-slate-100 dark:bg-[#121826] text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'}`}
                >
                  {sub.name} ({sub.links.length})
                </button>
              ))}
            </div>
          )}

          {/* Filters Row */}
          <div className="flex items-center gap-4 mt-5 py-2 border-t border-slate-200/50 dark:border-white/5">
             <div className="flex items-center gap-2">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform</span>
               <select 
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  className="bg-slate-100 border border-slate-200 dark:bg-[#121826] dark:border-white/10 px-2 py-1 rounded-md text-slate-600 dark:text-slate-300 transition-colors text-[11px] font-bold outline-none cursor-pointer"
               >
                  <option value="All">All</option>
                  <option value="LC">LeetCode (LC)</option>
                  <option value="SC">Scaler (SC)</option>
                  <option value="GFG">GeeksForGeeks (GFG)</option>
                  <option value="HR">HackerRank (HR)</option>
                  <option value="CF">CodeChef/Forces (CF)</option>
               </select>
             </div>
             <div className="w-px h-4 bg-slate-200 dark:bg-white/10"></div>
             <div className="flex items-center gap-2">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</span>
               <select 
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-slate-100 border border-slate-200 dark:bg-[#121826] dark:border-white/10 px-2 py-1 rounded-md text-slate-600 dark:text-slate-300 transition-colors text-[11px] font-bold outline-none cursor-pointer"
               >
                  <option value="All">All</option>
                  <option value="Theory">Theory</option>
                  <option value="Coding">Coding</option>
               </select>
             </div>
          </div>
        </div>
      )}

      {/* Main Table View */}
      <div className="w-full flex flex-col mb-12">
        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-200/50 dark:border-white/10 mb-3 mx-2">
            <div className="col-span-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">#</div>
            <div className="col-span-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Problem</div>
            <div className="col-span-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Platform & Type</div>
            <div className="col-span-2 text-right text-[10px] font-bold tracking-widest text-slate-400 uppercase">Status</div>
        </div>

        <div className="flex flex-col">
           {displayLinks.map((link, idx) => (
             <QuestionRow
               key={`${link.url}-${idx}`}
               link={link}
               idx={idx}
               isSolved={solved.includes(link.url)}
               qData={userProgress[link.url] || {}}
               openNotes={openNotes}
               setOpenNotes={setOpenNotes}
               handleToggle={handleToggle}
               updateQuestionData={updateQuestionData}
               getBadges={getBadges}
             />
           ))}
        </div>
      </div>
    </div>
  );
};

export default DataTable;
