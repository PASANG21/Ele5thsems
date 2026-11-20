import { DepthCode, ExamTrap, FormulaItem, SolvedProblem, SubtopicNote } from './chapter1Content';

export const CH5_SYLLABUS_CONTEXT = {
  university: 'Purbanchal University — Faculty of Engineering, Biratnagar, Nepal',
  program: 'B.E. Biomedical / Electrical / Electronics, Com. & Automation Engineering',
  semester: 'Year III · Semester V (Effective from 2021 / 2078 Batch)',
  subject: 'Probability and Statistics',
  chapter: 'Unit 5: Discrete Probability Distributions',
  lectureHours: '5 Hrs',
  finalMarks: 5,
  totalSubjectMarks: '60 Final Theory + 20 Internal Theory + 20 Practical = 100',
  syllabusTopics: [
    'Binomial distribution: conditions for using binomial distribution, properties (without proof in detailed contents), computing binomial probabilities, fitting of binomial distribution',
    'Poisson distribution: conditions for using poisson distribution, properties (without proof in detailed contents), computing poisson probabilities, fitting of poisson distribution',
  ],
  microSyllabusNote:
    'In the attached PU 5th Semester syllabus PDF, Probability & Statistics (pp. 3–5) allocates 5/60 final exam marks to Unit 5 (Model Q7 on pp. 8–9) and marks Binomial & Poisson properties as "(without proof)" in Detailed Course Contents. Below, every subtopic is covered across SD, D, DR, I, E, A, and N—including full step-by-step derivations of Mean, Variance, and the Binomial → Poisson limit for complete exam mastery.',
};

