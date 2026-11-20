export type DepthCode = 'SD' | 'D' | 'DR' | 'I' | 'E' | 'A' | 'N';

export interface DerivationStep {
  step: number;
  title: string;
  equation: string;
  note: string;
}

export interface SubtopicNote {
  id: string;
  code: string;
  title: string;
  depths: DepthCode[];
  definitionSD: string;
  descriptionD: string;
  explanationE: string;
  illustrationI: string;
  applicationA: string;
  derivationDR?: {
    title: string;
    goal: string;
    steps: DerivationStep[];
    result: string;
  };
  keyTakeawayN: string;
}

export interface FormulaItem {
  id: string;
  category: 'Location' | 'Dispersion' | 'Properties & Constants';
  quantity: string;
  symbol: string;
  formula: string;
  assumptionOrConstant: string;
  unit: string;
}

export interface SolvedProblem {
  id: string;
  tag: string;
  title: string;
  marks: string;
  source: string;
  statement: string;
  given: string[];
  tableHeaders?: string[];
  tableRows?: string[][];
  tableTotals?: string[];
  steps: {
    heading: string;
    work: string[];
  }[];
  finalAnswer: string[];
}

export interface ExamTrap {
  id: string;
  category: 'Sign Convention' | 'Boundary & Slope Geometry' | 'High-Yield PU Topic';
  title: string;
  wrongApproach: string;
  correctRule: string;
  examTip: string;
}

export const DEPTH_LABELS: Record<DepthCode, string> = {
  SD: 'Define',
  D: 'Description',
  DR: 'Derivation',
  I: 'Illustration',
  E: 'Explanation',
  A: 'Application',
  N: 'Numerical',
};

export const SYLLABUS_CONTEXT = {
  university: 'Purbanchal University — Faculty of Engineering, Biratnagar, Nepal',
  program: 'B.E. Biomedical / Electrical / Electronics, Com. & Automation Engineering',
  semester: 'Year III · Semester V (Effective from 2021 / 2078 Batch)',
  subject: 'Probability and Statistics',
  chapter: 'Unit 1: Descriptive Statistics',
  lectureHours: 6,
  finalMarks: 10,
  totalSubjectMarks: '60 Final Theory + 20 Internal Theory + 20 Practical = 100',
  syllabusTopics: [
    'Measures of location: mean, combined mean, median, mode, partition values (quartiles and percentiles) and their properties',
    'Measures of dispersion: absolute and relative measure of variation; standard deviation, variance and Coefficient of variation',
  ],
  microSyllabusNote:
    'In the attached PU 5th Semester syllabus PDF, explicit SD/D/DR/I/E/A/EX/N checkmark grids appear for Advanced Instrumentation, Control System Engineering, Electric Machine Design, Power System Analysis II, and Synchronous & Special Machines. For Probability & Statistics (pp. 2–9), the PDF provides the Detailed Course Contents, Mark Scheme (10 marks for Chapter I), and 2024 Model Question Paper. To guarantee complete exam mastery, every Unit 1 subtopic below is covered across all applicable depths: SD, D, DR, I, E, A, and N.',
};

