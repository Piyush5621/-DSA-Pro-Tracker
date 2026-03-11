import { motion, AnimatePresence } from 'framer-motion';
import { ListFilter } from 'lucide-react';
import TopicTree from './TopicTree';
import QuestionLink from './QuestionLink';

const SheetView = ({ viewData, filterType, searchQuery, setFilterType, setSearchQuery }) => {
  return (
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
            {viewData.type === 'tree' || viewData.type === 'techniques' ? (
              // Render Folders (both Topic and Technique folders are handled the same way by TopicTree)
              viewData.data.map((topic, idx) => (
                <TopicTree key={`node-${idx}`} node={topic} />
              ))
            ) : (
              // Render Flat Links for Search / Filter
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {viewData.data.map((link, idx) => (
                  <div key={`link-${idx}`} className="h-full">
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
  );
};

export default SheetView;