export const CH5_SUBTOPIC_NOTES: SubtopicNote[] = [
  {
    id: 'ch5-sub-1',
    code: '5.1',
    title: 'Binomial Distribution: Conditions, Properties & Probability Computation',
    depths: ['SD', 'D', 'DR', 'I', 'E', 'A', 'N'] as DepthCode[],
    definitionSD:
      'A discrete random variable X follows a Binomial Distribution B(n, p) if it counts the number of successes in n independent Bernoulli trials, each with constant success probability p (and failure probability q = 1 − p). Its PMF is P(X = x) = ⁿC_x · pˣ · qⁿ⁻ˣ for x = 0, 1, …, n.',
    descriptionD:
      'Four Conditions for Using Binomial Distribution: (1) Fixed, finite number of trials n; (2) Only two mutually exclusive outcomes per trial ("Success" or "Failure"); (3) Constant probability of success p across every trial; (4) Trials are statistically independent (sampling with replacement, or from an infinite/large batch).',
    explanationE:
      'Key Properties (marked without proof in PU Detailed Contents): Mean μ = np; Variance σ² = npq; Standard Deviation σ = √(npq); Mean is ALWAYS strictly greater than Variance (np > npq whenever 0 < p < 1); Symmetry holds iff p = 0.5 (skewed right if p < 0.5, skewed left if p > 0.5); Mode is the integer part ⌊(n+1)p⌋ (or bimodal at (n+1)p and (n+1)p − 1 if (n+1)p is an exact integer); Sum of independent Binomials with common p is Binomial: X₁ + X₂ ~ B(n₁ + n₂, p).',
    illustrationI:
      'In PU Model Q7, inspecting a box of n = 10 electronic components where each component is independently defective with p = 0.01 gives X ~ B(10, 0.01) with mean μ = 0.10 defectives/box and variance σ² = 0.099.',
    applicationA:
      'Lot acceptance sampling in electronics manufacturing, bit-error counts in fixed-length digital frames, and redundant component failure counts.',
    derivationDR: {
      title: 'Derivation (DR): Mean μ = np and Variance σ² = npq of Binomial Distribution',
      goal: 'Prove E(X) = np and Var(X) = npq directly from P(X = x) = ⁿC_x pˣ qⁿ⁻ˣ (note: marked without proof in PU Detailed Contents).',
      steps: [
        {
          step: 1,
          title: 'Derive Mean E(X) = np',
          equation: 'E(X) = ∑_{x=0}^n x · [ n! / (x!(n − x)!) ] pˣ qⁿ⁻ˣ = ∑_{x=1}^n [ n(n−1)! / ((x−1)!(n−x)!) ] p · pˣ⁻¹ qⁿ⁻ˣ',
          note: 'The x = 0 term is zero. Factor out n·p and re-index k = x − 1 (from 0 to n − 1):',
        },
        {
          step: 2,
          title: 'Collapse Remaining Binomial Sum to (p + q)ⁿ⁻¹ = 1',
          equation: 'E(X) = np ∑_{k=0}^{n−1} ⁿ⁻¹C_k pᵏ q⁽ⁿ⁻¹⁾⁻ᵏ = np · (p + q)ⁿ⁻¹ = np · 1 = np',
          note: 'Since p + q = 1.',
        },
        {
          step: 3,
          title: 'Compute Factorial Moment E[X(X − 1)]',
          equation: 'E[X(X − 1)] = ∑_{x=2}^n x(x−1) ⁿC_x pˣ qⁿ⁻ˣ = n(n−1)p² ∑_{x=2}^n ⁿ⁻²C_{x−2} pˣ⁻² qⁿ⁻ˣ = n(n−1)p² (p + q)ⁿ⁻² = n(n−1)p²',
          note: 'Recall E(X²) = E[X(X − 1)] + E(X) = n(n − 1)p² + np = n²p² − np² + np.',
        },
        {
          step: 4,
          title: 'Compute Variance Var(X) = E(X²) − [E(X)]²',
          equation: 'Var(X) = (n²p² − np² + np) − (np)² = np(1 − p) = npq',
          note: 'Since q = 1 − p < 1 for 0 < p < 1, Variance npq < Mean np always!',
        },
      ],
      result: 'μ = np,   σ² = npq,   σ = √(npq),   and   μ > σ².',
    },
    keyTakeawayN:
      'For "at least 2" (P(X ≥ 2)), ALWAYS use the complement 1 − [P(0) + P(1)] rather than summing x = 2 through n.',
  },
  {
    id: 'ch5-sub-2',
    code: '5.2',
    title: 'Fitting of Binomial Distribution',
    depths: ['SD', 'D', 'I', 'E', 'A', 'N'] as DepthCode[],
    definitionSD:
      'Fitting a Binomial Distribution means calculating theoretical expected frequencies E_x = N · P(X = x) = N · ⁿC_x pˣ qⁿ⁻ˣ across x = 0, 1, …, n for N repeated sets of n trials, and comparing them against observed frequencies O_x.',
    descriptionD:
      'There are two cases: (1) p is known theoretically (e.g., p = 0.5 for a fair coin/bit); (2) p is unknown, so we estimate it from sample mean x̄ = (∑fᵢxᵢ)/N by equating x̄ = n·p̂ ⇒ p̂ = x̄ / n and q̂ = 1 − p̂.',
    explanationE:
      'To avoid repeated power calculations in an exam, compute E₀ = N·qⁿ first, then use the Binomial Recurrence Relation: P(x + 1) = [(n − x) / (x + 1)] · (p / q) · P(x). Always verify ∑E_x = N.',
    illustrationI:
      'In 250 batches of 5 relays with sample mean x̄ = 2.00, we obtain p̂ = 2.00/5 = 0.40, E₀ = 250(0.6)⁵ = 19.44, and recur upward cleanly.',
    applicationA:
      'Testing whether observed defect counts per batch follow random independent manufacturing variation (later tested formally with Chi-square goodness-of-fit in Unit 8).',
    keyTakeawayN:
      'Remember n is the maximum count of successes per batch (e.g., 5), whereas N is the total number of batches (e.g., 250)—never confuse n with N!',
  },
  {
    id: 'ch5-sub-3',
    code: '5.3',
    title: 'Poisson Distribution: Conditions, Properties & Binomial Limit',
    depths: ['SD', 'D', 'DR', 'I', 'E', 'A', 'N'] as DepthCode[],
    definitionSD:
      'A discrete random variable X follows a Poisson Distribution P(λ) if it counts random events occurring independently at a constant average rate λ > 0 over a fixed interval of time, length, or area. Its PMF is P(X = x) = (e⁻λ · λˣ) / x! for x = 0, 1, 2, …',
    descriptionD:
      'Conditions for Using Poisson Distribution: (1) Rare-event limit of Binomial: number of trials n is very large (n → ∞, practically n ≥ 20), probability of occurrence p is very small (p → 0, practically p ≤ 0.05), and product np = λ remains finite constant; (2) Events occur independently in non-overlapping intervals; (3) Probability of two or more simultaneous events in an infinitesimal interval Δt is negligible.',
    explanationE:
      'Key Properties (marked without proof in PU Detailed Contents): Mean μ = λ; Variance σ² = λ (UNIQUE hallmark: Mean = Variance = λ!); Standard Deviation σ = √λ; Positively skewed (skewness = 1/√λ → 0 as λ increases); Unimodal at ⌊λ⌋ (or bimodal at λ − 1 and λ if λ is an integer); Reproductive property: sum of independent Poissons X₁ + X₂ ~ P(λ₁ + λ₂).',
    illustrationI:
      'Incoming telephone calls per minute at an exchange, transient voltage spikes per hour, or printing typos per page—where you can count how many events occurred, but cannot count how many "non-events" did not occur.',
    applicationA:
      'Modeling call-center arrival rates, substation lightning/switching surges, radioactive decay counts, and approximating rare Binomial defect probabilities when n is large.',
    derivationDR: {
      title: 'Derivation (DR): Poisson Limit from Binomial & Proof that Mean = Variance = λ',
      goal: 'Derive P(X = x) = e⁻λ λˣ / x! as n → ∞, p → 0 with np = λ, and prove E(X) = Var(X) = λ.',
      steps: [
        {
          step: 1,
          title: 'Substitute p = λ/n into Binomial PMF',
          equation: 'P(X = x) = [ n(n−1)…(n−x+1) / x! ] · (λ/n)ˣ · (1 − λ/n)ⁿ⁻ˣ',
          note: 'Group the nˣ denominator with the x factors in the numerator:',
        },
        {
          step: 2,
          title: 'Take Limit as n → ∞ with Fixed x and λ',
          equation: 'lim_{n→∞} [ 1·(1 − 1/n)…(1 − (x−1)/n) ] · (λˣ / x!) · (1 − λ/n)ⁿ · (1 − λ/n)⁻ˣ = 1 · (λˣ / x!) · e⁻λ · 1',
          note: 'Using lim_{n→∞}(1 − λ/n)ⁿ = e⁻λ yields P(X = x) = e⁻λ λˣ / x!.',
        },
        {
          step: 3,
          title: 'Derive Mean E(X) = λ',
          equation: 'E(X) = ∑_{x=1}^∞ x · (e⁻λ λˣ / x!) = λ·e⁻λ ∑_{x=1}^∞ λˣ⁻¹ / (x − 1)! = λ·e⁻λ · e^λ = λ',
          note: 'Since Taylor series ∑_{k=0}^∞ λᵏ/k! = e^λ.',
        },
        {
          step: 4,
          title: 'Derive Variance Var(X) = λ',
          equation: 'E[X(X − 1)] = ∑_{x=2}^∞ x(x−1)(e⁻λ λˣ / x!) = λ²e⁻λ ∑_{k=0}^∞ (λᵏ/k!) = λ² ⇒ E(X²) = λ² + λ ⇒ Var(X) = (λ² + λ) − λ² = λ',
          note: 'Thus Mean = Variance = λ identically!',
        },
      ],
      result: 'P(X = x) = (e⁻λ λˣ) / x!;   μ = λ,   σ² = λ,   σ = √λ.',
    },
    keyTakeawayN:
      'Always use the Poisson recurrence P(x + 1) = [λ / (x + 1)] · P(x) starting from P(0) = e⁻λ to avoid rounding drift and large factorials.',
  },
  {
    id: 'ch5-sub-4',
    code: '5.4',
    title: 'Fitting of Poisson Distribution',
    depths: ['SD', 'D', 'I', 'E', 'A', 'N'] as DepthCode[],
    definitionSD:
      'Fitting a Poisson Distribution computes expected frequencies E_x = N · (e⁻λ λˣ / x!) for x = 0, 1, 2, … across N total observed intervals/units using λ̂ = x̄ = (∑fᵢxᵢ)/N.',
    descriptionD:
      'Because Poisson has only one parameter λ, fitting requires: (1) Compute sample mean x̄ = ∑fᵢxᵢ / N and set λ̂ = x̄; (2) Compute P(0) = e⁻λ̂; (3) Apply recurrence P(x + 1) = [λ̂ / (x + 1)]·P(x) or E_{x+1} = [λ̂ / (x + 1)]·E_x; (4) Round E_x and check total ∑E_x ≈ N.',
    explanationE:
      'Remember that the Poisson support theoretically extends to ∞, so the tail probability P(X ≥ k) absorbs any tiny residual beyond the last table bin.',
    illustrationI:
      'For 200 substation shifts with x̄ = 0.90 spikes/hour, E₀ = 200·e⁻⁰·⁹ = 81.31, E₁ = 0.9×81.31 = 73.18, E₂ = (0.9/2)×73.18 = 32.93, etc.',
    applicationA:
      'Testing whether substation transients, network packet arrivals, or exchange call counts (as in Unit 1 Model Q4!) follow a pure Poisson process.',
    keyTakeawayN:
      'Quick diagnostic before fitting: if sample variance s² ≈ sample mean x̄, Poisson fits well; if s² < x̄, try Binomial; if s² > x̄, distribution is overdispersed.',
  },
];

