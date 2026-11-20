import { DepthCode, ExamTrap, FormulaItem, SolvedProblem, SubtopicNote } from './chapter1Content';

export const CH6_SYLLABUS_CONTEXT = {
  university: 'Purbanchal University — Faculty of Engineering, Biratnagar, Nepal',
  program: 'B.E. Biomedical / Electrical / Electronics, Com. & Automation Engineering',
  semester: 'Year III · Semester V (Effective from 2021 / 2078 Batch)',
  subject: 'Probability and Statistics',
  chapter: 'Unit 6: Continuous Probability Distributions',
  lectureHours: '7 Hrs',
  finalMarks: 10,
  totalSubjectMarks: '60 Final Theory + 20 Internal Theory + 20 Practical = 100',
  syllabusTopics: [
    'Normal distribution, standard normal distribution, curve of normal and standard normal distribution',
    'Properties of normal distribution, computing normal probabilities, measurement of areas under the normal curve',
    "Student's t-distribution and its application",
    'Chi-square (χ²) distribution and its application',
  ],
  microSyllabusNote:
    'In the attached PU 5th Semester syllabus PDF (pp. 3–6), Unit 6 is allocated 7 lecture hours and 10/60 final exam marks (e.g., Model Q10 on p. 9). Probability & Statistics lists Detailed Course Contents rather than an SD/D/DR matrix; therefore every Unit 6 subtopic is mapped across SD, D, DR, I, E, A, and N with complete step-by-step derivations.',
};

