import { DepthCode, ExamTrap, FormulaItem, SolvedProblem, SubtopicNote } from './chapter1Content';

export const CH4_SYLLABUS_CONTEXT = {
  university: 'Purbanchal University — Faculty of Engineering, Biratnagar, Nepal',
  program: 'B.E. Biomedical / Electrical / Electronics, Com. & Automation Engineering',
  semester: 'Year III · Semester V (Effective from 2021 / 2078 Batch)',
  subject: 'Probability and Statistics',
  chapter: 'Unit 4: Random Variable and Expectation',
  lectureHours: '3 Hrs (Syllabus) / 2 Hrs (Detailed Contents)',
  finalMarks: 5,
  totalSubjectMarks: '60 Final Theory + 20 Internal Theory + 20 Practical = 100',
  syllabusTopics: [
    'Random Variables: Discrete and continuous random variables',
    'Probability distribution of random variables (PMF, PDF, and CDF)',
    'Expected value and variance of discrete & continuous random variables',
  ],
  microSyllabusNote:
    'In the attached PU 5th Semester syllabus PDF, Probability & Statistics (pp. 3–5) allocates 5/60 final exam marks to Unit 4 (typically 1 Group B 5-mark question—see Model Q6 on p. 8). Explicit SD/D/DR/I/E/A/EX/N grids appear for the other engineering subjects in the PDF; here every Unit 4 subtopic is covered across SD, D, DR, I, E, A, and N with full step-by-step derivations.',
};

