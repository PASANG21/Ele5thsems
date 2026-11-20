import React, { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';

type HypTestMode = 'chi-2x2' | 'z-mean' | 't-paired' | 'z-2prop';
type AlphaLevel = 0.10 | 0.05 | 0.01;
type TailType = 'two' | 'right' | 'left';

const normalPdf = (z: number) => Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);

const normalCdf = (z: number) => {
  const sign = z < 0 ? -1 : 1;
  const x = Math.abs(z) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * x);
  const y =
    1 -
    (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t) *
      Math.exp(-x * x);
  return 0.5 * (1 + sign * y);
};

const logGamma = (z: number): number => {
  const g = 7;
  const p = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - logGamma(1 - z);
  let x = p[0];
  for (let i = 1; i < g + 2; i++) x += p[i] / (z - 1 + i);
  const t = z - 1 + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z - 0.5) * Math.log(t) - t + Math.log(x);
};

const tPdf = (t: number, df: number) => {
  const c = Math.exp(logGamma((df + 1) / 2) - logGamma(df / 2)) / Math.sqrt(df * Math.PI);
  return c * Math.pow(1 + (t * t) / df, -(df + 1) / 2);
};

const chiPdf = (x: number, df: number) => {
  if (x <= 0) return df === 1 ? 1.4 : 0;
  const k = df / 2;
  return Math.exp((k - 1) * Math.log(x) - x / 2 - k * Math.LN2 - logGamma(k));
};

const Z_CRIT_TWO: Record<AlphaLevel, number> = { 0.10: 1.645, 0.05: 1.96, 0.01: 2.576 };
const Z_CRIT_ONE: Record<AlphaLevel, number> = { 0.10: 1.282, 0.05: 1.645, 0.01: 2.326 };

const T_CRIT_7_TWO: Record<AlphaLevel, number> = { 0.10: 1.895, 0.05: 2.365, 0.01: 3.499 };
const T_CRIT_7_ONE: Record<AlphaLevel, number> = { 0.10: 1.415, 0.05: 1.895, 0.01: 2.998 };

const CHI_CRIT_1: Record<AlphaLevel, number> = { 0.10: 2.706, 0.05: 3.841, 0.01: 6.635 };

