import React, { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';

type DistType = 'binomial' | 'poisson';
type QueryOp = 'eq' | 'le' | 'ge';

const logFactorial = (n: number) => {
  let s = 0;
  for (let i = 2; i <= n; i++) s += Math.log(i);
  return s;
};

const binomPmf = (n: number, p: number, x: number) => {
  if (x < 0 || x > n) return 0;
  if (p <= 0) return x === 0 ? 1 : 0;
  if (p >= 1) return x === n ? 1 : 0;
  const logC = logFactorial(n) - logFactorial(x) - logFactorial(n - x);
  return Math.exp(logC + x * Math.log(p) + (n - x) * Math.log(1 - p));
};

const poissonPmf = (lambda: number, x: number) => {
  if (x < 0) return 0;
  if (lambda <= 0) return x === 0 ? 1 : 0;
  return Math.exp(-lambda + x * Math.log(lambda) - logFactorial(x));
};

export const DiscreteDistLab: React.FC = () => {
  const [dist, setDist] = useState<DistType>('binomial');
  const [n, setN] = useState<number>(10);
  const [p, setP] = useState<number>(0.01);
  const [lambda, setLambda] = useState<number>(0.9);
  const [queryOp, setQueryOp] = useState<QueryOp>('ge');
  const [k, setK] = useState<number>(2);
  const [showPoissonOverlay, setShowPoissonOverlay] = useState<boolean>(false);

  const loadModelQ7 = () => {
    setDist('binomial');
    setN(10);
    setP(0.01);
    setQueryOp('ge');
    setK(2);
    setShowPoissonOverlay(false);
  };

  const loadExtraBinomial = () => {
    setDist('binomial');
    setN(5);
    setP(0.4);
    setQueryOp('eq');
    setK(2);
    setShowPoissonOverlay(false);
  };

  const loadExtraPoisson = () => {
    setDist('poisson');
    setLambda(0.9);
    setQueryOp('ge');
    setK(2);
  };

  const handleReset = () => {
    if (dist === 'binomial') loadModelQ7();
    else loadExtraPoisson();
  };

  const calc = useMemo(() => {
    if (dist === 'binomial') {
      const maxX = Math.min(n, 20);
      const bars = Array.from({ length: maxX + 1 }, (_, x) => ({
        x,
        prob: binomPmf(n, p, x),
        approx: poissonPmf(n * p, x),
      }));
      const mean = n * p;
      const variance = n * p * (1 - p);
      const sd = Math.sqrt(variance);
      const maxBar = Math.max(...bars.map((b) => b.prob), 0.1);

      let queryProb = 0;
      for (let x = 0; x <= n; x++) {
        const px = binomPmf(n, p, x);
        if (queryOp === 'eq' && x === k) queryProb += px;
        if (queryOp === 'le' && x <= k) queryProb += px;
        if (queryOp === 'ge' && x >= k) queryProb += px;
      }

      return { bars, mean, variance, sd, maxBar, queryProb, mode: Math.floor((n + 1) * p) };
    }

    const maxX = Math.min(20, Math.max(8, Math.ceil(lambda + 4 * Math.sqrt(lambda) + 2)));
    const bars = Array.from({ length: maxX + 1 }, (_, x) => ({
      x,
      prob: poissonPmf(lambda, x),
      approx: 0,
    }));
    const mean = lambda;
    const variance = lambda;
    const sd = Math.sqrt(lambda);
    const maxBar = Math.max(...bars.map((b) => b.prob), 0.1);

    let queryProb = 0;
    const upper = Math.max(50, k + 25);
    for (let x = 0; x <= upper; x++) {
      const px = poissonPmf(lambda, x);
      if (queryOp === 'eq' && x === k) queryProb += px;
      if (queryOp === 'le' && x <= k) queryProb += px;
      if (queryOp === 'ge' && x >= k) queryProb += px;
    }

    return { bars, mean, variance, sd, maxBar, queryProb, mode: Math.floor(lambda) };
  }, [dist, n, p, lambda, queryOp, k]);

  const isHighlighted = (x: number) => {
    if (queryOp === 'eq') return x === k;
    if (queryOp === 'le') return x <= k;
    return x >= k;
  };

  // SVG Dimensions
  const W = 680;
  const H = 310;
  const PAD_L = 54;
  const PAD_R = 24;
  const PAD_T = 24;
  const PAD_B = 44;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;
  const yMax = Math.min(1.0, Math.ceil(calc.maxBar * 11.5) / 10) || 0.5;
  const yToPx = (val: number) => PAD_T + plotH - (val / yMax) * plotH;
  const count = calc.bars.length;
  const slotW = plotW / count;
  const barW = Math.min(42, slotW * 0.62);

  const opSymbol = queryOp === 'eq' ? '=' : queryOp === 'le' ? '≤' : '≥';

  return (
    <section aria-labelledby="disc-lab-heading" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 no-print">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 id="disc-lab-heading" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Interactive Binomial &amp; Poisson Distribution Lab
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Verify PU Model Q7 (n = 10, p = 0.01), test Binomial-to-Poisson approximation (λ = np), and compute exact tail probabilities P(X = k), P(X ≤ k), and P(X ≥ k).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg">
            <button
              type="button"
              onClick={loadModelQ7}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                dist === 'binomial' && n === 10 && Math.abs(p - 0.01) < 1e-4
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              PU Model Q7 (n=10, p=0.01)
            </button>
            <button
              type="button"
              onClick={loadExtraBinomial}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                dist === 'binomial' && n === 5 && Math.abs(p - 0.4) < 1e-4
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Extra Q1 (n=5, p=0.4)
            </button>
            <button
              type="button"
              onClick={loadExtraPoisson}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                dist === 'poisson'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Extra Q2 (Poisson λ=0.9)
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-stretch">
        {/* Left Zone: PMF Chart */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg">
              <button
                type="button"
                onClick={() => setDist('binomial')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  dist === 'binomial'
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                Binomial B(n, p)
              </button>
              <button
                type="button"
                onClick={() => setDist('poisson')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  dist === 'poisson'
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                Poisson P(λ)
              </button>
            </div>

            {dist === 'binomial' && (
              <button
                type="button"
                onClick={() => setShowPoissonOverlay((v) => !v)}
                className={`px-3 py-1 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  showPoissonOverlay
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {showPoissonOverlay ? 'Poisson λ=np Overlay: On' : 'Compare Poisson λ=np'}
              </button>
            )}
          </div>

          <div className="my-auto">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Discrete Distribution PMF Bar Chart">
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

              {calc.bars.map((bar, idx) => {
                const cx = PAD_L + slotW * (idx + 0.5);
                const bx = cx - barW / 2;
                const by = yToPx(bar.prob);
                const bh = Math.max(0, yToPx(0) - by);
                const active = isHighlighted(bar.x);
                return (
                  <g key={bar.x}>
                    <rect
                      x={bx}
                      y={by}
                      width={barW}
                      height={bh}
                      rx={3}
                      className={
                        active
                          ? 'fill-sky-500/25 dark:fill-sky-400/30 stroke-sky-600 dark:stroke-sky-400'
                          : 'fill-slate-200/70 dark:fill-slate-800 stroke-slate-400 dark:stroke-slate-600'
                      }
                      strokeWidth={active ? 1.5 : 1}
                    />
                    {count <= 12 && (
                      <text x={cx} y={by - 5} textAnchor="middle" className="fill-slate-700 dark:fill-slate-200 text-[10px] font-mono">
                        {bar.prob >= 0.001 ? bar.prob.toFixed(3) : '<.001'}
                      </text>
                    )}
                    {dist === 'binomial' && showPoissonOverlay && (
                      <circle cx={cx} cy={yToPx(bar.approx)} r={3.5} fill="#059669" />
                    )}
                    <text x={cx} y={yToPx(0) + 18} textAnchor="middle" className="fill-slate-700 dark:fill-slate-300 text-[11px] font-mono">
                      {bar.x}
                    </text>
                  </g>
                );
              })}

              <line x1={PAD_L} y1={yToPx(0)} x2={W - PAD_R} y2={yToPx(0)} className="stroke-slate-600 dark:stroke-slate-400" strokeWidth={1.25} />
              <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={yToPx(0)} className="stroke-slate-600 dark:stroke-slate-400" strokeWidth={1.25} />

              <text x={PAD_L + plotW / 2} y={H - 5} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[11px]">
                Successes / Events (x) · Highlighted Region: P(X {opSymbol} {k}) = {calc.queryProb.toFixed(4)}
              </text>
              <text x={16} y={PAD_T + plotH / 2} textAnchor="middle" transform={`rotate(-90 16 ${PAD_T + plotH / 2})`} className="fill-slate-500 dark:fill-slate-400 text-[11px]">
                Probability P(X = x)
              </text>
            </svg>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 mt-3 border-t border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Query P(X {opSymbol} {k})</div>
              <div className="text-base font-semibold text-sky-700 dark:text-sky-400 font-mono tabular-nums">
                {calc.queryProb.toFixed(4)}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Mean (μ)</div>
              <div className="text-base font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                {calc.mean.toFixed(3)}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Variance (σ²)</div>
              <div className="text-base font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                {calc.variance.toFixed(4)}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Std. Dev. (σ)</div>
              <div className="text-base font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                {calc.sd.toFixed(4)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Zone: Sliders & Query Controls */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-900/80 space-y-4">
            {dist === 'binomial' ? (
              <>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <label htmlFor="binom-n-slider">Number of Trials (n)</label>
                    <span className="font-mono text-slate-900 dark:text-slate-100 tabular-nums">{n}</span>
                  </div>
                  <input
                    id="binom-n-slider"
                    type="range"
                    min={1}
                    max={25}
                    step={1}
                    value={n}
                    onChange={(e) => {
                      const nextN = Number(e.target.value);
                      setN(nextN);
                      if (k > nextN) setK(nextN);
                    }}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <label htmlFor="binom-p-slider">Success Probability (p)</label>
                    <span className="font-mono text-sky-700 dark:text-sky-400 tabular-nums">{p.toFixed(2)}</span>
                  </div>
                  <input
                    id="binom-p-slider"
                    type="range"
                    min={0.01}
                    max={0.95}
                    step={0.01}
                    value={p}
                    onChange={(e) => setP(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>
              </>
            ) : (
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <label htmlFor="pois-lambda-slider">Average Rate (λ)</label>
                  <span className="font-mono text-sky-700 dark:text-sky-400 tabular-nums">{lambda.toFixed(2)}</span>
                </div>
                <input
                  id="pois-lambda-slider"
                  type="range"
                  min={0.1}
                  max={10.0}
                  step={0.1}
                  value={lambda}
                  onChange={(e) => setLambda(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Probability Query</span>
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  {(['eq', 'le', 'ge'] as QueryOp[]).map((op) => (
                    <button
                      key={op}
                      type="button"
                      onClick={() => setQueryOp(op)}
                      className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        queryOp === op
                          ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      {op === 'eq' ? 'X = k' : op === 'le' ? 'X ≤ k' : 'X ≥ k'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <label htmlFor="query-k-slider">Threshold (k)</label>
                  <span className="font-mono text-slate-900 dark:text-slate-100 tabular-nums">k = {k}</span>
                </div>
                <input
                  id="query-k-slider"
                  type="range"
                  min={0}
                  max={dist === 'binomial' ? n : 12}
                  step={1}
                  value={k}
                  onChange={(e) => setK(Number(e.target.value))}
                  className="w-full accent-slate-700 dark:accent-slate-300 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-3 space-y-1 font-mono tabular-nums">
            <div className="font-sans font-semibold text-slate-800 dark:text-slate-200">Distribution Diagnostic</div>
            {dist === 'binomial' ? (
              <div>
                μ = np = {calc.mean.toFixed(3)} &gt; σ² = npq = {calc.variance.toFixed(4)} · Mode = {calc.mode}
              </div>
            ) : (
              <div>
                Mean = Variance = λ = {calc.mean.toFixed(2)} · P(0) = e⁻λ = {poissonPmf(lambda, 0).toFixed(4)}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
