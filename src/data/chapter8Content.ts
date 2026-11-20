import { DepthCode, ExamTrap, FormulaItem, SolvedProblem, SubtopicNote } from './chapter1Content';

export const CH8_SYLLABUS_CONTEXT = {
  university: 'Purbanchal University — Faculty of Engineering, Biratnagar, Nepal',
  program: 'B.E. Biomedical / Electrical / Electronics, Com. & Automation Engineering',
  semester: 'Year III · Semester V (Effective from 2021 / 2078 Batch)',
  subject: 'Probability and Statistics',
  chapter: 'Unit 8: Testing of Hypothesis',
  lectureHours: '8 Hrs',
  finalMarks: 15,
  totalSubjectMarks: '60 Final Theory + 20 Internal Theory + 20 Practical = 100',
  syllabusTopics: [
    'Concept of hypothesis testing; hypothesis and its types, level of significance, degree of freedom, error in testing of hypothesis',
    'z-test: for single proportion, for the difference of two proportions, for single mean, for the difference of two means',
    't-test: for single mean, t-test for the difference of two means, paired t-test',
    'chi-square test: for goodness of fit, for independence of attributes, validity of chi-square test',
  ],
  microSyllabusNote:
    'In the attached PU 5th Semester syllabus PDF, Probability & Statistics (pp. 3–6) allocates the joint-highest 15/60 final exam marks and 8 lecture hours to Unit 8 (Group A Q3 [10 Marks] and Group B Q9 [5 Marks] in the 2024 Model Question Set). Below, every subtopic is covered across SD, D, DR, I, E, A, and N with step-by-step derivations and a critical-value decision sheet.',
};

