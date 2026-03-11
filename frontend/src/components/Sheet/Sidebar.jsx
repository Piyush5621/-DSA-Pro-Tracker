import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const CATEGORY_ICONS = {
  // Topics
  'Arrays & Strings': '◼',
  'Recursion & Backtracking': '↻',
  'Number Theory': '∑',
  'Sorting Algorithms': '⊕',
  'Binary Search': '🔎',
  'Linked List': '⛓️',
  'Stack & Queue': '⟨⟩',
  'Hashmap & Heaps': '⚹',
  'Basic Geometry': '△',
  'Two Pointer Technique': '⇄',
  'Greedy Algorithms': '⊙',
  'Trees': '⌲',
  'Dynamic Programming': '▦',
  'Bit Manipulation': '⊼',
  'Graphs': '◉',
  'Trie': '⌕',
  'Competitive Programming': '★',
  // Techniques
  'Two Pointers': '⇄',
  'Sliding Window': '▭',
  'Binary Search Variants': '🔎',
  'Prefix Sum': '∑',
  'Recursion Patterns': '↻',
  'Backtracking': '↰',
  'DP Patterns': '▦',
  'Graph Traversal': '◉',
  'Divide & Conquer': '⊕',
  'Tree Traversal': '⌲',
  'Linked List Techniques': '⛓️',
  'Hashing Techniques': '⚹',
  'Sorting Techniques': '⊕',
  'Heap / Priority Queue': '▲',
  'String Matching': '≈',
  'Other': '◇'
};

const Sidebar = ({ sections, selectedTopic, setSelectedTopic }) => {
  const [expandedSections, setExpandedSections] = useState({
    'Topics': true,
    'Techniques': false
  });

  const toggleSection = (title) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <aside className="w-full h-full border-r border-slate-200 dark:border-white/5 bg-transparent flex flex-col overflow-y-auto custom-scrollbar">
      
      {/* Scrollable Content */}
      <div className="flex-1 py-8 px-2">
        {sections.map((section, sIdx) => {
          const isExpanded = expandedSections[section.title];
          
          return (
            <div key={section.title} className={sIdx > 0 ? 'mt-10' : ''}>
              <button 
                onClick={() => toggleSection(section.title)}
                className="w-full px-4 mb-4 flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: isExpanded ? 0 : -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={14} className="text-slate-400 group-hover:text-blue-500 dark:group-hover:text-emerald-400" />
                  </motion.div>
                  <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 tracking-[0.2em] uppercase">
                    {section.title}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-300 dark:text-white/20 bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded-md">
                    {String(section.items.length).padStart(2, '0')}
                  </span>
                </div>
              </button>
              
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.nav 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="space-y-1.5 px-2 overflow-hidden"
                  >
                    {section.items.map((topic, idx) => {
                const isActive = selectedTopic === topic.name;
                
                // Calculate totals
                let total = 0;
                const countLinks = (nodes) => {
                  nodes?.forEach(n => {
                    if (n.type === 'link') total++;
                    else {
                      total += n.links?.length || 0;
                      if (n.children) countLinks(n.children);
                    }
                  });
                };
                if (topic.links) total += topic.links.length;
                countLinks(topic.children);

                const IconStr = CATEGORY_ICONS[topic.name] || '◇';

                return (
                  <button
                    key={topic.name}
                    onClick={() => setSelectedTopic(topic.name)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-left transition-all duration-300 group
                      ${isActive 
                        ? 'bg-blue-600 dark:bg-emerald-500/10 text-white dark:text-emerald-400 shadow-lg shadow-blue-500/20' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:translate-x-1'}
                    `}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span className={`text-[15px] flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-lg transition-all
                        ${isActive ? 'scale-110' : 'opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110'}
                      `}>
                         {IconStr}
                      </span>
                      <span className={`text-[13px] font-bold truncate tracking-tight transition-colors
                        ${isActive ? 'text-white dark:text-emerald-500' : 'group-hover:text-slate-900 dark:group-hover:text-slate-200'}
                      `}>
                        {topic.name}
                      </span>
                    </div>
                    
                    <div className={`flex items-center justify-center min-w-[24px] h-5 rounded-lg text-[10px] font-black px-1.5 transition-colors
                      ${isActive 
                        ? 'bg-white/20 dark:bg-emerald-500/20 text-white dark:text-emerald-400' 
                        : 'bg-slate-100 dark:bg-white/5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}
                    `}>
                      {total}
                    </div>
                  </button>
                )})}
                  </motion.nav>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