export const CH5_FORMULA_SHEET: FormulaItem[] = [
  {
    id: 'ch5-f-binom-pmf',
    category: 'Location',
    quantity: 'Binomial PMF',
    symbol: 'B(n, p)',
    formula: 'P(X = x) = ⁿC_x · pˣ · qⁿ⁻ˣ,   x = 0, 1, …, n',
    assumptionOrConstant: 'Fixed n trials; independent Bernoulli; constant p; q = 1 − p',
    unit: 'Dimensionless ∈ [0, 1]',
  },
  {
    id: 'ch5-f-binom-mv',
    category: 'Location',
    quantity: 'Binomial Mean, Variance & Mode',
    symbol: 'μ, σ², M_o',
    formula: 'μ = np;   σ² = npq;   σ = √(npq);   M_o = ⌊(n + 1)p⌋',
    assumptionOrConstant: 'Always μ > σ² (since q < 1); symmetric iff p = 0.5',
    unit: 'μ, M_o: count; σ²: count²',
  },
  {
    id: 'ch5-f-binom-rec',
    category: 'Location',
    quantity: 'Binomial Recurrence & Fitting',
    symbol: 'E_x',
    formula: 'E_x = N · P(X = x);   P(x + 1) = [ (n − x)/(x + 1) ] · (p / q) · P(x)',
    assumptionOrConstant: 'Estimate p̂ = x̄ / n when p unknown; verify ∑E_x = N',
    unit: 'Expected frequency (count)',
  },
  {
    id: 'ch5-f-pois-pmf',
    category: 'Dispersion',
    quantity: 'Poisson PMF',
    symbol: 'P(λ)',
    formula: 'P(X = x) = (e⁻λ · λˣ) / x!,   x = 0, 1, 2, …',
    assumptionOrConstant: 'e ≈ 2.7182818; rare independent events at constant rate λ > 0',
    unit: 'Dimensionless ∈ [0, 1]',
  },
  {
    id: 'ch5-f-pois-mv',
    category: 'Dispersion',
    quantity: 'Poisson Mean, Variance & Mode',
    symbol: 'μ, σ², M_o',
    formula: 'μ = λ;   σ² = λ;   σ = √λ;   M_o = ⌊λ⌋',
    assumptionOrConstant: 'Hallmark property: Mean = Variance = λ; bimodal at λ−1, λ if λ ∈ ℤ⁺',
    unit: 'μ, M_o: count; σ²: count²',
  },
  {
    id: 'ch5-f-pois-rec',
    category: 'Dispersion',
    quantity: 'Poisson Recurrence & Fitting',
    symbol: 'E_x',
    formula: 'E₀ = N · e⁻λ̂;   E_{x+1} = [ λ̂ / (x + 1) ] · E_x   (λ̂ = x̄)',
    assumptionOrConstant: 'Scale rate linearly for time/area changes: λ_new = rate × interval',
    unit: 'Expected frequency (count)',
  },
  {
    id: 'ch5-f-pois-approx',
    category: 'Properties & Constants',
    quantity: 'Poisson Approximation to Binomial',
    symbol: 'B(n, p) → P(λ)',
    formula: 'λ = n · p   when n is large (n ≥ 20) and p is small (p ≤ 0.05)',
    assumptionOrConstant: 'Standard rule of thumb: np ≤ 5 (or n ≥ 20, p ≤ 0.05)',
    unit: 'λ: expected count',
  },
  {
    id: 'ch5-f-reprod',
    category: 'Properties & Constants',
    quantity: 'Additive Reproductive Properties',
    symbol: 'X₁ + X₂',
    formula: 'Binomial (same p): B(n₁ + n₂, p);   Poisson: P(λ₁ + λ₂)',
    assumptionOrConstant: 'Requires X₁ and X₂ to be independent random variables',
    unit: 'Count',
  },
];