export const SUBTOPIC_NOTES: SubtopicNote[] = [
  {
    id: 'subtopic-1-1',
    code: '1.1',
    title: 'Data Classification, Frequency Distributions & Arithmetic Mean',
    depths: ['SD', 'D', 'DR', 'I', 'E', 'A', 'N'],
    definitionSD:
      'Arithmetic Mean (x̄) is the sum of all observations divided by the total number of observations (N). For grouped or discrete data, each value or class midpoint xᵢ is weighted by its frequency fᵢ.',
    descriptionD:
      'Raw engineering measurements are organized into Primary Data (collected firsthand from sensors, lab benches, or surveys) or Secondary Data (extracted from published handbooks, utility logs, or census reports). When summarized into Discrete Frequency Tables (exact integer counts) or Continuous Class Intervals (exclusive: 10–20, 20–30; or inclusive: 10–19, 20–29), the Arithmetic Mean serves as the rigid, algebraically defined center of gravity of the distribution.',
    explanationE:
      'Because every observation contributes proportionally to the numerator ∑fᵢxᵢ, the mean is sensitive to extreme outliers. To avoid large squaring or multiplication errors in 5-mark/10-mark PU problems, the Step-Deviation (Coding) method shifts the origin to an assumed mean A (usually the middle class midpoint) and scales by common class width h via uᵢ = (xᵢ − A)/h.',
    illustrationI:
      'Think of a uniform beam carrying weights fᵢ placed at distances xᵢ along a ruler: the Arithmetic Mean x̄ is the exact fulcrum point where clockwise and counter-clockwise torques balance to zero, i.e. ∑fᵢ(xᵢ − x̄) = 0.',
    applicationA:
      'Used in electrical load forecasting (average kWh per feeder), quality control of resistor/capacitor manufacturing tolerances, and baseline calibration of instrumentation readouts.',
    derivationDR: {
      title: 'Derivations (DR): Zero-Sum Deviation, Least-Squares Property & Step-Deviation Mean',
      goal: 'Prove: (i) ∑fᵢ(xᵢ − x̄) = 0, (ii) ∑fᵢ(xᵢ − A)² is minimum iff A = x̄, and (iii) x̄ = A + h·(∑fᵢuᵢ / N).',
      steps: [
        {
          step: 1,
          title: 'Zero-Sum of Deviations from Mean',
          equation: '∑fᵢ(xᵢ − x̄) = ∑fᵢxᵢ − x̄∑fᵢ = N·x̄ − x̄·N = 0',
          note: 'Since x̄ = (∑fᵢxᵢ)/N implies ∑fᵢxᵢ = N·x̄ and ∑fᵢ = N.',
        },
        {
          step: 2,
          title: 'Minimum Sum of Squared Deviations',
          equation: 'Let S(A) = ∑fᵢ(xᵢ − A)². Differentiate w.r.t. A: dS/dA = −2∑fᵢ(xᵢ − A) = 0',
          note: 'Solving gives ∑fᵢxᵢ − A∑fᵢ = 0 ⇒ A = (∑fᵢxᵢ)/N = x̄.',
        },
        {
          step: 3,
          title: 'Second Derivative Test for Minimum',
          equation: 'd²S/dA² = 2∑fᵢ = 2N > 0',
          note: 'Positive second derivative confirms S(A) attains its strict global minimum at A = x̄.',
        },
        {
          step: 4,
          title: 'Change of Origin & Scale (Step-Deviation Formula)',
          equation: 'Let uᵢ = (xᵢ − A) / h  ⇒  xᵢ = A + h·uᵢ',
          note: 'Substitute xᵢ into the definition of x̄.',
        },
        {
          step: 5,
          title: 'Simplify Linear Expectation',
          equation: 'x̄ = (1/N)∑fᵢ(A + h·uᵢ) = (A/N)∑fᵢ + (h/N)∑fᵢuᵢ = A + h·ū',
          note: 'Mean depends on both origin shift (A) and scale factor (h).',
        },
      ],
      result: 'x̄ = A + h · (∑fᵢuᵢ / N), and ∑fᵢ(xᵢ − x̄)² ≤ ∑fᵢ(xᵢ − A)² ∀ A ∈ ℝ.',
    },
    keyTakeawayN:
      'Always verify N = ∑fᵢ first, and check that ∑fᵢ(xᵢ − x̄) equals 0 (within rounding) before moving to variance.',
  },
  {
    id: 'subtopic-1-2',
    code: '1.2',
    title: 'Combined Mean & Weighted Aggregation',
    depths: ['SD', 'D', 'DR', 'I', 'E', 'A', 'N'],
    definitionSD:
      'Combined Mean (x̄₁₂ or x̄_c) is the arithmetic mean of a pooled dataset formed by merging k independent groups whose individual sample sizes (nᵢ) and means (x̄ᵢ) are known.',
    descriptionD:
      'When two or more production shifts, testing labs, or substations report separate group sizes and averages, the pooled average cannot be obtained by simply averaging the group means unless all group sizes are equal. Instead, each group mean must be weighted by its corresponding group size.',
    explanationE:
      'Because x̄ᵢ = (∑x_group_i) / nᵢ, multiplying x̄ᵢ by nᵢ reconstructs the exact total sum of observations in group i. Summing those reconstructed totals across all k groups and dividing by the total count N = ∑nᵢ yields the exact pooled mean without needing raw individual observations.',
    illustrationI:
      'If Shift A (60 motors) averages 92% efficiency and Shift B (40 motors) averages 88% efficiency, the pooled average is pulled closer to 92% (90.4%) than to the unweighted midpoint (90.0%).',
    applicationA:
      'Aggregating regional substation voltage readings, combining multi-batch component test results, and computing overall reliability metrics across parallel manufacturing lines.',
    derivationDR: {
      title: 'Derivation (DR): Combined Mean of k Groups',
      goal: 'Express the pooled mean x̄_c in terms of group sizes n₁, n₂, …, n_k and group means x̄₁, x̄₂, …, x̄_k.',
      steps: [
        {
          step: 1,
          title: 'Reconstruct Sum of Observations for Each Group',
          equation: '∑x₁j = n₁·x̄₁,   ∑x₂j = n₂·x̄₂,   …,   ∑x_kj = n_k·x̄_k',
          note: 'By direct rearrangement of the arithmetic mean definition for each group.',
        },
        {
          step: 2,
          title: 'Total Sum and Total Size of Pooled Dataset',
          equation: '∑x_total = ∑(nᵢ·x̄ᵢ)   and   N = n₁ + n₂ + … + n_k = ∑nᵢ',
          note: 'Summing all observations across mutually exclusive groups.',
        },
        {
          step: 3,
          title: 'Divide Total Sum by Pooled Size',
          equation: 'x̄_c = (n₁x̄₁ + n₂x̄₂ + … + n_kx̄_k) / (n₁ + n₂ + … + n_k)',
          note: 'For two groups: x̄₁₂ = (n₁x̄₁ + n₂x̄₂) / (n₁ + n₂).',
        },
      ],
      result: 'x̄_c = (∑nᵢx̄ᵢ) / (∑nᵢ). Furthermore, ∑nᵢ(x̄ᵢ − x̄_c) = 0 always holds.',
    },
    keyTakeawayN:
      'Never compute (x̄₁ + x̄₂)/2 when n₁ ≠ n₂; always weight by nᵢ.',
  },
  {
    id: 'subtopic-1-3',
    code: '1.3',
    title: 'Median & Partition Values (Quartiles, Deciles, Percentiles)',
    depths: ['SD', 'D', 'DR', 'I', 'E', 'A', 'N'],
    definitionSD:
      'Median (M_d) is the positional middle value that divides an ordered dataset into two equal halves (50% below, 50% above). Partition values generalize this division: Quartiles (Q₁, Q₂, Q₃) divide into 4 equal parts, Deciles (D₁…D₉) into 10 parts, and Percentiles (P₁…P₉₉) into 100 parts.',
    descriptionD:
      'Unlike the arithmetic mean, the median and partition values depend strictly on the rank/order of observations rather than their magnitudes. Thus, they remain unaffected by open-ended class intervals (e.g., "<10" or ">500") and extreme outliers. Note that Q₂ = D₅ = P₅₀ = M_d.',
    explanationE:
      'For ungrouped/discrete data (n items sorted ascending), median is the ((n+1)/2)-th item, and Q_k is at k(n+1)/4. For continuous grouped frequency tables, we construct the Less-Than Cumulative Frequency (cf) column, locate the target class where cf ≥ target rank (e.g., N/2 for M_d, kN/4 for Q_k, kN/100 for P_k), and linearly interpolate across the class width h.',
    illustrationI:
      'On a Less-Than Ogive (cumulative frequency vs. upper class boundary), drawing a horizontal line at height p·N until it hits the ogive polygon and dropping vertically to the x-axis locates the exact p-th quantile.',
    applicationA:
      'Analyzing skewed income/load distributions, setting SLA latency percentiles (P₉₅, P₉₉ response times), and computing Interquartile Range (IQR = Q₃ − Q₁) for fault-tolerant outlier detection.',
    derivationDR: {
      title: 'Derivation (DR): Continuous Grouped Median & General Percentile Formula',
      goal: 'Derive M_d = L + [(N/2 − cf) / f] × h and P_k = L + [(kN/100 − cf) / f] × h via similar triangles on the ogive.',
      steps: [
        {
          step: 1,
          title: 'Identify the Target Class Interval [L, U]',
          equation: 'Find first class with cumulative frequency ≥ m, where m = kN / 100 (for M_d, m = N/2)',
          note: 'L = true lower boundary, U = true upper boundary, h = U − L, f = class frequency, cf = cumulative frequency strictly BEFORE this class.',
        },
        {
          step: 2,
          title: 'Assume Uniform Density Within the Target Class',
          equation: 'Segment endpoints on ogive: (L, cf)  to  (L + h, cf + f)',
          note: 'Across width h, cumulative frequency rises linearly by f.',
        },
        {
          step: 3,
          title: 'Equate Slopes (Similar Right Triangles)',
          equation: '(P_k − L) / h  =  (m − cf) / f',
          note: 'Fraction of class width needed equals fraction of class frequency remaining.',
        },
        {
          step: 4,
          title: 'Solve for P_k (and M_d, Q₁, Q₃)',
          equation: 'P_k = L + [ (kN/100 − cf) / f ] × h',
          note: 'Substitute k = 50 for Median (M_d), k = 25 for Q₁, k = 75 for Q₃, and 10k for D_k.',
        },
      ],
      result: 'M_d = L + [(N/2 − cf)/f]×h;   Q₁ = L + [(N/4 − cf)/f]×h;   Q₃ = L + [(3N/4 − cf)/f]×h.',
    },
    keyTakeawayN:
      'Always convert inclusive classes (e.g., 10–19, 20–29) to true continuous boundaries (9.5–19.5, 19.5–29.5) before using L and h.',
  },
  {
    id: 'subtopic-1-4',
    code: '1.4',
    title: 'Mode & Empirical Mean–Median–Mode Relationship',
    depths: ['SD', 'D', 'DR', 'I', 'E', 'A', 'N'],
    definitionSD:
      'Mode (M_o) is the value that occurs with the maximum frequency (highest probability density) in a dataset.',
    descriptionD:
      'For discrete data, Mode is simply the value xᵢ with largest frequency fᵢ. For continuous grouped data of equal class width h, the Modal Class is the interval with maximum frequency f₁, flanked by preceding frequency f₀ and succeeding frequency f₂. A distribution may be unimodal, bimodal, or ill-defined when frequencies tie.',
    explanationE:
      'In a histogram, the modal bar is tallest. Drawing two diagonal lines from the top corners of the modal bar to the opposite top corners of its neighboring bars creates an intersection whose x-coordinate shifts away from the center toward whichever neighbor has the larger frequency. When data is moderately skewed or bimodal (making the modal formula unstable or yielding a denominator ≤ 0), Karl Pearson’s empirical relation M_o ≈ 3M_d − 2x̄ is used.',
    illustrationI:
      'In an electrical spare-parts inventory, Mean gives average cost, Median gives the middle-priced part, while Mode identifies the single component rating ordered most frequently.',
    applicationA:
      'Demand sizing for standard transformer ratings, packet-size profiling in network traffic, and identifying peak noise bins in ADC histograms.',
    derivationDR: {
      title: 'Derivation (DR): Grouped Mode Formula via Histogram Geometry',
      goal: 'Prove M_o = L + [(f₁ − f₀) / (2f₁ − f₀ − f₂)] × h.',
      steps: [
        {
          step: 1,
          title: 'Define Difference Heights on Histogram',
          equation: 'Δ₁ = f₁ − f₀   (left excess),     Δ₂ = f₁ − f₂   (right excess)',
          note: 'Modal bar runs from x = L to x = L + h with height f₁.',
        },
        {
          step: 2,
          title: 'Construct Crossed Diagonals Inside Modal Bar',
          equation: 'Line 1: (L, f₀) to (L + h, f₁)   and   Line 2: (L, f₁) to (L + h, f₂)',
          note: 'Intersection point (M_o, y*) forms two vertically opposite similar triangles of heights Δ₁ (left) and Δ₂ (right) along the top edge.',
        },
        {
          step: 3,
          title: 'Apply Similar Triangles Horizontal Proportion',
          equation: '(M_o − L) / (L + h − M_o)  =  Δ₁ / Δ₂',
          note: 'Equivalently, M_o − L is to the total width h as Δ₁ is to (Δ₁ + Δ₂).',
        },
        {
          step: 4,
          title: 'Solve for M_o',
          equation: 'M_o = L + [ Δ₁ / (Δ₁ + Δ₂) ] × h = L + [ (f₁ − f₀) / (2f₁ − f₀ − f₂) ] × h',
          note: 'Since Δ₁ + Δ₂ = (f₁ − f₀) + (f₁ − f₂) = 2f₁ − f₀ − f₂.',
        },
      ],
      result: 'M_o = L + [(f₁ − f₀)/(2f₁ − f₀ − f₂)] × h;   Empirical (skewed): M_o ≈ 3M_d − 2x̄.',
    },
    keyTakeawayN:
      'If f₁ occurs in the first class (f₀ = 0) or if 2f₁ − f₀ − f₂ ≤ 0, verify whether unequal widths exist or use M_o = 3M_d − 2x̄.',
  },
  {
    id: 'subtopic-1-5',
    code: '1.5',
    title: 'Measures of Dispersion: Absolute vs. Relative, Variance & Standard Deviation',
    depths: ['SD', 'D', 'DR', 'I', 'E', 'A', 'N'],
    definitionSD:
      'Dispersion measures the scatter or spread of observations around a central value. Variance (σ²) is the mean of squared deviations from the arithmetic mean, and Standard Deviation (σ) is its positive square root.',
    descriptionD:
      'Two datasets can have identical means yet completely different reliability or spread. Absolute Measures of Dispersion (Range, Quartile Deviation, Mean Deviation, Variance, Standard Deviation) retain the original units (or squared units for variance) and measure internal spread. Relative Measures (Coefficient of Range, Coefficient of QD, Coefficient of Variation) are dimensionless ratios/percentages used to compare variability across datasets with different units or widely different means.',
    explanationE:
      'Squaring deviations (xᵢ − x̄)² solves the zero-sum cancellation problem (∑fᵢ(xᵢ − x̄) = 0) while keeping the function smooth and differentiable for algebra and inference. Crucially, Variance and SD are invariant under any shift of origin (adding/subtracting a constant c changes x̄ to x̄ + c, leaving xᵢ − x̄ unchanged), and scale linearly in magnitude under multiplication by h (σ_y = |b|·σ_x).',
    illustrationI:
      'Two 100 Ω resistor batches both average 100 Ω. Batch A spans 99–101 Ω (σ = 0.5 Ω); Batch B spans 85–115 Ω (σ = 8.0 Ω). Same location, vastly different precision.',
    applicationA:
      'Signal-to-noise ratio characterization (RMS AC ripple is literally the standard deviation of voltage fluctuations around its DC mean), process capability (6σ tolerance), and machine precision grading.',
    derivationDR: {
      title: 'Derivations (DR): Computational Variance, Coding Formula & Origin/Scale Invariance',
      goal: 'Prove: (i) σ² = (∑fᵢxᵢ²)/N − x̄², (ii) σ = |h|·σ_u, and (iii) Combined Variance σ₁₂².',
      steps: [
        {
          step: 1,
          title: 'Expand Definition of Variance',
          equation: 'σ² = (1/N)∑fᵢ(xᵢ − x̄)² = (1/N)∑fᵢ(xᵢ² − 2xᵢx̄ + x̄²)',
          note: 'Distribute summation across the three terms.',
        },
        {
          step: 2,
          title: 'Simplify Using ∑fᵢxᵢ = N·x̄ and ∑fᵢ = N',
          equation: 'σ² = (∑fᵢxᵢ²)/N − 2x̄(∑fᵢxᵢ)/N + x̄²(∑fᵢ)/N = (∑fᵢxᵢ²)/N − 2x̄² + x̄² = (∑fᵢxᵢ²)/N − x̄²',
          note: 'Computational formula avoids fractional subtraction errors when x̄ is non-terminating.',
        },
        {
          step: 3,
          title: 'Origin & Scale Transformation (xᵢ = A + h·uᵢ)',
          equation: 'xᵢ − x̄ = (A + h·uᵢ) − (A + h·ū) = h·(uᵢ − ū)',
          note: 'The constant origin shift A cancels out identically!',
        },
        {
          step: 4,
          title: 'Substitute into Variance & Take Positive Root',
          equation: 'σ_x² = (1/N)∑fᵢh²(uᵢ − ū)² = h²·σ_u²   ⇒   σ_x = |h|·√[ (∑fᵢuᵢ²)/N − (∑fᵢuᵢ / N)² ]',
          note: 'SD is independent of origin A and scales by |h|.',
        },
        {
          step: 5,
          title: 'Combined Variance of Two Groups (Sizes n₁, n₂)',
          equation: 'Let d₁ = x̄₁ − x̄₁₂,  d₂ = x̄₂ − x̄₁₂.  For group 1: ∑(x₁j − x̄₁₂)² = ∑[(x₁j − x̄₁) + d₁]²',
          note: 'Expand square: ∑(x₁j − x̄₁)² + 2d₁∑(x₁j − x̄₁) + n₁d₁². Cross-term vanishes since ∑(x₁j − x̄₁) = 0!',
        },
        {
          step: 6,
          title: 'Pool Both Groups & Divide by (n₁ + n₂)',
          equation: 'σ₁₂² = [ n₁(σ₁² + d₁²) + n₂(σ₂² + d₂²) ] / (n₁ + n₂)',
          note: 'Generalizes immediately to k groups: σ_c² = ∑nᵢ(σᵢ² + dᵢ²) / ∑nᵢ.',
        },
      ],
      result: 'σ² = (∑fᵢxᵢ²)/N − x̄²;   σ_x = |h|·σ_u;   σ₁₂² = [n₁(σ₁² + d₁²) + n₂(σ₂² + d₂²)] / (n₁ + n₂).',
    },
    keyTakeawayN:
      'In PU Unit 1 frequency tables (like Model Q4), use N = ∑fᵢ as divisor for variance; reserve (n − 1) for sample variance estimation in Units 7–8.',
  },
  {
    id: 'subtopic-1-6',
    code: '1.6',
    title: 'Coefficient of Variation (CV) & Consistency Analysis',
    depths: ['SD', 'D', 'I', 'E', 'A', 'N'],
    definitionSD:
      'Coefficient of Variation (CV) is the ratio of Standard Deviation to the Arithmetic Mean expressed as a percentage: CV = (σ / x̄) × 100%.',
    descriptionD:
      'CV is the premier relative (unit-free) measure of dispersion proposed by Karl Pearson. Because both σ and x̄ carry the same physical unit, their ratio is pure and dimensionless, enabling direct comparison between completely different physical quantities (e.g., voltage variation in Volts vs. current variation in Amperes) or distributions with vastly different magnitudes.',
    explanationE:
      'A smaller CV indicates greater consistency, uniformity, stability, or lower relative risk. Conversely, a larger CV indicates greater relative variability. Note that CV is only meaningful for ratio-scale variables with strictly positive means (x̄ > 0), because an arbitrary zero point (like Celsius temperature) distorts the denominator.',
    illustrationI:
      'Machine A has σ = 5 mm on a 500 mm shaft (CV = 1%). Machine B has σ = 2 mm on a 20 mm bolt (CV = 10%). Even though Machine B has smaller σ, Machine A is 10× more consistent relative to its target size.',
    applicationA:
      'PU examiners frequently ask students to compare two factories, two shifts, two cricket players, or two electrical feeders and declare which one is "more consistent" or "more uniform".',
    keyTakeawayN:
      'Always conclude a CV comparison with an explicit sentence: "Since CV_A < CV_B, Group A is more consistent / less variable."',
  },
];

