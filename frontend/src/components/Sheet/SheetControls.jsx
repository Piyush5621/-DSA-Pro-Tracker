import { Search, X, Layers, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FILTERS = [
  { id: 'All', label: 'All Topics' },
  { id: 'Solved', label: 'Solved' },
  { id: 'Revisit', label: 'Need Review' },
  { id: 'Stuck', label: 'Stuck' },
];

const SheetControls = ({ filterType, setFilterType, searchQuery, setSearchQuery, layout, setLayout }) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Top row: Layout Tabs & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 w-full">
        {/* Layout Toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700 w-full sm:w-auto overflow-hidden">
          {['Topic', 'Technique'].map((l) => {
            const isActive = layout === l;
            const Icon = l === 'Topic' ? Layers : Hash;
            return (
              <button
                key={l}
                onClick={() => setLayout(l)}
                className={`flex-1 sm:flex-none relative px-4 py-1.5 flex items-center justify-center gap-2 text-[13px] font-semibold rounded-lg transition-colors whitespace-nowrap
                  ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeLayout"
                    className="absolute inset-0 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200/50 dark:border-slate-700"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon size={14} className="relative z-10" />
                <span className="relative z-10">By {l}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64 flex-shrink-0">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="topic-search"
            type="text"
            placeholder="Search problems..."
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
                aria-label="Clear search"
              >
                <X size={14} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom row: Filter Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700 w-full overflow-x-auto custom-scrollbar">
        {FILTERS.map((f) => {
          const isActive = filterType === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`flex-1 sm:flex-none relative px-4 py-1.5 text-[13px] font-semibold rounded-lg transition-colors whitespace-nowrap
                ${isActive ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFilter"
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
    </div>
  );
};

export default SheetControls;
