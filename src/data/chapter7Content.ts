import { DepthCode, ExamTrap, FormulaItem, SolvedProblem, SubtopicNote } from './chapter1Content';

export const CH7_SYLLABUS_CONTEXT = {
  university: 'Purbanchal University — Faculty of Engineering, Biratnagar, Nepal',
  program: 'B.E. Biomedical / Electrical / Electronics, Com. & Automation Engineering',
  semester: 'Year III · Semester V (Effective from 2021 / 2078 Batch)',
  subject: 'Probability and Statistics',
  chapter: 'Unit 7: Estimation',
  lectureHours: '4 Hrs',
  finalMarks: 5,
  totalSubjectMarks: '60 Final Theory + 20 Internal Theory + 20 Practical = 100',
  syllabusTopics: [
    'Concept of sample, sampling, determination of sample size, population, statistic, parameter',
    'Estimation and its types (point & interval estimation); criteria for good estimator',
    'Confidence interval and standard error',
    'Confidence interval for single mean and for the difference of two means',
    'Confidence interval for single proportion and for the difference of two proportions',
  ],
  microSyllabusNote:
    'In the attached PU 5th Semester syllabus PDF (pp. 3–6), Unit 7 is allocated 4 lecture hours and 5/60 final exam marks (Model Q8 & Q12b on p. 9; note Detailed Contents p. 6 explicitly includes "sampling, determination of sample size"). Every subtopic is covered across SD, D, DR, I, E, A, and N with step-by-step derivations.',
};

