import React, { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';

interface DiscreteRow {
  label: string;
  x: number;
  f: number;
}

interface ContinuousRow {
  label: string;
  lower: number;
  upper: number;
  f: number;
}

type PresetKey = 'pu-q4' | 'extra-q1';
type ChartView = 'histogram' | 'ogive';

const PRESET_PU_Q4: DiscreteRow[] = [
  { label: '0', x: 0, f: 14 },
  { label: '1', x: 1, f: 21 },
  { label: '2', x: 2, f: 25 },
  { label: '3', x: 3, f: 43 },
  { label: '4', x: 4, f: 51 },
  { label: '5', x: 5, f: 40 },
  { label: '6', x: 6, f: 39 },
  { label: '7', x: 7, f: 12 },
];

const PRESET_EXTRA_Q1: ContinuousRow[] = [
  { label: '100–150', lower: 100, upper: 150, f: 8 },
  { label: '150–200', lower: 150, upper: 200, f: 21 },
  { label: '200–250', lower: 200, upper: 250, f: 30 },
  { label: '250–300', lower: 250, upper: 300, f: 29 },
  { label: '300–350', lower: 300, upper: 350, f: 12 },
];

export const StatisticsLab: React.FC = () => {
  const [preset, setPreset] = useState<PresetKey>('extra-q1');
  const [chartView, setChartView] = useState<ChartView>('histogram');
  const [percentileK, setPercentileK] = useState<number>(80);
  const [discreteRows, setDiscreteRows] = useState<DiscreteRow[]>(PRESET_PU_Q4);
  const [continuousRows, setContinuousRows] = useState<ContinuousRow[]>(PRESET_EXTRA_Q1);

  const handleReset = () => {
    if (preset === 'pu-q4') {
      setDiscreteRows(PRESET_PU_Q4.map((r) => ({ ...r })));
      setPercentileK(75);
    } else {
      setContinuousRows(PRESET_EXTRA_Q1.map((r) => ({ ...r })));
      setPercentileK(80);
    }
  };

  const handlePresetSwitch = (next: PresetKey) => {
    setPreset(next);
    setPercentileK(next === 'pu-q4' ? 75 : 80);
  };

  const updateFreq = (index: number, raw: string) => {
    const parsed = Math.max(0, Math.min(999, Number.parseInt(raw || '0', 10) || 0));
    if (preset === 'pu-q4') {
      setDiscreteRows((prev) => prev.map((r, i) => (i === index ? { ...r, f: parsed } : r)));
    } else {
      setContinuousRows((prev) => prev.map((r, i) => (i === index ? { ...r, f: parsed } : r)));
    }
  };

  const stats = useMemo(() => {
    if (preset === 'pu-q4') {
      const N = discreteRows.reduce((s, r) => s + r.f, 0);
      const sumFx = discreteRows.reduce((s, r) => s + r.f * r.x, 0);
      const sumFx2 = discreteRows.reduce((s, r) => s + r.f * r.x * r.x, 0);
      const mean = N > 0 ? sumFx / N : 0;
      const variance = N > 0 ? Math.max(0, sumFx2 / N - mean * mean) : 0;
      const sd = Math.sqrt(variance);
      const cv = mean > 0 ? (sd / mean) * 100 : 0;

      let running = 0;
      const cfs = discreteRows.map((r) => {
        running += r.f;
        return running;
      });

      const getDiscreteQuantile = (frac: number) => {
        if (N === 0) return 0;
        const pos = frac * (N + 1);
        const idx = cfs.findIndex((c) => c >= pos);
        return idx >= 0 ? discreteRows[idx].x : discreteRows[discreteRows.length - 1].x;
      };

      const maxF = Math.max(...discreteRows.map((r) => r.f), 1);
      const modalIdx = discreteRows.findIndex((r) => r.f === maxF);
      const mode = discreteRows[modalIdx]?.x ?? 0;

      return {
        isContinuous: false,
        unit: 'calls/min',
        N,
        sumFx,
        sumFx2,
        mean,
        median: getDiscreteQuantile(0.5),
        mode,
        q1: getDiscreteQuantile(0.25),
        q3: getDiscreteQuantile(0.75),
        pk: getDiscreteQuantile(percentileK / 100),
        variance,
        sd,
        cv,
        cfs,
        maxF,
        modalIdx,
      };
    }

    const N = continuousRows.reduce((s, r) => s + r.f, 0);
    const midpoints = continuousRows.map((r) => (r.lower + r.upper) / 2);
    const sumFx = continuousRows.reduce((s, r, i) => s + r.f * midpoints[i], 0);
    const sumFx2 = continuousRows.reduce((s, r, i) => s + r.f * midpoints[i] * midpoints[i], 0);
    const mean = N > 0 ? sumFx / N : 0;
    const variance = N > 0 ? Math.max(0, sumFx2 / N - mean * mean) : 0;
    const sd = Math.sqrt(variance);
    const cv = mean > 0 ? (sd / mean) * 100 : 0;

    let running = 0;
    const cfs = continuousRows.map((r) => {
      running += r.f;
      return running;
    });

    const getContinuousQuantile = (frac: number) => {
      if (N === 0) return 0;
      const target = frac * N;
      const idx = cfs.findIndex((c) => c >= target);
      if (idx < 0) return continuousRows[continuousRows.length - 1].upper;
      const row = continuousRows[idx];
      const prevCf = idx === 0 ? 0 : cfs[idx - 1];
      const h = row.upper - row.lower;
      if (row.f === 0) return row.lower;
      return row.lower + ((target - prevCf) / row.f) * h;
    };

    const maxF = Math.max(...continuousRows.map((r) => r.f), 1);
    const modalIdx = continuousRows.findIndex((r) => r.f === maxF);
    const modalRow = continuousRows[modalIdx];
    const f1 = modalRow.f;
    const f0 = modalIdx > 0 ? continuousRows[modalIdx - 1].f : 0;
    const f2 = modalIdx < continuousRows.length - 1 ? continuousRows[modalIdx + 1].f : 0;
    const h = modalRow.upper - modalRow.lower;
    const denom = 2 * f1 - f0 - f2;
    const median = getContinuousQuantile(0.5);
    const mode = denom > 0 ? modalRow.lower + ((f1 - f0) / denom) * h : 3 * median - 2 * mean;

    return {
      isContinuous: true,
      unit: 'kWh',
      N,
      sumFx,
      sumFx2,
      mean,
      median,
      mode,
      q1: getContinuousQuantile(0.25),
      q3: getContinuousQuantile(0.75),
      pk: getContinuousQuantile(percentileK / 100),
      variance,
      sd,
      cv,
      cfs,
      maxF,
      modalIdx,
      f0,
      f1,
      f2,
    };
  }, [preset, discreteRows, continuousRows, percentileK]);

  // SVG Coordinate Geometry (680 x 340)
  const W = 680;
  const H = 330;
  const PAD_L = 54;
  const PAD_R = 26;
  const PAD_T = 26;
  const PAD_B = 44;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  const renderChart = () => {
    if (stats.isContinuous) {
      const minX = continuousRows[0].lower;
      const maxX = continuousRows[continuousRows.length - 1].upper;
      const xToPx = (val: number) => PAD_L + ((val - minX) / (maxX - minX || 1)) * plotW;

      if (chartView === 'histogram') {
        const yMax = Math.ceil((stats.maxF * 1.15) / 5) * 5 || 10;
        const yToPx = (val: number) => PAD_T + plotH - (val / yMax) * plotH;

        const mRow = continuousRows[stats.modalIdx];
        const f0 = stats.f0 ?? 0;
        const f1 = stats.f1 ?? mRow.f;
        const f2 = stats.f2 ?? 0;
        const xL = xToPx(mRow.lower);
        const xR = xToPx(mRow.upper);
        const xMo = xToPx(stats.mode);
        const denom = 2 * f1 - f0 - f2;
        const yIntersect = denom > 0 ? f1 - ((f1 - f0) * (f1 - f2)) / denom : f1;

        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Histogram with Mode Difference-Triangle Construction">
            {/* Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((t) => {
              const yVal = Math.round(t * yMax);
              const py = yToPx(yVal);
              return (
                <g key={t}>
                  <line x1={PAD_L} y1={py} x2={W - PAD_R} y2={py} className="stroke-slate-200 dark:stroke-slate-800" strokeWidth={1} />
                  <text x={PAD_L - 8} y={py + 4} textAnchor="end" className="fill-slate-500 dark:fill-slate-400 text-[11px] font-mono">
                    {yVal}
                  </text>
                </g>
              );
            })}

            {/* Histogram Bars */}
            {continuousRows.map((row, idx) => {
              const bx = xToPx(row.lower);
              const bw = xToPx(row.upper) - bx;
              const by = yToPx(row.f);
              const bh = yToPx(0) - by;
              const isModal = idx === stats.modalIdx;
              return (
                <g key={row.label}>
                  <rect
                    x={bx}
                    y={by}
                    width={bw}
                    height={bh}
                    className={
                      isModal
                        ? 'fill-sky-100 dark:fill-sky-900/50 stroke-sky-600 dark:stroke-sky-400'
                        : 'fill-slate-100 dark:fill-slate-800 stroke-slate-400 dark:stroke-slate-600'
                    }
                    strokeWidth={isModal ? 1.5 : 1}
                  />
                  <text x={bx + bw / 2} y={by - 6} textAnchor="middle" className="fill-slate-700 dark:fill-slate-200 text-[11px] font-mono font-medium">
                    {row.f}
                  </text>
                </g>
              );
            })}

            {/* Mode Difference-Triangle Crossed Diagonals */}
            {denom > 0 && (
              <g>
                <line x1={xL} y1={yToPx(f0)} x2={xR} y2={yToPx(f1)} stroke="#0284C7" strokeWidth={1.5} strokeDasharray="4 3" />
                <line x1={xL} y1={yToPx(f1)} x2={xR} y2={yToPx(f2)} stroke="#0284C7" strokeWidth={1.5} strokeDasharray="4 3" />
                <line x1={xMo} y1={yToPx(yIntersect)} x2={xMo} y2={yToPx(0)} stroke="#059669" strokeWidth={1.75} />
                <circle cx={xMo} cy={yToPx(yIntersect)} r={4} fill="#059669" />
              </g>
            )}

            {/* Mean & Median Markers */}
            <line x1={xToPx(stats.mean)} y1={PAD_T} x2={xToPx(stats.mean)} y2={yToPx(0)} stroke="#D97706" strokeWidth={1.5} strokeDasharray="3 3" />
            <line x1={xToPx(stats.median)} y1={PAD_T + 14} x2={xToPx(stats.median)} y2={yToPx(0)} className="stroke-slate-900 dark:stroke-slate-100" strokeWidth={1.5} strokeDasharray="5 3" />

            {/* Axes */}
            <line x1={PAD_L} y1={yToPx(0)} x2={W - PAD_R} y2={yToPx(0)} className="stroke-slate-600 dark:stroke-slate-400" strokeWidth={1.25} />
            <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={yToPx(0)} className="stroke-slate-600 dark:stroke-slate-400" strokeWidth={1.25} />

            {/* X Ticks */}
            {[continuousRows[0].lower, ...continuousRows.map((r) => r.upper)].map((boundary) => (
              <text key={boundary} x={xToPx(boundary)} y={yToPx(0) + 18} textAnchor="middle" className="fill-slate-600 dark:fill-slate-400 text-[11px] font-mono">
                {boundary}
              </text>
            ))}

            {/* Axis labels */}
            <text x={PAD_L + plotW / 2} y={H - 6} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[11px]">
              Consumption ({stats.unit}) · Dashed Amber: Mean ({stats.mean.toFixed(1)}) · Solid Green: Mode ({stats.mode.toFixed(1)})
            </text>
            <text x={16} y={PAD_T + plotH / 2} textAnchor="middle" transform={`rotate(-90 16 ${PAD_T + plotH / 2})`} className="fill-slate-500 dark:fill-slate-400 text-[11px]">
              Frequency (f)
            </text>
          </svg>
        );
      }

      // Ogive View (Continuous)
      const yMax = Math.max(stats.N, 10);
      const yToPx = (val: number) => PAD_T + plotH - (val / yMax) * plotH;
      const points = [
        { x: continuousRows[0].lower, cf: 0 },
        ...continuousRows.map((r, i) => ({ x: r.upper, cf: stats.cfs[i] })),
      ];
      const polyPoints = points.map((p) => `${xToPx(p.x)},${yToPx(p.cf)}`).join(' ');
      const pkRank = (percentileK / 100) * stats.N;

      return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Less-Than Cumulative Frequency Ogive">
          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const yVal = Math.round(t * yMax);
            const py = yToPx(yVal);
            return (
              <g key={t}>
                <line x1={PAD_L} y1={py} x2={W - PAD_R} y2={py} className="stroke-slate-200 dark:stroke-slate-800" strokeWidth={1} />
                <text x={PAD_L - 8} y={py + 4} textAnchor="end" className="fill-slate-500 dark:fill-slate-400 text-[11px] font-mono">
                  {yVal}
                </text>
              </g>
            );
          })}

          {/* Ogive Polyline */}
          <polyline fill="none" stroke="#0284C7" strokeWidth={2.25} points={polyPoints} />
          {points.map((p) => (
            <circle key={p.x} cx={xToPx(p.x)} cy={yToPx(p.cf)} r={3.5} className="fill-white dark:fill-slate-900" stroke="#0284C7" strokeWidth={2} />
          ))}

          {/* Interactive P_k Drop Lines */}
          {stats.N > 0 && (
            <g>
              <line x1={PAD_L} y1={yToPx(pkRank)} x2={xToPx(stats.pk)} y2={yToPx(pkRank)} stroke="#059669" strokeWidth={1.5} strokeDasharray="4 3" />
              <line x1={xToPx(stats.pk)} y1={yToPx(pkRank)} x2={xToPx(stats.pk)} y2={yToPx(0)} stroke="#059669" strokeWidth={1.5} strokeDasharray="4 3" />
              <circle cx={xToPx(stats.pk)} cy={yToPx(pkRank)} r={4.5} fill="#059669" />
              <text x={xToPx(stats.pk) + 6} y={yToPx(pkRank) - 6} className="fill-emerald-700 dark:fill-emerald-400 text-[11px] font-mono font-semibold">
                P{percentileK} = {stats.pk.toFixed(2)}
              </text>
            </g>
          )}

          {/* Axes */}
          <line x1={PAD_L} y1={yToPx(0)} x2={W - PAD_R} y2={yToPx(0)} className="stroke-slate-600 dark:stroke-slate-400" strokeWidth={1.25} />
          <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={yToPx(0)} className="stroke-slate-600 dark:stroke-slate-400" strokeWidth={1.25} />

          {points.map((p) => (
            <text key={p.x} x={xToPx(p.x)} y={yToPx(0) + 18} textAnchor="middle" className="fill-slate-600 dark:fill-slate-400 text-[11px] font-mono">
              {p.x}
            </text>
          ))}

          <text x={PAD_L + plotW / 2} y={H - 6} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[11px]">
            Upper Class Boundary ({stats.unit}) · Less-Than Ogive Interpolation
          </text>
          <text x={16} y={PAD_T + plotH / 2} textAnchor="middle" transform={`rotate(-90 16 ${PAD_T + plotH / 2})`} className="fill-slate-500 dark:fill-slate-400 text-[11px]">
            Cumulative Freq (cf)
          </text>
        </svg>
      );
    }

    // Discrete Chart (PU Model Q4)
    const count = discreteRows.length;
    const slotW = plotW / count;
    const barW = Math.min(44, slotW * 0.56);

    if (chartView === 'histogram') {
      const yMax = Math.ceil((stats.maxF * 1.15) / 10) * 10 || 10;
      const yToPx = (val: number) => PAD_T + plotH - (val / yMax) * plotH;

      return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Discrete Frequency Distribution Column Chart">
          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const yVal = Math.round(t * yMax);
            const py = yToPx(yVal);
            return (
              <g key={t}>
                <line x1={PAD_L} y1={py} x2={W - PAD_R} y2={py} className="stroke-slate-200 dark:stroke-slate-800" strokeWidth={1} />
                <text x={PAD_L - 8} y={py + 4} textAnchor="end" className="fill-slate-500 dark:fill-slate-400 text-[11px] font-mono">
                  {yVal}
                </text>
              </g>
            );
          })}

          {discreteRows.map((row, idx) => {
            const cx = PAD_L + slotW * (idx + 0.5);
            const bx = cx - barW / 2;
            const by = yToPx(row.f);
            const bh = yToPx(0) - by;
            const isModal = idx === stats.modalIdx;
            return (
              <g key={row.label}>
                <rect
                  x={bx}
                  y={by}
                  width={barW}
                  height={bh}
                  rx={3}
                  className={
                    isModal
                      ? 'fill-sky-100 dark:fill-sky-900/50 stroke-sky-600 dark:stroke-sky-400'
                      : 'fill-slate-100 dark:fill-slate-800 stroke-slate-400 dark:stroke-slate-600'
                  }
                  strokeWidth={isModal ? 1.5 : 1}
                />
                <text x={cx} y={by - 6} textAnchor="middle" className="fill-slate-700 dark:fill-slate-200 text-[11px] font-mono font-medium">
                  {row.f}
                </text>
                <text x={cx} y={yToPx(0) + 18} textAnchor="middle" className="fill-slate-600 dark:fill-slate-400 text-[11px] font-mono">
                  {row.x}
                </text>
              </g>
            );
          })}

          {/* Mean Line */}
          {(() => {
            const minX = discreteRows[0].x;
            const maxX = discreteRows[discreteRows.length - 1].x;
            const span = maxX - minX || 1;
            const meanCx = PAD_L + slotW * 0.5 + ((stats.mean - minX) / span) * (plotW - slotW);
            return (
              <line x1={meanCx} y1={PAD_T} x2={meanCx} y2={yToPx(0)} stroke="#D97706" strokeWidth={1.75} strokeDasharray="4 3" />
            );
          })()}

          <line x1={PAD_L} y1={yToPx(0)} x2={W - PAD_R} y2={yToPx(0)} className="stroke-slate-600 dark:stroke-slate-400" strokeWidth={1.25} />
          <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={yToPx(0)} className="stroke-slate-600 dark:stroke-slate-400" strokeWidth={1.25} />

          <text x={PAD_L + plotW / 2} y={H - 6} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[11px]">
            No. of Telephone Calls (x) · Dashed Amber: Mean ({stats.mean.toFixed(2)}) · Highlighted Bar: Mode ({stats.mode})
          </text>
          <text x={16} y={PAD_T + plotH / 2} textAnchor="middle" transform={`rotate(-90 16 ${PAD_T + plotH / 2})`} className="fill-slate-500 dark:fill-slate-400 text-[11px]">
            Frequency (f)
          </text>
        </svg>
      );
    }

    // Discrete Cumulative Frequency Chart
    const yMax = Math.max(stats.N, 10);
    const yToPx = (val: number) => PAD_T + plotH - (val / yMax) * plotH;
    const polyPts = discreteRows
      .map((_, i) => `${PAD_L + slotW * (i + 0.5)},${yToPx(stats.cfs[i])}`)
      .join(' ');
    const pkRank = (percentileK / 100) * (stats.N + 1);

    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Discrete Cumulative Frequency Curve">
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const yVal = Math.round(t * yMax);
          const py = yToPx(yVal);
          return (
            <g key={t}>
              <line x1={PAD_L} y1={py} x2={W - PAD_R} y2={py} className="stroke-slate-200 dark:stroke-slate-800" strokeWidth={1} />
              <text x={PAD_L - 8} y={py + 4} textAnchor="end" className="fill-slate-500 dark:fill-slate-400 text-[11px] font-mono">
                {yVal}
              </text>
            </g>
          );
        })}

        <polyline fill="none" stroke="#0284C7" strokeWidth={2.25} points={polyPts} />
        {discreteRows.map((r, i) => {
          const cx = PAD_L + slotW * (i + 0.5);
          return (
            <g key={r.label}>
              <circle cx={cx} cy={yToPx(stats.cfs[i])} r={3.5} className="fill-white dark:fill-slate-900" stroke="#0284C7" strokeWidth={2} />
              <text x={cx} y={yToPx(0) + 18} textAnchor="middle" className="fill-slate-600 dark:fill-slate-400 text-[11px] font-mono">
                {r.x}
              </text>
            </g>
          );
        })}

        {stats.N > 0 && (
          <line x1={PAD_L} y1={yToPx(pkRank)} x2={W - PAD_R} y2={yToPx(pkRank)} stroke="#059669" strokeWidth={1.25} strokeDasharray="4 3" />
        )}

        <line x1={PAD_L} y1={yToPx(0)} x2={W - PAD_R} y2={yToPx(0)} className="stroke-slate-600 dark:stroke-slate-400" strokeWidth={1.25} />
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={yToPx(0)} className="stroke-slate-600 dark:stroke-slate-400" strokeWidth={1.25} />

        <text x={PAD_L + plotW / 2} y={H - 6} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[11px]">
          Value (x) · Dashed Green Threshold: P{percentileK} rank ({pkRank.toFixed(1)} of {stats.N}) → x = {stats.pk}
        </text>
        <text x={16} y={PAD_T + plotH / 2} textAnchor="middle" transform={`rotate(-90 16 ${PAD_T + plotH / 2})`} className="fill-slate-500 dark:fill-slate-400 text-[11px]">
          Cumulative Freq (cf)
        </text>
      </svg>
    );
  };

  return (
    <section aria-labelledby="lab-heading" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 no-print">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 id="lab-heading" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Interactive Distribution &amp; Ogive Verification Lab
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Switch between the PU 2024 Model Question and Continuous Grouped Data, adjust frequencies, and inspect live location, mode geometry, and dispersion.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg">
            <button
              type="button"
              onClick={() => handlePresetSwitch('pu-q4')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                preset === 'pu-q4'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              PU Model Q4 (Calls)
            </button>
            <button
              type="button"
              onClick={() => handlePresetSwitch('extra-q1')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                preset === 'extra-q1'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Extra Q1 (Feeder kWh)
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

      {/* Two-Zone Sandbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-stretch">
        {/* Left Zone: Visual Canvas (60-65%) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg">
              <button
                type="button"
                onClick={() => setChartView('histogram')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  chartView === 'histogram'
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {stats.isContinuous ? 'Histogram + Mode Geometry' : 'Frequency Bars'}
              </button>
              <button
                type="button"
                onClick={() => setChartView('ogive')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  chartView === 'ogive'
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {stats.isContinuous ? 'Less-Than Ogive' : 'Cumulative Curve'}
              </button>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-400 font-mono tabular-nums">
              N = {stats.N} · ∑fx = {stats.sumFx.toFixed(0)} · ∑fx² = {stats.sumFx2.toFixed(0)}
            </div>
          </div>

          <div className="my-auto">{renderChart()}</div>

          {/* KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 mt-3 border-t border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Mean (x̄)</div>
              <div className="text-base font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                {stats.mean.toFixed(4)}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Median (M_d)</div>
              <div className="text-base font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                {stats.median.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Variance (σ²)</div>
              <div className="text-base font-semibold text-sky-700 dark:text-sky-400 font-mono tabular-nums">
                {stats.variance.toFixed(4)}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">SD (σ) · CV</div>
              <div className="text-base font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                {stats.sd.toFixed(2)} · {stats.cv.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Right Zone: Control & Frequency Deck */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-900/80">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="percentile-slider" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Percentile Explorer: P{percentileK}
              </label>
              <span className="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                {stats.pk.toFixed(2)} {stats.unit}
              </span>
            </div>
            <input
              id="percentile-slider"
              type="range"
              min={10}
              max={95}
              step={5}
              value={percentileK}
              onChange={(e) => setPercentileK(Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-1 tabular-nums">
              <span>P10</span>
              <span>Q₁ (P25): {stats.q1.toFixed(2)}</span>
              <span>Q₃ (P75): {stats.q3.toFixed(2)}</span>
              <span>P95</span>
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900/80">
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {stats.isContinuous ? 'Class Interval (kWh)' : 'Calls / Minute (x)'}
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Editable Freq (f) · cf</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto">
              {(stats.isContinuous ? continuousRows : discreteRows).map((row, idx) => (
                <div key={row.label} className="px-4 py-1.5 flex items-center justify-between text-sm">
                  <span className="font-mono text-slate-700 dark:text-slate-300 tabular-nums">{row.label}</span>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={0}
                      max={999}
                      aria-label={`Frequency for ${row.label}`}
                      value={row.f}
                      onChange={(e) => updateFreq(idx, e.target.value)}
                      className="w-16 px-2 py-1 text-right font-mono text-xs bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 tabular-nums"
                    />
                    <span className="w-10 text-right font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      {stats.cfs[idx]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2.5">
            Mode (M_o) = <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">{stats.mode.toFixed(2)} {stats.unit}</span> ·
            IQR (Q₃ − Q₁) = <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">{(stats.q3 - stats.q1).toFixed(2)} {stats.unit}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
