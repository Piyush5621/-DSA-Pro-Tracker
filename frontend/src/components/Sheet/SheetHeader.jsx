import { ListFilter } from 'lucide-react';

const SheetHeader = ({ totalQuestions }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 sm:mb-0">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
        <ListFilter size={22} className="text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
          Problem Directory
        </h2>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
          {totalQuestions} total problems available
        </p>
      </div>
    </div>
  );
};

export default SheetHeader;
