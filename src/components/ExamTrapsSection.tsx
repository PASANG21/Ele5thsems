import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ExamTrap } from '../data/chapter1Content';

type TrapFilter = 'All' | ExamTrap['category'];

interface ExamTrapsSectionProps {
  traps: ExamTrap[];
}

export const ExamTrapsSection: React.FC<ExamTrapsSectionProps> = ({ traps }) => {
  const [filter, setFilter] = useState<TrapFilter>('All');

  const visible = traps.filter((t) => filter === 'All' || t.category === filter);

  return (
    <section id="traps" aria-labelledby="traps-heading" className="space-y-6 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 id="traps-heading" className="text-2xl font-semibold text-slate-900 tracking-tight">
            04. Exam Traps, Sign Conventions &amp; High-Yield PU Topics
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Common sign mistakes, class-boundary &amp; ogive/histogram geometry errors, and recurring Purbanchal University question patterns.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0 no-print">
          {(['All', 'Sign Convention', 'Boundary & Slope Geometry', 'High-Yield PU Topic'] as TrapFilter[]).map(
            (cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filter === cat ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visible.map((trap) => (
          <article
            key={trap.id}
            className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4 print-break-inside-avoid"
          >
            <div className="space-y-3">
              <div className="text-xs font-medium text-slate-500">{trap.category}</div>
              <h3 className="text-base font-semibold text-slate-900">{trap.title}</h3>

              <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  Common Trap / Mistake
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{trap.wrongApproach}</p>
              </div>

              <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3 space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  Correct Rule
                </div>
                <p className="text-xs text-slate-800 leading-relaxed">{trap.correctRule}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Examiner Tip: </span>
              {trap.examTip}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
