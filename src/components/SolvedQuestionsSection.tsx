import React, { useState } from 'react';
import { SolvedProblem } from '../data/chapter1Content';

type ProblemFilter = 'all' | 'model' | 'extra';

interface SolvedQuestionsSectionProps {
  subtitle: string;
  questions: SolvedProblem[];
}

export const SolvedQuestionsSection: React.FC<SolvedQuestionsSectionProps> = ({ subtitle, questions }) => {
  const [filter, setFilter] = useState<ProblemFilter>('all');

  const visible = questions.filter((q) => {
    if (filter === 'model') return q.id.startsWith('pu-model');
    if (filter === 'extra') return !q.id.startsWith('pu-model');
    return true;
  });

  return (
    <section id="solved" aria-labelledby="solved-heading" className="space-y-6 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 id="solved-heading" className="text-2xl font-semibold text-slate-900 tracking-tight">
            03. Solved PU Model Questions &amp; Extra Exam Numericals
          </h2>
          <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0 no-print">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Questions (4)
          </button>
          <button
            type="button"
            onClick={() => setFilter('model')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              filter === 'model' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            PU Model Set
          </button>
          <button
            type="button"
            onClick={() => setFilter('extra')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              filter === 'extra' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Extra Exam Numericals
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {visible.map((q) => (
          <article
            key={q.id}
            className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 print-break-inside-avoid"
          >
            <div className="space-y-1.5 pb-4 border-b border-slate-100">
              <div className="text-xs text-slate-500">
                <span className="font-semibold text-sky-700">{q.tag}</span>
                <span aria-hidden="true"> · </span>
                <span>{q.marks}</span>
                <span aria-hidden="true"> · </span>
                <span>{q.source}</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{q.title}</h3>
              <p className="text-sm text-slate-800 leading-relaxed pt-1">{q.statement}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-slate-700">Given Data &amp; Setup</div>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                {q.given.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {q.tableHeaders && q.tableRows && (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
                        {q.tableHeaders.map((header, idx) => (
                          <th key={header} className={`py-2.5 px-3 ${idx === 0 ? 'text-left' : 'text-right'}`}>
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-mono tabular-nums text-slate-700">
                      {q.tableRows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50/50">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className={`py-2 px-3 ${cIdx === 0 ? 'text-left font-medium text-slate-900' : 'text-right'}`}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                    {q.tableTotals && (
                      <tfoot>
                        <tr className="bg-slate-50 border-t border-slate-200 text-xs font-mono font-semibold text-slate-900 tabular-nums">
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
                  <h4 className="text-sm font-semibold text-slate-900">{st.heading}</h4>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-1.5">
                    {st.work.map((line, lIdx) => (
                      <div key={lIdx} className="text-xs sm:text-sm font-mono text-slate-800 leading-relaxed tabular-nums">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg px-4 py-3 space-y-1">
              <div className="text-xs font-semibold text-emerald-800">Final Exam Answer</div>
              {q.finalAnswer.map((ans, aIdx) => (
                <div key={aIdx} className="text-sm font-mono font-medium text-slate-900 tabular-nums">
                  {ans}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