export const CH4_SUBTOPIC_NOTES: SubtopicNote[] = [
  {
    id: 'ch4-sub-1',
    code: '4.1',
    title: 'Random Variables: Discrete vs. Continuous',
    depths: ['SD', 'D', 'I', 'E', 'A'] as DepthCode[],
    definitionSD:
      'A Random Variable (X) is a real-valued function X: S → ℝ that assigns a unique real number to every outcome in the sample space S of a random experiment.',
    descriptionD:
      'Random variables bridge raw non-numeric outcomes (Heads/Tails, Pass/Fail) to mathematical analysis and fall into two classes: (1) Discrete Random Variable, whose range is finite or countably infinite (isolated integers such as 0, 1, 2, …); and (2) Continuous Random Variable, whose range spans an uncountably infinite interval of real numbers [a, b] or (−∞, ∞).',
    explanationE:
      'The distinction governs which mathematical operator we use: Discrete RVs accumulate probability via summation (∑) at individual points, whereas Continuous RVs accumulate probability via integration (∫) over intervals because the probability at any single exact real point is zero: P(X = c) = 0.',
    illustrationI:
      'Counting the number of dropped packets in 100 transmissions produces a discrete RV X ∈ {0, 1, …, 100}. Measuring the exact arrival delay of a packet in milliseconds produces a continuous RV T ∈ [0, ∞).',
    applicationA:
      'Modeling digital bit errors and component failure counts (discrete) vs. thermal noise voltage, breakdown voltage, and component lifetime (continuous).',
    keyTakeawayN:
      'For continuous RVs, P(a ≤ X ≤ b) = P(a < X < b); for discrete RVs, strict (<) vs. inclusive (≤) inequalities give DIFFERENT probabilities!',
  },
  {
    id: 'ch4-sub-2',
    code: '4.2',
    title: 'Probability Distribution (PMF, PDF & Cumulative Distribution Function CDF)',
    depths: ['SD', 'D', 'DR', 'I', 'E', 'A', 'N'] as DepthCode[],
    definitionSD:
      'For a discrete RV, the Probability Mass Function (PMF) is p(x) = P(X = x). For a continuous RV, the Probability Density Function (PDF) is a non-negative function f(x) whose integral over [a, b] equals P(a ≤ X ≤ b). The Cumulative Distribution Function (CDF) for any RV is F(x) = P(X ≤ x).',
    descriptionD:
      'A valid PMF must satisfy: (i) p(xᵢ) ≥ 0 for all xᵢ, and (ii) ∑ p(xᵢ) = 1. A valid PDF must satisfy: (i) f(x) ≥ 0 for all x ∈ ℝ, and (ii) ∫_{−∞}^{∞} f(x) dx = 1. Note carefully that f(x) is a density (probability per unit x), NOT a probability—so f(x) CAN exceed 1 as long as its total area under the curve equals 1!',
    explanationE:
      'In PU exams, finding an unknown constant k (discrete, as in Model Q6) or c (continuous) almost always uses the normalization condition ∑ p(xᵢ) = 1 or ∫ f(x) dx = 1, followed by checking non-negativity.',
    illustrationI:
      'A uniform PDF on [0, 0.5] has constant height f(x) = 2 (> 1!), yet its total area is 2 × 0.5 = 1. Meanwhile, its CDF ramps linearly from F(0) = 0 to F(0.5) = 1.',
    applicationA:
      'Determining normalizing constants in reliability models, computing survival probabilities P(T > t) = 1 − F(t), and extracting median/quantiles from F(x) = 0.5.',
    derivationDR: {
      title: 'Derivation (DR): Interval Probability from CDF & Why P(X = c) = 0 for Continuous RVs',
      goal: 'Prove P(a < X ≤ b) = F(b) − F(a), and show P(X = c) = 0 when F(x) is continuous.',
      steps: [
        {
          step: 1,
          title: 'Partition Event {X ≤ b} Disjointly',
          equation: '{X ≤ b} = {X ≤ a} ∪ {a < X ≤ b},   where {X ≤ a} ∩ {a < X ≤ b} = ∅ (for a < b)',
          note: 'Apply finite additivity of probability (Kolmogorov Axiom 3):',
        },
        {
          step: 2,
          title: 'Apply CDF Definition F(x) = P(X ≤ x)',
          equation: 'P(X ≤ b) = P(X ≤ a) + P(a < X ≤ b)   ⇒   P(a < X ≤ b) = F(b) − F(a)',
          note: 'Holds universally for BOTH discrete and continuous random variables.',
        },
        {
          step: 3,
          title: 'Continuous Point Probability Limit',
          equation: 'P(X = c) = ∫_c^c f(x) dx = 0   (or lim_{ε→0⁺} [F(c) − F(c − ε)] = 0)',
          note: 'Therefore for continuous RVs: P(a ≤ X ≤ b) = P(a < X ≤ b) = P(a < X < b) = F(b) − F(a) = ∫_a^b f(x) dx.',
        },
      ],
      result: 'P(a < X ≤ b) = F(b) − F(a);   f(x) = dF(x)/dx (continuous);   p(xᵢ) = F(xᵢ) − F(xᵢ⁻) (discrete).',
    },
    keyTakeawayN:
      'When solving for k or c, always reject any root that makes p(x) < 0 or f(x) < 0 on the support!',
  },
  {
    id: 'ch4-sub-3',
    code: '4.3',
    title: 'Expected Value, Moments, Variance & Linear Transformation Laws',
    depths: ['SD', 'D', 'DR', 'I', 'E', 'A', 'N'] as DepthCode[],
    definitionSD:
      'The Expected Value (mean μ) of X is E(X) = ∑ xᵢ·p(xᵢ) for discrete X, or E(X) = ∫_{−∞}^{∞} x·f(x) dx for continuous X. For any function g(X), E[g(X)] = ∑ g(xᵢ)p(xᵢ) or ∫ g(x)f(x) dx. Variance is Var(X) = σ² = E[(X − μ)²].',
    descriptionD:
      'Expected value represents the long-run probability-weighted average (first moment about the origin). Variance measures expected squared spread around the mean (second central moment), and Standard Deviation σ = √Var(X) restores the original units of X.',
    explanationE:
      'Linearity of expectation E(aX + b) = aE(X) + b holds unconditionally. For a quadratic cost function g(X) = aX² + bX + c, E[g(X)] = aE(X²) + bE(X) + c—remember that E(X²) ≠ [E(X)]² unless Var(X) = 0!',
    illustrationI:
      'In PU Model Q6, X takes negative and positive values (−2 to 3) with weights p(x). The fulcrum where the distribution balances is E(X) = 0.8, and the rotational moment of inertia around 0.8 is Var(X) = 2.16.',
    applicationA:
      'Calculating expected maintenance cost E(C), expected RMS noise power E(V²) = σ² + μ², and risk variance in power engineering.',
    derivationDR: {
      title: 'Derivations (DR): Linearity of Expectation, Computational Variance & Scaling Law',
      goal: 'Prove: (i) E(aX + b) = aE(X) + b, (ii) Var(X) = E(X²) − [E(X)]², and (iii) Var(aX + b) = a²Var(X).',
      steps: [
        {
          step: 1,
          title: 'Linearity of Expectation (Discrete & Continuous)',
          equation: 'E(aX + b) = ∑(axᵢ + b)p(xᵢ) = a∑xᵢp(xᵢ) + b∑p(xᵢ) = a·E(X) + b·1 = aE(X) + b',
          note: 'Identical proof with ∫_{−∞}^{∞} (ax + b)f(x) dx = a∫xf(x)dx + b∫f(x)dx = aE(X) + b.',
        },
        {
          step: 2,
          title: 'Expand Variance Definition',
          equation: 'Var(X) = E[(X − μ)²] = E[X² − 2μX + μ²]',
          note: 'Apply linearity of expectation (since μ = E(X) is a constant):',
        },
        {
          step: 3,
          title: 'Computational Variance Formula',
          equation: 'Var(X) = E(X²) − 2μ·E(X) + μ² = E(X²) − 2μ² + μ² = E(X²) − [E(X)]²',
          note: 'Notice that E(X²) = Var(X) + μ² ≥ μ² always!',
        },
        {
          step: 4,
          title: 'Origin & Scale Law for Variance',
          equation: 'Let Y = aX + b ⇒ E(Y) = aμ + b ⇒ Y − E(Y) = a(X − μ)',
          note: 'Substitute into Var(Y) = E[(Y − E(Y))²]:',
        },
        {
          step: 5,
          title: 'Extract Constant Factor a²',
          equation: 'Var(aX + b) = E[a²(X − μ)²] = a²·E[(X − μ)²] = a²·Var(X)   ⇒   SD(aX + b) = |a|·SD(X)',
          note: 'Additive shift b cancels out completely; negative scale flips sign in E(Y) but squares to +a² in Var(Y).',
        },
      ],
      result: 'E(aX + b) = aE(X) + b;   Var(X) = E(X²) − [E(X)]²;   Var(aX + b) = a²Var(X);   SD(aX + b) = |a|SD(X).',
    },
    keyTakeawayN:
      'In Model Q6-type questions, always include a clean 4-column table: x | P(x) | x·P(x) | x²·P(x), then compute Var(X) = ∑x²P(x) − [∑xP(x)]².',
  },
];

