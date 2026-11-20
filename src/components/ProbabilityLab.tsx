import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

type LabMode = 'bayes' | 'venn';
type BayesPreset = 'pu-q1' | 'bsc-channel';

interface BayesCause {
  id: string;
  label: string;
  prior: number;
  likelihood: number;
}

const PRESET_PU_Q1: BayesCause[] = [
  { id: 'M1', label: 'Machine M₁', prior: 0.2, likelihood: 0.01 },
  { id: 'M2', label: 'Machine M₂', prior: 0.3, likelihood: 0.02 },
  { id: 'M3', label: 'Machine M₃', prior: 0.5, likelihood: 0.03 },
];

const PRESET_CHANNEL: BayesCause[] = [
  { id: 'T0', label: 'Sent Bit 0 (T₀)', prior: 0.45, likelihood: 0.04 },
  { id: 'T1', label: 'Sent Bit 1 (T₁)', prior: 0.55, likelihood: 0.98 },
];

export const ProbabilityLab: React.FC = () => {
  const [mode, setMode] = useState<LabMode>('bayes');
  const [bayesPreset, setBayesPreset] = useState<BayesPreset>('pu-q1');
  const [causes, setCauses] = useState<BayesCause[]>(PRESET_PU_Q1);

  // Venn / Additive Law state (PU Model Q5 defaults)
  const [pA, setPA] = useState<number>(0.6);
  const [pB, setPB] = useState<number>(0.4);
  const [pAndB, setPAndB] = useState<number>(0.2);

  const handleBayesPreset = (next: BayesPreset) => {
    setBayesPreset(next);
    setCauses(next === 'pu-q1' ? PRESET_PU_Q1.map((c) => ({ ...c })) : PRESET_CHANNEL.map((c) => ({ ...c })));
  };

  const handleReset = () => {
    if (mode === 'bayes') {
      handleBayesPreset(bayesPreset);
    } else {
      setPA(0.6);
      setPB(0.4);
      setPAndB(0.2);
    }
  };

  const updateCause = (idx: number, field: 'prior' | 'likelihood', raw: string) => {
    const val = Math.max(0, Math.min(1, Number.parseFloat(raw) || 0));
    setCauses((prev) => prev.map((c, i) => (i === idx ? { ...c, [field]: val } : c)));
  };

  // Bayes Computations (auto-normalize priors if user edits so sum = 1)
  const priorSum = causes.reduce((s, c) => s + c.prior, 0) || 1;
  const normalized = causes.map((c) => {
    const pPrior = c.prior / priorSum;
    const joint = pPrior * c.likelihood;
    return { ...c, pPrior, joint };
  });
  const totalEvidence = normalized.reduce((s, c) => s + c.joint, 0);
  const withPosterior = normalized.map((c) => ({
    ...c,
    posterior: totalEvidence > 0 ? c.joint / totalEvidence : 0,
  }));

  // Venn clamping (Fréchet bounds)
  const minAnd = Math.max(0, Number((pA + pB - 1).toFixed(2)));
  const maxAnd = Math.min(pA, pB);
  const clampedAnd = Math.max(minAnd, Math.min(maxAnd, pAndB));
  const pUnion = pA + pB - clampedAnd;
  const pAOnly = pA - clampedAnd;
  const pBOnly = pB - clampedAnd;
  const pNeither = Math.max(0, 1 - pUnion);
  const isIndependent = Math.abs(clampedAnd - pA * pB) < 0.005;
  const isDisjoint = clampedAnd < 0.005;

  const evidenceLabel = bayesPreset === 'pu-q1' ? 'Defective (D)' : 'Received 1 (R₁)';

  // SVG Tree Geometry
  const W = 680;
  const H = 310;

  return (
    <section aria-labelledby="prob-lab-heading" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 no-print">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 id="prob-lab-heading" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Interactive Bayes&apos; Tree &amp; Additive Venn Law Lab
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Explore PU Model Q1 (3-Machine Bayes&apos; Theorem) and PU Model Q5 (Additive Law &amp; Set Difference) with live priors, likelihoods, and valid Fréchet bounds.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg">
            <button
              type="button"
              onClick={() => setMode('bayes')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'bayes'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Bayes&apos; Probability Tree
            </button>
            <button
              type="button"
              onClick={() => setMode('venn')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'venn'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Venn &amp; Additive Law (Q5)
            </button>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>

      {mode === 'bayes' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-stretch">
          {/* Left Zone: Probability Tree SVG */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg">
                <button
                  type="button"
                  onClick={() => handleBayesPreset('pu-q1')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    bayesPreset === 'pu-q1'
                      ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  PU Model Q1 (Machines M₁–M₃)
                </button>
                <button
                  type="button"
                  onClick={() => handleBayesPreset('bsc-channel')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    bayesPreset === 'bsc-channel'
                      ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  Extra Q2 (Binary Channel)
                </button>
              </div>

              <div className="text-xs font-mono text-slate-600 dark:text-slate-400 tabular-nums">
                Total P({evidenceLabel}) = {totalEvidence.toFixed(4)}
              </div>
            </div>

            <div className="my-auto">
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Two-Stage Bayes Probability Tree">
                {/* Root Node */}
                <circle cx={46} cy={H / 2} r={8} className="fill-slate-900 dark:fill-slate-100" />
                <text x={46} y={H / 2 + 24} textAnchor="middle" className="fill-slate-600 dark:fill-slate-400 text-[11px] font-medium">
                  Start (S)
                </text>

                {withPosterior.map((c, i) => {
                  const count = withPosterior.length;
                  const yStage1 = count === 2 ? (i === 0 ? 85 : 225) : 55 + i * 100;
                  const xStage1 = 235;
                  const xStage2 = 465;
                  const yHit = yStage1 - 18;
                  const yMiss = yStage1 + 18;

                  return (
                    <g key={c.id}>
                      {/* Stage 1 Branch */}
                      <line x1={54} y1={H / 2} x2={xStage1 - 10} y2={yStage1} className="stroke-slate-500 dark:stroke-slate-400" strokeWidth={1.75} />
                      <text
                        x={145}
                        y={(H / 2 + yStage1) / 2 - 6}
                        textAnchor="middle"
                        className="fill-slate-700 dark:fill-slate-300 text-[11px] font-mono"
                      >
                        P({c.id}) = {c.pPrior.toFixed(2)}
                      </text>
                      <circle cx={xStage1} cy={yStage1} r={7} fill="#0284C7" />
                      <text x={xStage1} y={yStage1 - 13} textAnchor="middle" className="fill-slate-900 dark:fill-slate-100 text-[11px] font-semibold">
                        {c.id}
                      </text>

                      {/* Stage 2 Evidence Branch (Hit) */}
                      <line x1={xStage1 + 7} y1={yStage1} x2={xStage2} y2={yHit} stroke="#0284C7" strokeWidth={2} />
                      <text x={(xStage1 + xStage2) / 2} y={yHit - 5} textAnchor="middle" className="fill-sky-800 dark:fill-sky-300 text-[11px] font-mono">
                        P(E|{c.id}) = {c.likelihood.toFixed(2)}
                      </text>
                      <circle cx={xStage2} cy={yHit} r={4.5} fill="#0284C7" />
                      <text x={xStage2 + 12} y={yHit + 4} className="fill-slate-900 dark:fill-slate-100 text-[11px] font-mono font-medium">
                        Joint: {c.joint.toFixed(4)} → Post: {(c.posterior * 100).toFixed(2)}%
                      </text>

                      {/* Stage 2 Non-Evidence Branch (Complement) */}
                      <line x1={xStage1 + 7} y1={yStage1} x2={xStage2} y2={yMiss} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth={1.25} strokeDasharray="4 3" />
                      <text x={(xStage1 + xStage2) / 2} y={yMiss + 12} textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono">
                        1 − P(E|{c.id}) = {(1 - c.likelihood).toFixed(2)}
                      </text>
                      <circle cx={xStage2} cy={yMiss} r={3.5} className="fill-slate-300 dark:fill-slate-700" />
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 mt-3 border-t border-slate-200 dark:border-slate-800">
              {withPosterior.map((c) => (
                <div key={`kpi-${c.id}`}>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Posterior P({c.id} | E)</div>
                  <div className="text-base font-semibold text-sky-700 dark:text-sky-400 font-mono tabular-nums">
                    {(c.posterior * 100).toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Zone: Editable Bayes Parameters */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900/80">
              <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Cause</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Prior P(Eᵢ) · Likelihood P(A|Eᵢ)</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {causes.map((c, idx) => (
                  <div key={c.id} className="px-4 py-3 flex items-center justify-between gap-2 text-sm">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100 text-xs">{c.label}</div>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                        Norm: {withPosterior[idx].pPrior.toFixed(3)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.05"
                        min={0}
                        max={1}
                        aria-label={`Prior for ${c.label}`}
                        value={c.prior}
                        onChange={(e) => updateCause(idx, 'prior', e.target.value)}
                        className="w-20 px-2 py-1 text-right font-mono text-xs bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 tabular-nums"
                      />
                      <input
                        type="number"
                        step="0.01"
                        min={0}
                        max={1}
                        aria-label={`Likelihood for ${c.label}`}
                        value={c.likelihood}
                        onChange={(e) => updateCause(idx, 'likelihood', e.target.value)}
                        className="w-20 px-2 py-1 text-right font-mono text-xs bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 tabular-nums"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-3 space-y-1 font-mono tabular-nums">
              <div className="font-sans font-semibold text-slate-800 dark:text-slate-200">Bayes&apos; Normalization Check</div>
              <div>
                ∑ P(Eᵢ) = 1.0000 · P({evidenceLabel}) = {totalEvidence.toFixed(4)}
              </div>
              <div>
                ∑ P(Eᵢ | {evidenceLabel}) = {withPosterior.reduce((s, c) => s + c.posterior, 0).toFixed(4)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-stretch">
          {/* Left Zone: Venn Diagram Canvas */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Sample Space S (Total Area = 1.00)</span>
              <span className="text-xs font-mono text-slate-600 dark:text-slate-400 tabular-nums">
                {isDisjoint ? 'DISJOINT (A ∩ B = ∅)' : isIndependent ? 'INDEPENDENT (P(A∩B) = P(A)P(B))' : 'DEPENDENT OVERLAP'}
              </span>
            </div>

            <div className="my-auto">
              {(() => {
                const overlapRatio = Math.min(pA, pB) > 0 ? clampedAnd / Math.min(pA, pB) : 0;
                const dist = 165 - overlapRatio * 95;
                const cxA = 340 - dist / 2;
                const cxB = 340 + dist / 2;
                const rA = 65 + pA * 38;
                const rB = 65 + pB * 38;
                return (
                  <svg viewBox="0 0 680 280" className="w-full h-auto" role="img" aria-label="Interactive Venn Diagram for Additive Law">
                    <rect x={24} y={14} width={632} height={248} rx={10} className="fill-white dark:fill-slate-900 stroke-slate-300 dark:stroke-slate-700" strokeWidth={1.5} />
                    <circle cx={cxA} cy={138} r={rA} fill="rgba(2, 132, 199, 0.16)" stroke="#0284C7" strokeWidth={2} />
                    <circle cx={cxB} cy={138} r={rB} fill="rgba(5, 150, 105, 0.16)" stroke="#059669" strokeWidth={2} />

                    <text x={cxA - rA * 0.42} y={134} textAnchor="middle" className="fill-sky-900 dark:fill-sky-200 text-xs font-semibold">
                      A only
                    </text>
                    <text x={cxA - rA * 0.42} y={152} textAnchor="middle" className="fill-sky-800 dark:fill-sky-300 text-xs font-mono">
                      {pAOnly.toFixed(2)}
                    </text>

                    <text x={340} y={134} textAnchor="middle" className="fill-slate-900 dark:fill-slate-100 text-xs font-semibold">
                      A ∩ B
                    </text>
                    <text x={340} y={152} textAnchor="middle" className="fill-slate-900 dark:fill-slate-100 text-xs font-mono">
                      {clampedAnd.toFixed(2)}
                    </text>

                    <text x={cxB + rB * 0.42} y={134} textAnchor="middle" className="fill-emerald-900 dark:fill-emerald-200 text-xs font-semibold">
                      B only
                    </text>
                    <text x={cxB + rB * 0.42} y={152} textAnchor="middle" className="fill-emerald-800 dark:fill-emerald-300 text-xs font-mono">
                      {pBOnly.toFixed(2)}
                    </text>

                    <text x={44} y={244} className="fill-slate-500 dark:fill-slate-400 text-xs font-mono">
                      Neither P((A ∪ B)′) = {pNeither.toFixed(2)}
                    </text>
                  </svg>
                );
              })()}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 mt-3 border-t border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">At least one P(A ∪ B)</div>
                <div className="text-base font-semibold text-sky-700 dark:text-sky-400 font-mono tabular-nums">{pUnion.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">A not B P(A ∩ B′)</div>
                <div className="text-base font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">{pAOnly.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Conditional P(A | B)</div>
                <div className="text-base font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                  {pB > 0 ? (clampedAnd / pB).toFixed(3) : '—'}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Product P(A)·P(B)</div>
                <div className="text-base font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">{(pA * pB).toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Right Zone: Probability Sliders */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-900/80 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <label htmlFor="pa-slider">P(A) — First Contract</label>
                  <span className="font-mono text-sky-700 dark:text-sky-400 tabular-nums">{pA.toFixed(2)}</span>
                </div>
                <input
                  id="pa-slider"
                  type="range"
                  min={0.05}
                  max={0.95}
                  step={0.05}
                  value={pA}
                  onChange={(e) => setPA(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <label htmlFor="pb-slider">P(B) — Second Contract</label>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 tabular-nums">{pB.toFixed(2)}</span>
                </div>
                <input
                  id="pb-slider"
                  type="range"
                  min={0.05}
                  max={0.95}
                  step={0.05}
                  value={pB}
                  onChange={(e) => setPB(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <label htmlFor="pandb-slider">P(A ∩ B) — Both Contracts</label>
                  <span className="font-mono text-slate-900 dark:text-slate-100 tabular-nums">{clampedAnd.toFixed(2)}</span>
                </div>
                <input
                  id="pandb-slider"
                  type="range"
                  min={minAnd}
                  max={Math.max(minAnd, maxAnd)}
                  step={0.05}
                  value={clampedAnd}
                  onChange={(e) => setPAndB(Number(e.target.value))}
                  className="w-full accent-slate-700 dark:accent-slate-300 cursor-pointer"
                />
                <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-1 tabular-nums">
                  Valid Fréchet range: [{minAnd.toFixed(2)}, {maxAnd.toFixed(2)}]
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-3 space-y-1 font-mono tabular-nums">
              <div>P(A ∪ B) = {pA.toFixed(2)} + {pB.toFixed(2)} − {clampedAnd.toFixed(2)} = {pUnion.toFixed(2)}</div>
              <div>P(A ∩ B′) = {pA.toFixed(2)} − {clampedAnd.toFixed(2)} = {pAOnly.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
