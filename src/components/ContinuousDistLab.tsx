import React, { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';

type DistFamily = 'normal' | 't' | 'chi2';
type AreaMode = 'between' | 'left' | 'right';

const SQRT_2PI = Math.sqrt(2 * Math.PI);

const erf = (x: number): number => {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y =
    1 -
    (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t) *
      Math.exp(-ax * ax);
  return sign * y;
};

const normalCdf = (z: number): number => 0.5 * (1 + erf(z / Math.SQRT2));
const normalPdf = (z: number): number => Math.exp(-0.5 * z * z) / SQRT_2PI;

const logGamma = (z: number): number => {
  const p = [
    676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059,
    12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - logGamma(1 - z);
  const zm = z - 1;
  let x = 0.99999999999980993;
  for (let i = 0; i < p.length; i++) x += p[i] / (zm + i + 1);
  const t = zm + p.length - 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (zm + 0.5) * Math.log(t) - t + Math.log(x);
};

const tPdf = (t: number, df: number): number => {
  const logCoeff = logGamma((df + 1) / 2) - logGamma(df / 2) - 0.5 * Math.log(df * Math.PI);
  return Math.exp(logCoeff - ((df + 1) / 2) * Math.log(1 + (t * t) / df));
};

const chi2Pdf = (x: number, df: number): number => {
  if (x <= 0) return df === 2 ? 0.5 : 0;
  const k2 = df / 2;
  const logVal = (k2 - 1) * Math.log(x) - x / 2 - k2 * Math.LN2 - logGamma(k2);
  return Math.exp(logVal);
};

const simpsonIntegral = (fn: (u: number) => number, a: number, b: number, steps = 160): number => {
  if (b <= a) return 0;
  const n = steps % 2 === 0 ? steps : steps + 1;
  const h = (b - a) / n;
  let sum = fn(a) + fn(b);
  for (let i = 1; i < n; i++) {
    sum += (i % 2 === 0 ? 2 : 4) * fn(a + i * h);
  }
  return (h / 3) * sum;
};

export const ContinuousDistLab: React.FC = () => {
  const [family, setFamily] = useState<DistFamily>('normal');
  const [areaMode, setAreaMode] = useState<AreaMode>('between');

  // Normal parameters
  const [mu, setMu] = useState<number>(1500);
  const [sigma, setSigma] = useState<number>(100);
  const [lowZ, setLowZ] = useState<number>(-0.5);
  const [highZ, setHighZ] = useState<number>(1.0);

  // t & chi2 degrees of freedom
  const [df, setDf] = useState<number>(5);
  const [tCut, setTCut] = useState<number>(2.0);
  const [chiCut, setChiCut] = useState<number>(11.07);
  const [showNormalRef, setShowNormalRef] = useState<boolean>(true);

  const loadModelQ10 = () => {
    setFamily('normal');
    setAreaMode('between');
    setMu(1500);
    setSigma(100);
    setLowZ(-0.5);
    setHighZ(1.0);
  };

  const loadExtraResistor = () => {
    setFamily('normal');
    setAreaMode('between');
    setMu(100);
    setSigma(4);
    setLowZ(-1.5);
    setHighZ(1.5);
  };

  const loadTPreset = () => {
    setFamily('t');
    setAreaMode('between');
    setDf(5);
    setTCut(2.0);
    setShowNormalRef(true);
  };

  const loadChiPreset = () => {
    setFamily('chi2');
    setAreaMode('right');
    setDf(5);
    setChiCut(11.07);
  };

  const handleReset = () => {
    if (family === 'normal') loadModelQ10();
    else if (family === 't') loadTPreset();
    else loadChiPreset();
  };

  const calc = useMemo(() => {
    const N_PTS = 180;

    if (family === 'normal') {
      const zMin = -3.6;
      const zMax = 3.6;
      const points = Array.from({ length: N_PTS + 1 }, (_, i) => {
        const z = zMin + ((zMax - zMin) * i) / N_PTS;
        return { u: z, y: normalPdf(z), refY: 0 };
      });
      const yMax = 0.44;
      const a = Math.min(lowZ, highZ);
      const b = Math.max(lowZ, highZ);

      let prob = 0;
      if (areaMode === 'between') prob = normalCdf(b) - normalCdf(a);
      else if (areaMode === 'left') prob = normalCdf(b);
      else prob = 1 - normalCdf(a);

      const xLow = mu + a * sigma;
      const xHigh = mu + b * sigma;

      return {
        xMin: zMin,
        xMax: zMax,
        yMax,
        points,
        shadeA: areaMode === 'left' ? zMin : a,
        shadeB: areaMode === 'right' ? zMax : b,
        prob,
        mean: mu,
        variance: sigma * sigma,
        sd: sigma,
        zA: a,
        zB: b,
        xLow,
        xHigh,
      };
    }

    if (family === 't') {
      const tMin = -4.2;
      const tMax = 4.2;
      const points = Array.from({ length: N_PTS + 1 }, (_, i) => {
        const t = tMin + ((tMax - tMin) * i) / N_PTS;
        return { u: t, y: tPdf(t, df), refY: normalPdf(t) };
      });
      const yMax = 0.44;
      const cut = Math.abs(tCut);

      let prob = 0;
      if (areaMode === 'between') {
        prob = simpsonIntegral((u) => tPdf(u, df), -cut, cut);
      } else if (areaMode === 'left') {
        prob = 0.5 + simpsonIntegral((u) => tPdf(u, df), 0, tCut);
      } else {
        prob = 0.5 - simpsonIntegral((u) => tPdf(u, df), 0, tCut);
      }

      const variance = df > 2 ? df / (df - 2) : Infinity;

      return {
        xMin: tMin,
        xMax: tMax,
        yMax,
        points,
        shadeA: areaMode === 'between' ? -cut : areaMode === 'left' ? tMin : tCut,
        shadeB: areaMode === 'between' ? cut : areaMode === 'left' ? tCut : tMax,
        prob: Math.max(0, Math.min(1, prob)),
        mean: 0,
        variance,
        sd: Number.isFinite(variance) ? Math.sqrt(variance) : Infinity,
        zA: -cut,
        zB: cut,
        xLow: -cut,
        xHigh: cut,
      };
    }

    // Chi-square
    const cMin = 0;
    const cMax = Math.max(16, Math.ceil(df + 4 * Math.sqrt(2 * df)));
    const pts = Array.from({ length: N_PTS + 1 }, (_, i) => {
      const x = cMin + ((cMax - cMin) * i) / N_PTS;
      return { u: x, y: chi2Pdf(x, df), refY: 0 };
    });
    const peakY = Math.max(...pts.map((p) => p.y), 0.12);
    const yMax = Math.min(0.65, peakY * 1.18);
    const cut = Math.min(cMax - 0.1, Math.max(0.1, chiCut));

    const leftArea = simpsonIntegral((u) => chi2Pdf(u, df), 0.0001, cut, 200);
    const prob = areaMode === 'left' ? Math.min(1, leftArea) : Math.max(0, 1 - leftArea);

    return {
      xMin: cMin,
      xMax: cMax,
      yMax,
      points: pts,
      shadeA: areaMode === 'left' ? 0 : cut,
      shadeB: areaMode === 'left' ? cut : cMax,
      prob,
      mean: df,
      variance: 2 * df,
      sd: Math.sqrt(2 * df),
      zA: cut,
      zB: cut,
      xLow: cut,
      xHigh: cut,
    };
  }, [family, areaMode, mu, sigma, lowZ, highZ, df, tCut, chiCut]);

  // SVG setup
  const W = 680;
  const H = 300;
  const PAD_L = 52;
  const PAD_R = 24;
  const PAD_T = 22;
  const PAD_B = 44;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  const xToPx = (u: number) => PAD_L + ((u - calc.xMin) / (calc.xMax - calc.xMin)) * plotW;
  const yToPx = (y: number) => PAD_T + plotH - (Math.min(y, calc.yMax) / calc.yMax) * plotH;

  const curvePath = calc.points
    .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${xToPx(pt.u).toFixed(1)} ${yToPx(pt.y).toFixed(1)}`)
    .join(' ');

  const refPath =
    family === 't' && showNormalRef
      ? calc.points
          .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${xToPx(pt.u).toFixed(1)} ${yToPx(pt.refY).toFixed(1)}`)
          .join(' ')
      : '';

  const shadePts = calc.points.filter((pt) => pt.u >= calc.shadeA - 1e-6 && pt.u <= calc.shadeB + 1e-6);
  const shadePath =
    shadePts.length > 1
      ? [
          `M ${xToPx(shadePts[0].u).toFixed(1)} ${yToPx(0).toFixed(1)}`,
          ...shadePts.map((pt) => `L ${xToPx(pt.u).toFixed(1)} ${yToPx(pt.y).toFixed(1)}`),
          `L ${xToPx(shadePts[shadePts.length - 1].u).toFixed(1)} ${yToPx(0).toFixed(1)}`,
          'Z',
        ].join(' ')
      : '';

  const xTicks =
    family === 'normal'
      ? [-3, -2, -1, 0, 1, 2, 3]
      : family === 't'
        ? [-3, -2, -1, 0, 1, 2, 3]
        : [0, 0.25, 0.5, 0.75, 1].map((f) => Number((calc.xMin + f * (calc.xMax - calc.xMin)).toFixed(1)));

  const queryCaption =
    family === 'normal'
      ? areaMode === 'between'
        ? `P(${calc.xLow.toFixed(0)} ≤ X ≤ ${calc.xHigh.toFixed(0)}) = P(${calc.zA.toFixed(2)} ≤ Z ≤ ${calc.zB.toFixed(2)})`
        : areaMode === 'left'
          ? `P(X ≤ ${calc.xHigh.toFixed(0)}) = Φ(${calc.zB.toFixed(2)})`
          : `P(X ≥ ${calc.xLow.toFixed(0)}) = 1 − Φ(${calc.zA.toFixed(2)})`
      : family === 't'
        ? areaMode === 'between'
          ? `P(${(-Math.abs(tCut)).toFixed(2)} ≤ t ≤ +${Math.abs(tCut).toFixed(2)})`
          : areaMode === 'left'
            ? `P(t ≤ ${tCut.toFixed(2)})`
            : `P(t ≥ ${tCut.toFixed(2)})`
        : areaMode === 'left'
          ? `P(χ² ≤ ${chiCut.toFixed(2)})`
          : `P(χ² ≥ ${chiCut.toFixed(2)})`;

  return (
    <section aria-labelledby="cont-lab-heading" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 no-print">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 id="cont-lab-heading" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Interactive Normal, Student&apos;s t &amp; Chi-Square Distribution Lab
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Verify PU Model Q10 (wooden beam strengths), inspect inflection points (μ ± σ), and compare Student&apos;s t_ν and χ²_ν curves dynamically.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg">
            <button
              type="button"
              onClick={loadModelQ10}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                family === 'normal' && mu === 1500 && sigma === 100
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              PU Model Q10 (Beams)
            </button>
            <button
              type="button"
              onClick={loadExtraResistor}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                family === 'normal' && mu === 100 && sigma === 4
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Extra Q1 (Resistors)
            </button>
            <button
              type="button"
              onClick={loadTPreset}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                family === 't'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Student&apos;s t_ν
            </button>
            <button
              type="button"
              onClick={loadChiPreset}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                family === 'chi2'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Chi-Square χ²_ν
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
        {/* Left Zone: Density Curve SVG */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg">
              {(['normal', 't', 'chi2'] as DistFamily[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => {
                    setFamily(f);
                    if (f === 'chi2' && areaMode === 'between') setAreaMode('right');
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    family === f
                      ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  {f === 'normal' ? 'Normal N(μ, σ²)' : f === 't' ? "Student's t_ν" : 'Chi-Square χ²_ν'}
                </button>
              ))}
            </div>

            {family === 't' && (
              <button
                type="button"
                onClick={() => setShowNormalRef((v) => !v)}
                className={`px-3 py-1 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  showNormalRef
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {showNormalRef ? 'N(0,1) Reference: On' : 'Show N(0,1) Curve'}
              </button>
            )}
          </div>

          <div className="my-auto">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Continuous Probability Density Curve">
              {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                const yVal = t * calc.yMax;
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

              {shadePath && <path d={shadePath} fill="#0284C7" fillOpacity={0.22} />}

              {family === 'normal' && (
                <>
                  <line
                    x1={xToPx(-1)}
                    y1={yToPx(normalPdf(-1))}
                    x2={xToPx(-1)}
                    y2={yToPx(0)}
                    className="stroke-slate-400 dark:stroke-slate-500"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />
                  <line
                    x1={xToPx(1)}
                    y1={yToPx(normalPdf(1))}
                    x2={xToPx(1)}
                    y2={yToPx(0)}
                    className="stroke-slate-400 dark:stroke-slate-500"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />
                  <circle cx={xToPx(-1)} cy={yToPx(normalPdf(-1))} r={3} className="fill-slate-600 dark:fill-slate-300" />
                  <circle cx={xToPx(1)} cy={yToPx(normalPdf(1))} r={3} className="fill-slate-600 dark:fill-slate-300" />
                </>
              )}

              {refPath && (
                <path d={refPath} fill="none" stroke="#059669" strokeWidth={1.5} strokeDasharray="5 4" />
              )}

              <path d={curvePath} fill="none" stroke="#0284C7" strokeWidth={2.5} />

              <line x1={PAD_L} y1={yToPx(0)} x2={W - PAD_R} y2={yToPx(0)} className="stroke-slate-600 dark:stroke-slate-400" strokeWidth={1.25} />
              <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={yToPx(0)} className="stroke-slate-600 dark:stroke-slate-400" strokeWidth={1.25} />

              {xTicks.map((tk) => (
                <g key={tk}>
                  <line x1={xToPx(tk)} y1={yToPx(0)} x2={xToPx(tk)} y2={yToPx(0) + 4} className="stroke-slate-600 dark:stroke-slate-400" strokeWidth={1} />
                  <text x={xToPx(tk)} y={yToPx(0) + 17} textAnchor="middle" className="fill-slate-600 dark:fill-slate-400 text-[11px] font-mono">
                    {tk}
                  </text>
                </g>
              ))}

              <text x={PAD_L + plotW / 2} y={H - 5} textAnchor="middle" className="fill-slate-600 dark:fill-slate-400 text-[11px] font-mono">
                {queryCaption} = {calc.prob.toFixed(4)}
              </text>
              <text
                x={16}
                y={PAD_T + plotH / 2}
                textAnchor="middle"
                transform={`rotate(-90 16 ${PAD_T + plotH / 2})`}
                className="fill-slate-500 dark:fill-slate-400 text-[11px]"
              >
                Density f(x)
              </text>
            </svg>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 mt-3 border-t border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Shaded Area (Prob.)</div>
              <div className="text-base font-semibold text-sky-700 dark:text-sky-400 font-mono tabular-nums">
                {calc.prob.toFixed(4)} ({(calc.prob * 100).toFixed(2)}%)
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Mean (μ)</div>
              <div className="text-base font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                {calc.mean.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Variance (σ²)</div>
              <div className="text-base font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                {Number.isFinite(calc.variance) ? calc.variance.toFixed(2) : '∞'}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{family === 'normal' ? 'Inflection (±1σ)' : 'Std. Dev. (σ)'}</div>
              <div className="text-base font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                {family === 'normal'
                  ? `${(mu - sigma).toFixed(0)}, ${(mu + sigma).toFixed(0)}`
                  : Number.isFinite(calc.sd)
                    ? calc.sd.toFixed(3)
                    : '∞'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Zone: Parameters & Area Controls */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-900/80 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Area Region</span>
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                {(family === 'chi2' ? (['left', 'right'] as AreaMode[]) : (['between', 'left', 'right'] as AreaMode[])).map(
                  (m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setAreaMode(m)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        areaMode === m
                          ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      {m === 'between' ? 'a ≤ X ≤ b' : m === 'left' ? 'Left Tail' : 'Right Tail'}
                    </button>
                  ),
                )}
              </div>
            </div>

            {family === 'normal' ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      <label htmlFor="norm-mu-slider">Mean (μ)</label>
                      <span className="font-mono text-slate-900 dark:text-slate-100 tabular-nums">{mu}</span>
                    </div>
                    <input
                      id="norm-mu-slider"
                      type="range"
                      min={0}
                      max={2000}
                      step={50}
                      value={mu}
                      onChange={(e) => setMu(Number(e.target.value))}
                      className="w-full accent-sky-600 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      <label htmlFor="norm-sd-slider">SD (σ)</label>
                      <span className="font-mono text-slate-900 dark:text-slate-100 tabular-nums">{sigma}</span>
                    </div>
                    <input
                      id="norm-sd-slider"
                      type="range"
                      min={2}
                      max={250}
                      step={2}
                      value={sigma}
                      onChange={(e) => setSigma(Number(e.target.value))}
                      className="w-full accent-sky-600 cursor-pointer"
                    />
                  </div>
                </div>

                {(areaMode === 'between' || areaMode === 'right') && (
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      <label htmlFor="norm-z1-slider">Lower Bound z₁ (x₁ = {(mu + lowZ * sigma).toFixed(1)})</label>
                      <span className="font-mono text-sky-700 dark:text-sky-400 tabular-nums">{lowZ.toFixed(2)}</span>
                    </div>
                    <input
                      id="norm-z1-slider"
                      type="range"
                      min={-3.0}
                      max={3.0}
                      step={0.05}
                      value={lowZ}
                      onChange={(e) => setLowZ(Number(e.target.value))}
                      className="w-full accent-sky-600 cursor-pointer"
                    />
                  </div>
                )}

                {(areaMode === 'between' || areaMode === 'left') && (
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      <label htmlFor="norm-z2-slider">Upper Bound z₂ (x₂ = {(mu + highZ * sigma).toFixed(1)})</label>
                      <span className="font-mono text-sky-700 dark:text-sky-400 tabular-nums">{highZ.toFixed(2)}</span>
                    </div>
                    <input
                      id="norm-z2-slider"
                      type="range"
                      min={-3.0}
                      max={3.0}
                      step={0.05}
                      value={highZ}
                      onChange={(e) => setHighZ(Number(e.target.value))}
                      className="w-full accent-sky-600 cursor-pointer"
                    />
                  </div>
                )}
              </>
            ) : family === 't' ? (
              <>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <label htmlFor="t-df-slider">Degrees of Freedom (ν)</label>
                    <span className="font-mono text-slate-900 dark:text-slate-100 tabular-nums">ν = {df}</span>
                  </div>
                  <input
                    id="t-df-slider"
                    type="range"
                    min={1}
                    max={40}
                    step={1}
                    value={df}
                    onChange={(e) => setDf(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <label htmlFor="t-cut-slider">Critical Threshold (t)</label>
                    <span className="font-mono text-sky-700 dark:text-sky-400 tabular-nums">{tCut.toFixed(2)}</span>
                  </div>
                  <input
                    id="t-cut-slider"
                    type="range"
                    min={areaMode === 'between' ? 0.2 : -3.5}
                    max={3.5}
                    step={0.05}
                    value={tCut}
                    onChange={(e) => setTCut(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <label htmlFor="chi-df-slider">Degrees of Freedom (ν)</label>
                    <span className="font-mono text-slate-900 dark:text-slate-100 tabular-nums">ν = {df}</span>
                  </div>
                  <input
                    id="chi-df-slider"
                    type="range"
                    min={1}
                    max={20}
                    step={1}
                    value={df}
                    onChange={(e) => setDf(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <label htmlFor="chi-cut-slider">Chi-Square Cutoff (χ²)</label>
                    <span className="font-mono text-sky-700 dark:text-sky-400 tabular-nums">{chiCut.toFixed(2)}</span>
                  </div>
                  <input
                    id="chi-cut-slider"
                    type="range"
                    min={0.2}
                    max={35}
                    step={0.1}
                    value={chiCut}
                    onChange={(e) => setChiCut(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>
              </>
            )}
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-3 space-y-1 font-mono tabular-nums">
            <div className="font-sans font-semibold text-slate-800 dark:text-slate-200">Distribution Diagnostic</div>
            {family === 'normal' && (
              <div>
                QD ≈ 0.6745σ = {(0.6745 * sigma).toFixed(2)} · MD ≈ 0.7979σ = {(0.7979 * sigma).toFixed(2)}
              </div>
            )}
            {family === 't' && (
              <div>
                {df >= 30
                  ? 'ν ≥ 30: t_ν closely matches Standard Normal N(0, 1).'
                  : `ν = ${df}: heavier tails than N(0,1); dashed green shows N(0,1).`}
              </div>
            )}
            {family === 'chi2' && (
              <div>
                Mean = ν = {df} · Variance = 2ν = {2 * df} · Mode = {Math.max(0, df - 2)}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