export const CH8_SUBTOPIC_NOTES: SubtopicNote[] = [
  {
    id: 'ch8-sub-1',
    code: '8.1',
    title: 'Concept of Hypothesis Testing, Types of Hypotheses, Errors, α & Degrees of Freedom',
    depths: ['SD', 'D', 'DR', 'I', 'E', 'A', 'N'] as DepthCode[],
    definitionSD:
      'A statistical hypothesis is a quantitative statement or assumption about a population parameter (such as μ, p, or independence of attributes). Hypothesis testing is a formal sample-based decision procedure that evaluates whether observed sample evidence is sufficiently improbable under the Null Hypothesis (H₀) to reject H₀ in favor of the Alternative Hypothesis (H₁).',
    descriptionD:
      'Null Hypothesis (H₀): Statement of "no effect / no difference / status quo" containing equality (=, ≤, ≥), assumed true until disproved. Alternative Hypothesis (H₁ or Hₐ): Research claim containing strict inequality: Two-tailed (H₁: θ ≠ θ₀), Right-tailed (H₁: θ > θ₀), or Left-tailed (H₁: θ < θ₀). Level of Significance (α): Maximum tolerable probability of rejecting a true H₀ (typically 0.05 or 0.01). Degree of Freedom (df or ν): Number of independent observations/comparisons free to vary after estimating constraints or parameters.',
    explanationE:
      'Two Errors in Hypothesis Testing: Type I Error (α) = P(Reject H₀ | H₀ is true) ("false positive"); Type II Error (β) = P(Fail to reject H₀ | H₀ is false) ("false negative"). Statistical Power = 1 − β = P(Reject H₀ | H₁ is true). Fixing sample size n, lowering α widens the acceptance region and increases β; only increasing n reduces α and β simultaneously. The 6-step PU exam format is: (1) State H₀ & H₁, (2) Specify α & tail type, (3) Select & compute Test Statistic, (4) Determine df & Critical Region, (5) Compare |calc| vs. critical (or p-value vs. α), (6) State statistical decision and plain-language conclusion.',
    illustrationI:
      'In a quality-control inspection, H₀: μ = 100 Ω (batch meets spec). Rejecting a good batch is a Type I error (α, producer risk); accepting a bad batch whose true mean shifted to 95 Ω is a Type II error (β, consumer risk).',
    applicationA:
      'Relay trip-time validation, clinical efficacy trials, production batch acceptance testing, and verifying whether training improves industrial worker output.',
    derivationDR: {
      title: 'Derivation (DR): Type II Error (β) & Power Function (1 − β) for Single-Mean Z-Test',
      goal: 'Derive the exact probability of Type II error β(μ₁) and power (1 − β) when testing H₀: μ = μ₀ vs. H₁: μ ≠ μ₀ at significance level α with known σ.',
      steps: [
        {
          step: 1,
          title: 'Write the Two-Tailed Acceptance Region Under H₀',
          equation: 'Fail to reject H₀  ⇔  −z_{α/2} ≤ (X̄ − μ₀) / (σ / √n) ≤ +z_{α/2}  ⇔  μ₀ − z_{α/2}(σ/√n) ≤ X̄ ≤ μ₀ + z_{α/2}(σ/√n)',
          note: 'By definition, P(X̄ falls outside [A_L, A_U] | μ = μ₀) = α (Type I error).',
        },
        {
          step: 2,
          title: 'Condition on True Alternative Mean μ = μ₁ ≠ μ₀',
          equation: 'β(μ₁) = P( A_L ≤ X̄ ≤ A_U | μ = μ₁ ) = P( (A_L − μ₁)/(σ/√n) ≤ Z ≤ (A_U − μ₁)/(σ/√n) )',
          note: 'When μ = μ₁, Z = (X̄ − μ₁)/(σ/√n) ~ N(0, 1). Substitute A_L and A_U:',
        },
        {
          step: 3,
          title: 'Express β and Power in Terms of Standard Normal CDF Φ(·)',
          equation: 'β(μ₁) = Φ( z_{α/2} − Δ ) − Φ( −z_{α/2} − Δ ),   where   Δ = (μ₁ − μ₀) / (σ / √n)',
          note: 'Notice that as n increases or |μ₁ − μ₀| increases, |Δ| grows larger, driving β → 0 and Power = 1 − β → 1.',
        },
      ],
      result: 'β(μ₁) = Φ(z_{α/2} − Δ) − Φ(−z_{α/2} − Δ);   Power = 1 − β(μ₁).',
    },
    keyTakeawayN:
      'Never say "Accept H₀" in formal statistical phrasing when p > α—state "Fail to reject H₀ (insufficient evidence against H₀ at level α)". Also check whether the claim specifies direction (< or > → one-tailed) or mere difference (≠ → two-tailed).',
  },
  {
    id: 'ch8-sub-2',
    code: '8.2',
    title: 'z-Tests for Single Mean & Difference of Two Means (Large Samples / Known σ)',
    depths: ['SD', 'D', 'I', 'E', 'A', 'N'] as DepthCode[],
    definitionSD:
      'A z-test uses the Standard Normal statistic Z ~ N(0, 1) under H₀ to test hypotheses about a single population mean μ or the difference between two population means (μ₁ − μ₂) when population standard deviation(s) σ are known or sample sizes are large (n ≥ 30).',
    descriptionD:
      'Single Mean: H₀: μ = μ₀, Z = (x̄ − μ₀) / (σ / √n). If σ is unknown and n ≥ 30, replace σ with sample s via CLT. Difference of Two Means (independent samples): H₀: μ₁ − μ₂ = δ₀ (usually δ₀ = 0), Z = [(x̄₁ − x̄₂) − δ₀] / √(σ₁²/n₁ + σ₂²/n₂), substituting s₁², s₂² when n₁, n₂ ≥ 30.',
    explanationE:
      'Because X̄ ~ N(μ, σ²/n) exactly for Normal populations (and approximately for any population with finite variance when n ≥ 30 by the Central Limit Theorem), standardizing by the Standard Error yields a N(0, 1) pivot whose critical values depend only on α and tail direction (±1.96 for 5% two-tailed; ±1.645 for 5% one-tailed).',
    illustrationI:
      'In PU Model Q9, a sample of n = 50 with x̄ = 90 is tested against μ₀ = 100 and σ = 8 at α = 0.05 (two-tailed): SE = 8/√50 = 1.1314, Z = (90 − 100)/1.1314 = −8.839, which lies far outside ±1.96, rejecting H₀.',
    applicationA:
      'Checking whether a production run shifted from target voltage/strength specification, or comparing average lifetimes of LED batches from two assembly lines.',
    keyTakeawayN:
      'If n < 30 AND σ is unknown, do NOT use a z-test—switch immediately to Student’s t-test (Subtopic 8.4). Use z-test only when σ is explicitly given OR n ≥ 30.',
  },
  {
    id: 'ch8-sub-3',
    code: '8.3',
    title: 'z-Tests for Single Proportion & Difference of Two Proportions',
    depths: ['SD', 'D', 'DR', 'I', 'E', 'A', 'N'] as DepthCode[],
    definitionSD:
      'Large-sample proportion z-tests evaluate claims about a population proportion p (H₀: p = p₀) or equality of two independent population proportions (H₀: p₁ = p₂) using the Normal approximation to the Binomial when np ≥ 5 and nq ≥ 5.',
    descriptionD:
      'Single Proportion: p̂ = x/n, Z = (p̂ − p₀) / √(p₀q₀ / n), where q₀ = 1 − p₀. Difference of Two Proportions: p̂₁ = x₁/n₁, p̂₂ = x₂/n₂, pooled proportion p̂ = (x₁ + x₂) / (n₁ + n₂), q̂ = 1 − p̂, and Z = (p̂₁ − p̂₂) / √[ p̂q̂ · (1/n₁ + 1/n₂) ].',
    explanationE:
      'Crucial Distinction from Unit 7 (Confidence Intervals): In hypothesis testing for a single proportion, the Null Hypothesis assumes the true parameter is p₀, so Standard Error MUST use p₀q₀ (NOT p̂q̂!). Similarly, under H₀: p₁ = p₂ = p, both samples share a single common proportion, which is best estimated by pooling counts into p̂ = (x₁ + x₂)/(n₁ + n₂).',
    illustrationI:
      'Comparing defect rates between Plant A (36/300 = 12%) and Plant B (16/200 = 8%): pooled p̂ = (36 + 16)/(300 + 200) = 52/500 = 0.104, giving SE = √(0.104×0.896×(1/300+1/200)) = 0.02787 and Z = 1.435.',
    applicationA:
      'Testing defective-component rates against a supplier guarantee, or comparing pass rates / packet-drop rates across two manufacturing shifts or routers.',
    derivationDR: {
      title: 'Derivation (DR): Pooled Two-Proportion Z-Statistic Under H₀: p₁ = p₂',
      goal: 'Derive Z = (p̂₁ − p̂₂) / √[p̂q̂(1/n₁ + 1/n₂)] starting from two independent Binomial proportions.',
      steps: [
        {
          step: 1,
          title: 'Write Exact Variance of (p̂₁ − p̂₂) for Independent Samples',
          equation: 'E(p̂₁ − p̂₂) = p₁ − p₂;   Var(p̂₁ − p̂₂) = Var(p̂₁) + Var(p̂₂) = (p₁q₁ / n₁) + (p₂q₂ / n₂)',
          note: 'Variances add even when subtracting two independent estimators.',
        },
        {
          step: 2,
          title: 'Impose Null Hypothesis H₀: p₁ = p₂ = p',
          equation: 'Under H₀:  E(p̂₁ − p̂₂) = 0   and   Var₀(p̂₁ − p̂₂) = p(1 − p) · (1/n₁ + 1/n₂)',
          note: 'Since the common null value p is unknown, combine both samples to form its minimum-variance unbiased pooled estimate:',
        },
        {
          step: 3,
          title: 'Substitute Pooled p̂ = (x₁ + x₂) / (n₁ + n₂)',
          equation: 'p̂ = (n₁p̂₁ + n₂p̂₂) / (n₁ + n₂) = (x₁ + x₂) / (n₁ + n₂)  ⇒  Z = (p̂₁ − p̂₂) / √[ p̂(1 − p̂)(1/n₁ + 1/n₂) ] ~ N(0, 1)',
          note: 'Valid when n₁p̂ ≥ 5, n₁q̂ ≥ 5, n₂p̂ ≥ 5, and n₂q̂ ≥ 5.',
        },
      ],
      result: 'Z = (p̂₁ − p̂₂) / √[ p̂q̂ (1/n₁ + 1/n₂) ],   where   p̂ = (x₁ + x₂)/(n₁ + n₂).',
    },
    keyTakeawayN:
      'Always check if the problem gives counts x (e.g., 36 defectives) or percentages p̂ (e.g., 12%). If percentages are given, convert x₁ = n₁p̂₁ and x₂ = n₂p̂₂ before computing pooled p̂ = (n₁p̂₁ + n₂p̂₂)/(n₁ + n₂)!',
  },
  {
    id: 'ch8-sub-4',
    code: '8.4',
    title: "Student's t-Tests: Single Mean, Difference of Two Means & Paired t-Test",
    depths: ['SD', 'D', 'I', 'E', 'A', 'N'] as DepthCode[],
    definitionSD:
      "Student's t-tests replace unknown population standard deviation σ with unbiased sample SD s in small Normal samples (typically n < 30), yielding heavier-tailed t_ν statistics parameterized by degrees of freedom ν.",
    descriptionD:
      '(1) Single Mean t-Test: t = (x̄ − μ₀) / (s / √n), df = n − 1, where s² = ∑(xᵢ − x̄)²/(n − 1). (2) Independent Two-Mean Pooled t-Test (assuming σ₁² = σ₂²): t = [(x̄₁ − x̄₂) − 0] / [ s_p √(1/n₁ + 1/n₂) ], df = n₁ + n₂ − 2, with s_p² = [(n₁−1)s₁² + (n₂−1)s₂²] / (n₁ + n₂ − 2). (3) Paired t-Test (dependent/before-after observations): let dᵢ = xᵢ − yᵢ, t = (d̄ − 0) / (s_d / √n), df = n − 1.',
    explanationE:
      'When two measurements are taken on the SAME subject, circuit, or substation (e.g., Before vs. After regulator installation, or Left vs. Right measurement on n specimens), the observations are correlated, NOT independent! You must collapse the n pairs into n differences dᵢ = xᵢ − yᵢ and run a 1-sample t-test on d̄ with df = n − 1—never an independent two-sample t-test with df = 2n − 2.',
    illustrationI:
      'Testing 8 substations before and after capacitor bank installation gives 8 paired differences d = [5, 3, 6, 4, 2, 7, 5, 4] with d̄ = 4.50, s_d = 1.6036, t = 4.50 / (1.6036/√8) = 7.937 against t_{0.05, 7} = 1.895.',
    applicationA:
      'Small-lot component destructive testing, comparing two prototype amplifier gains on n = 10 boards each, and before/after calibration drift studies.',
    keyTakeawayN:
      'Check sample variance formula carefully: if a PU problem provides ∑(xᵢ − x̄)² or raw data, divide by (n − 1) for s². If a problem gives "standard deviation of sample S" defined with divisor n, convert s² = [n/(n − 1)]·S² (or directly t = (x̄ − μ₀) / (S / √(n − 1))).',
  },
  {
    id: 'ch8-sub-5',
    code: '8.5',
    title: 'Chi-Square (χ²) Tests: Goodness of Fit, Independence of Attributes & Validity',
    depths: ['SD', 'D', 'DR', 'I', 'E', 'A', 'N'] as DepthCode[],
    definitionSD:
      'The Chi-Square test compares observed cell frequency counts Oᵢ against theoretical expected frequencies Eᵢ via χ² = ∑ [ (Oᵢ − Eᵢ)² / Eᵢ ], following approximately a χ²_ν distribution.',
    descriptionD:
      '(1) Goodness of Fit: Tests whether an observed frequency distribution fits a specified theoretical distribution (Uniform, Binomial, Poisson, Normal); df = k − 1 − m, where k is the number of classes AFTER pooling and m is the number of parameters estimated from the sample (m = 0 if given, m = 1 for Poisson λ̂ = x̄ or Binomial p̂, m = 2 for Normal μ̂, σ̂). (2) Independence of Attributes (r × c Contingency Table): Tests H₀: row and column attributes are independent. Expected count E_{ij} = (Row_i Total × Col_j Total) / N, df = (r − 1)(c − 1).',
    explanationE:
      'Validity Conditions of Chi-Square Test (High-Yield PU Theory Question): (1) Total sample size must be reasonably large: N ≥ 50; (2) No expected cell frequency should be less than 5 (all Eᵢ ≥ 5; if any Eᵢ < 5, pool/merge that cell with an adjacent category BEFORE computing χ² and subtract 1 df per merged bin); (3) Observations must be randomly drawn and mutually independent; (4) Data MUST be raw frequency counts (integers), NEVER percentages, proportions, or rates. Note: For a 2 × 2 table with 5 ≤ E < 10 or N < 40, Yates’ Continuity Correction subtracts 0.5 from |O − E| before squaring.',
    illustrationI:
      'In PU Model Q3, 200 workers are cross-classified by Training (150 Trained, 50 Untrained) and Performance (120 Good, 80 Not Good). All E_{ij} ∈ {90, 60, 30, 20} ≥ 5 and N = 200 ≥ 50, yielding χ² = 11.111 > χ²_{0.05, 1} = 3.841 ⇒ performance depends on training.',
    applicationA:
      'Testing whether defective relays are independent of shift/machine/training, and testing whether arrival or failure counts statistically follow Binomial or Poisson models.',
    derivationDR: {
      title: 'Derivation (DR): 2 × 2 Contingency Table Shortcut Formula',
      goal: 'Prove that for a 2 × 2 table with cells [[a, b], [c, d]] and total N = a + b + c + d, ∑(O − E)²/E simplifies identically to N(ad − bc)² / [(a+b)(c+d)(a+c)(b+d)].',
      steps: [
        {
          step: 1,
          title: 'Compute Deviation (O₁₁ − E₁₁) for the First Cell',
          equation: 'O₁₁ − E₁₁ = a − [(a + b)(a + c) / N] = [ a(a + b + c + d) − (a² + ac + ab + bc) ] / N = (ad − bc) / N',
          note: 'Notice that every cell deviation has identical magnitude |ad − bc| / N with alternating signs (±)!',
        },
        {
          step: 2,
          title: 'Factor Out Common Numerator (ad − bc)² / N²',
          equation: 'χ² = [(ad − bc)² / N²] · [ 1/E₁₁ + 1/E₁₂ + 1/E₂₁ + 1/E₂₂ ]',
          note: 'Substitute E₁₁ = R₁C₁/N, E₁₂ = R₁C₂/N, E₂₁ = R₂C₁/N, E₂₂ = R₂C₂/N where R₁=a+b, R₂=c+d, C₁=a+c, C₂=b+d:',
        },
        {
          step: 3,
          title: 'Sum Reciprocal Expected Frequencies',
          equation: '∑(1/E_{ij}) = N · [ (R₂C₂ + R₂C₁ + R₁C₂ + R₁C₁) / (R₁ R₂ C₁ C₂) ] = N · [ (R₁ + R₂)(C₁ + C₂) / (R₁ R₂ C₁ C₂) ] = N³ / (R₁ R₂ C₁ C₂)',
          note: 'Since R₁ + R₂ = N and C₁ + C₂ = N. Multiplying by (ad − bc)² / N² cancels N²:',
        },
      ],
      result: 'χ² = [ N (ad − bc)² ] / [ (a + b)(c + d)(a + c)(b + d) ],   with df = 1.',
    },
    keyTakeawayN:
      'Before computing χ² in Goodness-of-Fit, ALWAYS verify two sums: ∑Oᵢ = ∑Eᵢ = N and every Eᵢ ≥ 5. Notice in Chi-Square tests, the rejection region is ALWAYS strictly right-tailed (χ²_calc > χ²_{α, df})!',
  },
];