export const CH7_SUBTOPIC_NOTES: SubtopicNote[] = [
  {
    id: 'ch7-sub-1',
    code: '7.1',
    title: 'Population, Sample, Sampling, Parameter, Statistic & Sample Size Determination',
    depths: ['SD', 'D', 'DR', 'I', 'E', 'A', 'N'] as DepthCode[],
    definitionSD:
      'A Population is the complete totality of all units under study (size N), described by fixed unknown constants called Parameters (μ, σ², P). A Sample is a representative subset of size n selected via Sampling, whose numerical summaries are random variables called Statistics (x̄, s², p̂).',
    descriptionD:
      'Because a statistic varies from sample to sample, it forms a Sampling Distribution characterized by its Standard Error (SE)—the standard deviation of that statistic. Before collecting data, engineers determine the required Sample Size n to bound the maximum allowable Margin of Error E at confidence level 100(1 − α)%.',
    explanationE:
      'For estimating mean μ within ±E when σ is known: n = (z_{α/2}·σ / E)². For estimating proportion p within ±E: n = z_{α/2}²·p̂q̂ / E². If no prior estimate p̂ is available, use the worst-case maximum p̂q̂ = 0.5 × 0.5 = 0.25, giving n = z_{α/2}² / (4E²). ALWAYS round n UP to the next whole integer.',
    illustrationI:
      'To estimate mean transformer oil breakdown voltage within E = ±1.5 kV at 95% confidence (z = 1.96) with σ = 6 kV, n = (1.96 × 6 / 1.5)² = (7.84)² = 61.47 ⇒ we must test at least n = 62 samples (never round down to 61).',
    applicationA:
      'Sizing reliability test batches, quality inspection plans, opinion polls, and engineering sensor calibration campaigns.',
    derivationDR: {
      title: 'Derivation (DR): Sample Size Formula n = (z_{α/2}·σ / E)² and Worst-Case Proportion Bound',
      goal: 'Derive minimum sample size n directly from maximum allowable Margin of Error E.',
      steps: [
        {
          step: 1,
          title: 'Set Margin of Error E Equal to Half-Width of Confidence Interval',
          equation: 'E = | X̄ − μ |_{max} = z_{α/2} · SE(X̄) = z_{α/2} · (σ / √n)',
          note: 'Solve algebraically for √n:',
        },
        {
          step: 2,
          title: 'Isolate n for Mean Estimation',
          equation: '√n = (z_{α/2} · σ) / E   ⇒   n = [ (z_{α/2} · σ) / E ]²',
          note: 'Always apply ceiling ⌈n⌉ because n − 1 would violate the error bound E.',
        },
        {
          step: 3,
          title: 'Derive Proportion Sample Size & Conservative Maximum pq ≤ 0.25',
          equation: 'E = z_{α/2} √(pq / n)   ⇒   n = (z_{α/2}² · p · q) / E²',
          note: 'Since p(1 − p) = ¼ − (p − ½)² attains its maximum ¼ = 0.25 at p = 0.5, the worst-case bound is n = z_{α/2}² / (4E²).',
        },
      ],
      result: 'n_mean = ⌈ (z_{α/2}·σ / E)² ⌉,   n_prop = ⌈ z_{α/2}² pq / E² ⌉ ≤ ⌈ z_{α/2}² / (4E²) ⌉.',
    },
    keyTakeawayN:
      'Remember two rules: (1) Cutting Margin of Error E in HALF requires 4× the sample size n; (2) Always round fractional n UP.',
  },
  {
    id: 'ch7-sub-2',
    code: '7.2',
    title: 'Estimation Types & Criteria for a Good Estimator',
    depths: ['SD', 'D', 'DR', 'I', 'E', 'A', 'N'] as DepthCode[],
    definitionSD:
      'Statistical Estimation infers unknown population parameters (θ) from sample data. It has two forms: Point Estimation (a single numerical value θ̂ = T(X₁,…,Xₙ)) and Interval Estimation (a random range [L, U] constructed to capture θ with stated probability 1 − α).',
    descriptionD:
      'Four Classical Criteria for a Good Point Estimator θ̂: (1) Unbiasedness: E(θ̂) = θ across repeated samples; (2) Consistency: θ̂ₙ converges in probability to θ as n → ∞ (sufficient conditions: bias → 0 and Var(θ̂ₙ) → 0); (3) Efficiency: among all unbiased estimators, θ̂ has the smallest variance (MVUE); (4) Sufficiency: θ̂ extracts all information about θ contained in the sample.',
    explanationE:
      'Sample mean X̄ and sample proportion p̂ = X/n are unbiased, consistent, and efficient estimators of μ and p. Crucially, the naive sample variance (1/n)∑(Xᵢ − X̄)² is BIASED downward by (n − 1)/n, which is why Bessel\'s correction S² = [1/(n − 1)]∑(Xᵢ − X̄)² is used as the unbiased estimator of σ².',
    illustrationI:
      'Both sample mean X̄ and sample median are unbiased and consistent for the center μ of a Normal population N(μ, σ²), yet Var(X̄) = σ²/n while Var(Median) ≈ 1.57·σ²/n—making X̄ more efficient (relative efficiency ≈ 63.7% for median vs. mean).',
    applicationA:
      'Choosing optimal estimators in signal estimation (Kalman/least-squares filtering), reliability engineering (MTBF estimation), and PU theory short notes (Model Q12b).',
    derivationDR: {
      title: 'Derivation (DR): Unbiasedness of X̄ and Why S² Requires Denominator (n − 1)',
      goal: 'Prove E(X̄) = μ and E[ ∑(Xᵢ − X̄)² ] = (n − 1)σ², establishing S² = ∑(Xᵢ − X̄)²/(n − 1) as unbiased.',
      steps: [
        {
          step: 1,
          title: 'Prove Unbiasedness & Consistency of Sample Mean X̄',
          equation: 'E(X̄) = (1/n) ∑_{i=1}^n E(Xᵢ) = (1/n)(nμ) = μ;   Var(X̄) = (1/n²) ∑ σ² = σ²/n → 0 as n → ∞',
          note: 'E(X̄) = μ proves Unbiasedness; Var(X̄) → 0 additionally proves Consistency.',
        },
        {
          step: 2,
          title: 'Expand Sum of Squared Deviations About X̄',
          equation: '∑(Xᵢ − X̄)² = ∑[ (Xᵢ − μ) − (X̄ − μ) ]² = ∑(Xᵢ − μ)² − n(X̄ − μ)²',
          note: 'Cross-term −2(X̄ − μ)∑(Xᵢ − μ) equals −2n(X̄ − μ)², combining cleanly.',
        },
        {
          step: 3,
          title: 'Take Expectation Term by Term',
          equation: 'E[ ∑(Xᵢ − X̄)² ] = ∑ E[(Xᵢ − μ)²] − n·E[(X̄ − μ)²] = nσ² − n(σ²/n) = (n − 1)σ²',
          note: 'Dividing by n gives (n − 1)σ²/n ≠ σ² (biased); dividing by (n − 1) gives E(S²) = σ²!',
        },
      ],
      result: 'E(X̄) = μ (unbiased)   and   E[ ∑(Xᵢ − X̄)² / (n − 1) ] = σ² (unbiased).',
    },
    keyTakeawayN:
      'For Model Q12(b) short notes on Estimation, ALWAYS state: Definition + Point vs. Interval Estimation + the 4 Good Estimator Criteria (U-C-E-S) + Standard Error.',
  },
  {
    id: 'ch7-sub-3',
    code: '7.3',
    title: 'Standard Error & Confidence Intervals for Mean (μ) and Difference of Two Means (μ₁ − μ₂)',
    depths: ['SD', 'D', 'DR', 'I', 'E', 'A', 'N'] as DepthCode[],
    definitionSD:
      'A 100(1 − α)% Confidence Interval (CI) for a parameter θ is a random interval [L, U] = θ̂ ± (Critical Value × Standard Error) constructed so that in repeated sampling, 100(1 − α)% of such intervals contain the true parameter θ.',
    descriptionD:
      'Single Mean μ: (a) Known σ or large sample (n ≥ 30): x̄ ± z_{α/2}·(σ/√n) (using s if σ unknown and n ≥ 30); (b) Small sample (n < 30, unknown σ, normal population): x̄ ± t_{α/2, n−1}·(s/√n). Difference of Two Means (μ₁ − μ₂): (a) Large independent samples: (x̄₁ − x̄₂) ± z_{α/2}·√(σ₁²/n₁ + σ₂²/n₂); (b) Small independent samples with equal unknown variances: (x̄₁ − x̄₂) ± t_{α/2, n₁+n₂−2} · s_p√(1/n₁ + 1/n₂), where s_p² = [(n₁−1)s₁² + (n₂−1)s₂²]/(n₁ + n₂ − 2).',
    explanationE:
      'Key Confidence Constants (two-tailed z_{α/2}): 90% → 1.645; 95% → 1.96; 98% → 2.326 (or 2.33); 99% → 2.576 (or 2.58). Higher confidence (99% vs. 95%) widens the interval; larger sample size n narrows it by 1/√n. Note the PU syllabus wording "confidential interval of mean for mean" simply refers to the confidence interval for μ.',
    illustrationI:
      'Comparing Brand A (n₁=10, x̄₁=1420, s₁=60) and Brand B (n₂=12, x̄₂=1350, s₂=50) LED lifetimes gives pooled s_p = 54.73 hrs, t_{0.025,20} = 2.086, and 95% CI for (μ₁ − μ₂) = (21.12, 118.88) hrs. Because 0 lies outside this interval, Brand A is demonstrably longer-lasting.',
    applicationA:
      'Reporting measurement uncertainty tolerances, A/B reliability benchmarking between two suppliers, and clinical/biomedical device efficacy intervals.',
    derivationDR: {
      title: 'Derivation (DR): 100(1 − α)% Confidence Interval for Population Mean μ',
      goal: 'Derive the exact interval [ x̄ − z_{α/2}σ/√n, x̄ + z_{α/2}σ/√n ] from the Standard Normal pivot.',
      steps: [
        {
          step: 1,
          title: 'Write Probability Statement for Pivotal Quantity Z',
          equation: 'P( −z_{α/2} ≤ (X̄ − μ) / (σ / √n) ≤ +z_{α/2} ) = 1 − α',
          note: 'Because X̄ ~ N(μ, σ²/n) (or approximately so for n ≥ 30 by Central Limit Theorem).',
        },
        {
          step: 2,
          title: 'Multiply Through by Positive Standard Error σ/√n',
          equation: 'P( −z_{α/2}·(σ/√n) ≤ X̄ − μ ≤ +z_{α/2}·(σ/√n) ) = 1 − α',
          note: 'Inequality directions stay unchanged since σ/√n > 0.',
        },
        {
          step: 3,
          title: 'Isolate Unknown Parameter μ in the Center',
          equation: 'P( X̄ − z_{α/2}·(σ/√n) ≤ μ ≤ X̄ + z_{α/2}·(σ/√n) ) = 1 − α',
          note: 'Replacing random variable X̄ with observed sample mean x̄ yields the realized 100(1 − α)% CI.',
        },
      ],
      result: 'CI(μ) = x̄ ± z_{α/2}·(σ / √n)   (or   x̄ ± t_{α/2, n−1}·(s / √n)   when n < 30, σ unknown).',
    },
    keyTakeawayN:
      'Decision tree: n ≥ 30 or σ known ⇒ Z-interval; n < 30 and σ unknown ⇒ t-interval! Check if variance is small-sample pooled before computing.',
  },
  {
    id: 'ch7-sub-4',
    code: '7.4',
    title: 'Confidence Intervals for Proportion (p) and Difference of Two Proportions (p₁ − p₂)',
    depths: ['SD', 'D', 'I', 'E', 'A', 'N'] as DepthCode[],
    definitionSD:
      'For a large random sample of size n with x successes (p̂ = x/n, q̂ = 1 − p̂), the 100(1 − α)% Wald Confidence Interval for population proportion p is p̂ ± z_{α/2}√(p̂q̂ / n). For two independent large samples, the CI for (p₁ − p₂) is (p̂₁ − p̂₂) ± z_{α/2}√(p̂₁q̂₁/n₁ + p̂₂q̂₂/n₂).',
    descriptionD:
      'These intervals rely on the Normal approximation to Binomial X ~ B(n, p), requiring large samples (typically np̂ ≥ 5 and nq̂ ≥ 5). If sampling without replacement from a finite population of size N where sampling fraction n/N > 5% (0.05), multiply the standard error by the Finite Population Correction (FPC) factor √[(N − n)/(N − 1)].',
    explanationE:
      'Because a true proportion p must physically satisfy 0 ≤ p ≤ 1, whenever the lower confidence limit p̂ − E turns negative (which happens in PU Model Q8 at 99% confidence!) or the upper limit exceeds 1, report the algebraic value and truncate to [0, 1]. Notice also that in hypothesis testing of p₁ = p₂ (Unit 8), a pooled p̄ is used in SE, whereas in Confidence Intervals (Unit 7), NO pooling is done—each sample keeps p̂₁q̂₁/n₁ and p̂₂q̂₂/n₂ separately!',
    illustrationI:
      'In PU Model Q8 (n = 100, x = 5 defectives), p̂ = 0.05, q̂ = 0.95, and SE = √(0.05 × 0.95 / 100) = 0.02179. At 95% (z = 1.96), CI = (0.0073, 0.0927). At 99% (z = 2.576), p̂ − E = −0.0061, so the physical 99% CI is [0, 0.1061].',
    applicationA:
      'Lot defective-rate estimation in electronics QA (Model Q8), network packet-loss confidence bounds, and comparing two manufacturing lines.',
    keyTakeawayN:
      'In Confidence Intervals for p₁ − p₂, NEVER pool p̂₁ and p̂₂ (pooling is ONLY for H₀: p₁ = p₂ hypothesis tests in Unit 8)!',
  },
];

