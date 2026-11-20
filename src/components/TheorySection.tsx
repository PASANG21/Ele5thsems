import React, { useState } from 'react';
import { DepthCode, DEPTH_LABELS, SubtopicNote } from '../data/chapter1Content';

type TheoryFilter = 'all' | 'derivations' | 'definitions';

interface TheorySectionProps {
  unitLabel: string;
  microSyllabusNote: string;
  notes: SubtopicNote[];
}

export const TheorySection: React.FC<TheorySectionProps> = ({ unitLabel, microSyllabusNote, notes }) => {
  const [filter, setFilter] = useState<TheoryFilter>('all');

  const visibleNotes = notes.filter((note) => {
    if (filter === 'derivations') return Boolean(note.derivationDR);
    return true;
  });

  return (
    <section id="theory" aria-labelledby="theory-heading" className="space-y-6 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 id="theory-heading" className="text-2xl font-semibold text-slate-900 tracking-tight">
            01. Complete Theory Notes &amp; Step-by-Step Derivations
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Covers every {unitLabel} subtopic from the Purbanchal University syllabus across Define (SD), Description (D), Derivation (DR), Illustration (I), Explanation (E), Application (A), and Numerical (N).
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0 no-print">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Subtopics
          </button>
          <button
            type="button"
            onClick={() => setFilter('derivations')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              filter === 'derivations' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Derivations (DR)
          </button>
          <button
            type="button"
            onClick={() => setFilter('definitions')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              filter === 'definitions' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Quick Definitions (SD)
          </button>
        </div>
      </div>

      {/* Syllabus Transparency Note */}
      <div className="bg-slate-100/70 border border-slate-200 rounded-lg px-4 py-3 text-xs text-slate-700 leading-relaxed">
        <span className="font-semibold text-slate-900">Syllabus &amp; Micro-Syllabus Alignment: </span>
        {microSyllabusNote}
      </div>

      <div className="space-y-8">
        {visibleNotes.map((note) => (
          <article
            key={note.id}
            className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 print-break-inside-avoid"
          >
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 pb-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">
                {note.code}. {note.title}
              </h3>
              <div className="text-xs font-mono text-slate-500 whitespace-nowrap">
                {note.depths.map((d: DepthCode, idx: number) => (
                  <span key={d}>
                    {d} ({DEPTH_LABELS[d]})
                    {idx < note.depths.length - 1 ? ' · ' : ''}
                  </span>
                ))}
              </div>
            </div>

            {/* Always show Definition (SD) */}
            <div>
              <div className="text-xs font-semibold text-sky-700 mb-1">Definition (SD)</div>
              <p className="text-sm text-slate-800 leading-relaxed">{note.definitionSD}</p>
            </div>

            {filter !== 'definitions' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs font-semibold text-slate-700 mb-1">Description (D)</div>
                    <p className="text-sm text-slate-600 leading-relaxed">{note.descriptionD}</p>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-700 mb-1">Explanation (E)</div>
                    <p className="text-sm text-slate-600 leading-relaxed">{note.explanationE}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
                  <div>
                    <div className="text-xs font-semibold text-slate-700 mb-1">Illustration (I)</div>
                    <p className="text-sm text-slate-600 leading-relaxed">{note.illustrationI}</p>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-700 mb-1">Engineering Application (A)</div>
                    <p className="text-sm text-slate-600 leading-relaxed">{note.applicationA}</p>
                  </div>
                </div>

                {note.derivationDR && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{note.derivationDR.title}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{note.derivationDR.goal}</p>
                    </div>

                    <ol className="space-y-3">
                      {note.derivationDR.steps.map((s) => (
                        <li key={s.step} className="text-sm">
                          <div className="font-medium text-slate-800">
                            Step {s.step}: {s.title}
                          </div>
                          <div className="font-mono text-xs sm:text-sm text-sky-900 bg-white border border-slate-200 rounded px-3 py-2 my-1.5 overflow-x-auto">
                            {s.equation}
                          </div>
                          <div className="text-xs text-slate-600">{s.note}</div>
                        </li>
                      ))}
                    </ol>

                    <div className="pt-2 border-t border-slate-200 text-xs sm:text-sm">
                      <span className="font-semibold text-emerald-800">Derived Result: </span>
                      <span className="font-mono text-slate-900">{note.derivationDR.result}</span>
                    </div>
                  </div>
                )}

                <div className="text-xs text-slate-700 pt-2 border-t border-slate-100">
                  <span className="font-semibold text-slate-900">Numerical Checkpoint (N): </span>
                  {note.keyTakeawayN}
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};
