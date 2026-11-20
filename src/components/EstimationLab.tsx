import React, { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';

type EstMode = 'prop' | 'mean' | 'twoMean' | 'sampleSize';
type ConfLevel = 90 | 95 | 99;

const Z_CRIT: Record<ConfLevel, number> = {
  90: 1.645,
  95: 1.96,
  99: 2.576,
};

// Accurate two-tailed critical t values for df = 1..30 (falling back to Z above 30)
const T_TABLE_95: Record<number, number> = {
  1: 12.706, 2: 4.303, 3: 3.182, 4: 2.776, 5: 2.571, 6: 2.447, 7: 2.365, 8: 2.306, 9: 2.262, 10: 2.228,
  11: 2.201, 12: 2.179, 13: 2.16, 14: 2.145, 15: 2.131, 16: 2.12, 17: 2.11, 18: 2.101, 19: 2.093, 20: 2.086,
  21: 2.08, 22: 2.074, 23: 2.069, 24: 2.064, 25: 2.06, 26: 2.056, 27: 2.052, 28: 2.048, 29: 2.045, 30: 2.042,
};

const T_TABLE_90: Record<number, number> = {
  1: 6.314, 2: 2.92, 3: 2.353, 4: 2.132, 5: 2.015, 6: 1.943, 7: 1.895, 8: 1.86, 9: 1.833, 10: 1.812,
  11: 1.796, 12: 1.782, 13: 1.771, 14: 1.761, 15: 1.753, 16: 1.746, 17: 1.74, 18: 1.734, 19: 1.729, 20: 1.725,
  21: 1.721, 22: 1.717, 23: 1.714, 24: 1.711, 25: 1.708, 26: 1.706, 27: 1.703, 28: 1.701, 29: 1.699, 30: 1.697,
};

const T_TABLE_99: Record<number, number> = {
  1: 63.657, 2: 9.925, 3: 5.841, 4: 4.604, 5: 4.032, 6: 3.707, 7: 3.499, 8: 3.355, 9: 3.25, 10: 3.169,
  11: 3.106, 12: 3.055, 13: 3.012, 14: 2.977, 15: 2.947, 16: 2.921, 17: 2.898, 18: 2.878, 19: 2.861, 20: 2.845,
  21: 2.831, 22: 2.819, 23: 2.807, 24: 2.797, 25: 2.787, 26: 2.779, 27: 2.771, 28: 2.763, 29: 2.756, 30: 2.75,
};

const getTCrit = (cl: ConfLevel, df: number): number => {
  if (df > 30) return Z_CRIT[cl];
  const d = Math.max(1, Math.min(30, Math.round(df)));
  if (cl === 90) return T_TABLE_90[d];
  if (cl === 95) return T_TABLE_95[d];
  return T_TABLE_99[d];
};

export const EstimationLab: React.FC = () => {
  const [mode, setMode] = useState<EstMode>('prop');
  const [confLevel, setConfLevel] = useState<ConfLevel>(95);

  // Proportion params (PU Model Q8 default)
  const [propN, setPropN] = useState<number>(100);
  const [propX, setPropX] = useState<number>(5);

  // Single mean params
  const [meanN, setMeanN] = useState<number>(20);
  const [meanXbar, setMeanXbar] = useState<number>(100);
  const [meanS, setMeanS] = useState<number>(12);

  // Two means params (Extra Q1 LED brands default)
  const [n1] = useState<number>(10);
  const [x1, setX1] = useState<number>(1420);
  const [s1] = useState<number>(60);
  const [n2] = useState<number>(12);
  const [x2, setX2] = useState<number>(1350);
  const [s2] = useState<number>(50);

  // Sample size planner params (Extra Q2a default)
  const [planSigma, setPlanSigma] = useState<number>(6);
  const [planE, setPlanE] = useState<number>(1.5);

  const loadModelQ8 = (cl: ConfLevel = 95) => {
    setMode('prop');
    setConfLevel(cl);
    setPropN(100);
    setPropX(5);
  };

  const loadTwoMeanPreset = () => {
    setMode('twoMean');
    setConfLevel(95);
    setX1(1420);
    setX2(1350);
  };

  const loadSampleSizePreset = () => {
    setMode('sampleSize');
    setConfLevel(95);
    setPlanSigma(6);
    setPlanE(1.5);
  };

  const handleReset = () => {
    if (mode === 'prop') loadModelQ8(95);
    else if (mode === 'twoMean') loadTwoMeanPreset();
    else if (mode === 'sampleSize') loadSampleSizePreset();
    else {
      setConfLevel(95);
      setMeanN(20);
      setMeanXbar(100);
      setMeanS(12);
    }
  };

  const calc = useMemo(() => {
    const zVal = Z_CRIT[confLevel];

    if (mode === 'prop') {
      const pHat = propX / propN;
      const se = Math.sqrt((pHat * (1 - pHat)) / propN);
      const margin = zVal * se;
      const rawLo = pHat - margin;
      const rawHi = pHat + margin;
      return {
        distUsed: `Normal Z (z = ${zVal})`,
        pointEst: pHat,
        se,
        crit: zVal,
        margin,
        rawLo,
        rawHi,
        lo: Math.max(0, rawLo),
        hi: Math.min(1, rawHi),
        clipped: rawLo < 0 || rawHi > 1,
        requiredN: propN,
        sp: 0,
      };
    }

    if (mode === 'mean') {
      const useT = meanN < 30;
      const df = meanN - 1;
      const crit = useT ? getTCrit(confLevel, df) : zVal;
      const se = meanS / Math.sqrt(meanN);
      const margin = crit * se;
      return {
        distUsed: useT ? `Student's t (ν=${df}, t=${crit.toFixed(3)})` : `Normal Z (n≥30, z=${zVal})`,
        pointEst: meanXbar,
        se,
        crit,
        margin,
        rawLo: meanXbar - margin,
        rawHi: meanXbar + margin,
        lo: meanXbar - margin,
        hi: meanXbar + margin,
        clipped: false,
        requiredN: meanN,
        sp: 0,
      };
    }

    if (mode === 'twoMean') {
      const df = n1 + n2 - 2;
      const sp2 = ((n1 - 1) * s1 * s1 + (n2 - 1) * s2 * s2) / df;
      const sp = Math.sqrt(sp2);
      const se = sp * Math.sqrt(1 / n1 + 1 / n2);
      const crit = getTCrit(confLevel, df);
      const margin = crit * se;
      const diff = x1 - x2;
      return {
        distUsed: `Pooled t (ν=${df}, t=${crit.toFixed(3)})`,
        pointEst: diff,
        se,
        crit,
        margin,
        rawLo: diff - margin,
        rawHi: diff + margin,
        lo: diff - margin,
        hi: diff + margin,
        clipped: false,
        requiredN: n1 + n2,
        sp,
      };
    }

    // sampleSize
    const exactN = Math.pow((zVal * planSigma) / planE, 2);
    const ceilN = Math.ceil(exactN);
    const actualSE = planSigma / Math.sqrt(ceilN);
    return {
      distUsed: `Normal Z (z = ${zVal})`,
      pointEst: exactN,
      se: actualSE,
      crit: zVal,
      margin: zVal * actualSE,
      rawLo: -planE,
      rawHi: planE,
      lo: -planE,
      hi: planE,
      clipped: false,
      requiredN: ceilN,
      sp: 0,
    };
  }, [mode, confLevel, propN, propX, meanN, meanXbar, meanS, n1, x1, s1, n2, x2, s2, planSigma, planE]);

  // SVG Confidence Interval & Sampling Bell Curve Plot
  const W = 680;
  const H = 290;
  const PAD_L = 56;
  const PAD_R = 30;
  const plotW = W - PAD_L - PAD_R;

  const spanMin = mode === 'prop' ? -0.05 : calc.rawLo - calc.margin * 0.6;
  const spanMax = mode === 'prop' ? Math.max(0.2, calc.rawHi + 0.04) : calc.rawHi + calc.margin * 0.6;
  const xToPx = (val: number) => PAD_L + ((val - spanMin) / Math.max(1e-6, spanMax - spanMin)) * plotW;

  const sePlot = Math.max(1e-5, calc.se);
  const centerPlot = mode === 'sampleSize' ? 0 : calc.pointEst;
  const curvePts = Array.from({ length: 141 }, (_, i) => {
    const val = spanMin + ((spanMax - spanMin) * i) / 140;
    const z = (val - centerPlot) / sePlot;
    const pdf = Math.exp(-0.5 * z * z);
    return { val, pdf };
  });

  const bellBottom = 178;
  const bellH = 138;
  const bellY = (pdf: number) => bellBottom - pdf * bellH;
  const bellPath = curvePts
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${xToPx(p.val).toFixed(1)} ${bellY(p.pdf).toFixed(1)}`)
    .join(' ');
  const shadedPts = curvePts.filter((p) => p.val >= calc.rawLo - 1e-6 && p.val <= calc.rawHi + 1e-6);
  const shadedBellPath =
    shadedPts.length > 1
      ? [
          `M ${xToPx(shadedPts[0].val).toFixed(1)} ${bellBottom}`,
          ...shadedPts.map((p) => `L ${xToPx(p.val).toFixed(1)} ${bellY(p.pdf).toFixed(1)}`),
          `L ${xToPx(shadedPts[shadedPts.length - 1].val).toFixed(1)} ${bellBottom}`,
          'Z',
        ].join(' ')
      : '';

  const fmt = (v: number) => (mode === 'prop' ? v.toFixed(4) : v.toFixed(2));

  return (
    <section aria-labelledby="est-lab-heading" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 no-print">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 id="est-lab-heading" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Interactive Confidence Interval &amp; Sample Size Lab
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Verify PU Model Q8 (95% &amp; 99% proportion intervals), switch between Z and Student&apos;s t intervals, and plan minimum sample sizes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg">
            <button
              type="button"
              onClick={() => loadModelQ8(95)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'prop' && confLevel === 95 && propN === 100 && propX === 5
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              PU Q8 (95%)
            </button>
            <button
              type="button"
              onClick={() => loadModelQ8(99)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'prop' && confLevel === 99 && propN === 100 && propX === 5
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              PU Q8 (99%)
            </button>
            <button
              type="button"
              onClick={loadTwoMeanPreset}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'twoMean'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Extra Q1 (Two Means)
            </button>
            <button
              type="button"
              onClick={loadSampleSizePreset}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'sampleSize'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Extra Q2a (Sample Size)
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
        {/* Left Zone: Sampling Curve & Interval Number-Line */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg">
              {(
                [
                  ['prop', 'Proportion p'],
                  ['mean', 'Single Mean μ'],
                  ['twoMean', 'Two Means (μ₁ − μ₂)'],
                  ['sampleSize', 'Sample Size n'],
                ] as [EstMode, string][]
              ).map(([m, label]) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    mode === m
                      ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="my-auto">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Confidence Interval Visualizer">
              {shadedBellPath && <path d={shadedBellPath} fill="#0284C7" fillOpacity={0.22} />}
              <path d={bellPath} fill="none" stroke="#0284C7" strokeWidth={2.2} />
              <line x1={PAD_L} y1={bellBottom} x2={W - PAD_R} y2={bellBottom} className="stroke-slate-500 dark:stroke-slate-400" strokeWidth={1.2} />

              {/* Zero boundary guide when visible */}
              {0 >= spanMin && 0 <= spanMax && (
                <g>
                  <line x1={xToPx(0)} y1={24} x2={xToPx(0)} y2={248} stroke="#DC2626" strokeWidth={1.2} strokeDasharray="4 4" />
                  <text x={xToPx(0)} y={18} textAnchor="middle" className="fill-rose-700 dark:fill-rose-400 text-[10px] font-mono">
                    0 boundary
                  </text>
                </g>
              )}

              {/* Interval bracket bar at y = 228 */}
              <line x1={xToPx(calc.lo)} y1={226} x2={xToPx(calc.hi)} y2={226} stroke="#0F766E" strokeWidth={4} strokeLinecap="round" />
              <circle cx={xToPx(centerPlot)} cy={226} r={5} fill="#0284C7" />
              <line x1={xToPx(calc.lo)} y1={218} x2={xToPx(calc.lo)} y2={234} stroke="#0F766E" strokeWidth={2} />
              <line x1={xToPx(calc.hi)} y1={218} x2={xToPx(calc.hi)} y2={234} stroke="#0F766E" strokeWidth={2} />

              <text x={xToPx(calc.lo)} y={252} textAnchor="middle" className="fill-slate-700 dark:fill-slate-300 text-[11px] font-mono">
                {fmt(calc.lo)}
              </text>
              <text x={xToPx(centerPlot)} y={210} textAnchor="middle" className="fill-sky-800 dark:fill-sky-300 text-[11px] font-mono font-semibold">
                {mode === 'sampleSize' ? 'μ (Target)' : `${fmt(centerPlot)}`}
              </text>
              <text x={xToPx(calc.hi)} y={252} textAnchor="middle" className="fill-slate-700 dark:fill-slate-300 text-[11px] font-mono">
                {fmt(calc.hi)}
              </text>

              <text x={W / 2} y={276} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[11px] font-mono">
                {confLevel}% Confidence Band ({calc.distUsed}) · Margin E = ±{fmt(calc.margin)}
              </text>
            </svg>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 mt-2 border-t border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {mode === 'sampleSize' ? 'Min Sample Size (n)' : `${confLevel}% Conf. Interval`}
              </div>
              <div className="text-sm font-semibold text-sky-700 dark:text-sky-400 font-mono tabular-nums mt-0.5">
                {mode === 'sampleSize' ? `n = ${calc.requiredN}` : `[${fmt(calc.lo)}, ${fmt(calc.hi)}]`}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {mode === 'sampleSize' ? 'Unrounded n' : 'Point Estimate'}
              </div>
              <div className="text-base font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                {fmt(calc.pointEst)}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Standard Error (SE)</div>
              <div className="text-base font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                {mode === 'prop' ? calc.se.toFixed(5) : calc.se.toFixed(3)}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Critical Value</div>
              <div className="text-base font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                {calc.crit.toFixed(3)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Zone: Parameters & Confidence Level */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-900/80 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Confidence Level (1 − α)</span>
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                {([90, 95, 99] as ConfLevel[]).map((cl) => (
                  <button
                    key={cl}
                    type="button"
                    onClick={() => setConfLevel(cl)}
                    className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      confLevel === cl
                        ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    {cl}%
                  </button>
                ))}
              </div>
            </div>

            {mode === 'prop' && (
              <>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <label htmlFor="est-prop-n">Sample Size (n)</label>
                    <span className="font-mono text-slate-900 dark:text-slate-100 tabular-nums">{propN}</span>
                  </div>
                  <input
                    id="est-prop-n"
                    type="range"
                    min={30}
                    max={400}
                    step={10}
                    value={propN}
                    onChange={(e) => {
                      const nextN = Number(e.target.value);
                      setPropN(nextN);
                      if (propX > nextN) setPropX(nextN);
                    }}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <label htmlFor="est-prop-x">Defectives / Successes (x)</label>
                    <span className="font-mono text-sky-700 dark:text-sky-400 tabular-nums">
                      x = {propX} (p̂ = {(propX / propN).toFixed(3)})
                    </span>
                  </div>
                  <input
                    id="est-prop-x"
                    type="range"
                    min={1}
                    max={Math.min(propN - 1, 100)}
                    step={1}
                    value={propX}
                    onChange={(e) => setPropX(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>
              </>
            )}

            {mode === 'mean' && (
              <>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <label htmlFor="est-mean-n">Sample Size (n) — toggles t vs Z at n = 30</label>
                    <span className="font-mono text-sky-700 dark:text-sky-400 tabular-nums">
                      n = {meanN} ({meanN < 30 ? 't-dist' : 'Z-dist'})
                    </span>
                  </div>
                  <input
                    id="est-mean-n"
                    type="range"
                    min={5}
                    max={60}
                    step={1}
                    value={meanN}
                    onChange={(e) => setMeanN(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <label htmlFor="est-mean-xbar">Sample Mean (x̄)</label>
                    <span className="font-mono text-slate-900 dark:text-slate-100 tabular-nums">{meanXbar}</span>
                  </div>
                  <input
                    id="est-mean-xbar"
                    type="range"
                    min={50}
                    max={200}
                    step={5}
                    value={meanXbar}
                    onChange={(e) => setMeanXbar(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <label htmlFor="est-mean-s">Sample SD (s)</label>
                    <span className="font-mono text-slate-900 dark:text-slate-100 tabular-nums">{meanS}</span>
                  </div>
                  <input
                    id="est-mean-s"
                    type="range"
                    min={2}
                    max={30}
                    step={1}
                    value={meanS}
                    onChange={(e) => setMeanS(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>
              </>
            )}

            {mode === 'twoMean' && (
              <>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <label htmlFor="est-x1">Brand A Mean x̄₁ (n₁ = 10, s₁ = 60)</label>
                    <span className="font-mono text-slate-900 dark:text-slate-100 tabular-nums">{x1} hrs</span>
                  </div>
                  <input
                    id="est-x1"
                    type="range"
                    min={1300}
                    max={1500}
                    step={5}
                    value={x1}
                    onChange={(e) => setX1(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <label htmlFor="est-x2">Brand B Mean x̄₂ (n₂ = 12, s₂ = 50)</label>
                    <span className="font-mono text-slate-900 dark:text-slate-100 tabular-nums">{x2} hrs</span>
                  </div>
                  <input
                    id="est-x2"
                    type="range"
                    min={1300}
                    max={1500}
                    step={5}
                    value={x2}
                    onChange={(e) => setX2(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>
              </>
            )}

            {mode === 'sampleSize' && (
              <>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <label htmlFor="est-plan-sigma">Population SD (σ)</label>
                    <span className="font-mono text-slate-900 dark:text-slate-100 tabular-nums">{planSigma.toFixed(1)} kV</span>
                  </div>
                  <input
                    id="est-plan-sigma"
                    type="range"
                    min={1}
                    max={20}
                    step={0.5}
                    value={planSigma}
                    onChange={(e) => setPlanSigma(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <label htmlFor="est-plan-e">Allowable Margin of Error (±E)</label>
                    <span className="font-mono text-sky-700 dark:text-sky-400 tabular-nums">±{planE.toFixed(2)} kV</span>
                  </div>
                  <input
                    id="est-plan-e"
                    type="range"
                    min={0.5}
                    max={5.0}
                    step={0.25}
                    value={planE}
                    onChange={(e) => setPlanE(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>
              </>
            )}
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-3 space-y-1 font-mono tabular-nums">
            <div className="font-sans font-semibold text-slate-800 dark:text-slate-200">Estimation Diagnostic</div>
            {mode === 'prop' && (
              <div>
                {calc.clipped
                  ? `Algebraic (${calc.rawLo.toFixed(4)}, ${calc.rawHi.toFixed(4)}) clipped at 0 → [${calc.lo.toFixed(4)}, ${calc.hi.toFixed(4)}]`
                  : `np̂ = ${(propX).toFixed(0)} ≥ 5, nq̂ = ${(propN - propX).toFixed(0)} ≥ 5 (Normal approx valid)`}
              </div>
            )}
            {mode === 'mean' && (
              <div>
                {meanN < 30 ? `n = ${meanN} < 30 ⇒ Student's t with ν = ${meanN - 1} df` : `n = ${meanN} ≥ 30 ⇒ Large-sample Z`}
              </div>
            )}
            {mode === 'twoMean' && (
              <div>
                Pooled s_p = {calc.sp.toFixed(2)} hrs · {calc.lo <= 0 && calc.hi >= 0 ? '0 inside CI (no sig. diff)' : '0 outside CI (significant diff)'}
              </div>
            )}
            {mode === 'sampleSize' && (
              <div>
                n = (z·σ/E)² = {calc.pointEst.toFixed(2)} ⇒ ceiling ⌈n⌉ = {calc.requiredN} samples
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
