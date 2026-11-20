import React, { useState } from 'react';
import { FormulaItem } from '../data/chapter1Content';

type CategoryFilter = 'All' | FormulaItem['category'];

interface FormulaSheetSectionProps {
  unitLabel: string;
  formulas: FormulaItem[];
  categoryLabels?: Record<FormulaItem['category'], string>;
}

export const FormulaSheetSection: React.FC<FormulaSheetSectionProps> = ({
  unitLabel,
  formulas,
  categoryLabels,
}) => {
  const [category, setCategory] = useState<CategoryFilter>('All');

  const filtered = formulas.filter((item) => category === 'All' || item.category === category);

  return (
    <section id="formulas" aria-labelledby="formulas-heading" className="space-y-5 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 id="formulas-heading" className="text-2xl font-semibold text-slate-900 tracking-tight">
            02. Master Formula &amp; Design Constant Sheet
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Every {unitLabel} formula, standard assumption/constant, and SI / measurement unit for rapid pre-exam revision.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0 no-print">
          {(['All', 'Location', 'Dispersion', 'Properties & Constants'] as CategoryFilter[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                category === cat ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat === 'All' ? 'All' : categoryLabels?.[cat] ?? cat}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
                <th className="py-3 px-4">Quantity / Measure</th>
                <th className="py-3 px-4">Symbol</th>
                <th className="py-3 px-4">Formula</th>
                <th className="py-3 px-4">Standard Assumption / Constant</th>
                <th className="py-3 px-4">SI / Data Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors align-top">
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900">{item.quantity}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{categoryLabels?.[item.category] ?? item.category}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-sky-800 whitespace-nowrap">{item.symbol}</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-900 min-w-[240px]">{item.formula}</td>
                  <td className="py-3 px-4 text-xs text-slate-600 leading-relaxed min-w-[200px]">
                    {item.assumptionOrConstant}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-700 whitespace-nowrap">{item.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