export const FORMULA_SHEET: FormulaItem[] = [
  {
    id: 'f-mean-raw',
    category: 'Location',
    quantity: 'Arithmetic Mean (Ungrouped)',
    symbol: 'x̄',
    formula: 'x̄ = (∑xᵢ) / n',
    assumptionOrConstant: 'All n observations equally weighted; sensitive to outliers',
    unit: 'Same as data (e.g., Ω, V, calls)',
  },
  {
    id: 'f-mean-freq',
    category: 'Location',
    quantity: 'Arithmetic Mean (Discrete / Grouped)',
    symbol: 'x̄',
    formula: 'x̄ = (∑fᵢxᵢ) / N = A + h · (∑fᵢuᵢ / N)',
    assumptionOrConstant: 'N = ∑fᵢ; xᵢ = midpoint for continuous classes; uᵢ = (xᵢ − A)/h',
    unit: 'Same as data',
  },
  {
    id: 'f-combined-mean',
    category: 'Location',
    quantity: 'Combined Mean (k groups)',
    symbol: 'x̄₁₂ / x̄_c',
    formula: 'x̄_c = (n₁x̄₁ + n₂x̄₂ + … + n_kx̄_k) / (n₁ + n₂ + … + n_k)',
    assumptionOrConstant: 'Groups must be mutually exclusive; ∑nᵢ(x̄ᵢ − x̄_c) = 0',
    unit: 'Same as data',
  },
  {
    id: 'f-median-grouped',
    category: 'Location',
    quantity: 'Median (Continuous Grouped)',
    symbol: 'M_d',
    formula: 'M_d = L + [ (N/2 − cf) / f ] × h',
    assumptionOrConstant: 'Uniform density inside median class; L = true lower limit (apply ±0.5 if inclusive)',
    unit: 'Same as data',
  },
  {
    id: 'f-quartiles',
    category: 'Location',
    quantity: 'Quartiles (Q₁, Q₃)',
    symbol: 'Q₁, Q₃',
    formula: 'Q₁ = L + [(N/4 − cf)/f]×h;   Q₃ = L + [(3N/4 − cf)/f]×h',
    assumptionOrConstant: 'Q₂ = M_d; Interquartile Range IQR = Q₃ − Q₁',
    unit: 'Same as data',
  },
  {
    id: 'f-percentiles',
    category: 'Location',
    quantity: 'k-th Percentile & Decile',
    symbol: 'P_k, D_k',
    formula: 'P_k = L + [(kN/100 − cf)/f]×h;   D_k = P₁₀ₖ',
    assumptionOrConstant: 'k ∈ {1,…,99} for percentiles, {1,…,9} for deciles; P₅₀ = D₅ = Q₂ = M_d',
    unit: 'Same as data',
  },
  {
    id: 'f-mode-grouped',
    category: 'Location',
    quantity: 'Mode (Continuous Grouped)',
    symbol: 'M_o',
    formula: 'M_o = L + [ (f₁ − f₀) / (2f₁ − f₀ − f₂) ] × h',
    assumptionOrConstant: 'Requires equal class widths h and unimodal peak; else use empirical relation',
    unit: 'Same as data',
  },
  {
    id: 'f-empirical',
    category: 'Location',
    quantity: 'Empirical Mean–Median–Mode Relation',
    symbol: 'M_o ≈',
    formula: 'M_o ≈ 3·M_d − 2·x̄',
    assumptionOrConstant: 'Karl Pearson empirical constant (3 and 2) for moderately asymmetrical distributions',
    unit: 'Same as data',
  },
  {
    id: 'f-variance',
    category: 'Dispersion',
    quantity: 'Variance (Population / Frequency Table)',
    symbol: 'σ²',
    formula: 'σ² = (1/N)∑fᵢ(xᵢ − x̄)² = (∑fᵢxᵢ²)/N − x̄²',
    assumptionOrConstant: 'Divisor N = ∑fᵢ (PU Unit 1 descriptive convention); always ≥ 0',
    unit: '(Data unit)²',
  },
  {
    id: 'f-sd-coding',
    category: 'Dispersion',
    quantity: 'Standard Deviation (Step-Deviation)',
    symbol: 'σ',
    formula: 'σ = |h| · √[ (∑fᵢuᵢ²)/N − (∑fᵢuᵢ / N)² ]',
    assumptionOrConstant: 'uᵢ = (xᵢ − A)/h; independent of assumed origin A',
    unit: 'Same as data',
  },
  {
    id: 'f-combined-var',
    category: 'Dispersion',
    quantity: 'Combined Variance & SD',
    symbol: 'σ₁₂², σ₁₂',
    formula: 'σ₁₂² = [n₁(σ₁² + d₁²) + n₂(σ₂² + d₂²)] / (n₁ + n₂)',
    assumptionOrConstant: 'd₁ = x̄₁ − x̄₁₂, d₂ = x̄₂ − x̄₁₂; accounts for both within-group & between-group spread',
    unit: 'σ₁₂²: (unit)²; σ₁₂: unit',
  },
  {
    id: 'f-cv',
    category: 'Dispersion',
    quantity: 'Coefficient of Variation',
    symbol: 'CV',
    formula: 'CV = (σ / x̄) × 100%',
    assumptionOrConstant: 'Valid for ratio-scale data with x̄ > 0; smaller CV ⇒ higher consistency',
    unit: 'Dimensionless (%)',
  },
  {
    id: 'f-qd',
    category: 'Dispersion',
    quantity: 'Quartile Deviation & Coefficient of QD',
    symbol: 'QD, C_QD',
    formula: 'QD = (Q₃ − Q₁)/2;   Coeff. of QD = (Q₃ − Q₁)/(Q₃ + Q₁)',
    assumptionOrConstant: 'Resistant to outliers and open-ended classes',
    unit: 'QD: data unit; Coeff: dimensionless',
  },
  {
    id: 'f-origin-scale',
    category: 'Properties & Constants',
    quantity: 'Linear Transformation y = a + b·x',
    symbol: 'ȳ, σ_y',
    formula: 'ȳ = a + b·x̄;   M_d(y) = a + b·M_d(x);   σ_y = |b|·σ_x;   σ_y² = b²·σ_x²',
    assumptionOrConstant: 'Location shifts + scales; SD/Variance ignore shift a and use |b| or b²',
    unit: 'Scaled by |b|',
  },
  {
    id: 'f-correction',
    category: 'Properties & Constants',
    quantity: 'Correction of Misread Value (x_w → x_c)',
    symbol: 'x̄_corr, σ_corr',
    formula: '∑x_corr = ∑x_old − x_w + x_c;   ∑x²_corr = ∑x²_old − x_w² + x_c²',
    assumptionOrConstant: 'Never add/subtract (x_c − x_w)² to ∑x²; modify individual squares separately',
    unit: 'Same as data',
  },
];