export const CH8_FORMULA_SHEET: FormulaItem[] = [
  {
    id: 'ch8-f-z-mean',
    category: 'Location',
    quantity: 'z-Test for Single Mean',
    symbol: 'Z_mean',
    formula: 'Z = (x̄ − μ₀) / (σ / √n)   (use s if σ unknown & n ≥ 30)',
    assumptionOrConstant: 'Normal population or CLT (n ≥ 30); two-tailed if H₁: μ ≠ μ₀',
    unit: 'Standard Normal Z (dimensionless)',
  },
  {
    id: 'ch8-f-z-2mean',
    category: 'Location',
    quantity: 'z-Test for Difference of Two Means',
    symbol: 'Z_{μ₁−μ₂}',
    formula: 'Z = [(x̄₁ − x̄₂) − δ₀] / √(σ₁²/n₁ + σ₂²/n₂)',
    assumptionOrConstant: 'Independent samples; n₁, n₂ ≥ 30 (use s₁², s₂² if σ₁, σ₂ unknown)',
    unit: 'Standard Normal Z',
  },
  {
    id: 'ch8-f-z-prop',
    category: 'Location',
    quantity: 'z-Test for Single Proportion',
    symbol: 'Z_prop',
    formula: 'Z = (p̂ − p₀) / √(p₀ q₀ / n),   q₀ = 1 − p₀',
    assumptionOrConstant: 'MUST use null p₀q₀ in SE; valid for np₀ ≥ 5 and nq₀ ≥ 5',
    unit: 'Standard Normal Z',
  },
  {
    id: 'ch8-f-z-2prop',
    category: 'Location',
    quantity: 'z-Test for Difference of Two Proportions',
    symbol: 'Z_{p₁−p₂}',
    formula: 'Z = (p̂₁ − p̂₂) / √[ p̂q̂ (1/n₁ + 1/n₂) ],   p̂ = (x₁ + x₂)/(n₁ + n₂)',
    assumptionOrConstant: 'Pooled p̂ under H₀: p₁ = p₂; q̂ = 1 − p̂; all nᵢp̂, nᵢq̂ ≥ 5',
    unit: 'Standard Normal Z',
  },
  {
    id: 'ch8-f-t-1mean',
    category: 'Dispersion',
    quantity: "Single-Mean Student's t-Test",
    symbol: 't_{n−1}',
    formula: 't = (x̄ − μ₀) / (s / √n),   s² = ∑(xᵢ − x̄)² / (n − 1)',
    assumptionOrConstant: 'df = n − 1; Normal population; unknown σ; small n (< 30)',
    unit: 't-statistic (df = n − 1)',
  },
  {
    id: 'ch8-f-t-2mean',
    category: 'Dispersion',
    quantity: 'Two-Mean Independent Pooled t-Test',
    symbol: 't_{n₁+n₂−2}',
    formula: 't = (x̄₁ − x̄₂) / [ s_p √(1/n₁ + 1/n₂) ],   s_p² = [(n₁−1)s₁² + (n₂−1)s₂²]/(n₁ + n₂ − 2)',
    assumptionOrConstant: 'df = n₁ + n₂ − 2; independent Normal populations with σ₁ = σ₂',
    unit: 't-statistic (df = n₁ + n₂ − 2)',
  },
  {
    id: 'ch8-f-t-paired',
    category: 'Dispersion',
    quantity: 'Paired t-Test (Dependent Samples)',
    symbol: 't_paired',
    formula: 't = d̄ / (s_d / √n),   dᵢ = xᵢ − yᵢ,   s_d² = ∑(dᵢ − d̄)² / (n − 1)',
    assumptionOrConstant: 'df = n − 1 (NOT 2n − 2); correlated before/after measurements on n pairs',
    unit: 't-statistic (df = n − 1)',
  },
  {
    id: 'ch8-f-chi-gof',
    category: 'Dispersion',
    quantity: 'Chi-Square Goodness of Fit',
    symbol: 'χ²_GoF',
    formula: 'χ² = ∑_{i=1}^k [ (Oᵢ − Eᵢ)² / Eᵢ ],   df = k − 1 − m',
    assumptionOrConstant: 'k = bins AFTER pooling (Eᵢ ≥ 5); m = params estimated from sample; N ≥ 50',
    unit: 'Chi-Square (df = k − 1 − m)',
  },
  {
    id: 'ch8-f-chi-ind',
    category: 'Dispersion',
    quantity: 'Chi-Square Independence (r × c & 2 × 2)',
    symbol: 'χ²_ind',
    formula: 'E_{ij} = (Rᵢ·C_j)/N, df = (r−1)(c−1);  2×2: χ² = N(ad−bc)² / [(a+b)(c+d)(a+c)(b+d)]',
    assumptionOrConstant: 'Always right-tailed (reject if χ²_calc > χ²_{α, df}); Yates −0.5 if 5 ≤ E < 10 in 2×2',
    unit: 'Chi-Square (df = (r−1)(c−1))',
  },
  {
    id: 'ch8-f-crit-z',
    category: 'Properties & Constants',
    quantity: 'Critical Z-Values (α = 0.10, 0.05, 0.01)',
    symbol: 'z_crit',
    formula: 'Two-tailed: ±1.645 (10%), ±1.96 (5%), ±2.576 (1%)  |  One-tailed: ±1.282, ±1.645, ±2.326',
    assumptionOrConstant: 'Two-tailed splits α/2 in each tail; one-tailed puts full α in one tail',
    unit: 'Critical Z boundary',
  },
  {
    id: 'ch8-f-crit-tchi',
    category: 'Properties & Constants',
    quantity: 'Key Critical t & χ² Values (α = 0.05)',
    symbol: 't_crit, χ²_crit',
    formula: 't_{0.025, 7}=2.365, t_{0.05, 7}=1.895, t_{0.025, 10}=2.228  |  χ²_{0.05, df=1..4}: 3.841, 5.991, 7.815, 9.488',
    assumptionOrConstant: 'χ²_{0.01, 1} = 6.635, χ²_{0.01, 2} = 9.210; always check upper tail for χ²',
    unit: 'Critical table value',
  },
  {
    id: 'ch8-f-errors',
    category: 'Properties & Constants',
    quantity: 'Error Matrix & Validity Rules',
    symbol: 'α, β, 1−β',
    formula: 'α = P(Reject H₀ | H₀ true);  β = P(Fail to reject H₀ | H₀ false);  χ² valid ⇔ N ≥ 50 & Eᵢ ≥ 5',
    assumptionOrConstant: 'χ² requires raw integer counts (never %); pool adjacent classes if any Eᵢ < 5',
    unit: 'Probability ∈ [0, 1] / Count',
  },
];