export const CH5_SOLVED_QUESTIONS: SolvedProblem[] = [
  {
    id: 'pu-model-q7',
    tag: 'PU Model Set · Group B, Q7',
    title: 'Binomial Probabilities: Defective Components in Boxes of 10',
    marks: '5 Marks',
    source: 'Attached PDF — PU V Sem Final Exam 2024 Model Question, Pages 8–9',
    statement:
      'A factory produces components of which 1% are defective. The components are packed in boxes of 10. A box is selected at random. (a) Find the probability that the box contains exactly one defective component. (b) Find the probability that there are at least 2 defective components in the box.',
    given: [
      'Let X = number of defective components in a randomly selected box of n = 10 components.',
      'Probability of defective component: p = 1% = 0.01  ⇒  q = 1 − p = 0.99.',
      'Since n = 10 is finite and components are independent, X ~ Binomial(n = 10, p = 0.01).',
      'PMF: P(X = x) = ¹⁰C_x · (0.01)ˣ · (0.99)¹⁰⁻ˣ,   x = 0, 1, …, 10.',
    ],
    steps: [
      {
        heading: 'Part (a): Probability of Exactly One Defective Component P(X = 1)',
        work: [
          'P(X = 1) = ¹⁰C₁ · (0.01)¹ · (0.99)⁹',
          '¹⁰C₁ = 10,   (0.01)¹ = 0.01,   (0.99)⁹ = 0.91351725',
          'P(X = 1) = 10 × 0.01 × 0.91351725 = 0.091352 ≈ 0.0914 (9.14%)',
        ],
      },
      {
        heading: 'Part (b): Probability of At Least 2 Defective Components P(X ≥ 2)',
        work: [
          'Use the complement rule to avoid summing x = 2 through 10:',
          'P(X ≥ 2) = 1 − P(X < 2) = 1 − [ P(X = 0) + P(X = 1) ]',
          'P(X = 0) = ¹⁰C₀ · (0.01)⁰ · (0.99)¹⁰ = 1 × 1 × 0.90438207 = 0.904382',
          'P(X ≤ 1) = 0.904382 + 0.091352 = 0.995734',
          'P(X ≥ 2) = 1 − 0.995734 = 0.004266 ≈ 0.0043 (0.43%)',
          '(Note: Poisson approximation with λ = np = 0.1 gives P(1) = 0.0905 and P(X ≥ 2) = 0.0047; exact Binomial is preferred since n = 10 < 20.)',
        ],
      },
    ],
    finalAnswer: [
      '(a) P(exactly 1 defective) = 0.0914 (9.14%)',
      '(b) P(at least 2 defectives) = 0.0043 (0.43%)',
    ],
  },
  {
    id: 'ch5-extra-1',
    tag: 'Extra Exam-Level Numerical 1',
    title: 'Fitting a Binomial Distribution to 250 Batches of 5 Relays',
    marks: '5–10 Marks Pattern',
    source: 'High-Yield PU Exam Practice (Fitting of Binomial Distribution)',
    statement:
      'In an inspection of N = 250 batches of n = 5 relays each, the number of tripped relays X per batch was recorded as: x = [0, 1, 2, 3, 4, 5], Observed Frequency O = [24, 62, 84, 54, 22, 4]. (a) Estimate the parameter p from the sample mean. (b) Fit a Binomial distribution and compute all expected frequencies.',
    given: [
      'Number of trials per batch: n = 5; Total batches: N = 250.',
      'Observed frequencies O: [24, 62, 84, 54, 22, 4] (sum = 250).',
    ],
    tableHeaders: ['x', 'Obs. Freq (O)', 'O · x', 'Binomial P(X = x)', 'Expected E_x = 250·P(x)', 'Rounded E_x'],
    tableRows: [
      ['0', '24', '0', '1·(0.6)⁵ = 0.07776', '19.44', '19'],
      ['1', '62', '62', '5·(0.4)(0.6)⁴ = 0.25920', '64.80', '65'],
      ['2', '84', '168', '10·(0.4)²(0.6)³ = 0.34560', '86.40', '86'],
      ['3', '54', '162', '10·(0.4)³(0.6)² = 0.23040', '57.60', '58'],
      ['4', '22', '88', '5·(0.4)⁴(0.6) = 0.07680', '19.20', '19'],
      ['5', '4', '20', '1·(0.4)⁵ = 0.01024', '2.56', '3'],
    ],
    tableTotals: ['Total', 'N = 250', '∑Ox = 500', '∑P(x) = 1.00000', '∑E_x = 250.00', '∑ = 250'],
    steps: [
      {
        heading: 'Part (a): Estimate p̂ From Sample Mean x̄ = np̂',
        work: [
          'x̄ = ∑(O · x) / N = (0 + 62 + 168 + 162 + 88 + 20) / 250 = 500 / 250 = 2.00',
          'Equate to Binomial mean n·p̂ = 2.00  ⇒  5·p̂ = 2.00  ⇒  p̂ = 0.40,   q̂ = 1 − 0.40 = 0.60',
        ],
      },
      {
        heading: 'Part (b): Compute Expected Frequencies Using Binomial Recurrence',
        work: [
          'E₀ = 250 · (0.60)⁵ = 250 × 0.07776 = 19.44 ≈ 19',
          'Recurrence ratio: p̂ / q̂ = 0.40 / 0.60 = 2/3, so E_{x+1} = [(5 − x)/(x + 1)] · (2/3) · E_x:',
          'E₁ = (5/1)(2/3)(19.44) = 64.80 ≈ 65;   E₂ = (4/2)(2/3)(64.80) = 86.40 ≈ 86',
          'E₃ = (3/3)(2/3)(86.40) = 57.60 ≈ 58;   E₄ = (2/4)(2/3)(57.60) = 19.20 ≈ 19;   E₅ = (1/5)(2/3)(19.20) = 2.56 ≈ 3',
        ],
      },
    ],
    finalAnswer: [
      '(a) Estimated probability p̂ = 0.40 (with x̄ = 2.00)',
      '(b) Fitted Binomial expected frequencies: [19, 65, 86, 58, 19, 3] (sum = 250)',
    ],
  },
  {
    id: 'ch5-extra-2',
    tag: 'Extra Exam-Level Numerical 2',
    title: 'Fitting a Poisson Distribution & Substation Transient Spike Probabilities',
    marks: '5–10 Marks Pattern',
    source: 'High-Yield PU Exam Practice (Poisson Fitting & Probability Calculation)',
    statement:
      'A power substation records transient voltage spikes over N = 200 one-hour shifts: No. of spikes x = [0, 1, 2, 3, 4], Observed Shifts O = [82, 72, 34, 8, 4]. (a) Estimate the Poisson parameter λ and fit the expected Poisson frequencies. (b) Using this Poisson model, find the probability that a randomly chosen hour experiences (i) no spikes, and (ii) at least 2 spikes.',
    given: [
      'Total shifts N = 200.',
      'Observed frequencies O: [82, 72, 34, 8, 4] (∑O = 200).',
    ],
    tableHeaders: ['Spikes (x)', 'Obs. Shifts (O)', 'O · x', 'Poisson P(X = x)', 'Expected E_x = 200·P(x)', 'Rounded E_x'],
    tableRows: [
      ['0', '82', '0', 'e⁻⁰·⁹ = 0.40657', '81.31', '81'],
      ['1', '72', '72', '0.9 × 0.40657 = 0.36591', '73.18', '73'],
      ['2', '34', '68', '(0.9/2) × 0.36591 = 0.16466', '32.93', '33'],
      ['3', '8', '24', '(0.9/3) × 0.16466 = 0.04940', '9.88', '10'],
      ['4', '4', '16', '(0.9/4) × 0.04940 = 0.01111', '2.22', '2'],
      ['≥ 5 (tail)', '0', '0', '1 − 0.99765 = 0.00235', '0.47', '1'],
    ],
    tableTotals: ['Total', 'N = 200', '∑Ox = 180', '∑P(x) = 1.00000', '∑E_x = 200.00', '∑ = 200'],
    steps: [
      {
        heading: 'Part (a): Estimate λ̂ = x̄ & Compute Fitted Frequencies via Recurrence',
        work: [
          'λ̂ = x̄ = ∑(O · x) / N = (0 + 72 + 68 + 24 + 16) / 200 = 180 / 200 = 0.90 spikes/hour',
          'P(0) = e⁻⁰·⁹ = 0.40657  ⇒  E₀ = 200 × 0.40657 = 81.31 ≈ 81',
          'Use Poisson recurrence E_{x+1} = [λ̂ / (x + 1)] · E_x:',
          'E₁ = (0.9/1)(81.31) = 73.18 ≈ 73;   E₂ = (0.9/2)(73.18) = 32.93 ≈ 33;   E₃ = (0.9/3)(32.93) = 9.88 ≈ 10;   E₄ = (0.9/4)(9.88) = 2.22 ≈ 2',
          'Tail (x ≥ 5): E_{≥5} = 200 − 199.53 = 0.47 ≈ 1',
        ],
      },
      {
        heading: 'Part (b): Compute Hourly Spike Probabilities',
        work: [
          '(i) P(no spikes) = P(X = 0) = e⁻⁰·⁹ = 0.4066 (40.66%)',
          '(ii) P(at least 2 spikes) = P(X ≥ 2) = 1 − [ P(0) + P(1) ] = 1 − (0.40657 + 0.36591) = 1 − 0.77248 = 0.2275 (22.75%)',
        ],
      },
    ],
    finalAnswer: [
      '(a) λ̂ = 0.90 spikes/hr · Fitted Poisson frequencies: [81, 73, 33, 10, 2, (≥5: 1)]',
      '(b) (i) P(X = 0) = 0.4066 (40.66%) · (ii) P(X ≥ 2) = 0.2275 (22.75%)',
    ],
  },
];

