import React, { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';

interface DataPair {
  id: string;
  label: string;
  x: number;
  y: number;
}

type Ch2Preset = 'pu-q2' | 'extra-q2';
type ScatterView = 'yonx' | 'both';

const PRESET_PU_Q2: DataPair[] = [
  { id: '2001', label: '2001', x: 12, y: 5.1 },
  { id: '2002', label: '2002', x: 14, y: 5.5 },
  { id: '2003', label: '2003', x: 17, y: 5.8 },
  { id: '2004', label: '2004', x: 22, y: 7.0 },
  { id: '2005', label: '2005', x: 35, y: 7.5 },
  { id: '2006', label: '2006', x: 42, y: 8.2 },
  { id: '2007', label: '2007', x: 50, y: 9.5 },
];

const PRESET_EXTRA_Q2: DataPair[] = [
  { id: 'r1', label: 'Run 1', x: 20, y: 1.2 },
  { id: 'r2', label: 'Run 2', x: 22, y: 1.5 },
  { id: 'r3', label: 'Run 3', x: 25, y: 1.8 },
  { id: 'r4', label: 'Run 4', x: 28, y: 2.3 },
  { id: 'r5', label: 'Run 5', x: 30, y: 2.5 },
  { id: 'r6', label: 'Run 6', x: 32, y: 2.9 },
  { id: 'r7', label: 'Run 7', x: 35, y: 3.1 },
  { id: 'r8', label: 'Run 8', x: 38, y: 3.5 },
];

export const RegressionLab: React.FC = () => {
  const [preset, setPreset] = useState<Ch2Preset>('pu-q2');
  const [view, setView] = useState<ScatterView>('yonx');
  const [rows, setRows] = useState<DataPair[]>(PRESET_PU_Q2);
  const [predictX, setPredictX] = useState<number>(65);

  const handlePresetSwitch = (next: Ch2Preset) => {
    setPreset(next);
    if (next === 'pu-q2') {
      setRows(PRESET_PU_Q2.map((r) => ({ ...r })));
      setPredictX(65);
    } else {
      setRows(PRESET_EXTRA_Q2.map((r) => ({ ...r })));
      setPredictX(34);
    }
  };

  const handleReset = () => {
    handlePresetSwitch(preset);
  };

  const updatePoint = (idx: number, field: 'x' | 'y', raw: string) => {
    const val = Number.parseFloat(raw);
    const safe = Number.isFinite(val) ? val : 0;
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: safe } : r)));
  };

  const calc = useMemo(() => {
    const n = rows.length;
    const sumX = rows.reduce((s, r) => s + r.x, 0);
    const sumY = rows.reduce((s, r) => s + r.y, 0);
    const sumX2 = rows.reduce((s, r) => s + r.x * r.x, 0);
    const sumY2 = rows.reduce((s, r) => s + r.y * r.y, 0);
    const sumXY = rows.reduce((s, r) => s + r.x * r.y, 0);

    const meanX = n > 0 ? sumX / n : 0;
    const meanY = n > 0 ? sumY / n : 0;

    const Sxx = n * sumX2 - sumX * sumX;
    const Syy = n * sumY2 - sumY * sumY;
    const Sxy = n * sumXY - sumX * sumY;

    const b_yx = Sxx !== 0 ? Sxy / Sxx : 0;
    const b_xy = Syy !== 0 ? Sxy / Syy : 0;
    const a = meanY - b_yx * meanX;
    const c = meanX - b_xy * meanY;

    const denomR = Math.sqrt(Math.max(0, Sxx * Syy));
    const r = denomR > 0 ? Math.max(-1, Math.min(1, Sxy / denomR)) : 0;
    const r2 = r * r;

    const sx = n > 0 ? Math.sqrt(Math.max(0, Sxx / (n * n))) : 0;
    const sy = n > 0 ? Math.sqrt(Math.max(0, Syy / (n * n))) : 0;

    let angleDeg = 90;
    if (Math.abs(r) >= 0.999999) {
      angleDeg = 0;
    } else if (Math.abs(r) > 1e-6 && sx * sx + sy * sy > 0) {
      const tanTheta = ((1 - r2) / Math.abs(r)) * ((sx * sy) / (sx * sx + sy * sy));
      angleDeg = (Math.atan(tanTheta) * 180) / Math.PI;
    }

    const sse = rows.reduce((s, pt) => {
      const yHat = a + b_yx * pt.x;
      return s + (pt.y - yHat) * (pt.y - yHat);
    }, 0);

    const predictedY = a + b_yx * predictX;

    return {
      n,
      sumX,
      sumY,
      sumX2,
      sumY2,
      sumXY,
      meanX,
      meanY,
      b_yx,
      b_xy,
      a,
      c,
      r,
      r2,
      angleDeg,
      sse,
      predictedY,
    };
  }, [rows, predictX]);

  const xUnit = preset === 'pu-q2' ? "'000 Rs" : '°C';
  const yUnit = preset === 'pu-q2' ? 'lakh Rs.' : 'mV';
  const sliderMin = preset === 'pu-q2' ? 10 : 18;
  const sliderMax = preset === 'pu-q2' ? 70 : 42;

  // SVG Scatter Plot Geometry
  const W = 680;
  const H = 330;
  const PAD_L = 56;
  const PAD_R = 26;
  const PAD_T = 24;
  const PAD_B = 44;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  const xs = [...rows.map((r) => r.x), predictX];
  const ys = [...rows.map((r) => r.y), calc.predictedY];
  const rawMinX = Math.min(...xs);
  const rawMaxX = Math.max(...xs);
  const rawMinY = Math.min(...ys);
  const rawMaxY = Math.max(...ys);

  const spanX = rawMaxX - rawMinX || 10;
  const spanY = rawMaxY - rawMinY || 5;
  const minX = Math.floor(rawMinX - spanX * 0.08);
  const maxX = Math.ceil(rawMaxX + spanX * 0.08);
  const minY = Math.max(0, Math.floor((rawMinY - spanY * 0.12) * 10) / 10);
  const maxY = Math.ceil((rawMaxY + spanY * 0.12) * 10) / 10;

  const xToPx = (val: number) => PAD_L + ((val - minX) / (maxX - minX || 1)) * plotW;
  const yToPx = (val: number) => PAD_T + plotH - ((val - minY) / (maxY - minY || 1)) * plotH;

  // Line Y on X endpoints clipped visually to [minX, maxX]
  const yLineStart = calc.a + calc.b_yx * minX;
  const yLineEnd = calc.a + calc.b_yx * maxX;

  // Line X on Y endpoints computed from y in [minY, maxY]
  const xOnYStart = calc.c + calc.b_xy * minY;
  const xOnYEnd = calc.c + calc.b_xy * maxY;

  return (
    <section aria-labelledby="reg-lab-heading" className="bg-white border border-slate-200 rounded-xl p-6 no-print">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h2 id="reg-lab-heading" className="text-lg font-semibold text-slate-900">
            Interactive Correlation &amp; Least-Squares Regression Lab
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Inspect PU Model Q2 (Advertising vs. Sales) or Thermal Drift data, edit pairs live, and visualize OLS residuals, prediction, and the angle θ between both regression lines.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => handlePresetSwitch('pu-q2')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                preset === 'pu-q2' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              PU Model Q2 (Ad vs. Sales)
            </button>
            <button
              type="button"
              onClick={() => handlePresetSwitch('extra-q2')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                preset === 'extra-q2' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Extra Q2 (Temp vs. Drift)
            </button>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-stretch">
        {/* Left Zone: Scatter & Regression Canvas */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50/70 border border-slate-200 rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
              <button
                type="button"
                onClick={() => setView('yonx')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  view === 'yonx' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Y on X + Residuals
              </button>
              <button
                type="button"
                onClick={() => setView('both')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  view === 'both' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Both Lines &amp; Angle θ
              </button>
            </div>

            <div className="text-xs text-slate-600 font-mono tabular-nums">
              n = {calc.n} · ∑X = {calc.sumX.toFixed(1)} · ∑Y = {calc.sumY.toFixed(1)} · ∑XY = {calc.sumXY.toFixed(1)}
            </div>
          </div>

          <div className="my-auto">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Scatter Diagram and Regression Lines">
              <defs>
                <clipPath id="reg-plot-clip">
                  <rect x={PAD_L} y={PAD_T} width={plotW} height={plotH} />
                </clipPath>
              </defs>

              {/* Gridlines */}
              {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                const yVal = minY + t * (maxY - minY);
                const py = yToPx(yVal);
                return (
                  <g key={`y-${t}`}>
                    <line x1={PAD_L} y1={py} x2={W - PAD_R} y2={py} stroke="#E2E8F0" strokeWidth={1} />
                    <text x={PAD_L - 8} y={py + 4} textAnchor="end" className="fill-slate-500 text-[11px] font-mono">
                      {yVal.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                const xVal = minX + t * (maxX - minX);
                const px = xToPx(xVal);
                return (
                  <g key={`x-${t}`}>
                    <line x1={px} y1={PAD_T} x2={px} y2={PAD_T + plotH} stroke="#F1F5F9" strokeWidth={1} />
                    <text x={px} y={PAD_T + plotH + 18} textAnchor="middle" className="fill-slate-600 text-[11px] font-mono">
                      {Math.round(xVal)}
                    </text>
                  </g>
                );
              })}

              <g clipPath="url(#reg-plot-clip)">
                {/* Residual Vertical Segments */}
                {view === 'yonx' &&
                  rows.map((pt) => {
                    const yHat = calc.a + calc.b_yx * pt.x;
                    return (
                      <line
                        key={`res-${pt.id}`}
                        x1={xToPx(pt.x)}
                        y1={yToPx(pt.y)}
                        x2={xToPx(pt.x)}
                        y2={yToPx(yHat)}
                        stroke="#D97706"
                        strokeWidth={1.25}
                        strokeDasharray="3 2"
                      />
                    );
                  })}

                {/* Line X on Y (when both lines active) */}
                {view === 'both' && (
                  <line
                    x1={xToPx(xOnYStart)}
                    y1={yToPx(minY)}
                    x2={xToPx(xOnYEnd)}
                    y2={yToPx(maxY)}
                    stroke="#059669"
                    strokeWidth={2}
                    strokeDasharray="6 3"
                  />
                )}

                {/* Line Y on X */}
                <line
                  x1={xToPx(minX)}
                  y1={yToPx(yLineStart)}
                  x2={xToPx(maxX)}
                  y2={yToPx(yLineEnd)}
                  stroke="#0284C7"
                  strokeWidth={2.25}
                />

                {/* Prediction Marker */}
                {view === 'yonx' && (
                  <g>
                    <line
                      x1={xToPx(predictX)}
                      y1={yToPx(minY)}
                      x2={xToPx(predictX)}
                      y2={yToPx(calc.predictedY)}
                      stroke="#059669"
                      strokeWidth={1.25}
                      strokeDasharray="4 3"
                    />
                    <line
                      x1={PAD_L}
                      y1={yToPx(calc.predictedY)}
                      x2={xToPx(predictX)}
                      y2={yToPx(calc.predictedY)}
                      stroke="#059669"
                      strokeWidth={1.25}
                      strokeDasharray="4 3"
                    />
                    <circle cx={xToPx(predictX)} cy={yToPx(calc.predictedY)} r={5} fill="#059669" />
                  </g>
                )}

                {/* Observed Scatter Points */}
                {rows.map((pt) => (
                  <circle
                    key={pt.id}
                    cx={xToPx(pt.x)}
                    cy={yToPx(pt.y)}
                    r={4}
                    fill="#FFFFFF"
                    stroke="#0F172A"
                    strokeWidth={2}
                  />
                ))}

                {/* Centroid (X̄, Ȳ) */}
                <circle cx={xToPx(calc.meanX)} cy={yToPx(calc.meanY)} r={5.5} fill="#0284C7" stroke="#FFFFFF" strokeWidth={1.5} />
              </g>

              {/* Axes */}
              <line x1={PAD_L} y1={PAD_T + plotH} x2={W - PAD_R} y2={PAD_T + plotH} stroke="#475569" strokeWidth={1.25} />
              <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + plotH} stroke="#475569" strokeWidth={1.25} />

              <text x={PAD_L + plotW / 2} y={H - 6} textAnchor="middle" className="fill-slate-500 text-[11px]">
                {view === 'yonx'
                  ? `Predictor X (${xUnit}) · Blue: Y on X · Amber: Residuals · Green: Ŷ(${predictX}) = ${calc.predictedY.toFixed(2)}`
                  : `Predictor X (${xUnit}) · Blue: Y on X · Dashed Green: X on Y · Centroid (${calc.meanX.toFixed(2)}, ${calc.meanY.toFixed(2)}) · θ = ${calc.angleDeg.toFixed(2)}°`}
              </text>
              <text x={16} y={PAD_T + plotH / 2} textAnchor="middle" transform={`rotate(-90 16 ${PAD_T + plotH / 2})`} className="fill-slate-500 text-[11px]">
                Response Y ({yUnit})
              </text>
            </svg>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 mt-3 border-t border-slate-200">
            <div>
              <div className="text-xs text-slate-500">Correlation (r)</div>
              <div className="text-base font-semibold text-slate-900 font-mono tabular-nums">
                {calc.r >= 0 ? '+' : ''}{calc.r.toFixed(4)}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Determination (R²)</div>
              <div className="text-base font-semibold text-sky-700 font-mono tabular-nums">
                {(calc.r2 * 100).toFixed(2)}%
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Slopes (b_yx · b_xy)</div>
              <div className="text-base font-semibold text-slate-900 font-mono tabular-nums">
                {calc.b_yx.toFixed(3)} · {calc.b_xy.toFixed(3)}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Acute Angle (θ)</div>
              <div className="text-base font-semibold text-slate-900 font-mono tabular-nums">
                {calc.angleDeg.toFixed(2)}°
              </div>
            </div>
          </div>
        </div>

        {/* Right Zone: Controls & Paired Table */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="border border-slate-200 rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="predict-x-slider" className="text-xs font-semibold text-slate-700">
                Forecast Input X: {predictX} {xUnit}
              </label>
              <span className="text-xs font-mono font-semibold text-emerald-700 tabular-nums">
                Ŷ = {calc.predictedY.toFixed(4)} {yUnit}
              </span>
            </div>
            <input
              id="predict-x-slider"
              type="range"
              min={sliderMin}
              max={sliderMax}
              step={1}
              value={predictX}
              onChange={(e) => setPredictX(Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
            <div className="text-[11px] font-mono text-slate-500 mt-1.5 tabular-nums">
              Fitted Line: Ŷ = {calc.a.toFixed(4)} {calc.b_yx >= 0 ? '+' : '−'} {Math.abs(calc.b_yx).toFixed(4)}·X
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Observation</span>
              <span className="text-xs font-semibold text-slate-700">
                Editable X ({xUnit}) · Y ({yUnit})
              </span>
            </div>
            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
              {rows.map((row, idx) => (
                <div key={row.id} className="px-4 py-1.5 flex items-center justify-between text-sm">
                  <span className="font-mono text-xs text-slate-600">{row.label}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="1"
                      aria-label={`X value for ${row.label}`}
                      value={row.x}
                      onChange={(e) => updatePoint(idx, 'x', e.target.value)}
                      className="w-16 px-2 py-1 text-right font-mono text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 tabular-nums"
                    />
                    <input
                      type="number"
                      step="0.1"
                      aria-label={`Y value for ${row.label}`}
                      value={row.y}
                      onChange={(e) => updatePoint(idx, 'y', e.target.value)}
                      className="w-16 px-2 py-1 text-right font-mono text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 tabular-nums"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 font-mono tabular-nums">
            SSE = {calc.sse.toFixed(4)} · Line X on Y: X̂ = {calc.c.toFixed(4)} {calc.b_xy >= 0 ? '+' : '−'} {Math.abs(calc.b_xy).toFixed(4)}·Y
          </div>
        </div>
      </div>
    </section>
  );
};
