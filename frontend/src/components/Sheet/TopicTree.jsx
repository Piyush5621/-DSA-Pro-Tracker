import { useState } from 'react';
import { ChevronRight, FolderOpen, Folder } from 'lucide-react';
import QuestionLink from './QuestionLink';
import { motion, AnimatePresence } from 'framer-motion';

const TOPIC_COLORS = [
  'from-blue-500 to-indigo-500',
  'from-violet-500 to-purple-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-500',
  'from-cyan-500 to-sky-500',
  'from-fuchsia-500 to-pink-500',
  'from-lime-500 to-green-500',
];

const TopicTree = ({ node, depth = 0 }) => {
  const [expanded, setExpanded] = useState(false);

  if (node.type === 'link') {
    return <QuestionLink name={node.name} url={node.url} />;
  }

  const hasChildren = node.children?.length > 0 || node.links?.length > 0;
  const colorGradient = TOPIC_COLORS[Math.abs(node.name?.charCodeAt(0) % TOPIC_COLORS.length)];
  const isTopLevel = depth === 0;

  return (
    <div className={isTopLevel ? '' : 'ml-4 mt-2'}>
      {hasChildren && (
        <button
          onClick={() => setExpanded(!expanded)}
          className={`group flex items-center w-full text-left transition-all duration-200 
            ${isTopLevel
              ? `px-4 py-3.5 border-b border-slate-200/50 dark:border-white/5 hover:bg-slate-50/80 dark:hover:bg-white/[0.03] ${expanded ? 'bg-slate-50/50 dark:bg-white/[0.02]' : 'bg-transparent'}`
              : `px-3 py-2.5 rounded-xl ${expanded
                ? 'bg-slate-100/50 dark:bg-slate-800/30'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'}`
            }`}
        >
          {/* Folder icon with gradient */}
          {isTopLevel && (
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br ${colorGradient} flex items-center justify-center mr-3 shadow-md transition-transform duration-200 ${expanded ? 'scale-105' : ''}`}>
              {expanded
                ? <FolderOpen size={15} className="text-white" />
                : <Folder size={15} className="text-white" />
              }
            </div>
          )}

          {/* Nested folder icon (subtle) */}
          {!isTopLevel && (
            <div className="flex-shrink-0 mr-2.5">
              {expanded
                ? <FolderOpen size={14} className="text-blue-400 dark:text-blue-500" />
                : <Folder size={14} className="text-slate-400 dark:text-slate-500 group-hover:text-blue-400 transition-colors" />
              }
            </div>
          )}

          <span className={`flex-1 font-semibold tracking-tight truncate
            ${isTopLevel
              ? expanded
                ? 'text-slate-900 dark:text-white text-[15px]'
                : 'text-slate-700 dark:text-slate-300 text-[15px] group-hover:text-slate-900 dark:group-hover:text-white'
              : expanded
                ? 'text-slate-700 dark:text-slate-300 text-[13px]'
                : 'text-slate-600 dark:text-slate-400 text-[13px] group-hover:text-slate-800 dark:group-hover:text-slate-200'
            }`}
          >
            {node.name}
          </span>

          {/* Question count badge */}
          {isTopLevel && (
            <span className={`flex-shrink-0 ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full
              ${expanded
                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
              {(node.links?.length || 0) + (node.children?.reduce((a, c) => a + (c.links?.length || 0), 0) || 0)}
            </span>
          )}

          {/* Chevron */}
          <motion.div
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 ml-2"
          >
            <ChevronRight
              size={isTopLevel ? 16 : 14}
              className={expanded
                ? 'text-blue-500 dark:text-blue-400'
                : 'text-slate-400 dark:text-slate-500 group-hover:text-blue-400 transition-colors'}
            />
          </motion.div>
        </button>
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className={`${isTopLevel ? 'ml-5 mt-2 pl-4 border-l-2 border-slate-200/80 dark:border-slate-700/60 space-y-1' : 'ml-3 mt-1 pl-3 border-l border-slate-200/60 dark:border-slate-700/40 space-y-0.5'}`}>
              {node.links?.map((link, idx) => (
                <TopicTree key={`link-${idx}`} node={link} depth={depth + 1} />
              ))}
              {node.children?.map((child, idx) => (
                <TopicTree key={`child-${idx}`} node={child} depth={depth + 1} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TopicTree;