export const SOLVED_QUESTIONS: SolvedProblem[] = [
  {
    id: 'pu-model-q4',
    tag: 'PU Model Set · Group B, Q4',
    title: 'Mean & Variance of Telephone Calls Received at an Exchange',
    marks: '5 Marks',
    source: 'Attached PDF — PU V Sem Final Exam 2024 Model Question, Page 8',
    statement:
      'The following is the frequency distribution of the number of telephone calls received in 245 successive one-minute intervals at an exchange: No. of calls = [0, 1, 2, 3, 4, 5, 6, 7], Frequency = [14, 21, 25, 43, 51, 40, 39, 12]. Find mean and variance of number of calls per minute.',
    given: [
      'Data type: Discrete ungrouped frequency distribution (x = no. of calls/min, f = frequency)',
      'Total number of one-minute intervals: N = ∑f = 245',
    ],
    tableHeaders: ['No. of calls (x)', 'Frequency (f)', 'f · x', 'x²', 'f · x²'],
    tableRows: [
      ['0', '14', '0', '0', '0'],
      ['1', '21', '21', '1', '21'],
      ['2', '25', '50', '4', '100'],
      ['3', '43', '129', '9', '387'],
      ['4', '51', '204', '16', '816'],
      ['5', '40', '200', '25', '1000'],
      ['6', '39', '234', '36', '1404'],
      ['7', '12', '84', '49', '588'],
    ],
    tableTotals: ['Total', 'N = 245', '∑fx = 922', '—', '∑fx² = 4316'],
    steps: [
      {
        heading: 'Step 1: Verify Total Frequency N',
        work: ['N = 14 + 21 + 25 + 43 + 51 + 40 + 39 + 12 = 245 (Matches problem statement)'],
      },
      {
        heading: 'Step 2: Calculate Arithmetic Mean (x̄)',
        work: [
          'x̄ = (∑f·x) / N = 922 / 245 = 3.763265… ≈ 3.7633 calls/minute',
        ],
      },
      {
        heading: 'Step 3: Calculate Variance (σ²)',
        work: [
          'σ² = (∑f·x² / N) − (x̄)²',
          '∑f·x² / N = 4316 / 245 = 17.616327',
          '(x̄)² = (922 / 245)² = 850084 / 60025 = 14.162166',
          'σ² = 17.616327 − 14.162166 = 3.454161 ≈ 3.4542 (calls/min)²',
          '(Optional check: Standard Deviation σ = √3.454161 ≈ 1.8585 calls/min)',
        ],
      },
    ],
    finalAnswer: [
      'Mean (x̄) = 3.7633 calls/minute',
      'Variance (σ²) = 3.4542 (calls/minute)²',
    ],
  },
  {
    id: 'pu-model-q12a',
    tag: 'PU Model Set · Group B, Q12(a)',
    title: 'Short Note: Primary and Secondary Data',
    marks: '2.5 Marks (Part a of 5-Mark Q12)',
    source: 'Attached PDF — PU V Sem Final Exam 2024 Model Question, Page 9',
    statement: 'Write short notes on: (a) Primary and secondary data.',
    given: [
      'Question 12 splits 5 marks across (a) Primary & Secondary data (foundational data collection in Descriptive Statistics) and (b) Estimation (Unit 7). Below is the complete, high-scoring PU answer for part (a).',
    ],
    steps: [
      {
        heading: '1. Primary Data (Definition, Characteristics & Collection Methods)',
        work: [
          'Definition: Data collected firsthand by the investigator or engineer specifically for the study at hand. It is original in character and raw before processing.',
          'Engineering Collection Methods: Direct sensor/oscilloscope logging, lab experiments, field surveys, questionnaires, and direct observation.',
          'Merits: High accuracy, exact alignment with study objectives, known error bounds. Demerits: Expensive, time-consuming, requires instrumentation/manpower.',
        ],
      },
      {
        heading: '2. Secondary Data (Definition, Characteristics & Sources)',
        work: [
          'Definition: Data already collected, compiled, and published by another agency or researcher for a different purpose, now reused by the analyst.',
          'Sources: Government/NEA utility reports, IEEE/journal tables, manufacturer datasheets, census records, historical SCADA archives.',
          'Merits: Economical, rapid access, large historical span. Demerits: May contain outdated units, unknown collection bias, or mismatched definitions—must be verified for reliability and suitability before use.',
        ],
      },
    ],
    finalAnswer: [
      'Key Distinction: Primary data is raw material gathered firsthand for the current inquiry; Secondary data is already-processed material borrowed from external records.',
    ],
  },
  {
    id: 'extra-num-1',
    tag: 'Extra Exam-Level Numerical 1',
    title: 'Missing Frequencies, Mode, Quartiles, P₈₀, SD & CV for Continuous Feeder Load',
    marks: '10 Marks Pattern',
    source: 'High-Yield PU Exam Practice (Continuous Grouped Distribution)',
    statement:
      'The monthly electricity consumption (in kWh) of 100 residential feeders is distributed as: 100–150 (8), 150–200 (f₁), 200–250 (30), 250–300 (f₂), 300–350 (12). If the median consumption is 235 kWh, find the missing frequencies f₁ and f₂, and hence compute Mode (M_o), Q₁, Q₃, P₈₀, Standard Deviation (σ), and Coefficient of Variation (CV).',
    given: [
      'Total feeders N = 100, class width h = 50 kWh (exclusive continuous intervals)',
      'Given Median M_d = 235 kWh ⇒ Median class is 200–250 (L = 200, f = 30, cf = 8 + f₁)',
    ],
    tableHeaders: ['Class (kWh)', 'Midpoint (x)', 'Freq (f)', 'Less-than cf', 'u = (x−225)/50', 'f·u', 'f·u²'],
    tableRows: [
      ['100 – 150', '125', '8', '8', '-2', '-16', '32'],
      ['150 – 200', '175', 'f₁ = 21', '29', '-1', '-21', '21'],
      ['200 – 250', '225 (A)', '30', '59', '0', '0', '0'],
      ['250 – 300', '275', 'f₂ = 29', '88', '+1', '+29', '29'],
      ['300 – 350', '325', '12', '100', '+2', '+24', '48'],
    ],
    tableTotals: ['Total', '—', 'N = 100', '—', '—', '∑fu = 16', '∑fu² = 130'],
    steps: [
      {
        heading: 'Step 1: Solve Missing Frequencies f₁ and f₂',
        work: [
          'Total frequency constraint: 8 + f₁ + 30 + f₂ + 12 = 100  ⇒  f₁ + f₂ = 50',
          'Median formula: M_d = L + [(N/2 − cf) / f] × h',
          '235 = 200 + [(50 − (8 + f₁)) / 30] × 50',
          '35 = (42 − f₁) × (5/3)  ⇒  21 = 42 − f₁  ⇒  f₁ = 21',
          'Therefore, f₂ = 50 − 21 = 29',
        ],
      },
      {
        heading: 'Step 2: Mode (M_o) & Partition Values (Q₁, Q₃, P₈₀)',
        work: [
          'Modal class = 200–250 (max f₁ = 30, f₀ = 21, f₂ = 29, L = 200, h = 50):',
          'M_o = 200 + [(30 − 21) / (2×30 − 21 − 29)] × 50 = 200 + (9 / 10) × 50 = 245.00 kWh',
          'Q₁ position = N/4 = 25 ⇒ Class 150–200 (L = 150, cf = 8, f = 21): Q₁ = 150 + [(25−8)/21]×50 = 190.4762 kWh',
          'Q₃ position = 3N/4 = 75 ⇒ Class 250–300 (L = 250, cf = 59, f = 29): Q₃ = 250 + [(75−59)/29]×50 = 277.5862 kWh',
          'P₈₀ position = 80N/100 = 80 ⇒ Class 250–300 (L = 250, cf = 59, f = 29): P₈₀ = 250 + [(80−59)/29]×50 = 286.2069 kWh',
        ],
      },
      {
        heading: 'Step 3: Mean (x̄), Standard Deviation (σ) & CV via Step-Deviation',
        work: [
          'Assumed mean A = 225, h = 50: x̄ = 225 + 50 × (16 / 100) = 225 + 8 = 233.00 kWh',
          'σ² = h² × [ (∑fu²/N) − (∑fu/N)² ] = 50² × [ 130/100 − (16/100)² ] = 2500 × (1.30 − 0.0256) = 3186.00 kWh²',
          'σ = √3186 = 56.4447 kWh',
          'CV = (σ / x̄) × 100% = (56.4447 / 233) × 100% = 24.2252%',
        ],
      },
    ],
    finalAnswer: [
      'f₁ = 21, f₂ = 29',
      'M_o = 245.00 kWh · Q₁ = 190.48 kWh · Q₃ = 277.59 kWh · P₈₀ = 286.21 kWh',
      'x̄ = 233.00 kWh · σ = 56.44 kWh · CV = 24.23%',
    ],
  },
  {
    id: 'extra-num-2',
    tag: 'Extra Exam-Level Numerical 2',
    title: 'Consistency Comparison (CV), Combined Mean & Combined SD of Two Production Lines',
    marks: '5–10 Marks Pattern',
    source: 'High-Yield PU Exam Practice (Combined Dispersion & CV)',
    statement:
      'Two automated resistor-manufacturing lines, Line A and Line B, are tested for resistance consistency (nominal 100 Ω). Line A produced n₁ = 60 resistors with mean x̄₁ = 100.5 Ω and standard deviation σ₁ = 2.0 Ω. Line B produced n₂ = 40 resistors with mean x̄₂ = 98.0 Ω and variance σ₂² = 9.0 Ω². (a) Which production line is more consistent? (b) Find the combined mean (x̄₁₂), combined standard deviation (σ₁₂), and combined CV of the pooled batch of 100 resistors.',
    given: [
      'Line A: n₁ = 60, x̄₁ = 100.5 Ω, σ₁ = 2.0 Ω ⇒ σ₁² = 4.0 Ω²',
      'Line B: n₂ = 40, x̄₂ = 98.0 Ω, σ₂² = 9.0 Ω² ⇒ σ₂ = √9.0 = 3.0 Ω (Note: variance given, take square root!)',
    ],
    steps: [
      {
        heading: 'Part (a): Compare Consistency Using Coefficient of Variation',
        work: [
          'CV_A = (σ₁ / x̄₁) × 100% = (2.0 / 100.5) × 100% = 1.9900%',
          'CV_B = (σ₂ / x̄₂) × 100% = (3.0 / 98.0) × 100% = 3.0612%',
          'Conclusion: Since CV_A (1.99%) < CV_B (3.06%), Line A is more consistent in resistance.',
        ],
      },
      {
        heading: 'Part (b): Combined Mean (x̄₁₂)',
        work: [
          'x̄₁₂ = (n₁x̄₁ + n₂x̄₂) / (n₁ + n₂) = [60(100.5) + 40(98.0)] / (60 + 40)',
          'x̄₁₂ = (6030 + 3920) / 100 = 9950 / 100 = 99.50 Ω',
        ],
      },
      {
        heading: 'Part (c): Deviations & Combined Standard Deviation (σ₁₂)',
        work: [
          'd₁ = x̄₁ − x̄₁₂ = 100.5 − 99.5 = +1.0 Ω',
          'd₂ = x̄₂ − x̄₁₂ = 98.0 − 99.5 = −1.5 Ω   (Check: n₁d₁ + n₂d₂ = 60(1.0) + 40(−1.5) = 0)',
          'σ₁₂² = [ n₁(σ₁² + d₁²) + n₂(σ₂² + d₂²) ] / (n₁ + n₂)',
          'σ₁₂² = [ 60(4.0 + 1.0²) + 40(9.0 + (−1.5)²) ] / 100 = [ 60(5.0) + 40(11.25) ] / 100',
          'σ₁₂² = (300 + 450) / 100 = 7.50 Ω²',
          'σ₁₂ = √7.50 = 2.7386 Ω',
          'Combined CV₁₂ = (2.7386 / 99.50) × 100% = 2.7524%',
        ],
      },
    ],
    finalAnswer: [
      '(a) Line A is more consistent (CV_A = 1.99% < CV_B = 3.06%)',
      '(b) Combined Mean x̄₁₂ = 99.50 Ω · Combined SD σ₁₂ = 2.7386 Ω · Combined CV = 2.75%',
    ],
  },
];