export const CH7_FORMULA_SHEET: FormulaItem[] = [
  {
    id: 'ch7-f-good-est',
    category: 'Location',
    quantity: 'Unbiased Estimators (X̄, p̂, S²)',
    symbol: 'θ̂, S²',
    formula: 'E(X̄) = μ;   E(p̂) = p;   S² = ∑(xᵢ − x̄)² / (n − 1)  ⇒  E(S²) = σ²',
    assumptionOrConstant: 'Sample variance divides by (n − 1), NOT n, to avoid −σ²/n bias',
    unit: 'Same unit (or unit²)',
  },
  {
    id: 'ch7-f-se',
    category: 'Location',
    quantity: 'Standard Error (Mean & Proportion)',
    symbol: 'SE(X̄), SE(p̂)',
    formula: 'SE(X̄) = σ / √n  (or s/√n);   SE(p̂) = √(p̂q̂ / n)',
    assumptionOrConstant: 'Multiply by FPC √[(N−n)/(N−1)] if population size N finite and n/N > 0.05',
    unit: 'Mean: unit; Prop: dimensionless',
  },
  {
    id: 'ch7-f-sample-size',
    category: 'Location',
    quantity: 'Sample Size Determination',
    symbol: 'n',
    formula: 'n_mean = ⌈ (z_{α/2}·σ / E)² ⌉;   n_prop = ⌈ z_{α/2}²·p̂q̂ / E² ⌉ ≤ ⌈ z_{α/2}² / (4E²) ⌉',
    assumptionOrConstant: 'Use p̂ = q̂ = 0.5 when no pilot proportion is known; ALWAYS round UP',
    unit: 'Integer count (samples)',
  },
  {
    id: 'ch7-f-ci-mean',
    category: 'Dispersion',
    quantity: 'Confidence Interval for Single Mean (μ)',
    symbol: 'CI(μ)',
    formula: 'Large/known σ: x̄ ± z_{α/2}(σ/√n);   Small/unknown σ: x̄ ± t_{α/2, n−1}(s/√n)',
    assumptionOrConstant: 'z vs t split at n ≥ 30 vs n < 30 (unknown σ, normal population)',
    unit: 'Data unit',
  },
  {
    id: 'ch7-f-ci-diff-mean',
    category: 'Dispersion',
    quantity: 'CI for Difference of Two Means (μ₁ − μ₂)',
    symbol: 'CI(μ₁ − μ₂)',
    formula: 'Large: (x̄₁ − x̄₂) ± z_{α/2}√(σ₁²/n₁ + σ₂²/n₂);   Small: (x̄₁ − x̄₂) ± t_{α/2,ν}·s_p√(1/n₁ + 1/n₂)',
    assumptionOrConstant: 'Pooled s_p² = [(n₁−1)s₁² + (n₂−1)s₂²]/(n₁+n₂−2), ν = n₁ + n₂ − 2',
    unit: 'Data unit',
  },
  {
    id: 'ch7-f-ci-prop',
    category: 'Properties & Constants',
    quantity: 'CI for Single & Two Proportions',
    symbol: 'CI(p), CI(p₁ − p₂)',
    formula: 'Single: p̂ ± z_{α/2}√(p̂q̂/n);   Diff: (p̂₁ − p̂₂) ± z_{α/2}√(p̂₁q̂₁/n₁ + p̂₂q̂₂/n₂)',
    assumptionOrConstant: 'No pooling in CI(p₁ − p₂); clip single proportion limits inside [0, 1]',
    unit: 'Dimensionless ∈ [0, 1]',
  },
  {
    id: 'ch7-f-z-crit',
    category: 'Properties & Constants',
    quantity: 'Standard Two-Tailed Confidence Constants',
    symbol: 'z_{α/2}',
    formula: '90%: 1.645;   95%: 1.96;   98%: 2.326 (2.33);   99%: 2.576 (2.58)',
    assumptionOrConstant: 'Used for large samples (n ≥ 30), known σ, and all proportion CIs',
    unit: 'Dimensionless',
  },
];

