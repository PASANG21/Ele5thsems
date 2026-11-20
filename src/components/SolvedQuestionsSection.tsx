import React, { useState } from 'react';
import { Check, CheckCircle2, Circle } from 'lucide-react';
import { SolvedProblem } from '../data/chapter1Content';

type ProblemFilter = 'all' | 'model' | 'extra';

interface SolvedQuestionsSectionProps {
  subtitle: string;
  questions: SolvedProblem[];
  completedQuestions: string[];
  onToggleQuestion: (questionId: string) => void;
  onToggleAllQuestions: () => void;
}

export const SolvedQuestionsSection: React.FC<SolvedQuestionsSectionProps> = ({
  subtitle,
  questions,
  completedQuestions,
  onToggleQuestion,
  onToggleAllQuestions,
}) => {
  const [filter, setFilter] = useState<ProblemFilter>('all');

  const completedSet = new Set(completedQuestions);
  const completedCount = questions.filter((q) => completedSet.has(q.id)).length;
  const allCompleted = questions.length > 0 && completedCount === questions.length;

  const visible = questions.filter((q) => {
    if (filter === 'model') return q.id.startsWith('pu-model');
    if (filter === 'extra') return !q.id.startsWith('pu-model');
    return true;
  });

  return (
    <section id="solved" aria-labelledby="solved-heading" className="space-y-6 scroll-mt-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 id="solved-heading" className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            03. Solved PU Model Questions &amp; Extra Exam Numericals
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 no-print">
          <button
            type="button"
            onClick={onToggleAllQuestions}
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
              {allCompleted ? 'Section Completed' : 'Mark Section Completed'} ({completedCount}/{questions.length})
            </span>
          </button>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filter === 'all'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              All Questions ({questions.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('model')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filter === 'model'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              PU Model Set
            </button>
            <button
              type="button"
              onClick={() => setFilter('extra')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filter === 'extra'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Extra Exam Numericals
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {visible.map((q) => {
          const isCompleted = completedSet.has(q.id);
          return (
            <article
              key={q.id}
              className={`bg-white dark:bg-slate-900 border rounded-xl p-6 space-y-5 print-break-inside-avoid transition-colors ${
                isCompleted
                  ? 'border-emerald-300 dark:border-emerald-800/80'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-1.5 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-sky-700 dark:text-sky-400">{q.tag}</span>
                    <span aria-hidden="true"> · </span>
                    <span>{q.marks}</span>
                    <span aria-hidden="true"> · </span>
                    <span>{q.source}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleQuestion(q.id)}
                    aria-pressed={isCompleted}
                    aria-label={isCompleted ? `Mark ${q.tag} ${q.title} incomplete` : `Mark ${q.tag} ${q.title} completed`}
                    className={`no-print inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${
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

                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{q.title}</h3>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed pt-1">{q.statement}</p>
              </div>

            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Given Data &amp; Setup</div>
              <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-1">
                {q.given.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {q.tableHeaders && q.tableRows && (
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {q.tableHeaders.map((header, idx) => (
                          <th key={header} className={`py-2.5 px-3 ${idx === 0 ? 'text-left' : 'text-right'}`}>
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {q.tableRows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className={`py-2 px-3 ${cIdx === 0 ? 'text-left font-medium text-slate-900 dark:text-slate-100' : 'text-right'}`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                    {q.tableTotals && (
                      <tfoot>
                        <tr className="bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 text-xs font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                          {q.tableTotals.map((cell, cIdx) => (
                            <td key={cIdx} className={`py-2.5 px-3 ${cIdx === 0 ? 'text-left' : 'text-right'}`}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {q.steps.map((st, sIdx) => (
                <div key={sIdx} className="space-y-1.5">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{st.heading}</h4>
                  <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 space-y-1.5">
                    {st.work.map((line, lIdx) => (
                      <div key={lIdx} className="text-xs sm:text-sm font-mono text-slate-800 dark:text-slate-200 leading-relaxed tabular-nums">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-emerald-50/60 dark:bg-emerald-950/35 border border-emerald-200 dark:border-emerald-800/70 rounded-lg px-4 py-3 space-y-1">
              <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Final Exam Answer</div>
              {q.finalAnswer.map((ans, aIdx) => (
                <div key={aIdx} className="text-sm font-mono font-medium text-slate-900 dark:text-slate-100 tabular-nums">
                  {ans}
                </div>
              ))}
            </div>
          </article>
          );
        })}
      </div>
    </section>
  );
};