export const CH8_SOLVED_QUESTIONS: SolvedProblem[] = [
  {
    id: 'pu-model-q3',
    tag: 'PU Model Set · Group A, Q3',
    title: 'Chi-Square Test of Independence: Worker Training vs. Performance (2 × 2 Table)',
    marks: '10 Marks',
    source: 'Attached PDF — PU V Sem Final Exam 2024 Model Question, Pages 7–8',
    statement:
      'In an industry, 200 workers employed for a specific job were classified according to their performance (Good / Not Good) and training received (Trained / Untrained): Trained [Good = 100, Not Good = 50, Total = 150]; Untrained [Good = 20, Not Good = 30, Total = 50]; Column Totals [Good = 120, Not Good = 80, N = 200]. Use the chi-square test of independence at 5% level of significance and write your conclusion.',
    given: [
      'Sample size N = 200 workers; 2 × 2 contingency table (r = 2 rows, c = 2 columns).',
      'Observed counts: a = 100 (Trained, Good), b = 50 (Trained, Not Good), c = 20 (Untrained, Good), d = 30 (Untrained, Not Good).',
      'Marginal totals: R₁ = 150, R₂ = 50; C₁ = 120, C₂ = 80; α = 0.05.',
    ],
    tableHeaders: ['Cell (Training, Perf.)', 'Observed (O)', 'Expected E = (R·C)/N', 'O − E', '(O − E)²', '(O − E)² / E'],
    tableRows: [
      ['Trained · Good', '100', '(150 × 120) / 200 = 90', '+10', '100', '100 / 90 = 1.1111'],
      ['Trained · Not Good', '50', '(150 × 80) / 200 = 60', '−10', '100', '100 / 60 = 1.6667'],
      ['Untrained · Good', '20', '(50 × 120) / 200 = 30', '−10', '100', '100 / 30 = 3.3333'],
      ['Untrained · Not Good', '30', '(50 × 80) / 200 = 20', '+10', '100', '100 / 20 = 5.0000'],
    ],
    tableTotals: ['Total (N = 200)', '∑O = 200', '∑E = 200 (min E = 20 ≥ 5)', '∑ = 0', '—', 'χ²_calc = 11.1111'],
    steps: [
      {
        heading: 'Step 1: State Null & Alternative Hypotheses and Level of Significance',
        work: [
          'H₀: Performance and training are independent (training has no association with worker performance).',
          'H₁: Performance and training are dependent (training is associated with worker performance).',
          'Level of significance: α = 0.05 (chi-square independence test is always right-tailed).',
        ],
      },
      {
        heading: 'Step 2: Verify Validity Conditions & Compute Expected Frequencies E_{ij} = (Rᵢ · C_j)/N',
        work: [
          'E₁₁ = (150 × 120)/200 = 90;   E₁₂ = (150 × 80)/200 = 60',
          'E₂₁ = (50 × 120)/200 = 30;    E₂₂ = (50 × 80)/200 = 20',
          'Validity check: N = 200 ≥ 50 and minimum E_{ij} = 20 ≥ 5 → Chi-square test is strictly valid without pooling or Yates’ correction.',
        ],
      },
      {
        heading: 'Step 3: Compute χ² Test Statistic & Cross-Check via 2 × 2 Shortcut',
        work: [
          'χ²_calc = ∑ (O − E)² / E = 1.1111 + 1.6667 + 3.3333 + 5.0000 = 11.1111 (= 100/9)',
          '2 × 2 Shortcut Verification: χ² = [N(ad − bc)²] / [(a+b)(c+d)(a+c)(b+d)]',
          'χ² = [200 · (100×30 − 50×20)²] / (150 × 50 × 120 × 80) = (200 × 2000²) / 72,000,000 = 800/72 = 11.1111 (Verified!)',
        ],
      },
      {
        heading: 'Step 4: Degrees of Freedom, Critical Value & Decision',
        work: [
          'Degrees of freedom: df = (r − 1)(c − 1) = (2 − 1)(2 − 1) = 1',
          'Tabulated critical value at α = 0.05 and df = 1: χ²_{0.05, 1} = 3.841',
          'Comparison: χ²_calc = 11.1111 > χ²_{0.05, 1} = 3.841  ⇒  Reject H₀ at 5% level of significance.',
          'Interpretation: Trained workers have 100/150 = 66.7% Good performance vs. 20/50 = 40.0% for untrained workers.',
        ],
      },
    ],
    finalAnswer: [
      'χ²_calc = 11.111 (df = 1) > χ²_crit(0.05, 1) = 3.841  ⇒  Reject H₀',
      'Conclusion: Worker performance depends significantly on training at α = 0.05 (training boosts Good performance from 40% to 66.7%).',
    ],
  },
  {
    id: 'pu-model-q9',
    tag: 'PU Model Set · Group B, Q9',
    title: 'Single-Mean z-Test: Testing Sample Consistency With N(100, 8²)',
    marks: '5 Marks',
    source: 'Attached PDF — PU V Sem Final Exam 2024 Model Question, Page 9',
    statement:
      'A random sample of size 50 was drawn and sample mean was found to be 90. Test whether this sample could have come from a normal population with mean 100 and standard deviation 8 at 5% level of significance.',
    given: [
      'Sample size: n = 50 (≥ 30); Sample mean: x̄ = 90.',
      'Hypothesized population mean: μ₀ = 100; Known population SD: σ = 8.',
      'Level of significance: α = 0.05 (two-tailed test).',
    ],
    steps: [
      {
        heading: 'Step 1: Formulate Null & Alternative Hypotheses',
        work: [
          'H₀: μ = 100 (the sample could have come from the normal population N(100, 8²)).',
          'H₁: μ ≠ 100 (the sample mean differs significantly from 100 — two-tailed test).',
        ],
      },
      {
        heading: 'Step 2: Select Test Statistic & Compute Standard Error',
        work: [
          'Since the population standard deviation σ = 8 is known (and n = 50 ≥ 30), apply the single-mean Z-test:',
          'SE(X̄) = σ / √n = 8 / √50 = 8 / 7.0710678 = 1.131371',
        ],
      },
      {
        heading: 'Step 3: Compute Calculated Z-Statistic',
        work: [
          'Z_calc = (x̄ − μ₀) / (σ / √n) = (90 − 100) / 1.131371 = −10 / 1.131371 = −8.8388 ≈ −8.839',
          '|Z_calc| = 8.839',
        ],
      },
      {
        heading: 'Step 4: Critical Value & Decision at α = 0.05',
        work: [
          'For a two-tailed test at α = 0.05, critical values are Z_{α/2} = ±1.96.',
          'Rejection region: |Z| > 1.96 (i.e., Z < −1.96 or Z > +1.96).',
          'Since |Z_calc| = 8.839 > 1.96 (p-value < 0.0001), we reject H₀.',
        ],
      },
    ],
    finalAnswer: [
      'Z_calc = −8.839 (|Z_calc| = 8.839 > Z_crit = 1.96)  ⇒  Reject H₀ at α = 0.05',
      'Conclusion: The sample could NOT have reasonably come from the normal population N(100, 8²).',
    ],
  },
  {
    id: 'ch8-extra-1',
    tag: 'Extra Exam-Level Numerical 1',
    title: 'Paired t-Test: Evaluating Substation Reactive Power Loss Reduction',
    marks: '5–10 Marks Pattern',
    source: 'High-Yield PU Exam Practice (Small Dependent Samples · Paired t-Test)',
    statement:
      'To test whether installing automated capacitor banks reduces feeder reactive power loss (kVAR), measurements were recorded on n = 8 substations Before (X) and After (Y) installation, yielding differences dᵢ = Xᵢ − Yᵢ = [5, 3, 6, 4, 2, 7, 5, 4] kVAR. Test at α = 0.05 whether the capacitor banks significantly reduce reactive power loss.',
    given: [
      'Number of paired substations: n = 8  ⇒  df = n − 1 = 7.',
      'Paired differences dᵢ = Before − After = [5, 3, 6, 4, 2, 7, 5, 4] kVAR.',
      'Question asks if loss "reduces" (Before − After > 0) ⇒ Right-tailed test at α = 0.05.',
    ],
    tableHeaders: ['Substation (i)', 'dᵢ = Xᵢ − Yᵢ', 'dᵢ − d̄', '(dᵢ − d̄)²'],
    tableRows: [
      ['1', '5', '+0.5', '0.25'],
      ['2', '3', '−1.5', '2.25'],
      ['3', '6', '+1.5', '2.25'],
      ['4', '4', '−0.5', '0.25'],
      ['5', '2', '−2.5', '6.25'],
      ['6', '7', '+2.5', '6.25'],
      ['7', '5', '+0.5', '0.25'],
      ['8', '4', '−0.5', '0.25'],
    ],
    tableTotals: ['n = 8', '∑dᵢ = 36 (d̄ = 4.50)', '∑ = 0.0', '∑(dᵢ − d̄)² = 18.00'],
    steps: [
      {
        heading: 'Step 1: Hypotheses & Tail Specification',
        work: [
          'H₀: μ_d = 0 (capacitor banks produce zero mean reduction in reactive loss).',
          'H₁: μ_d > 0 (capacitor banks significantly reduce loss — right-tailed test, α = 0.05).',
        ],
      },
      {
        heading: 'Step 2: Sample Mean d̄ and Sample Standard Deviation s_d',
        work: [
          'd̄ = ∑dᵢ / n = 36 / 8 = 4.50 kVAR',
          's_d² = ∑(dᵢ − d̄)² / (n − 1) = 18.00 / (8 − 1) = 18 / 7 = 2.571429',
          's_d = √2.571429 = 1.603567 kVAR',
        ],
      },
      {
        heading: 'Step 3: Paired t-Statistic & Critical Value Comparison',
        work: [
          'SE(d̄) = s_d / √n = 1.603567 / √8 = 1.603567 / 2.828427 = 0.566947',
          't_calc = (d̄ − 0) / SE(d̄) = 4.50 / 0.566947 = 7.937',
          'Critical value (right-tailed, α = 0.05, df = 7): t_{0.05, 7} = 1.895',
          'Since t_calc = 7.937 > 1.895, reject H₀.',
        ],
      },
    ],
    finalAnswer: [
      't_calc = 7.937 (df = 7) > t_crit(0.05, one-tailed) = 1.895  ⇒  Reject H₀',
      'Conclusion: Automated capacitor banks significantly reduce feeder reactive power loss (mean drop = 4.50 kVAR).',
    ],
  },
  {
    id: 'ch8-extra-2',
    tag: 'Extra Exam-Level Numerical 2',
    title: 'Two-Proportion z-Test & Chi-Square Goodness-of-Fit With Validity Pooling',
    marks: '10 Marks Pattern',
    source: 'High-Yield PU Exam Practice (Two-Proportion Z & χ² Cell-Pooling Rule)',
    statement:
      '(a) Plant A produces 36 defective relays out of 300 tested, while Plant B produces 16 defective relays out of 200 tested. Test at α = 0.05 whether the two plants differ in defect proportion. (b) Over N = 150 shifts, observed voltage spikes x = [0, 1, 2, 3, 4] had O = [62, 54, 24, 7, 3] against expected Poisson(λ = 0.90) frequencies E = [60.98, 54.88, 24.70, 7.41, 2.03]. Test goodness-of-fit at α = 0.05 while enforcing χ² validity.',
    given: [
      'Part (a): n₁ = 300, x₁ = 36 (p̂₁ = 0.12); n₂ = 200, x₂ = 16 (p̂₂ = 0.08); α = 0.05 (two-tailed).',
      'Part (b): N = 150, parameter λ = 0.90 specified a priori (m = 0), notice E₄ = 2.03 < 5 violates χ² validity.',
    ],
    tableHeaders: ['Part (b) Spike Class', 'Observed (O)', 'Expected (E ≥ 5)', 'O − E', '(O − E)² / E'],
    tableRows: [
      ['x = 0', '62', '60.98', '+1.02', '0.0171'],
      ['x = 1', '54', '54.88', '−0.88', '0.0141'],
      ['x = 2', '24', '24.70', '−0.70', '0.0198'],
      ['x ≥ 3 (pooled 3 & 4)', '7 + 3 = 10', '7.41 + 2.03 = 9.44', '+0.56', '0.0332'],
    ],
    tableTotals: ['k = 4 classes (after pooling)', '∑O = 150', '∑E = 150.00 (min 9.44 ≥ 5)', '∑ = 0.00', 'χ²_calc = 0.0842'],
    steps: [
      {
        heading: 'Part (a): Two-Proportion Pooled Z-Test (H₀: p₁ = p₂ vs. H₁: p₁ ≠ p₂)',
        work: [
          'Pooled proportion: p̂ = (x₁ + x₂) / (n₁ + n₂) = (36 + 16) / (300 + 200) = 52 / 500 = 0.104,   q̂ = 0.896',
          'SE(p̂₁ − p̂₂) = √[ p̂q̂(1/n₁ + 1/n₂) ] = √[ 0.104 × 0.896 × (1/300 + 1/200) ] = √(0.093184 × 0.0083333) = 0.027866',
          'Z_calc = (0.12 − 0.08) / 0.027866 = 0.04 / 0.027866 = +1.435',
          'Critical Z_{0.025} = ±1.96. Since |Z_calc| = 1.435 < 1.96, we FAIL to reject H₀ (no significant difference at 5%).',
        ],
      },
      {
        heading: 'Part (b): Goodness-of-Fit χ² Test With Adjacent Class Pooling',
        work: [
          'Since E₄ = 2.03 < 5, merge x = 3 and x = 4 into a single class "x ≥ 3": O = 10, E = 9.44 ≥ 5.',
          'χ²_calc = 0.0171 + 0.0141 + 0.0198 + 0.0332 = 0.0842',
          'Degrees of freedom after pooling: df = k − 1 − m = 4 − 1 − 0 = 3 (note: df = 2 if λ̂ was estimated from sample).',
          'Critical value χ²_{0.05, 3} = 7.815 (even at df = 2, χ²_{0.05, 2} = 5.991). Since 0.0842 ≪ 7.815, fail to reject H₀.',
        ],
      },
    ],
    finalAnswer: [
      '(a) Z_calc = 1.435 < 1.96  ⇒  Fail to reject H₀ (no statistically significant difference between Plant A & Plant B defect rates).',
      '(b) χ²_calc = 0.0842 (df = 3 after pooling) ≪ 7.815  ⇒  Fail to reject H₀ (Poisson(0.90) fits the spike counts well).',
    ],
  },
];