export const CH7_SOLVED_QUESTIONS: SolvedProblem[] = [
  {
    id: 'pu-model-q8',
    tag: 'PU Model Set · Group B, Q8',
    title: '95% and 99% Confidence Limits for Proportion of Defective Items',
    marks: '5 Marks',
    source: 'Attached PDF — PU V Sem Final Exam 2024 Model Question, Page 9',
    statement:
      'A random sample of 100 items drawn from a large batch of articles contain 5 defective items. Find 95% and 99% confidence limits for the proportion of defective items.',
    given: [
      'Sample size n = 100 (large batch ⇒ no FPC needed, and n ≥ 30 ⇒ Z-interval applies).',
      'Number of defectives x = 5.',
      'Sample proportion p̂ = x / n = 5 / 100 = 0.05;   q̂ = 1 − p̂ = 0.95.',
      'Critical z-values: z₀.₀₂₅ = 1.96 (95% CI);   z₀.₀₀₅ = 2.576 (or 2.58 in 2-dec tables for 99% CI).',
    ],
    steps: [
      {
        heading: 'Step 1: Compute Standard Error of Sample Proportion SE(p̂)',
        work: [
          'SE(p̂) = √(p̂ · q̂ / n) = √(0.05 × 0.95 / 100) = √(0.0475 / 100) = √0.000475 = 0.021794',
        ],
      },
      {
        heading: 'Step 2: 95% Confidence Limits for Population Proportion p',
        work: [
          'Margin of Error E₉₅ = z₀.₀₂₅ · SE(p̂) = 1.96 × 0.021794 = 0.042717 ≈ 0.0427',
          'Lower 95% limit = p̂ − E₉₅ = 0.05 − 0.042717 = 0.007283 ≈ 0.0073  (0.73%)',
          'Upper 95% limit = p̂ + E₉₅ = 0.05 + 0.042717 = 0.092717 ≈ 0.0927  (9.27%)',
        ],
      },
      {
        heading: 'Step 3: 99% Confidence Limits (Showing Physical [0, 1] Boundary Handling)',
        work: [
          'Using z₀.₀₀₅ = 2.576:   E₉₉ = 2.576 × 0.021794 = 0.056143 ≈ 0.0561',
          'Algebraic limits: 0.05 ± 0.056143 = (−0.00614,  0.10614)',
          'Because a proportion p cannot be negative (0 ≤ p ≤ 1), truncate lower limit at 0:',
          'Physical 99% CI = [0, 0.1061]  (or [0, 0.1062] if using 2-decimal z = 2.58 where E = 0.05623)',
        ],
      },
    ],
    finalAnswer: [
      '95% Confidence Limits: (0.0073, 0.0927)  or  [0.73%, 9.27%]',
      '99% Confidence Limits: [0, 0.1061]  (algebraic lower limit −0.0061 clipped to 0; 0.1062 with z = 2.58)',
    ],
  },
  {
    id: 'pu-model-q12b',
    tag: 'PU Model Set · Group B, Q12(b)',
    title: 'Short Notes: Statistical Estimation, Estimator Criteria & Confidence Intervals',
    marks: '2.5 Marks (Half of Q12)',
    source: 'Attached PDF — PU V Sem Final Exam 2024 Model Question, Page 9',
    statement: 'Write short notes on the following: (b) Estimation.',
    given: [
      'Aim: Summarize all core Unit 7 concepts cleanly in crisp PU short-note format.',
    ],
    steps: [
      {
        heading: '1. Definition & Purpose',
        work: [
          'Statistical estimation is the branch of inferential statistics that determines approximate values or plausible ranges for unknown population parameters (such as μ, σ², or p) using observed sample statistics (x̄, s², p̂).',
        ],
      },
      {
        heading: '2. Two Types of Estimation',
        work: [
          '(i) Point Estimation: Produces a single numerical estimate θ̂ of the parameter θ (e.g., x̄ = 90 as a point estimate of μ), without indicating precision.',
          '(ii) Interval Estimation: Constructs a range [L, U] = θ̂ ± (Critical Value × Standard Error) expected to capture θ with confidence level 100(1 − α)% (e.g., 95%).',
        ],
      },
      {
        heading: '3. Four Criteria for a Good Estimator',
        work: [
          '(i) Unbiasedness: E(θ̂) = θ (expected value equals the true parameter).',
          '(ii) Consistency: θ̂ₙ → θ in probability as sample size n → ∞ (Var(θ̂ₙ) → 0).',
          '(iii) Efficiency: Has the minimum variance among all unbiased estimators.',
          '(iv) Sufficiency: Uses all relevant information contained in the sample regarding θ.',
        ],
      },
    ],
    finalAnswer: [
      'Key summary: Point Estimate gives one value (θ̂); Interval Estimate gives θ̂ ± Margin of Error at confidence (1 − α); an ideal estimator is Unbiased, Consistent, Efficient, and Sufficient.',
    ],
  },
  {
    id: 'ch7-extra-1',
    tag: 'Extra Exam-Level Numerical 1',
    title: 'Small-Sample t-Confidence Interval for Difference of Two Means (Pooled s_p)',
    marks: '5–10 Marks Pattern',
    source: 'High-Yield PU Exam Practice (Two-Mean Confidence Interval with n < 30)',
    statement:
      'To compare the operating life of two LED bulb brands, a test yields Brand A: n₁ = 10, x̄₁ = 1420 hrs, s₁ = 60 hrs; Brand B: n₂ = 12, x̄₂ = 1350 hrs, s₂ = 50 hrs. Assuming both populations are normal with equal variances, construct a 95% confidence interval for the true difference in mean lifetimes (μ₁ − μ₂).',
    given: [
      'Sample 1 (Brand A): n₁ = 10, x̄₁ = 1420 hrs, s₁ = 60 hrs.',
      'Sample 2 (Brand B): n₂ = 12, x̄₂ = 1350 hrs, s₂ = 50 hrs.',
      'Small samples (n₁, n₂ < 30), equal unknown variances ⇒ pooled t-interval with ν = n₁ + n₂ − 2 = 20 df.',
      'From t-table at α = 0.05 (two-tailed), ν = 20: t₀.₀₂₅,₂₀ = 2.086.',
    ],
    steps: [
      {
        heading: 'Step 1: Compute Pooled Sample Variance s_p² and Standard Deviation s_p',
        work: [
          's_p² = [ (n₁ − 1)s₁² + (n₂ − 1)s₂² ] / (n₁ + n₂ − 2)',
          's_p² = [ 9(60²) + 11(50²) ] / 20 = [ 9(3600) + 11(2500) ] / 20 = (32400 + 27500) / 20 = 59900 / 20 = 2995',
          's_p = √2995 = 54.7266 hrs',
        ],
      },
      {
        heading: 'Step 2: Compute Standard Error & Margin of Error',
        work: [
          'SE(x̄₁ − x̄₂) = s_p · √(1/n₁ + 1/n₂) = 54.7266 · √(1/10 + 1/12) = 54.7266 × 0.428174 = 23.4325 hrs',
          'Margin of Error E = t₀.₀₂₅,₂₀ · SE = 2.086 × 23.4325 = 48.880 hrs',
        ],
      },
      {
        heading: 'Step 3: Construct 95% Confidence Interval for μ₁ − μ₂',
        work: [
          'Point estimate: x̄₁ − x̄₂ = 1420 − 1350 = 70.00 hrs',
          '95% CI = 70.00 ± 48.88 = (21.12, 118.88) hrs',
          'Since 0 is NOT inside (21.12, 118.88), Brand A has a significantly higher mean lifetime at 95% confidence.',
        ],
      },
    ],
    finalAnswer: [
      'Pooled s_p = 54.73 hrs;   95% CI for (μ₁ − μ₂) = (21.12, 118.88) hours',
    ],
  },
  {
    id: 'ch7-extra-2',
    tag: 'Extra Exam-Level Numerical 2',
    title: 'Sample Size Determination & Difference of Two Proportions CI',
    marks: '5–10 Marks Pattern',
    source: 'High-Yield PU Exam Practice (Sample Size & Two-Proportion Interval)',
    statement:
      '(a) An electrical engineer needs to estimate the mean breakdown voltage of transformer oil within ±1.5 kV at 95% confidence. Past records give σ = 6 kV. What minimum sample size is required? (b) In cable quality audits, Supplier 1 showed 18 defective segments out of 200 and Supplier 2 showed 10 defective segments out of 250. Find the 95% confidence interval for the difference of defective proportions (p₁ − p₂).',
    given: [
      'Part (a): Margin of error E = 1.5 kV, σ = 6 kV, confidence = 95% (z₀.₀₂₅ = 1.96).',
      'Part (b): n₁ = 200, x₁ = 18 ⇒ p̂₁ = 0.09, q̂₁ = 0.91;   n₂ = 250, x₂ = 10 ⇒ p̂₂ = 0.04, q̂₂ = 0.96.',
    ],
    steps: [
      {
        heading: 'Part (a): Minimum Sample Size n',
        work: [
          'n = [ (z_{α/2} · σ) / E ]² = [ (1.96 × 6) / 1.5 ]² = (7.84)² = 61.4656',
          'Always round UP to guarantee error ≤ 1.5 kV  ⇒  n = 62 samples',
        ],
      },
      {
        heading: 'Part (b): 95% Confidence Interval for (p₁ − p₂)',
        work: [
          'Point estimate: p̂₁ − p̂₂ = 0.09 − 0.04 = 0.05',
          'SE(p̂₁ − p̂₂) = √( p̂₁q̂₁/n₁ + p̂₂q̂₂/n₂ ) = √( (0.09 × 0.91)/200 + (0.04 × 0.96)/250 )',
          'SE = √(0.0004095 + 0.0001536) = √0.0005631 = 0.023730',
          'Margin of Error E = 1.96 × 0.023730 = 0.04651 ≈ 0.0465',
          '95% CI = 0.05 ± 0.0465 = (0.0035, 0.0965)  or  [0.35%, 9.65%]',
        ],
      },
    ],
    finalAnswer: [
      '(a) Minimum sample size required n = 62 tests',
      '(b) 95% CI for (p₁ − p₂) = (0.0035, 0.0965)  or  [0.35%, 9.65%]',
    ],
  },
];