export const CH6_SUBTOPIC_NOTES: SubtopicNote[] = [
  {
    id: 'ch6-sub-1',
    code: '6.1',
    title: 'Normal Distribution, Standard Normal Distribution & Curve Geometry',
    depths: ['SD', 'D', 'DR', 'I', 'E', 'A', 'N'] as DepthCode[],
    definitionSD:
      'A continuous random variable X follows a Normal (Gaussian) distribution N(μ, σ²) with mean μ ∈ (−∞, ∞) and standard deviation σ > 0 if its PDF is f(x) = [1 / (σ√(2π))] · exp(−½ · [(x − μ)/σ]²) for −∞ < x < ∞. When μ = 0 and σ = 1, the standardized variate Z = (X − μ)/σ follows the Standard Normal Distribution N(0, 1) with PDF φ(z) = (1/√(2π))·e^(−z²/2).',
    descriptionD:
      'The normal curve is a smooth, symmetric, unimodal bell-shaped curve centered at x = μ (or z = 0 for standard normal). It extends asymptotically from −∞ to +∞ without ever touching the horizontal axis, and the total area enclosed beneath f(x) is exactly 1.',
    explanationE:
      'Peak height occurs at x = μ with f(μ) = 1/(σ√(2π)) ≈ 0.3989/σ (for Standard Normal, φ(0) = 0.3989). Points of inflection—where curvature changes from concave downward to concave upward—occur exactly one standard deviation away at x = μ − σ and x = μ + σ (z = ±1). Decreasing σ makes the curve taller and narrower; increasing σ flattens and widens it.',
    illustrationI:
      'In PU Model Q10, wooden beam breaking strengths follow X ~ N(1500, 100²). Shifting center by 1500 and dividing by 100 maps every beam strength onto the single universal Standard Normal curve Z ~ N(0, 1), so 1450 kg becomes z = −0.50 and 1600 kg becomes z = +1.00.',
    applicationA:
      'Thermal and shot noise in communication receivers, component tolerance variations (resistors, capacitors), structural breaking strengths, and measurement errors.',
    derivationDR: {
      title: 'Derivation (DR): Standardization Z = (X − μ)/σ & Inflection Points at x = μ ± σ',
      goal: 'Verify that Z = (X − μ)/σ has PDF φ(z) = (1/√(2π))e^(−z²/2) and prove f″(x) = 0 at x = μ ± σ.',
      steps: [
        {
          step: 1,
          title: 'Change of Variable from X to Z = (X − μ)/σ',
          equation: 'x = μ + σz  ⇒  dx = σ dz,   and   f_Z(z) = f_X(μ + σz) · |dx/dz| = [1/(σ√(2π))] e^(−z²/2) · σ = (1/√(2π)) e^(−z²/2)',
          note: 'The σ factors cancel, leaving a parameter-free universal density φ(z) ~ N(0, 1).',
        },
        {
          step: 2,
          title: 'First Derivative f′(x) to Locate Peak (Mode)',
          equation: 'f′(x) = f(x) · [ −(x − μ) / σ² ] = 0   ⇒   x = μ',
          note: 'Since f(x) > 0 everywhere, the unique stationary point (peak/mode) occurs at x = μ.',
        },
        {
          step: 3,
          title: 'Second Derivative f″(x) by Product Rule',
          equation: 'f″(x) = f′(x)[ −(x − μ)/σ² ] + f(x)[ −1/σ² ] = [ f(x) / σ² ] · [ (x − μ)²/σ² − 1 ]',
          note: 'Set f″(x) = 0 for points of inflection:',
        },
        {
          step: 4,
          title: 'Solve f″(x) = 0 for Inflection Coordinates',
          equation: '(x − μ)² / σ² = 1   ⇒   x = μ ± σ   (equivalently z = ±1)',
          note: 'At x = μ, f″(μ) = −f(μ)/σ² < 0 (concave down maximum); at x = μ ± σ, curvature flips sign.',
        },
      ],
      result: 'Z = (X − μ)/σ ~ N(0, 1) with inflection points at x = μ ± σ (z = ±1).',
    },
    keyTakeawayN:
      'Always sketch a quick bell curve centered at 0, plot your z-values on the left/right of 0, and shade the target interval before looking up tables.',
  },
  {
    id: 'ch6-sub-2',
    code: '6.2',
    title: 'Properties of the Normal Distribution (Moments, Deviations & Linear Sums)',
    depths: ['SD', 'D', 'DR', 'I', 'E', 'A', 'N'] as DepthCode[],
    definitionSD:
      'A Normal distribution N(μ, σ²) is completely specified by two parameters—mean μ and variance σ²—and exhibits exact symmetry, zero skewness, mesokurtic kurtosis, constant ratios among dispersion measures, and closure under linear combinations.',
    descriptionD:
      'Core Properties: (1) Mean = Median = Mode = μ; (2) Skewness β₁ = 0, Kurtosis β₂ = 3; (3) Odd central moments μ_{2k+1} = 0, even central moments μ_{2k} = 1·3·5···(2k−1)σ^{2k} (so μ₂ = σ², μ₄ = 3σ⁴); (4) Mean Deviation MD = √(2/π)·σ ≈ 0.7979σ ≈ (4/5)σ; (5) Quartiles Q₁ = μ − 0.6745σ, Q₃ = μ + 0.6745σ, so QD ≈ 0.6745σ ≈ (2/3)σ; (6) Ratio QD : MD : SD ≈ 10 : 12 : 15; (7) Reproductive property: if Xᵢ ~ N(μᵢ, σᵢ²) independently, then ∑aᵢXᵢ ~ N(∑aᵢμᵢ, ∑aᵢ²σᵢ²).',
    explanationE:
      'Notice that for any Normal variable, knowing any single dispersion metric (SD, MD, or QD) immediately recovers the other two via σ ≈ 1.2533·MD ≈ 1.4826·QD. Also note that variance adds even when subtracting two independent normals: Var(X − Y) = σ_X² + σ_Y².',
    illustrationI:
      'If resistor R₁ ~ N(100, 3²) Ω and R₂ ~ N(200, 4²) Ω are wired in series independently, total resistance R₁ + R₂ ~ N(300, 3² + 4²) = N(300, 5²) Ω—standard deviation is √(9 + 16) = 5 Ω, NOT 3 + 4 = 7 Ω.',
    applicationA:
      'Tolerance stack-up in electrical circuits, mechanical shaft-and-bearing clearance analysis, and establishing control limits (±3σ) in Statistical Quality Control.',
    derivationDR: {
      title: 'Derivation (DR): Mean E(X) = μ, Variance Var(X) = σ² & Mean Deviation MD ≈ 0.7979σ',
      goal: 'Prove E(X) = μ, Var(X) = σ², and MD = √(2/π)σ directly from the Normal PDF.',
      steps: [
        {
          step: 1,
          title: 'Show E(Z) = 0 and E(X) = μ via Odd Symmetry',
          equation: 'E(Z) = (1/√(2π)) ∫_{−∞}^∞ z · e^(−z²/2) dz = 0   ⇒   E(X) = E(μ + σZ) = μ + σ·0 = μ',
          note: 'The integrand z·e^(−z²/2) is an odd function integrated over symmetric limits (−∞, ∞), so it vanishes identically.',
        },
        {
          step: 2,
          title: 'Evaluate E(Z²) = 1 by Integration by Parts',
          equation: 'E(Z²) = (1/√(2π)) ∫_{−∞}^∞ z · (z e^(−z²/2)) dz = (1/√(2π)) [ −z e^(−z²/2) ]_{−∞}^∞ + (1/√(2π)) ∫_{−∞}^∞ e^(−z²/2) dz = 0 + 1 = 1',
          note: 'Using u = z, dv = z e^(−z²/2) dz ⇒ v = −e^(−z²/2), and the Gaussian integral ∫_{−∞}^∞ e^(−z²/2) dz = √(2π).',
        },
        {
          step: 3,
          title: 'Conclude Var(X) = σ²',
          equation: 'Var(X) = Var(μ + σZ) = σ² · Var(Z) = σ² · [ E(Z²) − (E(Z))² ] = σ²(1 − 0) = σ²',
          note: 'Since Variance is shift-invariant and scales by σ².',
        },
        {
          step: 4,
          title: 'Derive Mean Deviation About Mean (MD)',
          equation: 'MD = E(|X − μ|) = σ E(|Z|) = (2σ/√(2π)) ∫_0^∞ z e^(−z²/2) dz = √(2/π) · σ · [ −e^(−z²/2) ]_0^∞ = √(2/π)·σ ≈ 0.7979σ',
          note: 'Exploits even symmetry of |z|e^(−z²/2) and substitution u = z²/2.',
        },
      ],
      result: 'E(X) = μ,   Var(X) = σ²,   MD = √(2/π)σ ≈ 0.7979σ,   QD ≈ 0.6745σ.',
    },
    keyTakeawayN:
      'In theory/short-answer exams, remember the 10 : 12 : 15 rule (QD ≈ ⅔σ, MD ≈ ⅘σ, SD = σ) and that Var(X − Y) = σ₁² + σ₂² (always PLUS!).',
  },
  {
    id: 'ch6-sub-3',
    code: '6.3',
    title: 'Computing Normal Probabilities & Measurement of Areas Under the Normal Curve',
    depths: ['SD', 'D', 'I', 'E', 'A', 'N'] as DepthCode[],
    definitionSD:
      'Computing a normal probability P(a ≤ X ≤ b) converts endpoints into standard z-scores z₁ = (a − μ)/σ and z₂ = (b − μ)/σ and measures the area under the Standard Normal density φ(z) between z₁ and z₂: P(a ≤ X ≤ b) = Φ(z₂) − Φ(z₁).',
    descriptionD:
      'Empirical Area Rule (68–95–99.7%): P(μ − σ ≤ X ≤ μ + σ) = 0.6827 (68.27%), P(μ − 2σ ≤ X ≤ μ + 2σ) = 0.9545 (95.45%), and P(μ − 3σ ≤ X ≤ μ + 3σ) = 0.9973 (99.73%). Two standard table conventions appear in PU exams: (1) Cumulative table Φ(z) = P(Z ≤ z) from −∞ to z; (2) Half-area table A(z) = P(0 ≤ Z ≤ z) from 0 to z, where Φ(z) = 0.5 + A(z) for z ≥ 0.',
    explanationE:
      'Because φ(z) is continuous, P(X = c) = 0, so P(X < b) = P(X ≤ b). For negative z, symmetry gives Φ(−z) = 1 − Φ(z) and A(−z) = A(z) on the left side of 0. When a and b sit on opposite sides of μ (like z₁ < 0 < z₂), ADD their half-areas: A(|z₁|) + A(z₂). When both sit on the same side of μ (0 < z₁ < z₂), SUBTRACT: A(z₂) − A(z₁).',
    illustrationI:
      'For PU Model Q10 (z₁ = −0.50, z₂ = +1.00), the two limits lie on opposite sides of the mean 0, so total area = A(0.50) + A(1.00) = 0.1915 + 0.3413 = 0.5328.',
    applicationA:
      'Quality control yield calculations, finding warranty limits or cutoff scores (inverse Z-lookup), and Normal approximation to Binomial B(n, p) with continuity correction ±0.5 when np ≥ 5 and nq ≥ 5.',
    keyTakeawayN:
      'Check which Z-table your exam booklet supplies! If table entry at z = 0 is 0.0000, it is half-area A(z) = P(0 ≤ Z ≤ z); if entry at z = 0 is 0.5000, it is cumulative Φ(z) = P(Z ≤ z).',
  },
  {
    id: 'ch6-sub-4',
    code: '6.4',
    title: "Student's t-Distribution and Its Application",
    depths: ['SD', 'D', 'DR', 'I', 'E', 'A', 'N'] as DepthCode[],
    definitionSD:
      "If Z ~ N(0, 1) and V ~ χ²_ν are independent, the ratio T = Z / √(V / ν) follows Student's t-distribution with ν degrees of freedom. For a random sample of size n from a normal population N(μ, σ²) with unknown σ, t = (X̄ − μ) / (S / √n) follows a t-distribution with ν = n − 1 degrees of freedom.",
    descriptionD:
      'Properties of the t-curve: (1) Symmetric and bell-shaped around t = 0 (Mean = Median = Mode = 0 for ν > 1); (2) Flatter peak and noticeably heavier ("fatter") tails than Standard Normal N(0, 1) because estimating σ by S introduces extra uncertainty; (3) Variance = ν / (ν − 2) > 1 for ν > 2; (4) As ν → ∞ (practically n ≥ 30), the t-distribution converges rapidly to N(0, 1).',
    explanationE:
      'Student\'s t is the workhorse continuous distribution for small-sample engineering inference (n < 30) when the true population standard deviation σ is unknown and must be estimated by unbiased sample SD S = √[∑(xᵢ − x̄)² / (n − 1)].',
    illustrationI:
      'At 95% two-tailed confidence (α = 0.05), the Normal critical value is z₀.₀₂₅ = 1.96, whereas for n = 5 (ν = 4), t₀.₀₂₅,₄ = 2.776—wider tails require a larger multiplier to guarantee 95% coverage.',
    applicationA:
      'Small-sample confidence intervals for mean μ and difference of two means (Unit 7); single-sample t-test, two-sample pooled t-test, paired t-test (Unit 8); and testing significance of correlation coefficient r.',
    derivationDR: {
      title: 'Derivation (DR): Constructing Student\'s t Statistic from Z and χ²_{n−1}',
      goal: 'Show how (X̄ − μ)/(S/√n) reduces to the canonical Z / √(V/ν) definition.',
      steps: [
        {
          step: 1,
          title: 'Standardize Sample Mean Using True σ',
          equation: 'Z = (X̄ − μ) / (σ / √n) ~ N(0, 1)',
          note: 'Valid exactly for any n when Xᵢ ~ N(μ, σ²).',
        },
        {
          step: 2,
          title: 'Identify Independent Chi-Square Pivot for Sample Variance',
          equation: 'V = (n − 1)S² / σ² = ∑(Xᵢ − X̄)² / σ² ~ χ²_{n−1},   independent of X̄',
          note: 'Degrees of freedom ν = n − 1 (1 df lost estimating μ by X̄).',
        },
        {
          step: 3,
          title: 'Substitute Z and V into Canonical Ratio T = Z / √(V/ν)',
          equation: 'T = [ (X̄ − μ) / (σ/√n) ] / √[ ((n−1)S²/σ²) / (n−1) ] = (X̄ − μ) / (S / √n)',
          note: 'The unknown σ cancels completely, yielding an observable pivot t ~ t_{n−1}.',
        },
      ],
      result: 't = (X̄ − μ) / (S / √n) ~ t_{n−1},   with E(t) = 0 (ν > 1) and Var(t) = ν/(ν − 2) (ν > 2).',
    },
    keyTakeawayN:
      'Always use df ν = n − 1 for a single sample and ν = n₁ + n₂ − 2 for two independent samples with equal unknown variances.',
  },
  {
    id: 'ch6-sub-5',
    code: '6.5',
    title: 'Chi-Square (χ²) Distribution and Its Application',
    depths: ['SD', 'D', 'I', 'E', 'A', 'N'] as DepthCode[],
    definitionSD:
      'If Z₁, Z₂, …, Z_ν are independent Standard Normal random variables N(0, 1), the sum of their squares χ² = ∑_{i=1}^ν Zᵢ² follows a Chi-Square distribution with ν degrees of freedom, having PDF f(x) = [1 / (2^(ν/2) Γ(ν/2))] · x^(ν/2 − 1) e^(−x/2) for x > 0.',
    descriptionD:
      'Properties of χ²_ν: (1) Strictly non-negative support x ∈ [0, ∞); (2) Positively (right) skewed, with skewness √(8/ν) decreasing as ν increases; (3) Mean = ν, Variance = 2ν, Mode = ν − 2 (for ν ≥ 2, else 0); (4) Additive property: if U ~ χ²_{ν₁} and V ~ χ²_{ν₂} independently, then U + V ~ χ²_{ν₁ + ν₂}; (5) Approaches Normal N(ν, 2ν) for large ν (> 30).',
    explanationE:
      'Unlike the symmetric Z and t curves, χ² is asymmetric and single-tailed toward positive values, so both lower and upper critical values (χ²_{1−α/2, ν} and χ²_{α/2, ν}) must be read separately when building two-sided confidence intervals for variance σ².',
    illustrationI:
      'For ν = 6 degrees of freedom, Mean = 6, Variance = 12 (SD = √12 ≈ 3.464), Mode = 6 − 2 = 4, and the upper 5% critical cutoff is χ²_{0.05, 6} = 12.592.',
    applicationA:
      'Chi-square test of goodness of fit (comparing observed vs. Binomial/Poisson/Normal expected frequencies), test of independence of attributes in r × c contingency tables (Model Q3, Unit 8), and confidence intervals/tests for population variance σ² via (n − 1)S²/σ² ~ χ²_{n−1}.',
    keyTakeawayN:
      'Remember the two-parameter moment shortcut: for χ²_ν, Mean = ν and Variance = 2ν (twice the degrees of freedom!).',
  },
];

