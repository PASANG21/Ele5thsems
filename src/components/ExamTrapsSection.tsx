import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Circle } from 'lucide-react';
import { ExamTrap } from '../data/chapter1Content';

type TrapFilter = 'All' | ExamTrap['category'];

interface ExamTrapsSectionProps {
  traps: ExamTrap[];
  isCompleted: boolean;
  onToggleCompleted: () => void;
}

export const ExamTrapsSection: React.FC<ExamTrapsSectionProps> = ({
  traps,
  isCompleted,
  onToggleCompleted,
}) => {
  const [filter, setFilter] = useState<TrapFilter>('All');

  const visible = traps.filter((t) => filter === 'All' || t.category === filter);

  return (
    <section id="traps" aria-labelledby="traps-heading" className="space-y-6 scroll-mt-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 id="traps-heading" className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            04. Exam Traps, Sign Conventions &amp; High-Yield PU Topics
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Common sign mistakes, class-boundary &amp; ogive/histogram geometry errors, and recurring Purbanchal University question patterns.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 no-print">
          <button
            type="button"
            onClick={onToggleCompleted}
            aria-pressed={isCompleted}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${
              isCompleted
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/70'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
            )}
            <span>{isCompleted ? 'Section Completed' : 'Mark Section Completed'}</span>
          </button>

          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg">
            {(['All', 'Sign Convention', 'Boundary & Slope Geometry', 'High-Yield PU Topic'] as TrapFilter[]).map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    filter === cat
                      ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visible.map((trap) => (
          <article
            key={trap.id}
            className={`bg-white dark:bg-slate-900 border rounded-xl p-5 flex flex-col justify-between gap-4 print-break-inside-avoid transition-colors ${
              isCompleted
                ? 'border-emerald-300 dark:border-emerald-800/80'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="space-y-3">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{trap.category}</div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{trap.title}</h3>

              <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/70 rounded-lg p-3 space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  Common Trap / Mistake
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{trap.wrongApproach}</p>
              </div>

              <div className="bg-emerald-50/60 dark:bg-emerald-950/35 border border-emerald-200 dark:border-emerald-800/70 rounded-lg p-3 space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  Correct Rule
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">{trap.correctRule}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Examiner Tip: </span>
              {trap.examTip}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
