import { useEffect, useState, useMemo } from 'react';
import { useAuth } from './context/AuthContext';
import { useProgress } from './context/ProgressContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sheet/Sidebar';
import DataTable from './components/Sheet/DataTable';
import { BookOpen, Loader2, TrendingUp, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import dsaDataLocal from './data/dsaData.json';

  const buildTechniquesData = (data) => {
    const techMap = {
        'Two Pointers': { name: 'Two Pointers', type: 'folder', children: [], links: [] },
        'Sliding Window': { name: 'Sliding Window', type: 'folder', children: [], links: [] },
        'Binary Search Variants': { name: 'Binary Search Variants', type: 'folder', children: [], links: [] },
        'Prefix Sum': { name: 'Prefix Sum', type: 'folder', children: [], links: [] },
        'Recursion Patterns': { name: 'Recursion Patterns', type: 'folder', children: [], links: [] },
        'Backtracking': { name: 'Backtracking', type: 'folder', children: [], links: [] },
        'DP Patterns': { name: 'DP Patterns', type: 'folder', children: [], links: [] },
        'Graph Traversal': { name: 'Graph Traversal', type: 'folder', children: [], links: [] },
        'Divide & Conquer': { name: 'Divide & Conquer', type: 'folder', children: [], links: [] },
        'Tree Traversal': { name: 'Tree Traversal', type: 'folder', children: [], links: [] },
        'Linked List Techniques': { name: 'Linked List Techniques', type: 'folder', children: [], links: [] },
        'Stack & Queue': { name: 'Stack & Queue', type: 'folder', children: [], links: [] },
        'Hashing Techniques': { name: 'Hashing Techniques', type: 'folder', children: [], links: [] },
        'Bit Manipulation': { name: 'Bit Manipulation', type: 'folder', children: [], links: [] },
        'Sorting Techniques': { name: 'Sorting Techniques', type: 'folder', children: [], links: [] },
        'Heap / Priority Queue': { name: 'Heap / Priority Queue', type: 'folder', children: [], links: [] },
        'Trie': { name: 'Trie', type: 'folder', children: [], links: [] },
        'String Matching': { name: 'String Matching', type: 'folder', children: [], links: [] },
        'Other': { name: 'Other', type: 'folder', children: [], links: [] },
    };

    const extractToTech = (nodes, parentPath) => {
        nodes.forEach(n => {
            if (n.type === 'link') {
                const pathStr = (parentPath + ' ' + n.name).toLowerCase();
                if (pathStr.includes('sliding window')) techMap['Sliding Window'].links.push(n);
                else if (pathStr.includes('two pointer') || pathStr.includes('two-pointer')) techMap['Two Pointers'].links.push(n);
                else if (pathStr.includes('binary search')) techMap['Binary Search Variants'].links.push(n);
                else if (pathStr.includes('prefix sum')) techMap['Prefix Sum'].links.push(n);
                else if (pathStr.includes('backtrack')) techMap['Backtracking'].links.push(n);
                else if (pathStr.includes('recursion') || pathStr.includes('recursive')) techMap['Recursion Patterns'].links.push(n);
                else if (pathStr.includes('dp') || pathStr.includes('dynamic program')) techMap['DP Patterns'].links.push(n);
                else if (pathStr.includes('graph') || pathStr.includes('bfs') || pathStr.includes('dfs')) techMap['Graph Traversal'].links.push(n);
                else if (pathStr.includes('divide') || pathStr.includes('conquer') || pathStr.includes('merge sort')) techMap['Divide & Conquer'].links.push(n);
                else if (pathStr.includes('tree') || pathStr.includes('bst') || pathStr.includes('order')) techMap['Tree Traversal'].links.push(n);
                else if (pathStr.includes('linked list')) techMap['Linked List Techniques'].links.push(n);
                else if (pathStr.includes('stack') || pathStr.includes('queue')) techMap['Stack & Queue'].links.push(n);
                else if (pathStr.includes('hash') || pathStr.includes('map')) techMap['Hashing Techniques'].links.push(n);
                else if (pathStr.includes('bit ') || pathStr.includes('xor') || pathStr.includes('bitwise') || pathStr.includes('bit manipulation')) techMap['Bit Manipulation'].links.push(n);
                else if (pathStr.includes('sort')) techMap['Sorting Techniques'].links.push(n);
                else if (pathStr.includes('heap') || pathStr.includes('priority queue')) techMap['Heap / Priority Queue'].links.push(n);
                else if (pathStr.includes('trie')) techMap['Trie'].links.push(n);
                else if (pathStr.includes('string match') || pathStr.includes('kmp') || pathStr.includes('rabin')) techMap['String Matching'].links.push(n);
                else techMap['Other'].links.push(n);
            } else {
                if (n.links) {
                    n.links.forEach((l) => {
                        const pathStr = (parentPath + ' ' + n.name + ' ' + l.name).toLowerCase();
                        if (pathStr.includes('sliding window')) techMap['Sliding Window'].links.push(l);
                        else if (pathStr.includes('two pointer') || pathStr.includes('two-pointer')) techMap['Two Pointers'].links.push(l);
                        else if (pathStr.includes('binary search')) techMap['Binary Search Variants'].links.push(l);
                        else if (pathStr.includes('prefix sum')) techMap['Prefix Sum'].links.push(l);
                        else if (pathStr.includes('backtrack')) techMap['Backtracking'].links.push(l);
                        else if (pathStr.includes('recursion') || pathStr.includes('recursive')) techMap['Recursion Patterns'].links.push(l);
                        else if (pathStr.includes('dp') || pathStr.includes('dynamic program')) techMap['DP Patterns'].links.push(l);
                        else if (pathStr.includes('graph') || pathStr.includes('bfs') || pathStr.includes('dfs')) techMap['Graph Traversal'].links.push(l);
                        else if (pathStr.includes('divide') || pathStr.includes('conquer') || pathStr.includes('merge sort')) techMap['Divide & Conquer'].links.push(l);
                        else if (pathStr.includes('tree') || pathStr.includes('bst') || pathStr.includes('order')) techMap['Tree Traversal'].links.push(l);
                        else if (pathStr.includes('linked list')) techMap['Linked List Techniques'].links.push(l);
                        else if (pathStr.includes('stack') || pathStr.includes('queue')) techMap['Stack & Queue'].links.push(l);
                        else if (pathStr.includes('hash') || pathStr.includes('map')) techMap['Hashing Techniques'].links.push(l);
                        else if (pathStr.includes('bit ') || pathStr.includes('xor') || pathStr.includes('bitwise') || pathStr.includes('bit manipulation')) techMap['Bit Manipulation'].links.push(l);
                        else if (pathStr.includes('sort')) techMap['Sorting Techniques'].links.push(l);
                        else if (pathStr.includes('heap') || pathStr.includes('priority queue')) techMap['Heap / Priority Queue'].links.push(l);
                        else if (pathStr.includes('trie')) techMap['Trie'].links.push(l);
                        else if (pathStr.includes('string match') || pathStr.includes('kmp') || pathStr.includes('rabin')) techMap['String Matching'].links.push(l);
                        else techMap['Other'].links.push(l);
                    });
                }
                if (n.children) extractToTech(n.children, parentPath + ' ' + n.name);
            }
        });
    };
    extractToTech(data, '');
    return Object.values(techMap); // Return all to show 0 if empty
  };

const Sheet = () => {
  const { user } = useAuth();
  const { solved, userProgress } = useProgress();
  const [sheetData, setSheetData] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicName, setSelectedTopicName] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    setSheetData(dsaDataLocal);
  }, []);

  const sidebarFilteredData = useMemo(() => {
    if (sheetData.length === 0) return [];
    
    // Exact topics provided by user
    const topicsItems = sheetData;
    
    // Techniques built dynamically
    const techniquesItems = buildTechniquesData(sheetData);

    return [
      { title: 'Topics', items: topicsItems },
      { title: 'Techniques', items: techniquesItems }
    ];
  }, [sheetData]);

  useEffect(() => {
    if (sidebarFilteredData.length > 0 && !selectedTopicName) {
       setSelectedTopicName(sidebarFilteredData[0].items[0].name);
    }
  }, [sidebarFilteredData, selectedTopicName]);

  useEffect(() => {
    const countLinks = (nodes) => {
      let count = 0;
      nodes?.forEach(node => {
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

  const totalSolved = solved.length;
  const totalStuck = Object.values(userProgress).filter(p => p.status === 'Stuck').length;
  const totalRevisit = Object.values(userProgress).filter(p => p.status === 'Revisit').length;
  const percentage = totalQuestions > 0 ? ((totalSolved / totalQuestions) * 100).toFixed(1) : 0;

  const activeTopicObj = useMemo(() => {
    for (const section of sidebarFilteredData) {
      const found = section.items.find(t => t.name === selectedTopicName);
      if (found) return found;
    }
    return null;
  }, [sidebarFilteredData, selectedTopicName]);

  if (!user) {
    if (typeof window !== 'undefined') window.location.href = '/';
    return null;
  }

  if (sheetData.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#080d17] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30 animate-pulse">
          <BookOpen size={28} className="text-white" />
        </div>
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm font-bold tracking-widest uppercase">Loading Matrix...</span>
        </div>
      </div>
    );
  }

  const metrics = [
    { label: 'Completion', val: `${percentage}%`, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', icon: TrendingUp },
    { label: 'Solved', val: totalSolved, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 },
    { label: 'Need Revisit', val: totalRevisit, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', icon: Clock },
    { label: 'Stuck', val: totalStuck, color: 'text-rose-500 dark:text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', icon: AlertTriangle }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030612] transition-colors duration-300 flex flex-col overflow-hidden relative">
      {/* Background glow mesh for premium feel */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px]" />
      </div>

      {/* Top Header */}
      <div className="relative z-10 w-full">
         <Navbar totalQuestions={totalQuestions} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      {/* Main Layout Grid */}
      <div className="flex flex-1 overflow-hidden relative z-10 p-2 sm:p-4 gap-4">
        
        {/* Left Sidebar - Foldable */}
        {!searchQuery && (
           <motion.div 
             initial={{ width: 288 }}
             animate={{ width: isSidebarOpen ? 288 : 0, opacity: isSidebarOpen ? 1 : 0, marginInlineEnd: isSidebarOpen ? 0 : -16 }}
             transition={{ type: 'spring', stiffness: 300, damping: 30 }}
             className="hidden md:flex flex-shrink-0 z-10 h-full overflow-hidden"
           >
             <div className="w-72 h-full rounded-3xl bg-white/60 dark:bg-[#09101E]/80 backdrop-blur-xl border border-slate-200 dark:border-white/5 shadow-xl shadow-black/5 dark:shadow-none overflow-hidden flex flex-col items-start">
               <Sidebar
                 sections={sidebarFilteredData}
                 selectedTopic={selectedTopicName}
                 setSelectedTopic={setSelectedTopicName}
               />
             </div>
           </motion.div>
        )}

        {/* Central Workspace */}
        <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar relative z-0">
           <div className="w-full px-4 sm:px-8 py-8 flex flex-col">
              {/* Sidebar Toggle Button for Desktop */}
              {!searchQuery && (
                <button
                   onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                   className="hidden md:flex absolute top-4 left-4 z-20 w-8 h-8 rounded-full bg-white dark:bg-[#121826] border border-slate-200 dark:border-white/10 items-center justify-center text-slate-500 shadow-sm hover:text-slate-800 dark:hover:text-amber-400 transition-colors"
                >
                   <motion.div animate={{ rotate: isSidebarOpen ? 0 : 180 }}>
                      <BookOpen size={14} />
                   </motion.div>
                </button>
              )}

              {/* Metric Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                 {metrics.map((m, i) => {
                    const Icon = m.icon;
                    return (
                      <motion.div 
                        key={m.label}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`flex items-center gap-4 py-4 px-5 rounded-3xl border bg-white/60 dark:bg-[#09101E]/80 backdrop-blur-xl shadow-md dark:border-white/5 dark:shadow-none ${m.bg.replace('bg-', 'hover:bg-').replace('border-', 'hover:border-')} transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden`}
                      >
                         <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${m.bg} relative z-10 shadow-inner`}>
                            <Icon size={18} className={m.color} />
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">
                               {m.label}
                            </span>
                            <span className={`text-xl font-black tracking-tight leading-none mt-1 ${m.color}`}>
                               {m.val}
                            </span>
                         </div>
                      </motion.div>
                    )
                 })}
              </div>

              {/* Data Table */}
              <DataTable 
                  topic={activeTopicObj} 
                  searchQuery={searchQuery} 
                  solved={solved}
              />

           </div>
        </main>
      </div>
    </div>
  );
};

export default Sheet;