export const CH5_EXAM_TRAPS: ExamTrap[] = [
  {
    id: 'ch5-trap-sign-1',
    category: 'Sign Convention',
    title: 'Confusing n (Trials per Batch) with N (Number of Batches) During Fitting',
    wrongApproach: 'Computing p̂ = x̄ / N instead of p̂ = x̄ / n, or multiplying P(X = x) by n instead of N.',
    correctRule: 'n is the number of Bernoulli trials in ONE experiment (max x value); N is the total frequency ∑O_x. Always compute p̂ = x̄ / n and E_x = N · P(X = x).',
    examTip: 'Check that 0 ≤ p̂ ≤ 1! Dividing by N instead of n produces an impossibly tiny p̂.',
  },
  {
    id: 'ch5-trap-sign-2',
    category: 'Sign Convention',
    title: 'Sign & Term-Count Trap in "At Least", "At Most", "More Than", "Less Than"',
    wrongApproach: 'Computing P(X ≥ 2) = 1 − P(X ≤ 2) (wrongly excluding X = 2!), or treating "more than 2" as X ≥ 2.',
    correctRule: '"At least 2" means X ≥ 2 ⇒ 1 − [P(0) + P(1)]. "More than 2" means X > 2 ⇒ 1 − [P(0) + P(1) + P(2)]. "At most 2" means X ≤ 2. "Less than 2" means X ≤ 1.',
    examTip: 'Write the inequality symbol and list the excluded integers explicitly before applying 1 − P(complement).',
  },
  {
    id: 'ch5-trap-sign-3',
    category: 'Sign Convention',
    title: 'Negative Sign Missing in Exponential e⁻λ (Using e⁺λ by Mistake)',
    wrongApproach: 'Evaluating e^{λ}λˣ/x! which yields probabilities > 1.',
    correctRule: 'Poisson PMF ALWAYS has a negative exponent e⁻λ, so P(0) = e⁻λ ∈ (0, 1).',
    examTip: 'Double-check on your calculator that e⁻λ is less than 1 and ∑P(x) ≤ 1.',
  },
  {
    id: 'ch5-trap-geom-1',
    category: 'Boundary & Slope Geometry',
    title: 'Choosing Binomial vs. Poisson (and When Poisson Approximation Is Valid)',
    wrongApproach: 'Using Poisson approximation in PU Model Q7 (n = 10, p = 0.01) as the primary method without noting Binomial, OR using Binomial when no n exists (e.g., "3 calls per minute").',
    correctRule: 'Use Binomial when finite n and p are given (Model Q7 has n = 10 ⇒ Binomial!). Use Poisson when only average rate λ is given OR when n ≥ 20 and p ≤ 0.05 (λ = np).',
    examTip: 'If a problem asks "can Poisson be used?" check Mean ≈ Variance and rare independent arrivals.',
  },
  {
    id: 'ch5-trap-geom-2',
    category: 'Boundary & Slope Geometry',
    title: 'Forgetting to Scale Poisson Parameter λ When Time/Area Interval Changes',
    wrongApproach: 'Given λ = 2 defects per meter (or 3 calls per minute) and using the same λ = 2 for a 5-meter cable (or 2-minute interval).',
    correctRule: 'Poisson rate scales linearly with interval length: λ_new = λ_unit × interval (e.g., 2 × 5 = 10 defects per 5 m).',
    examTip: 'Always write the unit next to λ (e.g. λ = 0.9 spikes/hour) before substituting.',
  },
  {
    id: 'ch5-trap-geom-3',
    category: 'Boundary & Slope Geometry',
    title: 'Using Binomial Variance ≥ Mean in Parameter Recovery Questions',
    wrongApproach: 'Claiming a Binomial distribution has Mean = 4 and Variance = 6.',
    correctRule: 'Because q = 1 − p < 1, Binomial ALWAYS has Mean > Variance (np > npq). If Mean = Variance, the distribution is Poisson; if Variance > Mean, neither Binomial nor Poisson applies!',
    examTip: 'Classic 2-mark/5-mark PU trick: "Comment on the statement: For a Binomial distribution, mean is 5 and variance is 6" → Impossible because q = σ²/μ = 6/5 = 1.2 > 1!',
  },
  {
    id: 'ch5-trap-pu-1',
    category: 'High-Yield PU Topic',
    title: 'Model Q7 (5 Marks): Binomial Probability With Complement "At Least 2"',
    wrongApproach: 'Rounding (0.99)⁹ too early to 0.91, causing 3rd/4th decimal inaccuracies.',
    correctRule: 'Keep at least 5–6 significant digits in (1 − p)ⁿ and (1 − p)ⁿ⁻¹ before rounding final answers to 4 decimal places.',
    examTip: 'Unit 5 is worth 5/60 marks in PU—expect either a Binomial/Poisson probability problem (like Model Q7) or a Binomial/Poisson fitting table.',
  },
  {
    id: 'ch5-trap-pu-2',
    category: 'High-Yield PU Topic',
    title: 'Poisson Fitting Tail Bin & Recurrence Speed',
    wrongApproach: 'Computing 4!, 5! factorials repeatedly and forgetting the residual tail probability.',
    correctRule: 'Use E_{x+1} = [λ̂/(x + 1)]·E_x from E₀ = N·e⁻λ̂, and check ∑E_x = N.',
    examTip: 'State the conditions and 3–4 key properties cleanly if asked in theory alongside a numerical.',
  },
];