export const CH8_EXAM_TRAPS: ExamTrap[] = [
  {
    id: 'ch8-trap-sign-1',
    category: 'Sign Convention',
    title: 'Using Sample p̂ Instead of Null p₀ in Single-Proportion z-Test Standard Error',
    wrongApproach: 'Computing Z = (p̂ − p₀) / √(p̂q̂ / n), which confuses confidence interval SE (Unit 7) with hypothesis test SE (Unit 8).',
    correctRule: 'In a single-proportion hypothesis test, H₀ assumes p = p₀ is true, so ALWAYS use Z = (p̂ − p₀) / √(p₀q₀ / n).',
    examTip: 'Remember: Confidence Intervals have no H₀ (use p̂q̂); Hypothesis Tests assume H₀ (use p₀q₀ for 1-prop, pooled p̂ for 2-prop).',
  },
  {
    id: 'ch8-trap-sign-2',
    category: 'Sign Convention',
    title: 'One-Tailed vs. Two-Tailed Critical Value & Sign Error (1.645 vs. 1.96)',
    wrongApproach: 'Using ±1.96 when the problem asks "is mean less than / greater than / reduced?" or using +1.645 for a left-tailed test H₁: μ < μ₀.',
    correctRule: 'Words like "differs / changed / could have come from" (PU Model Q9) ⇒ Two-tailed (5%: ±1.96). "Greater / improved" ⇒ Right-tailed (+1.645). "Less / reduced / dropped" ⇒ Left-tailed (−1.645; reject if Z_calc < −1.645).',
    examTip: 'Draw a quick bell curve and shade the tail matching the inequality symbol in H₁ before comparing numbers.',
  },
  {
    id: 'ch8-trap-sign-3',
    category: 'Sign Convention',
    title: 'Forgetting to Pool Proportions in Two-Proportion z-Test',
    wrongApproach: 'Using unpooled √(p̂₁q̂₁/n₁ + p̂₂q̂₂/n₂) to test H₀: p₁ = p₂.',
    correctRule: 'Under H₀: p₁ = p₂, compute pooled p̂ = (x₁ + x₂)/(n₁ + n₂) and use SE = √[p̂q̂(1/n₁ + 1/n₂)].',
    examTip: 'If given percentages instead of counts, multiply nᵢ·p̂ᵢ first to recover x₁ and x₂.',
  },
  {
    id: 'ch8-trap-geom-1',
    category: 'Boundary & Slope Geometry',
    title: 'Using Chi-Square on Percentages or Failing to Pool Cells With Eᵢ < 5',
    wrongApproach: 'Converting observed counts into percentages before running ∑(O−E)²/E, or keeping a tail bin with E = 2.03 in the sum.',
    correctRule: 'χ² is ONLY valid on raw integer counts with N ≥ 50 and every Eᵢ ≥ 5. Pool adjacent categories with E < 5 BEFORE computing χ² and compute df from the FINAL pooled bin count k.',
    examTip: 'Because (O − E)²/E scales linearly with N, running χ² on percentages artificially distorts the test statistic!',
  },
  {
    id: 'ch8-trap-geom-2',
    category: 'Boundary & Slope Geometry',
    title: 'Wrong Degrees of Freedom in Paired t-Test vs. Independent Two-Sample t-Test',
    wrongApproach: 'Using independent two-sample df = n + n − 2 = 14 on 8 paired Before/After measurements.',
    correctRule: 'Dependent before/after pairs use Paired t-Test on dᵢ = xᵢ − yᵢ with df = n − 1 (= 7). Independent groups use pooled t with df = n₁ + n₂ − 2.',
    examTip: 'Check whether the two columns represent the SAME n units measured twice (paired) or two SEPARATE groups (independent).',
  },
  {
    id: 'ch8-trap-geom-3',
    category: 'Boundary & Slope Geometry',
    title: 'Goodness-of-Fit df Trap: Forgetting to Subtract Estimated Parameters (k − 1 − m)',
    wrongApproach: 'Always writing df = k − 1 even when λ̂ (Poisson), p̂ (Binomial), or (μ̂, σ̂) (Normal) were estimated from the data.',
    correctRule: 'df = k_final − 1 − m, where m = 0 (theoretical distribution fully specified), m = 1 (estimated λ̂ or p̂), or m = 2 (estimated μ̂ and σ̂).',
    examTip: 'State the value of m explicitly next to df in Goodness-of-Fit problems so the grader sees you checked parameter estimation.',
  },
  {
    id: 'ch8-trap-pu-1',
    category: 'High-Yield PU Topic',
    title: 'PU Model Q3 (10 Marks) & Q9 (5 Marks): Full 6-Step Presentation',
    wrongApproach: 'Writing only the numerical value χ² = 11.11 or Z = −8.84 without stating H₀, H₁, α, df, critical value, or engineering conclusion.',
    correctRule: 'Unit 8 carries 15/60 marks! Every PU hypothesis test requires: (1) H₀ & H₁, (2) α & tail, (3) Formula + substitution, (4) df & critical value, (5) Reject / Fail to reject H₀, (6) Contextual conclusion.',
    examTip: 'In Model Q3, double-check ∑O = ∑E = 200 and verify χ² using the 2 × 2 shortcut N(ad−bc)²/[(a+b)(c+d)(a+c)(b+d)].',
  },
  {
    id: 'ch8-trap-pu-2',
    category: 'High-Yield PU Topic',
    title: 'Divisor n vs. (n − 1) in Sample Standard Deviation for Small-Sample t-Test',
    wrongApproach: 'Plugging S = √[∑(x−x̄)²/n] into t = (x̄−μ₀)/(S/√n) instead of unbiased s = √[∑(x−x̄)²/(n−1)].',
    correctRule: 'With unbiased s (divisor n − 1), t = (x̄ − μ₀)/(s/√n). If a textbook gives biased S (divisor n), use t = (x̄ − μ₀)/(S/√(n − 1)).',
    examTip: 'Verify how s was defined in the problem statement; for raw data in exams, always compute s² = ∑(x − x̄)²/(n − 1).',
  },
];
