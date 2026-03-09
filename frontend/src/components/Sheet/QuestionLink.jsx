import { useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { ExternalLink, PenSquare, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiLeetcode, SiGeeksforgeeks, SiHackerrank, SiCodechef, SiCodingninjas, SiYoutube } from 'react-icons/si';
import { FaExternalLinkAlt } from 'react-icons/fa';

const STATUS_OPTIONS = [
  { value: 'Completed', icon: CheckCircle2, label: 'Solved', colorClass: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50  dark:bg-emerald-900/25 border-emerald-200  dark:border-emerald-700/50' },
  { value: 'Revisit', icon: Clock, label: 'Revisit', colorClass: 'text-amber-600  dark:text-amber-400', bg: 'bg-amber-50   dark:bg-amber-900/25  border-amber-200   dark:border-amber-700/50' },
  { value: 'Stuck', icon: AlertTriangle, label: 'Stuck', colorClass: 'text-rose-600   dark:text-rose-400', bg: 'bg-rose-50    dark:bg-rose-900/25   border-rose-200    dark:border-rose-700/50' },
];

const PLATFORM_MAP = [
  { match: 'leetcode.com', icon: SiLeetcode, color: 'text-yellow-500', bg: 'bg-yellow-50  dark:bg-yellow-900/20', label: 'LeetCode' },
  { match: 'geeksforgeeks.org', icon: SiGeeksforgeeks, color: 'text-green-600 dark:text-green-500', bg: 'bg-green-50   dark:bg-green-900/20', label: 'GFG' },
  { match: 'hackerrank.com', icon: SiHackerrank, color: 'text-green-500', bg: 'bg-green-50   dark:bg-green-900/20', label: 'HackerRank' },
  { match: 'codechef.com', icon: SiCodechef, color: 'text-amber-700  dark:text-amber-500', bg: 'bg-amber-50   dark:bg-amber-900/20', label: 'CodeChef' },
  { match: 'codingninjas.com', icon: SiCodingninjas, color: 'text-orange-600', bg: 'bg-orange-50  dark:bg-orange-900/20', label: 'Ninjas' },
  { match: 'youtube.com', icon: SiYoutube, color: 'text-red-600', bg: 'bg-red-50     dark:bg-red-900/20', label: 'YouTube' },
  { match: 'youtu.be', icon: SiYoutube, color: 'text-red-600', bg: 'bg-red-50     dark:bg-red-900/20', label: 'YouTube' },
];

const getPlatform = (url = '') => {
  const lower = url.toLowerCase();
  return PLATFORM_MAP.find(p => lower.includes(p.match)) || null;
};

const QuestionLink = ({ name, url, path }) => {
  const { solved, userProgress, toggleSolved, updateQuestionData } = useProgress();
  const [showNotes, setShowNotes] = useState(false);

  const isSolved = solved.includes(url);
  const qData = userProgress[url] || {};
  const currentStatus = isSolved ? 'Completed' : (qData.status || null);
  const currentNotes = qData.notes || '';
  const platform = getPlatform(url);
  const PlatformIcon = platform?.icon || FaExternalLinkAlt;

  return (
    <motion.div
      layout
      whileHover={{ x: 3 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`group rounded-xl border transition-all duration-200 overflow-hidden
        ${isSolved
          ? 'bg-emerald-50/40 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30'
          : 'bg-white/60 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/60 hover:bg-white dark:hover:bg-slate-800/60 hover:border-slate-200 dark:hover:border-slate-700/60 hover:shadow-md hover:shadow-black/5'
        }`}
    >
      <div className="flex items-center gap-3 px-3 py-2.5">

        {/* Checkbox */}
        <button
          onClick={() => toggleSolved(url)}
          className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200
            ${isSolved
              ? 'bg-emerald-500 border-emerald-500 shadow-sm shadow-emerald-500/30'
              : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 bg-white dark:bg-slate-900'
            }`}
        >
          <AnimatePresence>
            {isSolved && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              >
                <CheckCircle2 size={13} className="text-white" strokeWidth={3} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Platform badge */}
        <div className={`flex-shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold ${platform ? `${platform.bg} ${platform.color}` : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
          <PlatformIcon size={12} />
          {platform && <span className="hidden sm:inline">{platform.label}</span>}
        </div>

        {/* Question name / link */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          {path && (
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 truncate mb-0.5 line-clamp-1" dangerouslySetInnerHTML={{ __html: path }} />
          )}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-[13px] font-medium truncate transition-colors duration-150 flex items-center gap-1.5
              ${isSolved
                ? 'text-slate-400 dark:text-slate-500 line-through decoration-slate-300 dark:decoration-slate-600'
                : 'text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'
              }`}
          >
            <span className="truncate">{name}</span>
            <ExternalLink size={11} className="flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" />
          </a>
        </div>

        {/* Status chips + notes toggle */}
        <div className="flex-shrink-0 flex items-center gap-1.5">
          {/* Status buttons */}
          <div className="hidden sm:flex items-center gap-1">
            {STATUS_OPTIONS.map(opt => {
              const Icon = opt.icon;
              const active = currentStatus === opt.value;
              return (
                <button
                  key={opt.value}
                  title={opt.label}
                  onClick={() => updateQuestionData(url, { status: active ? null : opt.value })}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all duration-200
                    ${active
                      ? `${opt.bg} ${opt.colorClass} border-current/20 shadow-sm`
                      : 'text-slate-300 dark:text-slate-600 border-transparent hover:text-slate-500 dark:hover:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                  <Icon size={13} />
                </button>
              );
            })}
          </div>

          {/* Mobile: select */}
          <select
            value={currentStatus || ''}
            onChange={(e) => updateQuestionData(url, { status: e.target.value || null })}
            className="sm:hidden text-[11px] font-medium border border-slate-200 dark:border-slate-700 rounded-lg px-1.5 py-1 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 outline-none"
          >
            <option value="">Status</option>
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Notes toggle */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            title="Notes"
            className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all duration-200
              ${(showNotes || currentNotes)
                ? 'bg-blue-50 dark:bg-blue-900/25 text-blue-500 border-blue-200 dark:border-blue-700/50 shadow-sm'
                : 'text-slate-300 dark:text-slate-600 border-transparent hover:text-slate-500 dark:hover:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
          >
            <PenSquare size={13} />
          </button>
        </div>
      </div>

      {/* Notes panel */}
      <AnimatePresence>
        {showNotes && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-slate-100 dark:border-slate-800"
          >
            <div className="px-10 py-3 bg-slate-50/80 dark:bg-slate-900/60">
              <textarea
                value={currentNotes}
                onChange={(e) => updateQuestionData(url, { notes: e.target.value })}
                placeholder="Write your approach, edge cases, time & space complexity…"
                rows={3}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-[13px] text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 dark:focus:border-blue-600 outline-none transition-all resize-none shadow-sm"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuestionLink;