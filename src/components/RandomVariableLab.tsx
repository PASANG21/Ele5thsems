import React, { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';

type RvMode = 'discrete' | 'continuous';
type DiscretePreset = 'pu-q6' | 'cap-failures';

interface DiscreteSupportRow {
  x: number;
  weight: number;
}

const PRESET_PU_Q6: DiscreteSupportRow[] = [
  { x: -2, weight: 0.1 },
  { x: -1, weight: 0.1 },
  { x: 0, weight: 0.2 },
  { x: 1, weight: 0.2 },
  { x: 2, weight: 0.3 },
  { x: 3, weight: 0.1 },
];

const PRESET_CAP: DiscreteSupportRow[] = [
  { x: 0, weight: 0.1 },
  { x: 1, weight: 0.3 },
  { x: 2, weight: 0.5 },
  { x: 3, weight: 0.1 },
];

export const RandomVariableLab: React.FC = () => {
  const [mode, setMode] = useState<RvMode>('discrete');
  const [preset, setPreset] = useState<DiscretePreset>('pu-q6');
  const [rows, setRows] = useState<DiscreteSupportRow[]>(PRESET_PU_Q6);
  const [showCdf, setShowCdf] = useState<boolean>(false);

  // Continuous PDF bounds [a, b] inside [0, 2] for f(x) = 0.75 * x * (2 - x)
  const [boundA, setBoundA] = useState<number>(0.5);
  const [boundB, setBoundB] = useState<number>(1.5);

  const handlePreset = (next: DiscretePreset) => {
    setPreset(next);
    setRows(next === 'pu-q6' ? PRESET_PU_Q6.map((r) => ({ ...r })) : PRESET_CAP.map((r) => ({ ...r })));
  };

  const handleReset = () => {
    if (mode === 'discrete') {
      handlePreset(preset);
    } else {
      setBoundA(0.5);
      setBoundB(1.5);
    }
  };

  const updateWeight = (idx: number, raw: string) => {
    const val = Math.max(0, Math.min(1, Number.parseFloat(raw) || 0));
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, weight: val } : r)));
  };

  const discreteCalc = useMemo(() => {
    const rawSum = rows.reduce((s, r) => s + r.weight, 0);
    const denom = rawSum > 0 ? rawSum : 1;
    let running = 0;
    const items = rows.map((r) => {
      const p = r.weight / denom;
      running += p;
      return { x: r.x, raw: r.weight, p, cdf: running };
    });
    const ex = items.reduce((s, r) => s + r.x * r.p, 0);
    const ex2 = items.reduce((s, r) => s + r.x * r.x * r.p, 0);
    const variance = Math.max(0, ex2 - ex * ex);
    const sd = Math.sqrt(variance);
    const maxP = Math.max(...items.map((i) => i.p), 0.1);
    return { rawSum, items, ex, ex2, variance, sd, maxP };
  }, [rows]);

  // Continuous calculations: f(x) = 0.75 * x * (2 - x), F(x) = 0.75 x^2 - 0.25 x^3
  const pdfFn = (x: number) => (x >= 0 && x <= 2 ? 0.75 * x * (2 - x) : 0);
  const cdfFn = (x: number) => {
    if (x <= 0) return 0;
    if (x >= 2) return 1;
    return 0.75 * x * x - 0.25 * x * x * x;
  };
  const lo = Math.min(boundA, boundB);
  const hi = Math.max(boundA, boundB);
  const intervalProb = cdfFn(hi) - cdfFn(lo);

  // SVG Dimensions
  const W = 680;
  const H = 310;
  const PAD_L = 54;
  const PAD_R = 26;
  const PAD_T = 24;
  const PAD_B = 44;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  const renderDiscreteSvg = () => {
    const count = discreteCalc.items.length;
    const slotW = plotW / count;
    const barW = Math.min(46, slotW * 0.52);
    const yMax = showCdf ? 1.0 : Math.min(1.0, Math.ceil((discreteCalc.maxP * 1.2) * 10) / 10);
    const yToPx = (val: number) => PAD_T + plotH - (val / (yMax || 1)) * plotH;

    const minX = discreteCalc.items[0].x;
    const maxX = discreteCalc.items[count - 1].x;
    const spanX = maxX - minX || 1;
    const meanPx = PAD_L + slotW * 0.5 + ((discreteCalc.ex - minX) / spanX) * (plotW - slotW);

    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Discrete Random Variable PMF and Expectation Fulcrum">
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const yVal = t * yMax;
          const py = yToPx(yVal);
          return (
            <g key={t}>
              <line x1={PAD_L} y1={py} x2={W - PAD_R} y2={py} className="stroke-slate-200 dark:stroke-slate-800" strokeWidth={1} />
              <text x={PAD_L - 8} y={py + 4} textAnchor="end" className="fill-slate-500 dark:fill-slate-400 text-[11px] font-mono">
                {yVal.toFixed(2)}
              </text>
            </g>
          );
        })}

        {discreteCalc.items.map((item, idx) => {
          const cx = PAD_L + slotW * (idx + 0.5);
          const bx = cx - barW / 2;
          const heightVal = showCdf ? item.cdf : item.p;
          const by = yToPx(heightVal);
          const bh = yToPx(0) - by;
          return (
            <g key={item.x}>
              <rect
                x={bx}
                y={by}
                width={barW}
                height={bh}
                rx={3}
                className={
                  showCdf
                    ? 'fill-emerald-100 dark:fill-emerald-900/50 stroke-emerald-600 dark:stroke-emerald-400'
                    : 'fill-sky-100 dark:fill-sky-900/50 stroke-sky-600 dark:stroke-sky-400'
                }
                strokeWidth={1.5}
              />
              <text x={cx} y={by - 6} textAnchor="middle" className="fill-slate-700 dark:fill-slate-200 text-[11px] font-mono font-medium">
                {heightVal.toFixed(2)}
              </text>
              <text x={cx} y={yToPx(0) + 18} textAnchor="middle" className="fill-slate-700 dark:fill-slate-300 text-[11px] font-mono">
                {item.x}
              </text>
            </g>
          );
        })}

        {/* Expectation Fulcrum Line & Triangle */}
        <line x1={meanPx} y1={PAD_T} x2={meanPx} y2={yToPx(0)} stroke="#D97706" strokeWidth={1.75} strokeDasharray="4 3" />
        <polygon points={`${meanPx},${yToPx(0)} ${meanPx - 6},${yToPx(0) + 9} ${meanPx + 6},${yToPx(0) + 9}`} fill="#D97706" />

        <line x1={PAD_L} y1={yToPx(0)} x2={W - PAD_R} y2={yToPx(0)} className="stroke-slate-600 dark:stroke-slate-400" strokeWidth={1.25} />
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={yToPx(0)} className="stroke-slate-600 dark:stroke-slate-400" strokeWidth={1.25} />

        <text x={PAD_L + plotW / 2} y={H - 5} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[11px]">
          Value of X · Amber Fulcrum: E(X) = {discreteCalc.ex.toFixed(3)} · Var(X) = {discreteCalc.variance.toFixed(3)}
        </text>
        <text x={16} y={PAD_T + plotH / 2} textAnchor="middle" transform={`rotate(-90 16 ${PAD_T + plotH / 2})`} className="fill-slate-500 dark:fill-slate-400 text-[11px]">
          {showCdf ? 'CDF F(x)' : 'PMF P(X = x)'}
        </text>
      </svg>
    );
  };

  const renderContinuousSvg = () => {
    const xToPx = (x: number) => PAD_L + (x / 2) * plotW;
    const yMax = 0.9;
    const yToPx = (y: number) => PAD_T + plotH - (y / yMax) * plotH;

    // Curve points across [0, 2]
    const samples = 60;
    const curvePts: string[] = [];
    for (let i = 0; i <= samples; i++) {
      const x = (i / samples) * 2;
      curvePts.push(`${xToPx(x)},${yToPx(pdfFn(x))}`);
    }

    // Shaded area polygon between lo and hi
    const shadePts: string[] = [`${xToPx(lo)},${yToPx(0)}`];
    const shadeSteps = 32;
    for (let i = 0; i <= shadeSteps; i++) {
      const x = lo + (i / shadeSteps) * (hi - lo);
      shadePts.push(`${xToPx(x)},${yToPx(pdfFn(x))}`);
    }
    shadePts.push(`${xToPx(hi)},${yToPx(0)}`);

    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Continuous PDF Curve and Shaded Integral Probability">
        {[0, 0.25, 0.5, 0.75].map((yVal) => {
          const py = yToPx(yVal);
          return (
            <g key={yVal}>
              <line x1={PAD_L} y1={py} x2={W - PAD_R} y2={py} className="stroke-slate-200 dark:stroke-slate-800" strokeWidth={1} />
              <text x={PAD_L - 8} y={py + 4} textAnchor="end" className="fill-slate-500 dark:fill-slate-400 text-[11px] font-mono">
                {yVal.toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* Shaded Area */}
        <polygon points={shadePts.join(' ')} fill="rgba(2, 132, 199, 0.20)" />

        {/* PDF Curve */}
        <polyline fill="none" stroke="#0284C7" strokeWidth={2.5} points={curvePts.join(' ')} />

        {/* Interval Boundary Lines */}
        <line x1={xToPx(lo)} y1={yToPx(0)} x2={xToPx(lo)} y2={yToPx(pdfFn(lo))} stroke="#0284C7" strokeWidth={1.75} strokeDasharray="4 2" />
        <line x1={xToPx(hi)} y1={yToPx(0)} x2={xToPx(hi)} y2={yToPx(pdfFn(hi))} stroke="#0284C7" strokeWidth={1.75} strokeDasharray="4 2" />

        {/* Mean Line at x = 1 */}
        <line x1={xToPx(1)} y1={PAD_T} x2={xToPx(1)} y2={yToPx(0)} stroke="#D97706" strokeWidth={1.5} strokeDasharray="3 3" />

        <line x1={PAD_L} y1={yToPx(0)} x2={W - PAD_R} y2={yToPx(0)} className="stroke-slate-600 dark:stroke-slate-400" strokeWidth={1.25} />
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={yToPx(0)} className="stroke-slate-600 dark:stroke-slate-400" strokeWidth={1.25} />

        {[0, 0.5, 1, 1.5, 2].map((tick) => (
          <text key={tick} x={xToPx(tick)} y={yToPx(0) + 18} textAnchor="middle" className="fill-slate-600 dark:fill-slate-400 text-[11px] font-mono">
            {tick.toFixed(1)}
          </text>
        ))}

        <text x={PAD_L + plotW / 2} y={H - 5} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[11px]">
          Surge Duration x (ms) · Shaded Area P({lo.toFixed(2)} ≤ X ≤ {hi.toFixed(2)}) = {intervalProb.toFixed(4)}
        </text>
        <text x={16} y={PAD_T + plotH / 2} textAnchor="middle" transform={`rotate(-90 16 ${PAD_T + plotH / 2})`} className="fill-slate-500 dark:fill-slate-400 text-[11px]">
          Density f(x)
        </text>
      </svg>
    );
  };

  return (
    <section aria-labelledby="rv-lab-heading" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 no-print">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 id="rv-lab-heading" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Interactive Random Variable, PMF/PDF &amp; Expectation Lab
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Verify PU Model Q6 (Discrete PMF, k, E(X), Var(X)) or integrate a Continuous PDF f(x) = 0.75x(2 − x) interactively over any interval [a, b].
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg">
            <button
              type="button"
              onClick={() => setMode('discrete')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'discrete'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Discrete PMF (Model Q6)
            </button>
            <button
              type="button"
              onClick={() => setMode('continuous')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'continuous'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Continuous PDF (Extra Q1)
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

      {mode === 'discrete' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg">
                <button
                  type="button"
                  onClick={() => handlePreset('pu-q6')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    preset === 'pu-q6'
                      ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  PU Model Q6
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset('cap-failures')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    preset === 'cap-failures'
                      ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  Extra Q2 (Capacitors)
                </button>
              </div>

              <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg">
                <button
                  type="button"
                  onClick={() => setShowCdf(false)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    !showCdf
                      ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  PMF
                </button>
                <button
                  type="button"
                  onClick={() => setShowCdf(true)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    showCdf
                      ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  CDF
                </button>
              </div>
            </div>

            <div className="my-auto">{renderDiscreteSvg()}</div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 mt-3 border-t border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Expected Value E(X)</div>
                <div className="text-base font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                  {discreteCalc.ex.toFixed(4)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Second Moment E(X²)</div>
                <div className="text-base font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                  {discreteCalc.ex2.toFixed(4)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Variance Var(X)</div>
                <div className="text-base font-semibold text-sky-700 dark:text-sky-400 font-mono tabular-nums">
                  {discreteCalc.variance.toFixed(4)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Std. Dev. SD(X)</div>
                <div className="text-base font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                  {discreteCalc.sd.toFixed(4)}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900/80">
              <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Value (x)</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Editable Weight · Norm. P(x) · CDF</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {discreteCalc.items.map((item, idx) => (
                  <div key={item.x} className="px-4 py-2 flex items-center justify-between text-sm">
                    <span className="font-mono text-slate-900 dark:text-slate-100 font-medium tabular-nums">x = {item.x}</span>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        step="0.05"
                        min={0}
                        max={1}
                        aria-label={`Probability weight for x = ${item.x}`}
                        value={item.raw}
                        onChange={(e) => updateWeight(idx, e.target.value)}
                        className="w-16 px-2 py-1 text-right font-mono text-xs bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 tabular-nums"
                      />
                      <span className="w-12 text-right font-mono text-xs text-sky-700 dark:text-sky-400 tabular-nums">
                        {item.p.toFixed(2)}
                      </span>
                      <span className="w-12 text-right font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                        {item.cdf.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2.5 font-mono tabular-nums">
              Input Sum ∑w = {discreteCalc.rawSum.toFixed(2)}{' '}
              {Math.abs(discreteCalc.rawSum - 1) < 0.001 ? '(Valid ∑P = 1.00)' : '(Auto-normalized to 1.00)'}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                PDF: f(x) = 0.75·x·(2 − x), 0 ≤ x ≤ 2
              </span>
              <span className="text-xs font-mono text-slate-600 dark:text-slate-400 tabular-nums">
                CDF: F(x) = 0.75x² − 0.25x³
              </span>
            </div>

            <div className="my-auto">{renderContinuousSvg()}</div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 mt-3 border-t border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Interval Prob</div>
                <div className="text-base font-semibold text-sky-700 dark:text-sky-400 font-mono tabular-nums">
                  {intervalProb.toFixed(4)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Mean E(X)</div>
                <div className="text-base font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">1.0000</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">E(X²)</div>
                <div className="text-base font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">1.2000</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Variance Var(X)</div>
                <div className="text-base font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">0.2000</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-900/80 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <label htmlFor="bound-a-slider">Lower Bound (a)</label>
                  <span className="font-mono text-sky-700 dark:text-sky-400 tabular-nums">{boundA.toFixed(2)} ms</span>
                </div>
                <input
                  id="bound-a-slider"
                  type="range"
                  min={0}
                  max={2}
                  step={0.1}
                  value={boundA}
                  onChange={(e) => setBoundA(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <label htmlFor="bound-b-slider">Upper Bound (b)</label>
                  <span className="font-mono text-sky-700 dark:text-sky-400 tabular-nums">{boundB.toFixed(2)} ms</span>
                </div>
                <input
                  id="bound-b-slider"
                  type="range"
                  min={0}
                  max={2}
                  step={0.1}
                  value={boundB}
                  onChange={(e) => setBoundB(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-3 space-y-1 font-mono tabular-nums">
              <div>F({hi.toFixed(2)}) = {cdfFn(hi).toFixed(5)}</div>
              <div>F({lo.toFixed(2)}) = {cdfFn(lo).toFixed(5)}</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                P({lo.toFixed(2)} ≤ X ≤ {hi.toFixed(2)}) = {intervalProb.toFixed(5)}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
