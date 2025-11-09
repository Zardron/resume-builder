import React from 'react';

const SectionBadge = ({ icon: Icon, label, className = '' }) => (
  <span
    className={`inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white/90 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 ${className}`}
  >
    {Icon ? <Icon className="size-3.5 text-[var(--accent-color)]" strokeWidth={1.75} aria-hidden="true" /> : null}
    <span className="tracking-[0.2em]">{label}</span>
  </span>
);

export default SectionBadge;

