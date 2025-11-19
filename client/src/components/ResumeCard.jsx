import { FileText, PencilIcon, TrashIcon, Calendar } from 'lucide-react';

const ResumeCard = ({ name, lastUpdated, onEdit, onDelete }) => (
  <div className="group relative flex h-full min-h-[200px] flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[var(--primary-color)] hover:bg-gray-50 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-[var(--primary-color)] dark:hover:bg-gray-800/90">
    {/* Action buttons - visible on hover */}
    <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.();
        }}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[var(--primary-color)] shadow-md transition-all hover:scale-110 hover:shadow-lg dark:bg-gray-700 dark:text-blue-300"
        aria-label="Edit resume"
      >
        <PencilIcon className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.();
        }}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-red-600 shadow-md transition-all hover:scale-110 hover:shadow-lg dark:bg-gray-700 dark:text-red-400"
        aria-label="Delete resume"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>

    {/* Main content */}
    <div className="relative z-0 flex flex-1 flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary-color)] to-[var(--accent-color)] shadow-lg shadow-blue-500/25 transition-transform duration-300 group-hover:scale-105">
        <FileText className="h-8 w-8 text-white" />
      </div>
      <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
        {name}
      </h3>
      <div className="mt-auto flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
        <Calendar className="h-3.5 w-3.5" />
        <span className="font-medium">{lastUpdated}</span>
      </div>
    </div>
  </div>
);

export default ResumeCard;

