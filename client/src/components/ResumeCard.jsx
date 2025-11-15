import { File, PencilIcon, TrashIcon } from 'lucide-react';

const ResumeCard = ({ name, lastUpdated, onEdit, onDelete }) => (
  <button
    className="group w-full relative h-48 flex flex-col items-center justify-center rounded-md border border-[var(--primary-color)] dark:border-white/50 hover:shadow-xs hover:shadow-gray-500 dark:hover:shadow-black hover:translate-x-[2px] hover:translate-y-[-2px] bg-gradient-to-r from-[var(--gradient-primary-color)] to-[var(--gradient-accent-color)] transition-all duration-300"
  >
    <File className="size-11 p-2.5 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] rounded-full text-white border border-white" />
    <p className="text-xs group-hover:text-[var(--primary-color)] transition-all duration-300 mt-2">
      {name}
    </p>

    <div className="absolute bottom-2 left-0 right-0 flex flex-col items-center text-xs">
      <p>Last updated:</p>
      <p className="font-light">{lastUpdated}</p>
    </div>

    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.();
        }}
        className="size-4 text-[var(--ai-blue)] hover:scale-110 transition-transform"
        aria-label="Edit resume"
      >
        <PencilIcon className="size-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.();
        }}
        className="size-4 text-red-500 hover:scale-110 transition-transform"
        aria-label="Delete resume"
      >
        <TrashIcon className="size-4" />
      </button>
    </div>
  </button>
);

export default ResumeCard;