export const HypothesisLab: React.FC = () => {
  const [mode, setMode] = useState<HypTestMode>('chi-2x2');
  const [alpha, setAlpha] = useState<AlphaLevel>(0.05);
  const [tail, setTail] = useState<TailType>('two');

  // Chi-square 2x2 state (PU Model Q3)
  const [cellA, setCellA] = useState<number>(100);
  const [cellB, setCellB] = useState<number>(50);
  const [cellC, setCellC] = useState<number>(20);
  const [cellD, setCellD] = useState<number>(30);

  // Single-mean Z-test state (PU Model Q9)
  const [zN, setZN] = useState<number>(50);
  const [zXbar, setZXbar] = useState<number>(90);
  const [zMu0, setZMu0] = useState<number>(100);
  const [zSigma, setZSigma] = useState<number>(8);

  // Paired t-test state (Extra Q1, df=7)
  const [tDbar, setTDbar] = useState<number>(4.5);
  const [tSd, setTSd] = useState<number>(1.604);

  // Two-proportion Z-test state (Extra Q2a)
  const [pX1, setPX1] = useState<number>(36);
  const [pN1, setPN1] = useState<number>(300);
  const [pX2, setPX2] = useState<number>(16);
  const [pN2, setPN2] = useState<number>(200);

  const loadModelQ3 = () => {
    setMode('chi-2x2');
    setAlpha(0.05);
    setCellA(100);
    setCellB(50);
    setCellC(20);
    setCellD(30);
  };

  const loadModelQ9 = () => {
    setMode('z-mean');
    setAlpha(0.05);
    setTail('two');
    setZN(50);
    setZXbar(90);
    setZMu0(100);
    setZSigma(8);
  };

  const loadExtraPairedT = () => {
    setMode('t-paired');
    setAlpha(0.05);
    setTail('right');
    setTDbar(4.5);
    setTSd(1.604);
  };

  const loadExtraTwoProp = () => {
    setMode('z-2prop');
    setAlpha(0.05);
    setTail('two');
    setPX1(36);
    setPN1(300);
    setPX2(16);
    setPN2(200);
  };

  const handleReset = () => {
    if (mode === 'chi-2x2') loadModelQ3();
    else if (mode === 'z-mean') loadModelQ9();
    else if (mode === 't-paired') loadExtraPairedT();
    else loadExtraTwoProp();
  };

  const calc = useMemo(() => {
    if (mode === 'chi-2x2') {
      const N = cellA + cellB + cellC + cellD;
      const r1 = cellA + cellB;
      const r2 = cellC + cellD;
      const c1 = cellA + cellC;
      const c2 = cellB + cellD;
      const denom = r1 * r2 * c1 * c2;
      const e11 = N > 0 ? (r1 * c1) / N : 0;
      const e12 = N > 0 ? (r1 * c2) / N : 0;
      const e21 = N > 0 ? (r2 * c1) / N : 0;
      const e22 = N > 0 ? (r2 * c2) / N : 0;
      const minE = Math.min(e11, e12, e21, e22);
      const stat = denom > 0 ? (N * Math.pow(cellA * cellD - cellB * cellC, 2)) / denom : 0;
      const crit = CHI_CRIT_1[alpha];
      const reject = stat > crit;
      const pApprox = 2 * (1 - normalCdf(Math.sqrt(Math.max(0, stat))));
      return {
        dist: 'chi' as const,
        stat,
        crit,
        dfLabel: 'df = 1',
        seLabel: `min E = ${minE.toFixed(1)}`,
        valid: N >= 50 && minE >= 5,
        reject,
        pApprox,
        e11,
        e12,
        e21,
        e22,
        N,
      };
    }

    if (mode === 'z-mean') {
      const se = zSigma / Math.sqrt(Math.max(1, zN));
      const stat = se > 0 ? (zXbar - zMu0) / se : 0;
      const crit = tail === 'two' ? Z_CRIT_TWO[alpha] : Z_CRIT_ONE[alpha];
      const reject =
        tail === 'two' ? Math.abs(stat) > crit : tail === 'right' ? stat > crit : stat < -crit;
      const pApprox =
        tail === 'two'
          ? 2 * (1 - normalCdf(Math.abs(stat)))
          : tail === 'right'
            ? 1 - normalCdf(stat)
            : normalCdf(stat);
      return {
        dist: 'z' as const,
        stat,
        crit,
        dfLabel: `n = ${zN}`,
        seLabel: `SE = ${se.toFixed(4)}`,
        valid: zN >= 30 || zSigma > 0,
        reject,
        pApprox,
      };
    }

    if (mode === 't-paired') {
      const se = tSd / Math.sqrt(8);
      const stat = se > 0 ? tDbar / se : 0;
      const crit = tail === 'two' ? T_CRIT_7_TWO[alpha] : T_CRIT_7_ONE[alpha];
      const reject =
        tail === 'two' ? Math.abs(stat) > crit : tail === 'right' ? stat > crit : stat < -crit;
      const pApprox =
        tail === 'two'
          ? 2 * (1 - normalCdf(Math.abs(stat) * 0.92))
          : tail === 'right'
            ? 1 - normalCdf(stat * 0.92)
            : normalCdf(stat * 0.92);
      return {
        dist: 't' as const,
        stat,
        crit,
        dfLabel: 'df = 7 (n = 8)',
        seLabel: `SE = ${se.toFixed(4)}`,
        valid: true,
        reject,
        pApprox,
      };
    }

    // z-2prop
    const p1 = pX1 / pN1;
    const p2 = pX2 / pN2;
    const pPool = (pX1 + pX2) / (pN1 + pN2);
    const se = Math.sqrt(Math.max(1e-9, pPool * (1 - pPool) * (1 / pN1 + 1 / pN2)));
    const stat = (p1 - p2) / se;
    const crit = tail === 'two' ? Z_CRIT_TWO[alpha] : Z_CRIT_ONE[alpha];
    const reject =
      tail === 'two' ? Math.abs(stat) > crit : tail === 'right' ? stat > crit : stat < -crit;
    const pApprox =
      tail === 'two'
        ? 2 * (1 - normalCdf(Math.abs(stat)))
        : tail === 'right'
          ? 1 - normalCdf(stat)
          : normalCdf(stat);
    return {
      dist: 'z' as const,
      stat,
      crit,
      dfLabel: `p̂ = ${pPool.toFixed(3)}`,
      seLabel: `SE = ${se.toFixed(4)}`,
      valid: pPool * pN1 >= 5 && pPool * pN2 >= 5,
      reject,
      pApprox,
      p1,
      p2,
    };
  }, [mode, alpha, tail, cellA, cellB, cellC, cellD, zN, zXbar, zMu0, zSigma, tDbar, tSd, pX1, pN1, pX2, pN2]);

  // SVG Curve Coordinates
  const W = 680;
  const H = 300;
  const PAD_L = 48;
  const PAD_R = 24;
  const PAD_T = 26;
  const PAD_B = 46;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  const isChi = calc.dist === 'chi';
  const domainMin = isChi ? 0 : -4.5;
  const domainMax = isChi ? 14 : 4.5;
  const yMax = isChi ? 0.85 : 0.45;
  const xToPx = (x: number) => PAD_L + ((x - domainMin) / (domainMax - domainMin)) * plotW;
  const yToPx = (y: number) => PAD_T + plotH - (Math.min(y, yMax) / yMax) * plotH;

  const evalPdf = (x: number) => {
    if (isChi) return chiPdf(x, 1);
    if (calc.dist === 't') return tPdf(x, 7);
    return normalPdf(x);
  };

  const buildPath = (x0: number, x1: number, closed: boolean) => {
    const steps = 110;
    const pts: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const xv = x0 + (i / steps) * (x1 - x0);
      pts.push(`${i === 0 ? 'M' : 'L'} ${xToPx(xv).toFixed(1)} ${yToPx(evalPdf(xv)).toFixed(1)}`);
    }
    if (closed) {
      pts.push(`L ${xToPx(x1).toFixed(1)} ${yToPx(0).toFixed(1)}`);
      pts.push(`L ${xToPx(x0).toFixed(1)} ${yToPx(0).toFixed(1)} Z`);
    }
    return pts.join(' ');
  };

  const clampedStat = Math.max(domainMin + 0.08, Math.min(domainMax - 0.08, calc.stat));
  const statOffScale = calc.stat < domainMin || calc.stat > domainMax;

  return (
    <section aria-labelledby="hyp-lab-heading" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 no-print">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 id="hyp-lab-heading" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Interactive Hypothesis Testing &amp; Critical Region Simulator
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Visualize rejection regions for PU Model Q3 (2×2 χ²), Model Q9 (Single-Mean Z), Paired t (df = 7), and Two-Proportion Z-tests.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg">
            <button
              type="button"
              onClick={loadModelQ3}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'chi-2x2'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              PU Model Q3 (χ² 2×2)
            </button>
            <button
              type="button"
              onClick={loadModelQ9}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'z-mean'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              PU Model Q9 (Z-Mean)
            </button>
            <button
              type="button"
              onClick={loadExtraPairedT}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 't-paired'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Extra Q1 (Paired t)
            </button>
            <button
              type="button"
              onClick={loadExtraTwoProp}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'z-2prop'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Extra Q2 (2-Prop Z)
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
        {/* Left Zone: Interactive Critical Region SVG */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {isChi
                ? 'Chi-Square Distribution (df = 1 · Right-Tailed Rejection)'
                : calc.dist === 't'
                  ? "Student's t-Distribution (df = 7)"
                  : 'Standard Normal Z ~ N(0, 1)'}
            </span>
            <span
              className={`font-semibold px-2 py-0.5 rounded border ${
                calc.reject
                  ? 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              }`}
            >
              {calc.reject ? '▲ REJECT H₀' : '● FAIL TO REJECT H₀'}
            </span>
          </div>

          <div className="my-auto">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Hypothesis Test Critical Region Plot">
              {/* Rejection Shading */}
              {isChi ? (
                <path d={buildPath(calc.crit, domainMax, true)} fill="#DC2626" fillOpacity={0.22} />
              ) : (
                <>
                  {(tail === 'two' || tail === 'left') && (
                    <path d={buildPath(domainMin, -calc.crit, true)} fill="#DC2626" fillOpacity={0.22} />
                  )}
                  {(tail === 'two' || tail === 'right') && (
                    <path d={buildPath(calc.crit, domainMax, true)} fill="#DC2626" fillOpacity={0.22} />
                  )}
                </>
              )}

              {/* Full PDF Curve */}
              <path
                d={buildPath(isChi ? 0.08 : domainMin, domainMax, false)}
                fill="none"
                className="stroke-slate-900 dark:stroke-slate-100"
                strokeWidth={2}
              />

              {/* Critical Threshold Line(s) */}
              {isChi ? (
                <g>
                  <line
                    x1={xToPx(calc.crit)}
                    y1={PAD_T + 12}
                    x2={xToPx(calc.crit)}
                    y2={yToPx(0)}
                    stroke="#DC2626"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                  />
                  <text x={xToPx(calc.crit) + 5} y={PAD_T + 22} className="fill-red-700 dark:fill-red-400 text-[11px] font-mono font-semibold">
                    χ²_crit = {calc.crit.toFixed(3)}
                  </text>
                </g>
              ) : (
                <>
                  {(tail === 'two' || tail === 'left') && (
                    <g>
                      <line
                        x1={xToPx(-calc.crit)}
                        y1={PAD_T + 14}
                        x2={xToPx(-calc.crit)}
                        y2={yToPx(0)}
                        stroke="#DC2626"
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                      />
                      <text x={xToPx(-calc.crit) - 4} y={PAD_T + 22} textAnchor="end" className="fill-red-700 dark:fill-red-400 text-[10px] font-mono font-semibold">
                        −{calc.crit.toFixed(3)}
                      </text>
                    </g>
                  )}
                  {(tail === 'two' || tail === 'right') && (
                    <g>
                      <line
                        x1={xToPx(calc.crit)}
                        y1={PAD_T + 14}
                        x2={xToPx(calc.crit)}
                        y2={yToPx(0)}
                        stroke="#DC2626"
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                      />
                      <text x={xToPx(calc.crit) + 4} y={PAD_T + 22} className="fill-red-700 dark:fill-red-400 text-[10px] font-mono font-semibold">
                        +{calc.crit.toFixed(3)}
                      </text>
                    </g>
                  )}
                </>
              )}

              {/* Calculated Statistic Marker */}
              <line
                x1={xToPx(clampedStat)}
                y1={PAD_T}
                x2={xToPx(clampedStat)}
                y2={yToPx(0)}
                stroke="#0284C7"
                strokeWidth={2.25}
              />
              <circle cx={xToPx(clampedStat)} cy={PAD_T + 8} r={4} fill="#0284C7" />
              <text
                x={clampedStat > (isChi ? 9 : 1.5) ? xToPx(clampedStat) - 6 : xToPx(clampedStat) + 6}
                y={PAD_T + 12}
                textAnchor={clampedStat > (isChi ? 9 : 1.5) ? 'end' : 'start'}
                className="fill-sky-800 dark:fill-sky-300 text-[11px] font-mono font-semibold"
              >
                calc = {calc.stat.toFixed(3)}
                {statOffScale ? ' (off-scale)' : ''}
              </text>

              {/* Axes & Ticks */}
              <line x1={PAD_L} y1={yToPx(0)} x2={W - PAD_R} y2={yToPx(0)} className="stroke-slate-600 dark:stroke-slate-400" strokeWidth={1.25} />
              {(isChi ? [0, 2, 4, 6, 8, 10, 12, 14] : [-4, -3, -2, -1, 0, 1, 2, 3, 4]).map((tk) => (
                <g key={tk}>
                  <line x1={xToPx(tk)} y1={yToPx(0)} x2={xToPx(tk)} y2={yToPx(0) + 5} className="stroke-slate-600 dark:stroke-slate-400" strokeWidth={1} />
                  <text x={xToPx(tk)} y={yToPx(0) + 18} textAnchor="middle" className="fill-slate-600 dark:fill-slate-400 text-[11px] font-mono">
                    {tk}
                  </text>
                </g>
              ))}
              <text x={PAD_L + plotW / 2} y={H - 6} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[11px]">
                Test Statistic Axis · α = {(alpha * 100).toFixed(0)}% Shaded Rejection Region
              </text>
            </svg>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 mt-3 border-t border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Test Stat (calc)</div>
              <div className="text-base font-semibold text-sky-700 dark:text-sky-400 font-mono tabular-nums">
                {calc.stat.toFixed(3)}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Critical Value</div>
              <div className="text-base font-semibold text-red-700 dark:text-red-400 font-mono tabular-nums">
                {isChi ? calc.crit.toFixed(3) : tail === 'two' ? `±${calc.crit.toFixed(3)}` : tail === 'left' ? `−${calc.crit.toFixed(3)}` : `+${calc.crit.toFixed(3)}`}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Scale / df</div>
              <div className="text-base font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                {calc.dfLabel}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Approx p-value</div>
              <div className="text-base font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                {calc.pApprox < 0.0001 ? '< 0.0001' : calc.pApprox.toFixed(4)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Zone: Controls */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-900/80 space-y-4">
            {/* Alpha & Tail Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Significance Level (α)</div>
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  {([0.10, 0.05, 0.01] as AlphaLevel[]).map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAlpha(a)}
                      className={`flex-1 py-1 text-xs font-mono font-medium rounded-md transition-colors cursor-pointer ${
                        alpha === a
                          ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      {(a * 100).toFixed(0)}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Tail Direction</div>
                {isChi ? (
                  <div className="py-1.5 px-3 text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg">
                    Right-Tailed (χ² &gt; crit)
                  </div>
                ) : (
                  <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    {(['two', 'right', 'left'] as TailType[]).map((tl) => (
                      <button
                        key={tl}
                        type="button"
                        onClick={() => setTail(tl)}
                        className={`flex-1 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                          tail === tl
                            ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                        }`}
                      >
                        {tl === 'two' ? '≠ Two' : tl === 'right' ? '> Right' : '< Left'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mode-Specific Interactive Controls */}
            {mode === 'chi-2x2' && (
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">2 × 2 Observed Counts (O) &amp; Expected (E)</div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Trained · Good (a)', val: cellA, set: setCellA, exp: calc.e11 },
                    { label: 'Trained · Not Good (b)', val: cellB, set: setCellB, exp: calc.e12 },
                    { label: 'Untrained · Good (c)', val: cellC, set: setCellC, exp: calc.e21 },
                    { label: 'Untrained · Not Good (d)', val: cellD, set: setCellD, exp: calc.e22 },
                  ].map((item) => (
                    <div key={item.label} className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
                      <div className="flex justify-between text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                        <span>{item.label}</span>
                        <span className="font-mono text-slate-900 dark:text-slate-100 tabular-nums">{item.val}</span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={160}
                        step={1}
                        value={item.val}
                        onChange={(e) => item.set(Number(e.target.value))}
                        className="w-full accent-sky-600 cursor-pointer"
                      />
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                        Expected E = {item.exp?.toFixed(1)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mode === 'z-mean' && (
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <label htmlFor="hyp-zxbar">Sample Mean (x̄)</label>
                    <span className="font-mono text-sky-700 dark:text-sky-400 tabular-nums">{zXbar}</span>
                  </div>
                  <input id="hyp-zxbar" type="range" min={85} max={115} step={0.5} value={zXbar} onChange={(e) => setZXbar(Number(e.target.value))} className="w-full accent-sky-600 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <label htmlFor="hyp-zn">Sample Size (n)</label>
                    <span className="font-mono text-slate-900 dark:text-slate-100 tabular-nums">{zN}</span>
                  </div>
                  <input id="hyp-zn" type="range" min={30} max={200} step={5} value={zN} onChange={(e) => setZN(Number(e.target.value))} className="w-full accent-sky-600 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <label htmlFor="hyp-zsig">Population SD (σ) · Null μ₀ = {zMu0}</label>
                    <span className="font-mono text-slate-900 dark:text-slate-100 tabular-nums">{zSigma}</span>
                  </div>
                  <input id="hyp-zsig" type="range" min={2} max={30} step={1} value={zSigma} onChange={(e) => setZSigma(Number(e.target.value))} className="w-full accent-slate-700 dark:accent-slate-300 cursor-pointer" />
                </div>
              </div>
            )}

            {mode === 't-paired' && (
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <label htmlFor="hyp-tdbar">Mean Paired Difference (d̄ = Before − After)</label>
                    <span className="font-mono text-sky-700 dark:text-sky-400 tabular-nums">{tDbar.toFixed(2)} kVAR</span>
                  </div>
                  <input id="hyp-tdbar" type="range" min={-3} max={6} step={0.25} value={tDbar} onChange={(e) => setTDbar(Number(e.target.value))} className="w-full accent-sky-600 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <label htmlFor="hyp-tsd">Sample SD of Differences (s_d, n = 8)</label>
                    <span className="font-mono text-slate-900 dark:text-slate-100 tabular-nums">{tSd.toFixed(3)} kVAR</span>
                  </div>
                  <input id="hyp-tsd" type="range" min={0.5} max={5.0} step={0.1} value={tSd} onChange={(e) => setTSd(Number(e.target.value))} className="w-full accent-slate-700 dark:accent-slate-300 cursor-pointer" />
                </div>
              </div>
            )}

            {mode === 'z-2prop' && (
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <label htmlFor="hyp-px1">Plant A Defectives (x₁ of n₁ = {pN1})</label>
                    <span className="font-mono text-sky-700 dark:text-sky-400 tabular-nums">{pX1} ({((pX1 / pN1) * 100).toFixed(1)}%)</span>
                  </div>
                  <input id="hyp-px1" type="range" min={5} max={90} step={1} value={pX1} onChange={(e) => setPX1(Number(e.target.value))} className="w-full accent-sky-600 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <label htmlFor="hyp-px2">Plant B Defectives (x₂ of n₂ = {pN2})</label>
                    <span className="font-mono text-slate-900 dark:text-slate-100 tabular-nums">{pX2} ({((pX2 / pN2) * 100).toFixed(1)}%)</span>
                  </div>
                  <input id="hyp-px2" type="range" min={5} max={70} step={1} value={pX2} onChange={(e) => setPX2(Number(e.target.value))} className="w-full accent-slate-700 dark:accent-slate-300 cursor-pointer" />
                </div>
              </div>
            )}
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-3 space-y-1 font-mono tabular-nums">
            <div className="font-sans font-semibold text-slate-800 dark:text-slate-200">Validity &amp; Decision Diagnostic</div>
            <div>
              {calc.seLabel} · {calc.valid ? '● Assumptions Satisfied' : '▲ Check Sample / Min E ≥ 5'}
            </div>
            <div className="font-sans text-slate-700 dark:text-slate-300">
              {calc.reject
                ? `Calculated (${calc.stat.toFixed(3)}) falls inside the α = ${(alpha * 100).toFixed(0)}% rejection region → Reject H₀.`
                : `Calculated (${calc.stat.toFixed(3)}) lies inside the acceptance zone → Fail to reject H₀.`}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