export const CH6_FORMULA_SHEET: FormulaItem[] = [
  {
    id: 'ch6-f-norm-pdf',
    category: 'Location',
    quantity: 'Normal & Standard Normal PDF',
    symbol: 'f(x), φ(z)',
    formula: 'f(x) = [1/(σ√(2π))] e^(−½[(x−μ)/σ]²);   φ(z) = (1/√(2π)) e^(−z²/2)',
    assumptionOrConstant: '1/√(2π) ≈ 0.39894; Z = (X − μ)/σ ~ N(0, 1); −∞ < x < ∞',
    unit: 'Density (unit⁻¹)',
  },
  {
    id: 'ch6-f-norm-moments',
    category: 'Location',
    quantity: 'Normal Moments, Skewness & Kurtosis',
    symbol: 'μ, β₁, β₂',
    formula: 'Mean = Median = Mode = μ;   β₁ = 0;   β₂ = 3;   μ₄ = 3σ⁴',
    assumptionOrConstant: 'All odd central moments μ_{2k+1} = 0; inflection points at μ ± σ',
    unit: 'μ: data unit; β₁, β₂: dimensionless',
  },
  {
    id: 'ch6-f-norm-disp',
    category: 'Location',
    quantity: 'Normal Dispersion Ratios (10 : 12 : 15)',
    symbol: 'QD, MD, σ',
    formula: 'QD ≈ 0.6745σ ≈ (2/3)σ;   MD = √(2/π)σ ≈ 0.7979σ ≈ (4/5)σ',
    assumptionOrConstant: 'Quartiles: Q₁ = μ − 0.6745σ, Q₃ = μ + 0.6745σ; σ ≈ 1.2533·MD ≈ 1.4826·QD',
    unit: 'Same unit as X',
  },
  {
    id: 'ch6-f-norm-area',
    category: 'Dispersion',
    quantity: 'Empirical Rule & Area Under Curve',
    symbol: 'Φ(z), A(z)',
    formula: 'P(μ ± 1σ) = 68.27%;   P(μ ± 2σ) = 95.45%;   P(μ ± 3σ) = 99.73%',
    assumptionOrConstant: 'P(a ≤ X ≤ b) = Φ(z₂) − Φ(z₁); Φ(−z) = 1 − Φ(z); Φ(z) = 0.5 + A(z) (z ≥ 0)',
    unit: 'Probability ∈ [0, 1]',
  },
  {
    id: 'ch6-f-norm-sum',
    category: 'Dispersion',
    quantity: 'Linear Combination of Independent Normals',
    symbol: 'aX ± bY',
    formula: 'E(aX ± bY) = aμ₁ ± bμ₂;   Var(aX ± bY) = a²σ₁² + b²σ₂²',
    assumptionOrConstant: 'Requires X and Y independent; variances ALWAYS add for X − Y',
    unit: 'Mean: unit; Var: unit²',
  },
  {
    id: 'ch6-f-t-dist',
    category: 'Properties & Constants',
    quantity: "Student's t-Distribution",
    symbol: 't_ν',
    formula: 't = (X̄ − μ) / (S / √n) ~ t_{n−1};   E(t) = 0;   Var(t) = ν / (ν − 2)',
    assumptionOrConstant: 'ν = n − 1 (single sample); Var defined for ν > 2; converges to N(0,1) as ν → ∞',
    unit: 'Dimensionless',
  },
  {
    id: 'ch6-f-chi-dist',
    category: 'Properties & Constants',
    quantity: 'Chi-Square Distribution & Moments',
    symbol: 'χ²_ν',
    formula: 'χ² = ∑ Zᵢ²;   E(χ²) = ν;   Var(χ²) = 2ν;   Mode = ν − 2 (ν ≥ 2)',
    assumptionOrConstant: 'Support [0, ∞); additive: χ²_{ν₁} + χ²_{ν₂} ~ χ²_{ν₁+ν₂}; (n−1)S²/σ² ~ χ²_{n−1}',
    unit: 'Dimensionless (≥ 0)',
  },
];

