import { LayoutGrid, Palette, Sparkles } from 'lucide-react';
import SectionBadge from './SectionBadge';

const TEMPLATE_GROUPS = [
  {
    id: 'modern',
    name: 'Modern Edge',
    description: 'Bold typography with adaptive sections for product, design, and tech candidates.',
    accent: 'from-blue-500/90 to-cyan-500/80',
    highlights: ['ATS friendly', 'Skills spotlight band', 'Version history ready'],
  },
  {
    id: 'minimal',
    name: 'Minimal Focus',
    description: 'Clean two-column layout that keeps recruiters focused on your strongest experience.',
    accent: 'from-slate-800/90 to-slate-600/80',
    highlights: ['2-column grid', 'Auto-adjusting typography', 'PDF perfect spacing'],
  },
  {
    id: 'spotlight',
    name: 'Spotlight',
    description: 'Visual-first template with a hero banner perfect for portfolios and creative work.',
    accent: 'from-violet-500/90 to-fuchsia-500/80',
    highlights: ['Photo ready', 'Color-accent blocks', 'Adaptive for long form content'],
  },
];

const TemplateShowcase = () => (
  <section
    id="templates"
    className="relative mt-24 px-4 md:px-16 lg:px-24 xl:px-32"
    aria-labelledby="template-showcase-heading"
  >
    <div className="absolute -top-10 left-1/2 h-64 w-[520px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[220px] dark:bg-white/5" />
    <header className="relative text-center">
      <SectionBadge icon={LayoutGrid} label="Templates" className="mx-auto" />
      <h2 id="template-showcase-heading" className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">
        Purpose-built layouts for every role
      </h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
        Switch templates instantly without reformatting. Each layout pulls from the same resume data model, so you can experiment freely before exporting.
      </p>
    </header>

    <div className="relative mt-12 grid gap-6 lg:grid-cols-3">
      {TEMPLATE_GROUPS.map((template) => (
        <article
          key={template.id}
          className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/50"
        >
          <div className={`relative h-28 bg-gradient-to-br ${template.accent}`}>
            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs text-white backdrop-blur-md">
              <Sparkles className="size-3.5" />
              Instant preview
            </div>
            <div className="absolute -bottom-6 right-6 h-20 w-32 rounded-lg border border-white/50 bg-white/70 shadow-xl backdrop-blur-sm dark:border-white/20 dark:bg-white/10" />
          </div>
          <div className="space-y-4 px-6 pb-6 pt-10">
            <header>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{template.name}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{template.description}</p>
            </header>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              {template.highlights.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Palette className="size-4 text-[var(--accent-color)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default TemplateShowcase;

