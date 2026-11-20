import React, { useState } from 'react';
import { Check, CheckCircle2, Circle } from 'lucide-react';
import { DepthCode, DEPTH_LABELS, SubtopicNote } from '../data/chapter1Content';

type TheoryFilter = 'all' | 'derivations' | 'definitions';

interface TheorySectionProps {
  unitLabel: string;
  microSyllabusNote: string;
  notes: SubtopicNote[];
  completedSubtopics: string[];
  onToggleSubtopic: (subtopicId: string) => void;
  onToggleAllSubtopics: () => void;
}

export const TheorySection: React.FC<TheorySectionProps> = ({
  unitLabel,
  microSyllabusNote,
  notes,
  completedSubtopics,
  onToggleSubtopic,
  onToggleAllSubtopics,
}) => {
  const [filter, setFilter] = useState<TheoryFilter>('all');

  const completedSet = new Set(completedSubtopics);
  const completedCount = notes.filter((n) => completedSet.has(n.id)).length;
  const allCompleted = notes.length > 0 && completedCount === notes.length;

  const visibleNotes = notes.filter((note) => {
    if (filter === 'derivations') return Boolean(note.derivationDR);
    return true;
  });

  return (
    <section id="theory" aria-labelledby="theory-heading" className="space-y-6 scroll-mt-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 id="theory-heading" className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            01. Complete Theory Notes &amp; Step-by-Step Derivations
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Covers every {unitLabel} subtopic from the Purbanchal University syllabus across Define (SD), Description (D), Derivation (DR), Illustration (I), Explanation (E), Application (A), and Numerical (N).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 no-print">
          <button
            type="button"
            onClick={onToggleAllSubtopics}
            aria-pressed={allCompleted}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${
              allCompleted
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/70'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {allCompleted ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
            )}
            <span>
              {allCompleted ? 'Section Completed' : 'Mark Section Completed'} ({completedCount}/{notes.length})
            </span>
          </button>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filter === 'all'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Subtopics
            </button>
            <button
              type="button"
              onClick={() => setFilter('derivations')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filter === 'derivations'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Derivations (DR)
            </button>
            <button
              type="button"
              onClick={() => setFilter('definitions')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filter === 'definitions'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Quick Definitions (SD)
            </button>
          </div>
        </div>
      </div>

      {/* Syllabus Transparency Note */}
      <div className="bg-slate-100/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
        <span className="font-semibold text-slate-900 dark:text-slate-100">Syllabus &amp; Micro-Syllabus Alignment: </span>
        {microSyllabusNote}
      </div>

      <div className="space-y-8">
        {visibleNotes.map((note) => {
          const isCompleted = completedSet.has(note.id);
          return (
            <article
              key={note.id}
              className={`bg-white dark:bg-slate-900 border rounded-xl p-6 space-y-5 print-break-inside-avoid transition-colors ${
                isCompleted
                  ? 'border-emerald-300 dark:border-emerald-800/80'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {note.code}. {note.title}
                  </h3>
                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    {note.depths.map((d: DepthCode, idx: number) => (
                      <span key={d}>
                        {d} ({DEPTH_LABELS[d]})
                        {idx < note.depths.length - 1 ? ' · ' : ''}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleSubtopic(note.id)}
                  aria-pressed={isCompleted}
                  aria-label={isCompleted ? `Mark ${note.code} ${note.title} incomplete` : `Mark ${note.code} ${note.title} completed`}
                  className={`no-print inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 self-start md:self-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${
                    isCompleted
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/80'
                      : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Circle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                      Mark Completed
                    </>
                  )}
                </button>
              </div>

              {/* Always show Definition (SD) */}
              <div>
                <div className="text-xs font-semibold text-sky-700 dark:text-sky-400 mb-1">Definition (SD)</div>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{note.definitionSD}</p>
              </div>

            {filter !== 'definitions' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">Description (D)</div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{note.descriptionD}</p>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">Explanation (E)</div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{note.explanationE}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">Illustration (I)</div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{note.illustrationI}</p>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">Engineering Application (A)</div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{note.applicationA}</p>
                  </div>
                </div>

                {note.derivationDR && (
                  <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{note.derivationDR.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{note.derivationDR.goal}</p>
                    </div>

                    <ol className="space-y-3">
                      {note.derivationDR.steps.map((s) => (
                        <li key={s.step} className="text-sm">
                          <div className="font-medium text-slate-800 dark:text-slate-200">
                            Step {s.step}: {s.title}
                          </div>
                          <div className="font-mono text-xs sm:text-sm text-sky-900 dark:text-sky-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-3 py-2 my-1.5 overflow-x-auto">
                            {s.equation}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">{s.note}</div>
                        </li>
                      ))}
                    </ol>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
                      <span className="font-semibold text-emerald-800 dark:text-emerald-400">Derived Result: </span>
                      <span className="font-mono text-slate-900 dark:text-slate-100">{note.derivationDR.result}</span>
                    </div>
                  </div>
                )}

                <div className="text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Numerical Checkpoint (N): </span>
                  {note.keyTakeawayN}
                </div>
              </>
            )}
          </article>
          );
        })}
      </div>
    </section>
  );
};