export const EXAM_TRAPS: ExamTrap[] = [
  {
    id: 'trap-sign-1',
    category: 'Sign Convention',
    title: 'Negative Sign in Linear Scaling of Standard Deviation (y = a + bx)',
    wrongApproach: 'Writing σ_y = b·σ_x when b is negative (e.g., y = 10 − 2x yielding σ_y = −2σ_x).',
    correctRule: 'Standard deviation is ALWAYS non-negative: σ_y = |b|·σ_x and σ_y² = b²·σ_x². Mean keeps the sign (ȳ = a + bx̄), while SD discards the origin a and takes |b|.',
    examTip: 'Double-check short theory/numerical MCQs where a negative scale factor like u = (A − x)/h is used.',
  },
  {
    id: 'trap-sign-2',
    category: 'Sign Convention',
    title: 'Reversed Subtraction in Computational Variance Formula',
    wrongApproach: 'Computing x̄² − (∑fx²)/N, which produces an impossible negative variance.',
    correctRule: 'Always compute (∑fx²)/N − x̄². Because E[X²] ≥ (E[X])² by Cauchy–Schwarz / non-negativity of variance, the mean of squares is strictly ≥ square of mean.',
    examTip: 'Keep at least 4–5 decimal places in ∑fx²/N and x̄² before subtracting to prevent catastrophic cancellation errors.',
  },
  {
    id: 'trap-sign-3',
    category: 'Sign Convention',
    title: 'Misread Observation Correction in ∑x²',
    wrongApproach: 'Adjusting ∑x² by adding (x_correct − x_wrong)² instead of adjusting the individual squares.',
    correctRule: '∑x_corr = ∑x_old − x_wrong + x_correct, and ∑x²_corr = ∑x²_old − x_wrong² + x_correct². Signs attach to each observation individually.',
    examTip: 'Verify whether N changes (if a value is deleted vs. replaced).',
  },
  {
    id: 'trap-geom-1',
    category: 'Boundary & Slope Geometry',
    title: 'Inclusive Class Intervals Without ±0.5 Continuity Correction',
    wrongApproach: 'Using L = 20 and h = 9 for classes written as 10–19, 20–29, 30–39.',
    correctRule: 'Convert inclusive classes to true continuous boundaries before computing Median, Mode, Quartiles, or plotting Histograms/Ogives: 9.5–19.5, 19.5–29.5, 29.5–39.5 (so L = 19.5 and h = 10).',
    examTip: 'Midpoints xᵢ stay identical in both forms, so Mean & SD are unaffected—only positional/boundary formulas (M_d, M_o, Q_k, P_k) break if you skip this!',
  },
  {
    id: 'trap-geom-2',
    category: 'Boundary & Slope Geometry',
    title: 'Ogive Slope & Histogram Difference-Triangle Angle Errors',
    wrongApproach: 'Plotting Less-Than Ogive points at class midpoints or lower limits, OR drawing Mode cross-diagonals to midpoints instead of opposite top corners.',
    correctRule: 'A Less-Than Ogive plots (Upper Boundary, cf), starting at (L_first, 0); its segment slope is f/h. In a Histogram for Mode, diagonals connect top corners of the modal bar to the opposite top corners of adjacent bars (slope angle governed by Δ₁ = f₁ − f₀ and Δ₂ = f₁ − f₂).',
    examTip: 'For unequal class widths, plot Frequency Density (f/h) on the y-axis of a histogram—never raw frequency!',
  },
  {
    id: 'trap-geom-3',
    category: 'Boundary & Slope Geometry',
    title: 'Variance vs. SD Given in Problem Statement & N vs. (n − 1) Divisor',
    wrongApproach: 'Plugging given Variance σ² directly into CV = σ/x̄ without taking √, OR dividing Model Q4 by (N − 1).',
    correctRule: 'Read carefully whether the problem gives SD (σ) or Variance (σ²). In PU Unit 1 Descriptive Statistics frequency tables, divisor is N = ∑f; reserve (n − 1) for sample inference in Units 7–8.',
    examTip: 'Check units: if data is in Ω, Variance is in Ω² and SD is in Ω.',
  },
  {
    id: 'trap-pu-1',
    category: 'High-Yield PU Topic',
    title: 'Model Q4 Pattern: Discrete/Grouped Mean, Variance & CV Comparison',
    wrongApproach: 'Reporting only numerical CV values without writing the verbal consistency decision.',
    correctRule: 'PU examiners allocate 1 full mark to the concluding interpretation ("Since CV_A < CV_B, Machine A is more consistent").',
    examTip: 'Expect at least one 5-mark or 10-mark question combining CV comparison or Combined Mean/SD.',
  },
  {
    id: 'trap-pu-2',
    category: 'High-Yield PU Topic',
    title: 'Missing Frequency Using Mean or Median + Empirical Mode',
    wrongApproach: 'Using the grouped Mode formula when the distribution is bimodal or when 2f₁ − f₀ − f₂ ≤ 0.',
    correctRule: 'If the modal class is ill-defined or widths are unequal, immediately switch to Karl Pearson’s empirical formula M_o = 3M_d − 2x̄.',
    examTip: 'Missing-frequency problems with Median (like Extra Q1) are classic 8–10 mark PU favorites.',
  },
];
