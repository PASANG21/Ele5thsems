import React, { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { FormulaItem } from '../data/chapter1Content';

type CategoryFilter = 'All' | FormulaItem['category'];

interface FormulaSheetSectionProps {
  unitLabel: string;
  formulas: FormulaItem[];
  categoryLabels?: Record<FormulaItem['category'], string>;
  isCompleted: boolean;
  onToggleCompleted: () => void;
}

export const FormulaSheetSection: React.FC<FormulaSheetSectionProps> = ({
  unitLabel,
  formulas,
  categoryLabels,
  isCompleted,
  onToggleCompleted,
}) => {
  const [category, setCategory] = useState<CategoryFilter>('All');

  const filtered = formulas.filter((item) => category === 'All' || item.category === category);

  return (
    <section id="formulas" aria-labelledby="formulas-heading" className="space-y-5 scroll-mt-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 id="formulas-heading" className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            02. Master Formula &amp; Design Constant Sheet
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Every {unitLabel} formula, standard assumption/constant, and SI / measurement unit for rapid pre-exam revision.
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
            {(['All', 'Location', 'Dispersion', 'Properties & Constants'] as CategoryFilter[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  category === cat
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {cat === 'All' ? 'All' : categoryLabels?.[cat] ?? cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`bg-white dark:bg-slate-900 border rounded-xl overflow-hidden transition-colors ${
          isCompleted
            ? 'border-emerald-300 dark:border-emerald-800/80'
            : 'border-slate-200 dark:border-slate-800'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <th className="py-3 px-4">Quantity / Measure</th>
                <th className="py-3 px-4">Symbol</th>
                <th className="py-3 px-4">Formula</th>
                <th className="py-3 px-4">Standard Assumption / Constant</th>
                <th className="py-3 px-4">SI / Data Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors align-top">
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900 dark:text-slate-100">{item.quantity}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{categoryLabels?.[item.category] ?? item.category}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-sky-800 dark:text-sky-300 whitespace-nowrap">{item.symbol}</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-900 dark:text-slate-100 min-w-[240px]">{item.formula}</td>
                  <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed min-w-[200px]">
                    {item.assumptionOrConstant}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap">{item.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