export const CH6_SOLVED_QUESTIONS: SolvedProblem[] = [
  {
    id: 'pu-model-q10',
    tag: 'PU Model Set · Group B, Q10',
    title: 'Normal Probability: Breaking Strength of Wooden Beams',
    marks: '5 Marks',
    source: 'Attached PDF — PU V Sem Final Exam 2024 Model Question, Page 9',
    statement:
      'A certain type of wooden beam has a mean breaking strength of 1500 kgs and a standard deviation of 100 kgs. Find the relative frequency of all such beams whose breaking strengths lie between 1450 and 1600 kgs.',
    given: [
      'Let X = breaking strength of a randomly chosen wooden beam (in kgs).',
      'Mean μ = 1500 kgs, Standard Deviation σ = 100 kgs, so X ~ N(1500, 100²).',
      'Required relative frequency: P(1450 ≤ X ≤ 1600).',
    ],
    steps: [
      {
        heading: 'Step 1: Convert Endpoints to Standard Normal Variates Z = (X − μ)/σ',
        work: [
          'For lower limit x₁ = 1450 kgs:   z₁ = (1450 − 1500) / 100 = −50 / 100 = −0.50',
          'For upper limit x₂ = 1600 kgs:   z₂ = (1600 − 1500) / 100 = +100 / 100 = +1.00',
        ],
      },
      {
        heading: 'Step 2: Measure Area Under Standard Normal Curve (Opposite Sides of Mean 0)',
        work: [
          'P(1450 ≤ X ≤ 1600) = P(−0.50 ≤ Z ≤ +1.00) = P(−0.50 ≤ Z ≤ 0) + P(0 ≤ Z ≤ 1.00)',
          'By symmetry, P(−0.50 ≤ Z ≤ 0) = P(0 ≤ Z ≤ 0.50) = 0.19146 ≈ 0.1915',
          'From Standard Normal table, P(0 ≤ Z ≤ 1.00) = 0.34134 ≈ 0.3413',
          'Alternatively using cumulative Φ(z): Φ(1.00) − Φ(−0.50) = 0.8413 − (1 − 0.6915) = 0.8413 − 0.3085 = 0.5328',
        ],
      },
      {
        heading: 'Step 3: Combine Areas',
        work: [
          'P(1450 ≤ X ≤ 1600) = 0.1915 + 0.3413 = 0.5328  (exact: 0.532807)',
          'Relative frequency percentage = 0.5328 × 100% = 53.28%',
        ],
      },
    ],
    finalAnswer: [
      'Relative frequency P(1450 ≤ X ≤ 1600) = 0.5328 (or 53.28% of all beams)',
    ],
  },
  {
    id: 'ch6-extra-1',
    tag: 'Extra Exam-Level Numerical 1',
    title: 'Forward & Inverse Normal Calculations: Precision Resistor Batch',
    marks: '5–10 Marks Pattern',
    source: 'High-Yield PU Exam Practice (Normal Probability & Quantile Cutoff)',
    statement:
      'A manufacturing process produces precision resistors whose resistance R follows a normal distribution with mean μ = 100 Ω and standard deviation σ = 4 Ω. (a) What percentage of resistors are rejected if specifications require resistance between 94 Ω and 106 Ω? (b) Find the maximum resistance R₀ of the lowest 10% of resistors.',
    given: [
      'R ~ N(μ = 100 Ω, σ = 4 Ω).',
      'Acceptable tolerance band: [94 Ω, 106 Ω].',
      'Standard Normal table values: A(1.50) = P(0 ≤ Z ≤ 1.50) = 0.4332; Φ(−1.2816) = 0.10 (standard z₀.₁₀ ≈ 1.28).',
    ],
    steps: [
      {
        heading: 'Part (a): Acceptance & Rejection Percentages for [94 Ω, 106 Ω]',
        work: [
          'z₁ = (94 − 100) / 4 = −1.50,   z₂ = (106 − 100) / 4 = +1.50',
          'P(94 ≤ R ≤ 106) = P(−1.50 ≤ Z ≤ +1.50) = 2 × P(0 ≤ Z ≤ 1.50) = 2 × 0.4332 = 0.8664 (86.64% accepted)',
          'Rejection probability = 1 − 0.8664 = 0.1336  ⇒  13.36% rejected',
        ],
      },
      {
        heading: 'Part (b): Inverse Lookup for Lowest 10% Cutoff R₀',
        work: [
          'We need P(R ≤ R₀) = 0.10, which lies in the left tail below μ (so z₀ < 0).',
          'Area between μ and R₀ is 0.50 − 0.10 = 0.4000  ⇒  from Z-table, A(1.28) = 0.3997 ≈ 0.4000 (exact z = −1.2816).',
          'Using z₀ = −1.2816: R₀ = μ + z₀·σ = 100 + (−1.2816)(4) = 100 − 5.126 = 94.87 Ω  (with z₀ = −1.28: 94.88 Ω)',
        ],
      },
    ],
    finalAnswer: [
      '(a) Rejected resistors = 13.36% (0.1336)',
      '(b) Maximum resistance of lowest 10% = 94.87 Ω (or 94.88 Ω using 2-decimal z = −1.28)',
    ],
  },
  {
    id: 'ch6-extra-2',
    tag: 'Extra Exam-Level Numerical 2',
    title: 'Recovering Unknown Mean (μ) & SD (σ) From Normal Tail Proportions',
    marks: '10 Marks Pattern',
    source: 'Classic PU Engineering Exam Pattern (Simultaneous Normal Equations)',
    statement:
      'In a large batch of high-voltage capacitors whose breakdown voltage X is normally distributed, 10% fail below 40 kV and 20% withstand more than 70 kV. (a) Find the mean μ and standard deviation σ of breakdown voltage. (b) Estimate the percentage of capacitors with breakdown voltage between 50 kV and 65 kV.',
    given: [
      'X ~ N(μ, σ²) with unknown μ and σ.',
      'P(X < 40) = 0.10  (left tail area 0.10 ⇒ A(z) = 0.4000 on left).',
      'P(X > 70) = 0.20  (right tail area 0.20 ⇒ A(z) = 0.3000 on right).',
    ],
    steps: [
      {
        heading: 'Step 1: Find Corresponding Standard Normal z-Scores',
        work: [
          'For P(X < 40) = 0.10: z₁ = −1.2816  (approx −1.28 since A(1.28) = 0.3997)',
          'For P(X > 70) = 0.20: P(0 ≤ Z ≤ z₂) = 0.50 − 0.20 = 0.3000  ⇒  z₂ = +0.8416  (approx +0.84 since A(0.84) = 0.2995)',
        ],
      },
      {
        heading: 'Step 2: Set Up & Solve Simultaneous Equations for μ and σ',
        work: [
          '(1) (40 − μ) / σ = −1.2816   ⇒   μ − 1.2816σ = 40',
          '(2) (70 − μ) / σ = +0.8416   ⇒   μ + 0.8416σ = 70',
          'Subtract (1) from (2): (0.8416 + 1.2816)σ = 30  ⇒  2.1232σ = 30  ⇒  σ = 14.13 kV  (14.15 kV with 2-dec z)',
          'Substitute σ = 14.13 into (1): μ = 40 + 1.2816(14.13) = 40 + 18.11 = 58.11 kV',
        ],
      },
      {
        heading: 'Step 3: Find P(50 ≤ X ≤ 65)',
        work: [
          'z_a = (50 − 58.11) / 14.13 = −0.574  ⇒  A(0.574) ≈ 0.2170',
          'z_b = (65 − 58.11) / 14.13 = +0.488  ⇒  A(0.488) ≈ 0.1872',
          'P(50 ≤ X ≤ 65) = 0.2170 + 0.1872 = 0.4042 (40.42%)',
        ],
      },
    ],
    finalAnswer: [
      '(a) Mean μ = 58.11 kV,   Standard Deviation σ = 14.13 kV',
      '(b) Proportion between 50 kV and 65 kV = 40.42% (0.4042)',
    ],
  },
];