export const CH4_FORMULA_SHEET: FormulaItem[] = [
  {
    id: 'ch4-f-pmf',
    category: 'Location',
    quantity: 'Discrete PMF Normalization',
    symbol: 'p(x)',
    formula: 'p(xᵢ) = P(X = xᵢ) ≥ 0   and   ∑ p(xᵢ) = 1',
    assumptionOrConstant: 'Sum runs over all discrete support points xᵢ',
    unit: 'Dimensionless ∈ [0, 1]',
  },
  {
    id: 'ch4-f-pdf',
    category: 'Location',
    quantity: 'Continuous PDF & Interval Probability',
    symbol: 'f(x)',
    formula: 'f(x) ≥ 0,   ∫_{−∞}^{∞} f(x) dx = 1,   P(a ≤ X ≤ b) = ∫_a^b f(x) dx',
    assumptionOrConstant: 'P(X = c) = 0; f(x) is density (can exceed 1)',
    unit: 'f(x): 1 / Unit(X)',
  },
  {
    id: 'ch4-f-cdf',
    category: 'Location',
    quantity: 'Cumulative Distribution Function (CDF)',
    symbol: 'F(x)',
    formula: 'F(x) = P(X ≤ x) = ∑_{xᵢ ≤ x} p(xᵢ)   or   ∫_{−∞}^x f(t) dt',
    assumptionOrConstant: '0 ≤ F(x) ≤ 1; non-decreasing; P(a < X ≤ b) = F(b) − F(a)',
    unit: 'Dimensionless ∈ [0, 1]',
  },
  {
    id: 'ch4-f-exp-d',
    category: 'Dispersion',
    quantity: 'Expected Value (Discrete)',
    symbol: 'E(X), μ',
    formula: 'E(X) = ∑ xᵢ · p(xᵢ);   E[g(X)] = ∑ g(xᵢ) · p(xᵢ)',
    assumptionOrConstant: 'Requires absolute convergence ∑|xᵢ|p(xᵢ) < ∞',
    unit: 'Same as X',
  },
  {
    id: 'ch4-f-exp-c',
    category: 'Dispersion',
    quantity: 'Expected Value (Continuous)',
    symbol: 'E(X), μ',
    formula: 'E(X) = ∫_{−∞}^{∞} x · f(x) dx;   E[g(X)] = ∫_{−∞}^{∞} g(x) · f(x) dx',
    assumptionOrConstant: 'Integral limits restrict to nonzero support of f(x)',
    unit: 'Same as X',
  },
  {
    id: 'ch4-f-var',
    category: 'Dispersion',
    quantity: 'Variance & Standard Deviation',
    symbol: 'Var(X), σ',
    formula: 'Var(X) = E[(X − μ)²] = E(X²) − [E(X)]²;   σ = √Var(X)',
    assumptionOrConstant: 'Always ≥ 0; E(X²) = ∑xᵢ²p(xᵢ) or ∫x²f(x)dx',
    unit: 'Var: (Unit X)²; σ: Unit X',
  },
  {
    id: 'ch4-f-lin-exp',
    category: 'Properties & Constants',
    quantity: 'Linearity of Expectation',
    symbol: 'E(aX + b)',
    formula: 'E(aX + b) = a·E(X) + b;   E(c) = c',
    assumptionOrConstant: 'Holds for any constants a, b, c ∈ ℝ',
    unit: 'Unit(aX + b)',
  },
  {
    id: 'ch4-f-lin-var',
    category: 'Properties & Constants',
    quantity: 'Linear Transformation of Variance & SD',
    symbol: 'Var(aX + b)',
    formula: 'Var(aX + b) = a²·Var(X);   SD(aX + b) = |a|·SD(X);   Var(c) = 0',
    assumptionOrConstant: 'Invariant to additive shift b; SD scales by |a| ≥ 0',
    unit: 'a²·(Unit X)² / |a|·Unit X',
  },
  {
    id: 'ch4-f-quad-exp',
    category: 'Properties & Constants',
    quantity: 'Quadratic Expectation & Second Moment',
    symbol: 'E(X²)',
    formula: 'E(aX² + bX + c) = a·E(X²) + b·E(X) + c,   where E(X²) = Var(X) + μ²',
    assumptionOrConstant: 'CRITICAL: E(X²) ≠ [E(X)]² unless Var(X) = 0',
    unit: 'Unit of g(X)',
  },
];