export const CH7_EXAM_TRAPS: ExamTrap[] = [
  {
    id: 'ch7-trap-sign-1',
    category: 'Sign Convention',
    title: 'Reporting a Negative Lower Limit for Proportion Confidence Interval (Model Q8!)',
    wrongApproach: 'Writing 99% CI = (−0.0061, 0.1061) as the final proportion answer without noting physical bounds.',
    correctRule: 'A true proportion p ∈ [0, 1]. If p̂ − E < 0 (as in PU Model Q8 at 99% confidence), state the algebraic limit and explicitly truncate the lower bound to 0: [0, 0.1061].',
    examTip: 'Examiners love Model Q8 specifically because p̂ = 0.05 is small enough that 99% Wald lower bound crosses zero!',
  },
  {
    id: 'ch7-trap-sign-2',
    category: 'Sign Convention',
    title: 'Dividing Sample Variance by n Instead of (n − 1) in Small-Sample t-Intervals',
    wrongApproach: 'Using biased sample variance σ̂² = ∑(xᵢ − x̄)²/n when calculating t-confidence intervals.',
    correctRule: 'Unbiased sample variance S² ALWAYS divides by (n − 1). If a problem gives s computed with denominator n, convert via S = s·√[n/(n − 1)] before applying t.',
    examTip: 'Verify whether raw data or precomputed s is given—with raw data, always use n − 1.',
  },
  {
    id: 'ch7-trap-geom-1',
    category: 'Boundary & Slope Geometry',
    title: 'Using z_{α} (One-Tailed) Instead of z_{α/2} (Two-Tailed) for Confidence Intervals',
    wrongApproach: 'Using z = 1.645 for a 95% confidence interval instead of 1.96.',
    correctRule: 'Two-sided confidence intervals split α equally across BOTH tails (α/2 each side): 90% → 1.645, 95% → 1.96, 99% → 2.576 (2.58).',
    examTip: 'Sketch the curve with α/2 in each tail so you never accidentally pull a one-tailed critical value.',
  },
  {
    id: 'ch7-trap-geom-2',
    category: 'Boundary & Slope Geometry',
    title: 'Pooling Proportions in a Confidence Interval for (p₁ − p₂)',
    wrongApproach: 'Computing p̄ = (x₁ + x₂)/(n₁ + n₂) when building a CI for p₁ − p₂.',
    correctRule: 'NEVER pool proportions for a Confidence Interval—use √(p̂₁q̂₁/n₁ + p̂₂q̂₂/n₂). Pooled p̄ is ONLY used in Unit 8 hypothesis tests under H₀: p₁ = p₂.',
    examTip: 'Contrast clearly: Unit 7 CI keeps separate p̂₁ and p̂₂; Unit 8 z-test pools p̄.',
  },
  {
    id: 'ch7-trap-pu-1',
    category: 'High-Yield PU Topic',
    title: 'Rounding Fractional Sample Size n Down Instead of Up',
    wrongApproach: 'Obtaining n = 61.47 and rounding to n = 61 (or 61.1 → 61).',
    correctRule: 'Always take the ceiling ⌈n⌉ (e.g., 61.01 → 62), because any smaller integer makes the Margin of Error strictly larger than the specified bound E.',
    examTip: 'Write the unrounded value (61.47) then state "Rounding up to ensure E ≤ 1.5 kV: n = 62".',
  },
  {
    id: 'ch7-trap-pu-2',
    category: 'High-Yield PU Topic',
    title: 'Model Q8 & Q12(b): Mastering Both Numerical Proportions & Estimation Theory',
    wrongApproach: 'Writing only "Point and Interval" for Q12(b) without stating Unbiasedness, Consistency, Efficiency, Sufficiency, and Standard Error.',
    correctRule: 'Even though Unit 7 carries 5/60 marks, PU Model Set pairs a proportion CI numerical (Q8) with short notes on Estimation (Q12b)—memorize the 4 U-C-E-S criteria cold.',
    examTip: 'Checking whether 0 lies inside a (μ₁ − μ₂) or (p₁ − p₂) CI earns bonus clarity in engineering conclusions.',
  },
];