export const CH6_EXAM_TRAPS: ExamTrap[] = [
  {
    id: 'ch6-trap-sign-1',
    category: 'Sign Convention',
    title: 'Using Wrong Sign on z-Score for Left-Tail Inverse Lookup',
    wrongApproach: 'For "lowest 10% of items", setting z = +1.28 instead of −1.28, giving a cutoff ABOVE the mean.',
    correctRule: 'Anything below the 50th percentile (left of μ) MUST have a NEGATIVE z-score. Write x = μ + zσ with z < 0.',
    examTip: 'Sanity check: if the problem asks for the lowest 10%, your final x must be strictly less than μ!',
  },
  {
    id: 'ch6-trap-sign-2',
    category: 'Sign Convention',
    title: 'Subtracting Variances When Computing X − Y for Independent Normals',
    wrongApproach: 'Writing Var(X − Y) = σ_X² − σ_Y² instead of σ_X² + σ_Y².',
    correctRule: 'For independent random variables, Var(aX ± bY) = a²σ_X² + b²σ_Y²—variances ALWAYS ADD, even when subtracting X − Y!',
    examTip: 'Remember Var(−Y) = (−1)²Var(Y) = +σ_Y².',
  },
  {
    id: 'ch6-trap-geom-1',
    category: 'Boundary & Slope Geometry',
    title: 'Half-Area Table A(z) vs. Cumulative Table Φ(z) Confusion',
    wrongApproach: 'Reading P(0 ≤ Z ≤ 1.00) = 0.3413 from a half-area table and treating it as P(Z ≤ 1.00), or adding 0.5 twice when limits span 0.',
    correctRule: 'Same side of μ (0 < z₁ < z₂): SUBTRACT A(z₂) − A(z₁). Opposite sides of μ (z₁ < 0 < z₂): ADD A(|z₁|) + A(z₂). With cumulative Φ(z): always Φ(z₂) − Φ(z₁).',
    examTip: 'Look at the table value at z = 0.00 first: 0.0000 means half-area A(z); 0.5000 means cumulative Φ(z).',
  },
  {
    id: 'ch6-trap-geom-2',
    category: 'Boundary & Slope Geometry',
    title: 'Confusing Normal Inflection Points (μ ± σ) with Control Limits (μ ± 3σ)',
    wrongApproach: 'Stating that the normal curve inflection points lie at μ ± 2σ or at 0.6745σ (which are quartiles).',
    correctRule: 'Points of inflection (f″(x) = 0) lie at μ ± σ (68.27% area); Quartiles lie at μ ± 0.6745σ (50% area); Practical 3σ span lies at μ ± 3σ (99.73% area).',
    examTip: 'PU examiners frequently ask a 2-mark/5-mark theory question on properties and points of inflection of the normal curve.',
  },
  {
    id: 'ch6-trap-pu-1',
    category: 'High-Yield PU Topic',
    title: 'Simultaneous Equations for Unknown μ and σ (10-Mark Classic)',
    wrongApproach: 'Using the given percentage directly as z (e.g., plugging 0.10 as z instead of looking up the inverse z = −1.28).',
    correctRule: 'Convert each given tail percentage into its standard normal z-score FIRST, then solve (x₁ − μ)/σ = z₁ and (x₂ − μ)/σ = z₂.',
    examTip: 'Draw two shaded tail sketches so you never mix up "10% below x₁" (z₁ < 0) with "20% above x₂" (z₂ > 0).',
  },
  {
    id: 'ch6-trap-pu-2',
    category: 'High-Yield PU Topic',
    title: 'Comparing Normal, Student\'s t, and Chi-Square Properties',
    wrongApproach: 'Applying z = 1.96 for n < 30 with unknown σ, or forgetting that χ² has Mean = ν and Variance = 2ν.',
    correctRule: 'Use t_{n−1} whenever n < 30 and σ is unknown (t is symmetric, heavier-tailed, Var = ν/(ν−2)). Use χ²_ν on [0, ∞) with Mean = ν, Var = 2ν.',
    examTip: 'Unit 6 carries 10/60 marks in PU—expect one Normal area/inverse numerical (like Model Q10) plus t/χ² properties or a second Normal problem.',
  },
];