export const CH4_SOLVED_QUESTIONS: SolvedProblem[] = [
  {
    id: 'pu-model-q6',
    tag: 'PU Model Set · Group B, Q6',
    title: 'Unknown Constant k, Expected Value & Variance of Discrete RV X',
    marks: '5 Marks',
    source: 'Attached PDF — PU V Sem Final Exam 2024 Model Question, Page 8',
    statement:
      'A random variable X has the following probability distribution: Value of x = [-2, -1, 0, 1, 2, 3], P(x) = [0.1, k, 0.2, 2k, 0.3, k]. (i) Find the value of k. (ii) Find the expected value and variance of X.',
    given: [
      'Discrete random variable X with support {-2, -1, 0, 1, 2, 3}.',
      'Probability axioms require P(x) ≥ 0 for all x and ∑ P(x) = 1.',
    ],
    tableHeaders: ['x', 'P(x) [with k = 0.1]', 'x · P(x)', 'x²', 'x² · P(x)'],
    tableRows: [
      ['-2', '0.1', '-0.2', '4', '0.4'],
      ['-1', 'k = 0.1', '-0.1', '1', '0.1'],
      ['0', '0.2', '0.0', '0', '0.0'],
      ['1', '2k = 0.2', '0.2', '1', '0.2'],
      ['2', '0.3', '0.6', '4', '1.2'],
      ['3', 'k = 0.1', '0.3', '9', '0.9'],
    ],
    tableTotals: ['Total', '∑P(x) = 1.0', 'E(X) = 0.8', '—', 'E(X²) = 2.8'],
    steps: [
      {
        heading: 'Part (i): Find the Value of k Using Normalization ∑ P(x) = 1',
        work: [
          '0.1 + k + 0.2 + 2k + 0.3 + k = 1',
          '0.6 + 4k = 1  ⇒  4k = 0.4  ⇒  k = 0.1',
          'Verify all P(x) ≥ 0: [0.1, 0.1, 0.2, 0.2, 0.3, 0.1] ≥ 0 (Valid PMF!).',
        ],
      },
      {
        heading: 'Part (ii-a): Find the Expected Value E(X)',
        work: [
          'E(X) = ∑ x · P(x)',
          'E(X) = (−2)(0.1) + (−1)(0.1) + (0)(0.2) + (1)(0.2) + (2)(0.3) + (3)(0.1)',
          'E(X) = −0.2 − 0.1 + 0 + 0.2 + 0.6 + 0.3 = 0.8',
        ],
      },
      {
        heading: 'Part (ii-b): Find the Variance Var(X)',
        work: [
          'First compute E(X²) = ∑ x² · P(x):',
          'E(X²) = (−2)²(0.1) + (−1)²(0.1) + (0)²(0.2) + (1)²(0.2) + (2)²(0.3) + (3)²(0.1)',
          'E(X²) = 0.4 + 0.1 + 0 + 0.2 + 1.2 + 0.9 = 2.8',
          'Var(X) = E(X²) − [E(X)]² = 2.8 − (0.8)² = 2.8 − 0.64 = 2.16',
          '(Optional check: SD(X) = √2.16 ≈ 1.4697)',
        ],
      },
    ],
    finalAnswer: [
      '(i) k = 0.1',
      '(ii) Expected Value E(X) = 0.8   ·   Variance Var(X) = 2.16',
    ],
  },
  {
    id: 'ch4-extra-1',
    tag: 'Extra Exam-Level Numerical 1',
    title: 'Continuous PDF: Constant c, CDF F(x), Interval Probability, Mean & Variance',
    marks: '5–10 Marks Pattern',
    source: 'High-Yield PU Exam Practice (Continuous Random Variable & Expectation)',
    statement:
      'A continuous random variable X representing voltage surge duration (in ms) has PDF f(x) = c·x·(2 − x) for 0 ≤ x ≤ 2, and 0 otherwise. Find: (a) the constant c, (b) the cumulative distribution function F(x) and P(0.5 ≤ X ≤ 1.5), and (c) E(X), Var(X), and E(3X − 2).',
    given: [
      'Support of continuous RV X is [0, 2]; f(x) = c(2x − x²) on [0, 2], 0 elsewhere.',
      'Normalization condition: ∫_{−∞}^{∞} f(x) dx = 1.',
    ],
    steps: [
      {
        heading: 'Part (a): Find Constant c',
        work: [
          '∫₀² c(2x − x²) dx = 1  ⇒  c · [ x² − x³/3 ]₀² = 1',
          'c · (4 − 8/3) = 1  ⇒  (4/3)c = 1  ⇒  c = 3/4 = 0.75',
          'Since x(2 − x) ≥ 0 on [0, 2] and c > 0, f(x) ≥ 0 holds everywhere.',
        ],
      },
      {
        heading: 'Part (b): Derive CDF F(x) & Compute P(0.5 ≤ X ≤ 1.5)',
        work: [
          'For x < 0: F(x) = 0.   For x > 2: F(x) = 1.',
          'For 0 ≤ x ≤ 2: F(x) = ∫₀ˣ (3/4)(2t − t²) dt = (3/4)[ t² − t³/3 ]₀ˣ = (3/4)x² − (1/4)x³',
          'P(0.5 ≤ X ≤ 1.5) = F(1.5) − F(0.5)',
          'F(1.5) = 0.75(2.25) − 0.25(3.375) = 1.6875 − 0.84375 = 0.84375',
          'F(0.5) = 0.75(0.25) − 0.25(0.125) = 0.1875 − 0.03125 = 0.15625',
          'P(0.5 ≤ X ≤ 1.5) = 0.84375 − 0.15625 = 0.6875 (or 11/16)',
        ],
      },
      {
        heading: 'Part (c): Expected Value, Variance & Linear Function E(3X − 2)',
        work: [
          'E(X) = ∫₀² x · (3/4)(2x − x²) dx = (3/4) ∫₀² (2x² − x³) dx = (3/4)[ 2x³/3 − x⁴/4 ]₀² = (3/4)(16/3 − 4) = (3/4)(4/3) = 1.0 ms',
          'E(X²) = ∫₀² x² · (3/4)(2x − x²) dx = (3/4) ∫₀² (2x³ − x⁴) dx = (3/4)[ x⁴/2 − x⁵/5 ]₀² = (3/4)(8 − 32/5) = (3/4)(8/5) = 1.2 ms²',
          'Var(X) = E(X²) − [E(X)]² = 1.2 − (1.0)² = 0.2 ms²',
          'E(3X − 2) = 3·E(X) − 2 = 3(1.0) − 2 = 1.0   (and Var(3X − 2) = 3²·Var(X) = 1.8)',
        ],
      },
    ],
    finalAnswer: [
      '(a) c = 3/4 = 0.75',
      '(b) F(x) = (3/4)x² − (1/4)x³ on [0, 2] · P(0.5 ≤ X ≤ 1.5) = 0.6875 (11/16)',
      '(c) E(X) = 1.0 ms · Var(X) = 0.2 ms² · E(3X − 2) = 1.0',
    ],
  },
  {
    id: 'ch4-extra-2',
    tag: 'Extra Exam-Level Numerical 2',
    title: 'Substation Capacitor Failures: CDF, Moments & Quadratic Maintenance Cost E(C)',
    marks: '5 Marks Pattern',
    source: 'High-Yield PU Exam Practice (Discrete CDF & Nonlinear Expectation)',
    statement:
      'A discrete random variable X denotes the daily number of capacitor failures in a substation with PMF: x = [0, 1, 2, 3], P(X = x) = [k, 3k, 5k, k]. (a) Find k and the CDF F(x). (b) Compute E(X), E(X²), Var(X), and SD(X). (c) If daily maintenance cost is C = 500 + 200X + 50X² (Rs.), find E(C).',
    given: [
      'Support of X: {0, 1, 2, 3} with weights k, 3k, 5k, k.',
      'Cost equation: C = g(X) = 500 + 200X + 50X².',
    ],
    tableHeaders: ['x', 'P(X = x)', 'CDF F(x)', 'x · P(x)', 'x² · P(x)'],
    tableRows: [
      ['0', '0.1', '0.1', '0.0', '0.0'],
      ['1', '0.3', '0.4', '0.3', '0.3'],
      ['2', '0.5', '0.9', '1.0', '2.0'],
      ['3', '0.1', '1.0', '0.3', '0.9'],
    ],
    tableTotals: ['Total', '∑P(x) = 1.0', '—', 'E(X) = 1.6', 'E(X²) = 3.2'],
    steps: [
      {
        heading: 'Part (a): Determine k & Construct Step CDF F(x)',
        work: [
          'k + 3k + 5k + k = 1  ⇒  10k = 1  ⇒  k = 0.1',
          'CDF F(x): 0 (x < 0);  0.1 (0 ≤ x < 1);  0.4 (1 ≤ x < 2);  0.9 (2 ≤ x < 3);  1.0 (x ≥ 3).',
        ],
      },
      {
        heading: 'Part (b): Compute E(X), E(X²), Var(X) & SD(X)',
        work: [
          'E(X) = 0(0.1) + 1(0.3) + 2(0.5) + 3(0.1) = 1.6 failures/day',
          'E(X²) = 0(0.1) + 1(0.3) + 4(0.5) + 9(0.1) = 3.2 (failures/day)²',
          'Var(X) = E(X²) − [E(X)]² = 3.2 − (1.6)² = 3.2 − 2.56 = 0.64 (failures/day)²',
          'SD(X) = √0.64 = 0.8 failures/day',
        ],
      },
      {
        heading: 'Part (c): Expected Daily Maintenance Cost E(C)',
        work: [
          'Apply linearity of expectation term-by-term (use E(X²) = 3.2, NOT [E(X)]²!):',
          'E(C) = E(500 + 200X + 50X²) = 500 + 200·E(X) + 50·E(X²)',
          'E(C) = 500 + 200(1.6) + 50(3.2) = 500 + 320 + 160 = Rs. 980',
        ],
      },
    ],
    finalAnswer: [
      '(a) k = 0.1',
      '(b) E(X) = 1.6 · E(X²) = 3.2 · Var(X) = 0.64 · SD(X) = 0.8 failures/day',
      '(c) Expected Daily Cost E(C) = Rs. 980',
    ],
  },
];

export const CH4_EXAM_TRAPS: ExamTrap[] = [
  {
    id: 'ch4-trap-sign-1',
    category: 'Sign Convention',
    title: 'Negative Support Values in x²·P(x) (PU Model Q6 Trap)',
    wrongApproach: 'Writing (−2)² = −4 or (−1)² = −1 when computing E(X²) in Model Q6, yielding E(X²) < [E(X)]² and negative variance.',
    correctRule: 'Squaring a negative value ALWAYS yields a positive number: (−2)² = +4 and (−1)² = +1. Keep negative signs in x·P(x) for E(X), and make x² strictly positive in E(X²).',
    examTip: 'Remember: Var(X) ≥ 0 ALWAYS! If your subtraction E(X²) − [E(X)]² gives a negative number, immediately inspect negative x rows.',
  },
  {
    id: 'ch4-trap-sign-2',
    category: 'Sign Convention',
    title: 'Linear Scaling Sign on SD(aX + b) vs. E(aX + b)',
    wrongApproach: 'Writing SD(−2X + 5) = −2·SD(X) or Var(−2X + 5) = −4·Var(X).',
    correctRule: 'E(aX + b) = aE(X) + b preserves the sign of a and keeps +b. Variance squares a and drops b: Var(aX + b) = a²Var(X) ≥ 0, so SD(aX + b) = |a|·SD(X) ≥ 0.',
    examTip: 'Watch out for negative coefficients like Y = 10 − 3X in short theory/numerical questions.',
  },
  {
    id: 'ch4-trap-sign-3',
    category: 'Sign Convention',
    title: 'Substituting [E(X)]² Instead of E(X²) Into E(aX² + bX + c)',
    wrongApproach: 'Computing E(X²) as [E(X)]², which underestimates E(X²) by exactly Var(X).',
    correctRule: 'Always compute E(X²) = ∑x²p(x) or ∫x²f(x)dx directly (or use E(X²) = Var(X) + [E(X)]²).',
    examTip: 'By Jensen’s inequality, E(X²) > [E(X)]² for any non-constant random variable.',
  },
  {
    id: 'ch4-trap-geom-1',
    category: 'Boundary & Slope Geometry',
    title: 'Discrete Strict vs. Inclusive Inequality Boundaries (P(X < 2) vs. P(X ≤ 2))',
    wrongApproach: 'Treating P(1 < X < 3) as F(3) − F(1) for a discrete RV, or forgetting that P(X = c) > 0 for discrete RVs.',
    correctRule: 'For continuous RVs, endpoints have zero probability so ≤ and < give the exact same integral. For discrete RVs, list the exact integer points inside the interval: P(1 < X < 3) = P(X = 2), whereas P(1 ≤ X ≤ 3) = P(1) + P(2) + P(3).',
    examTip: 'Write out the included x values explicitly before summing.',
  },
  {
    id: 'ch4-trap-geom-2',
    category: 'Boundary & Slope Geometry',
    title: 'Wrong Integration Limits / Rejecting Negative k or c Roots',
    wrongApproach: 'Integrating f(x) from −∞ to +∞ literally without restricting to the nonzero support [a, b], or accepting a quadratic root k that makes f(x) < 0.',
    correctRule: 'Split ∫_{−∞}^{∞} into piecewise supports where f(x) ≠ 0, and verify BOTH normalization (∫f(x)dx = 1) AND non-negativity (f(x) ≥ 0 for all x).',
    examTip: 'Also remember f(x) is a density, so f(x) > 1 is completely legal if the interval width is narrow!',
  },
  {
    id: 'ch4-trap-geom-3',
    category: 'Boundary & Slope Geometry',
    title: 'Missing the Extra x Factor in Continuous E(X) and E(X²)',
    wrongApproach: 'Integrating ∫ f(x) dx instead of ∫ x·f(x) dx for E(X), or forgetting to differentiate CDF F(x) before integrating x·f(x) dx.',
    correctRule: 'If given CDF F(x), differentiate first to obtain PDF f(x) = F′(x), then integrate ∫ x·f(x) dx for E(X) and ∫ x²·f(x) dx for E(X²).',
    examTip: 'Check symmetry! If f(x) is symmetric about x = m on [a, b], E(X) = m immediately.',
  },
  {
    id: 'ch4-trap-pu-1',
    category: 'High-Yield PU Topic',
    title: 'Model Q6 (5 Marks): Find k, E(X) & Var(X) From Discrete Distribution Table',
    wrongApproach: 'Finding k correctly and computing E(X), then forgetting to square x in E(X²) or stopping at E(X²) without subtracting [E(X)]².',
    correctRule: 'Show all 4 steps clearly: (1) ∑P(x) = 1 ⇒ k, (2) E(X) = ∑xP(x), (3) E(X²) = ∑x²P(x), (4) Var(X) = E(X²) − [E(X)]².',
    examTip: 'Unit 4 is worth 5/60 marks in PU—this exact 5-mark discrete table question is the most frequent Unit 4 exam problem.',
  },
  {
    id: 'ch4-trap-pu-2',
    category: 'High-Yield PU Topic',
    title: 'Continuous PDF Constant c, CDF F(x) & Interval Probability',
    wrongApproach: 'Forgetting to specify the piecewise bounds x < a (F=0) and x > b (F=1) when writing out F(x).',
    correctRule: 'Always define F(x) in all 3 regions (below support, inside support, above support) and verify F(a) = 0 and F(b) = 1.',
    examTip: 'Checking F(upper limit) = 1 catches 99% of integration arithmetic slips.',
  },
];
