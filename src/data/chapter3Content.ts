import { DepthCode, ExamTrap, FormulaItem, SolvedProblem, SubtopicNote } from './chapter1Content';

export const CH3_SYLLABUS_CONTEXT = {
  university: 'Purbanchal University — Faculty of Engineering, Biratnagar, Nepal',
  program: 'B.E. Biomedical / Electrical / Electronics, Com. & Automation Engineering',
  semester: 'Year III · Semester V (Effective from 2021 / 2078 Batch)',
  subject: 'Probability and Statistics',
  chapter: 'Unit 3: Probability',
  lectureHours: '6 Hrs (Syllabus) / 5 Hrs (Detailed Contents)',
  finalMarks: 15,
  totalSubjectMarks: '60 Final Theory + 20 Internal Theory + 20 Practical = 100',
  syllabusTopics: [
    'Introduction of probability: Basic terminology (random experiment, sample space, trial and events); Types of events (mutually exclusive, equally likely, independent)',
    'Definitions of probability (classical, empirical/statistical, axiomatic) & basic principles of counting',
    "Laws of probability: Additive and multiplicative (statement only in detailed contents); Conditional probability; Bayes' Theorem (statement only in detailed contents)",
  ],
  microSyllabusNote:
    'In the attached PU 5th Semester syllabus PDF, Probability & Statistics (pp. 3–5) allocates 15/60 final exam marks to Unit 3 (25% of the paper) and marks Additive/Multiplicative Laws and Bayes’ Theorem as "(statement only)" in Detailed Course Contents. Below, every subtopic is covered across SD, D, DR, I, E, A, and N—including full step-by-step derivations of the laws and Bayes’ Theorem for complete conceptual mastery.',
};

export const CH3_SUBTOPIC_NOTES: SubtopicNote[] = [
  {
    id: 'ch3-sub-1',
    code: '3.1',
    title: 'Basic Terminology & Types of Events',
    depths: ['SD', 'D', 'I', 'E', 'A'] as DepthCode[],
    definitionSD:
      'A Random Experiment is a process whose outcomes cannot be predicted with certainty beforehand even under identical conditions. The Sample Space (S) is the set of all possible outcomes, each single performance is a Trial, and any subset E ⊆ S is an Event.',
    descriptionD:
      'Events are classified by set relationships and probabilistic structure: (1) Mutually Exclusive (Disjoint) Events cannot occur simultaneously (A ∩ B = ∅); (2) Equally Likely Events have no physical bias favoring one outcome over another; (3) Exhaustive Events cover the entire sample space (A₁ ∪ A₂ ∪ … ∪ A_k = S); (4) Independent Events occur when knowledge of one event does not alter the probability of the other (P(A ∩ B) = P(A)·P(B)).',
    explanationE:
      'A critical conceptual distinction in PU exams is Mutually Exclusive vs. Independent: if P(A) > 0 and P(B) > 0, mutually exclusive events CANNOT be independent! Because if A and B are disjoint, knowing A occurred forces P(B | A) = 0 ≠ P(B). Disjointness is a set property (A ∩ B = ∅), whereas independence is a probability product property (P(A ∩ B) = P(A)P(B)).',
    illustrationI:
      'Tossing a fair die: S = {1, 2, 3, 4, 5, 6}. Let A = {2, 4, 6} (even) and B = {1, 3, 5} (odd) → mutually exclusive and exhaustive. Let C = {1, 2} (≤ 2): P(A) = 1/2, P(C) = 1/3, P(A ∩ C) = P({2}) = 1/6 = P(A)·P(C) → A and C are independent!',
    applicationA:
      'Defining fault states in power substations (line-to-ground vs. three-phase faults as mutually exclusive categories) and modeling redundant protection relays operating independently.',
    keyTakeawayN:
      'Always test independence numerically via P(A ∩ B) = P(A)·P(B), never by intuition alone.',
  },
  {
    id: 'ch3-sub-2',
    code: '3.2',
    title: 'Definitions of Probability & Basic Principles of Counting',
    depths: ['SD', 'D', 'DR', 'I', 'E', 'A', 'N'] as DepthCode[],
    definitionSD:
      'Classical (Laplace) Probability defines P(A) = n(A)/n(S) for finite equally likely outcomes; Empirical (Relative Frequency) Probability defines P(A) = lim_{n→∞} (f_A / n); Axiomatic (Kolmogorov) Probability defines P: ℱ → [0, 1] satisfying (i) P(A) ≥ 0, (ii) P(S) = 1, and (iii) countable additivity for disjoint events.',
    descriptionD:
      'To count n(A) and n(S) in complex engineering problems, we use: (1) Multiplication Principle: two sequential choices of m and n ways give m × n ways; (2) Addition Principle: mutually exclusive options give m + n ways; (3) Permutations (order matters): ⁿP_r = n! / (n − r)!; (4) Combinations (order does not matter): ⁿC_r = n! / [r!(n − r)!].',
    explanationE:
      'Classical probability fails when outcomes are not equally likely (loaded die) or when S is infinite. Empirical probability requires long-run trials and yields approximations. Kolmogorov’s axiomatic framework unifies both and supports continuous sample spaces.',
    illustrationI:
      'Selecting 3 relays out of 12 without regard to order uses combinations (¹²C₃ = 220), whereas assigning 3 distinct circuit slots A, B, C to 3 relays uses permutations (¹²P₃ = 1320).',
    applicationA:
      'Quality-control lot sampling (hypergeometric defect probabilities without replacement) and reliability combinatorics of series/parallel components.',
    derivationDR: {
      title: 'Derivation (DR): Fundamental Kolmogorov Corollaries (Complement & Sub-additivity)',
      goal: 'Prove P(A′) = 1 − P(A), P(∅) = 0, and 0 ≤ P(A) ≤ 1 directly from the 3 Kolmogorov axioms.',
      steps: [
        {
          step: 1,
          title: 'Partition Sample Space Using Event A and Complement A′',
          equation: 'S = A ∪ A′   with   A ∩ A′ = ∅',
          note: 'A and A′ are mutually exclusive and exhaustive.',
        },
        {
          step: 2,
          title: 'Apply Axiom 2 (Normalization) and Axiom 3 (Additivity)',
          equation: '1 = P(S) = P(A ∪ A′) = P(A) + P(A′)   ⇒   P(A′) = 1 − P(A)',
          note: 'Since P(A′) ≥ 0 by Axiom 1, we immediately obtain P(A) ≤ 1, hence 0 ≤ P(A) ≤ 1.',
        },
        {
          step: 3,
          title: 'Probability of Impossible Event (∅)',
          equation: '∅ = S′   ⇒   P(∅) = 1 − P(S) = 1 − 1 = 0',
          note: 'Also implies monotonicity: if A ⊆ B, then B = A ∪ (B ∩ A′) ⇒ P(B) = P(A) + P(B ∩ A′) ≥ P(A).',
        },
      ],
      result: 'P(A′) = 1 − P(A),   0 ≤ P(A) ≤ 1,   P(∅) = 0,   and   P(A ∩ B′) = P(A) − P(A ∩ B).',
    },
    keyTakeawayN:
      'For "at least one" problems, almost always compute 1 − P(none) using the complement rule—it eliminates tedious multi-case addition.',
  },
  {
    id: 'ch3-sub-3',
    code: '3.3',
    title: 'Additive & Multiplicative Laws of Probability',
    depths: ['SD', 'D', 'DR', 'I', 'E', 'A', 'N'] as DepthCode[],
    definitionSD:
      'The Additive Law gives the probability of the union of events: P(A ∪ B) = P(A) + P(B) − P(A ∩ B). The Multiplicative Law gives the probability of the intersection of events: P(A ∩ B) = P(A)·P(B | A) = P(B)·P(A | B).',
    descriptionD:
      'Special cases frequently tested: (1) If A and B are mutually exclusive (A ∩ B = ∅), the additive law reduces to P(A ∪ B) = P(A) + P(B); (2) For three events, inclusion-exclusion gives P(A ∪ B ∪ C) = P(A)+P(B)+P(C) − P(A∩B)−P(A∩C)−P(B∩C) + P(A∩B∩C); (3) If A and B are independent, the multiplicative law reduces to P(A ∩ B) = P(A)·P(B).',
    explanationE:
      'Note that PU Detailed Course Contents marks Additive & Multiplicative laws as "(statement only)". Understanding the set-partition proof ensures you never forget to subtract P(A ∩ B) for overlapping events—or add P(A ∩ B ∩ C) back in for three events!',
    illustrationI:
      'In PU Model Q5, winning contract A (0.6) and contract B (0.4) overlap with probability P(A ∩ B) = 0.2. Simply adding 0.6 + 0.4 would double-count the 0.2 overlap; subtracting it gives P(A ∪ B) = 0.8.',
    applicationA:
      'Computing system reliability: parallel redundancy (system works if at least one unit works → Additive / complement law) vs. series chain (system works only if all units work → Multiplicative law).',
    derivationDR: {
      title: 'Derivation (DR): General Additive Law & Difference Event P(A ∩ B′)',
      goal: 'Prove P(A ∪ B) = P(A) + P(B) − P(A ∩ B) and P(A ∩ B′) = P(A) − P(A ∩ B) from disjoint set partitions.',
      steps: [
        {
          step: 1,
          title: 'Decompose Event A into Two Disjoint Parts',
          equation: 'A = (A ∩ B′) ∪ (A ∩ B),   where (A ∩ B′) ∩ (A ∩ B) = ∅',
          note: 'By Axiom 3: P(A) = P(A ∩ B′) + P(A ∩ B)  ⇒  P(A ∩ B′) = P(A) − P(A ∩ B).',
        },
        {
          step: 2,
          title: 'Decompose Union A ∪ B into Disjoint Parts',
          equation: 'A ∪ B = (A ∩ B′) ∪ B,   where (A ∩ B′) ∩ B = ∅',
          note: 'Apply Axiom 3 to the disjoint union:',
        },
        {
          step: 3,
          title: 'Substitute P(A ∩ B′) into Union Equation',
          equation: 'P(A ∪ B) = P(A ∩ B′) + P(B) = P(A) − P(A ∩ B) + P(B) = P(A) + P(B) − P(A ∩ B)',
          note: 'Reduces to P(A) + P(B) whenever A ∩ B = ∅.',
        },
      ],
      result: 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B)   and   P(A ∩ B′) = P(A) − P(A ∩ B).',
    },
    keyTakeawayN:
      'Parallel system reliability with n independent units: R_parallel = 1 − ∏(1 − Rᵢ); Series system reliability: R_series = ∏Rᵢ.',
  },
  {
    id: 'ch3-sub-4',
    code: '3.4',
    title: "Conditional Probability, Law of Total Probability & Bayes' Theorem",
    depths: ['SD', 'D', 'DR', 'I', 'E', 'A', 'N'] as DepthCode[],
    definitionSD:
      "Conditional Probability of event A given that event B has already occurred (P(B) > 0) is P(A | B) = P(A ∩ B) / P(B). Bayes' Theorem updates prior probabilities P(Eᵢ) of mutually exclusive, exhaustive causes into posterior probabilities P(Eᵢ | A) after observing evidence A.",
    descriptionD:
      'Let {E₁, E₂, …, E_k} be a partition of S (mutually exclusive and exhaustive causes with P(Eᵢ) > 0). The Law of Total Probability gives the unconditional probability of evidence A: P(A) = ∑ P(Eᵢ)·P(A | Eᵢ). Bayes’ Theorem then computes the inverse probability P(E_r | A) that cause E_r produced the observed outcome A.',
    explanationE:
      'Bayes’ Theorem is marked "(statement only)" in PU Detailed Course Contents, yet it is the #1 guaranteed 10-mark Group A question (see PU Model Q1!). Think of P(Eᵢ) as prior beliefs before inspecting the component, P(A | Eᵢ) as the forward likelihood (defect rate of machine i), and P(Eᵢ | A) as the backward diagnostic probability given the component is defective.',
    illustrationI:
      'In PU Model Q1, Machine M₃ produces 50% of parts at a 3% defect rate, contributing 0.50 × 0.03 = 0.015 out of the total 0.023 defect probability—so given a defective part, there is a 15/23 (65.22%) chance it came from M₃.',
    applicationA:
      'Fault localization across parallel production lines (PU Model Q1), digital communication error decoding (BSC channel), and medical/biomedical diagnostic test sensitivity.',
    derivationDR: {
      title: "Derivation (DR): Law of Total Probability & Bayes' Theorem",
      goal: 'Given partition E₁, …, E_k of S and evidence A with P(A) > 0, derive P(E_r | A).',
      steps: [
        {
          step: 1,
          title: 'Partition Evidence Event A Across Causes',
          equation: 'A = A ∩ S = A ∩ (E₁ ∪ E₂ ∪ … ∪ E_k) = (A ∩ E₁) ∪ (A ∩ E₂) ∪ … ∪ (A ∩ E_k)',
          note: 'Because Eᵢ are pairwise disjoint, the intersections (A ∩ Eᵢ) are also pairwise disjoint.',
        },
        {
          step: 2,
          title: 'Apply Axiom 3 & Multiplicative Law (Total Probability)',
          equation: 'P(A) = ∑_{i=1}^k P(A ∩ Eᵢ) = ∑_{i=1}^k P(Eᵢ) · P(A | Eᵢ)',
          note: 'Each term P(Eᵢ)·P(A | Eᵢ) is the joint probability along branch i of the probability tree.',
        },
        {
          step: 3,
          title: 'Apply Definition of Conditional Probability for Cause E_r',
          equation: 'P(E_r | A) = P(E_r ∩ A) / P(A) = [ P(E_r) · P(A | E_r) ] / [ ∑_{i=1}^k P(Eᵢ) · P(A | Eᵢ) ]',
          note: 'Notice that ∑_{r=1}^k P(E_r | A) = 1 always serves as an instant arithmetic check!',
        },
      ],
      result: 'P(E_r | A) = [ P(E_r)·P(A | E_r) ] / [ ∑ P(Eᵢ)·P(A | Eᵢ) ].',
    },
    keyTakeawayN:
      'Always construct a 4-column Bayes Table (Cause Eᵢ | Prior P(Eᵢ) | Likelihood P(A|Eᵢ) | Joint P(Eᵢ∩A)) and verify ∑P(Eᵢ|A) = 1.',
  },
];

export const CH3_FORMULA_SHEET: FormulaItem[] = [
  {
    id: 'ch3-f-classical',
    category: 'Location',
    quantity: 'Classical & Empirical Probability',
    symbol: 'P(A)',
    formula: 'P(A) = n(A) / n(S)   |   P(A) = lim_{n→∞} (f_A / n)',
    assumptionOrConstant: 'Classical requires finite, mutually exclusive & equally likely outcomes',
    unit: 'Dimensionless ∈ [0, 1]',
  },
  {
    id: 'ch3-f-counting',
    category: 'Location',
    quantity: 'Permutations & Combinations',
    symbol: 'ⁿP_r, ⁿC_r',
    formula: 'ⁿP_r = n! / (n − r)!   |   ⁿC_r = n! / [r!(n − r)!]',
    assumptionOrConstant: '0! = 1; use ⁿP_r when order matters, ⁿC_r when order does not',
    unit: 'Count (ways)',
  },
  {
    id: 'ch3-f-axioms',
    category: 'Location',
    quantity: 'Kolmogorov Axioms & Complement Rule',
    symbol: 'P(A′)',
    formula: 'P(A) ≥ 0;   P(S) = 1;   P(A′) = 1 − P(A);   P(∅) = 0',
    assumptionOrConstant: 'Disjoint countable additivity: P(⋃Aᵢ) = ∑P(Aᵢ) if Aᵢ ∩ Aⱼ = ∅',
    unit: 'Dimensionless ∈ [0, 1]',
  },
  {
    id: 'ch3-f-additive2',
    category: 'Dispersion',
    quantity: 'Additive Law (2 Events) & Difference',
    symbol: 'P(A ∪ B)',
    formula: 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B);   P(A ∩ B′) = P(A) − P(A ∩ B)',
    assumptionOrConstant: 'Reduces to P(A) + P(B) if mutually exclusive (A ∩ B = ∅)',
    unit: 'Dimensionless ∈ [0, 1]',
  },
  {
    id: 'ch3-f-additive3',
    category: 'Dispersion',
    quantity: 'Additive Law (3 Events) & De Morgan',
    symbol: 'P(A ∪ B ∪ C)',
    formula: '∑P(A) − ∑P(A∩B) + P(A∩B∩C);   P(A′ ∩ B′) = 1 − P(A ∪ B)',
    assumptionOrConstant: 'For independent events: P(at least one) = 1 − ∏[1 − P(Aᵢ)]',
    unit: 'Dimensionless ∈ [0, 1]',
  },
  {
    id: 'ch3-f-cond',
    category: 'Dispersion',
    quantity: 'Conditional Probability & Multiplicative Law',
    symbol: 'P(A | B)',
    formula: 'P(A | B) = P(A ∩ B) / P(B);   P(A ∩ B) = P(A)·P(B | A)',
    assumptionOrConstant: 'Requires P(B) > 0; P(A′ | B) = 1 − P(A | B)',
    unit: 'Dimensionless ∈ [0, 1]',
  },
  {
    id: 'ch3-f-indep',
    category: 'Properties & Constants',
    quantity: 'Statistical Independence (2 & 3 Events)',
    symbol: 'A ⊥ B',
    formula: 'P(A ∩ B) = P(A)·P(B)   ⇔   P(A | B) = P(A)',
    assumptionOrConstant: '3 events need pairwise AND triple product P(A∩B∩C) = P(A)P(B)P(C)',
    unit: 'Condition',
  },
  {
    id: 'ch3-f-total-prob',
    category: 'Properties & Constants',
    quantity: 'Law of Total Probability',
    symbol: 'P(A)',
    formula: 'P(A) = ∑_{i=1}^k P(Eᵢ) · P(A | Eᵢ)',
    assumptionOrConstant: '{E₁,…,E_k} must be mutually exclusive and exhaustive (∑P(Eᵢ) = 1)',
    unit: 'Dimensionless ∈ [0, 1]',
  },
  {
    id: 'ch3-f-bayes',
    category: 'Properties & Constants',
    quantity: "Bayes' Theorem (Posterior Probability)",
    symbol: 'P(E_r | A)',
    formula: 'P(E_r | A) = [ P(E_r)·P(A | E_r) ] / [ ∑_{i=1}^k P(Eᵢ)·P(A | Eᵢ) ]',
    assumptionOrConstant: 'P(A) > 0; ∑_{r=1}^k P(E_r | A) = 1 (posterior normalization)',
    unit: 'Dimensionless ∈ [0, 1]',
  },
];

export const CH3_SOLVED_QUESTIONS: SolvedProblem[] = [
  {
    id: 'pu-model-q1',
    tag: 'PU Model Set · Group A, Q1',
    title: "Bayes' Theorem: Defective Electronic Components Across Three Machines",
    marks: '10 Marks',
    source: 'Attached PDF — PU V Sem Final Exam 2024 Model Question, Page 7',
    statement:
      'Three different machines M₁, M₂, and M₃ are used to produce similar electronic components. Machines M₁, M₂, and M₃ produce 20%, 30% and 50% of the components respectively. It is known that the probabilities that the machines produce defective components are 1% for M₁, 2% for M₂, and 3% for M₃. If a component is selected randomly from a large batch, and that component is defective, find the probability that it was produced: (a) by M₂, and (b) by M₃.',
    given: [
      'Let M₁, M₂, M₃ be the mutually exclusive and exhaustive events that a component is produced by machine 1, 2, or 3.',
      'Let D be the event that the randomly selected component is defective.',
      'Prior probabilities: P(M₁) = 0.20, P(M₂) = 0.30, P(M₃) = 0.50 (check: 0.20 + 0.30 + 0.50 = 1.00).',
      'Conditional defect rates: P(D | M₁) = 0.01, P(D | M₂) = 0.02, P(D | M₃) = 0.03.',
    ],
    tableHeaders: ['Machine (Mᵢ)', 'Prior P(Mᵢ)', 'Defect Rate P(D | Mᵢ)', 'Joint P(Mᵢ ∩ D)', 'Posterior P(Mᵢ | D)'],
    tableRows: [
      ['M₁', '0.20', '0.01', '0.20 × 0.01 = 0.0020', '0.0020 / 0.0230 = 2/23 (0.0870)'],
      ['M₂', '0.30', '0.02', '0.30 × 0.02 = 0.0060', '0.0060 / 0.0230 = 6/23 (0.2609)'],
      ['M₃', '0.50', '0.03', '0.50 × 0.03 = 0.0150', '0.0150 / 0.0230 = 15/23 (0.6522)'],
    ],
    tableTotals: ['Total', '∑ = 1.00', '—', 'P(D) = 0.0230', '∑ = 23/23 = 1.0000'],
    steps: [
      {
        heading: 'Step 1: Compute Total Probability of a Defective Component P(D)',
        work: [
          'By the Law of Total Probability:',
          'P(D) = P(M₁)·P(D | M₁) + P(M₂)·P(D | M₂) + P(M₃)·P(D | M₃)',
          'P(D) = (0.20)(0.01) + (0.30)(0.02) + (0.50)(0.03) = 0.002 + 0.006 + 0.015 = 0.0230',
        ],
      },
      {
        heading: "Step 2 (a): Find P(M₂ | D) Using Bayes' Theorem",
        work: [
          'P(M₂ | D) = [ P(M₂)·P(D | M₂) ] / P(D) = 0.0060 / 0.0230 = 6 / 23 = 0.26087 ≈ 0.2609 (26.09%)',
        ],
      },
      {
        heading: "Step 3 (b): Find P(M₃ | D) Using Bayes' Theorem",
        work: [
          'P(M₃ | D) = [ P(M₃)·P(D | M₃) ] / P(D) = 0.0150 / 0.0230 = 15 / 23 = 0.65217 ≈ 0.6522 (65.22%)',
          '(Check: P(M₁ | D) = 2/23 ≈ 0.0870, and 2/23 + 6/23 + 15/23 = 23/23 = 1)',
        ],
      },
    ],
    finalAnswer: [
      '(a) Probability defective component was produced by M₂: 6/23 ≈ 0.2609 (26.09%)',
      '(b) Probability defective component was produced by M₃: 15/23 ≈ 0.6522 (65.22%)',
    ],
  },
  {
    id: 'pu-model-q5',
    tag: 'PU Model Set · Group B, Q5',
    title: 'Additive Law & Set Difference: Construction Contract Bidding',
    marks: '5 Marks',
    source: 'Attached PDF — PU V Sem Final Exam 2024 Model Question, Page 8',
    statement:
      'A company has bid on two large construction projects. The company president believes that the probability of winning the first contract is 0.6, the probability of winning the second contract is 0.4, and the probability of winning both contracts is 0.2. (a) What is the probability that the company wins at least one contract? (b) What is the probability that the company wins the first contract but not the second contract?',
    given: [
      'Let A = event of winning the first contract, B = event of winning the second contract.',
      'Given: P(A) = 0.6,   P(B) = 0.4,   and   P(A ∩ B) = 0.2.',
      'Note: P(A)·P(B) = 0.24 ≠ 0.2, so A and B are NOT independent.',
    ],
    steps: [
      {
        heading: 'Part (a): Probability of Winning At Least One Contract P(A ∪ B)',
        work: [
          'By the General Additive Law of Probability:',
          'P(A ∪ B) = P(A) + P(B) − P(A ∩ B)',
          'P(A ∪ B) = 0.6 + 0.4 − 0.2 = 0.8 (or 80%)',
        ],
      },
      {
        heading: 'Part (b): Probability of Winning First Contract But Not Second P(A ∩ B′)',
        work: [
          'Event "A occurs and B does not" is (A ∩ B′). Since A = (A ∩ B′) ∪ (A ∩ B) disjointly:',
          'P(A ∩ B′) = P(A) − P(A ∩ B)',
          'P(A ∩ B′) = 0.6 − 0.2 = 0.4 (or 40%)',
        ],
      },
    ],
    finalAnswer: [
      '(a) P(wins at least one contract) = 0.80 (80%)',
      '(b) P(wins first contract but not second) = 0.40 (40%)',
    ],
  },
  {
    id: 'ch3-extra-1',
    tag: 'Extra Exam-Level Numerical 1',
    title: 'Combinatorics, Conditional Inspection & Independent Protection Alarms',
    marks: '10 Marks Pattern',
    source: 'High-Yield PU Exam Practice (Counting, Conditional & Independent Events)',
    statement:
      'A power distribution panel contains 12 relays, of which 4 are faulty and 8 are healthy. (a) If 3 relays are selected at random without replacement, find the probability that: (i) all 3 are healthy, (ii) at least 1 is faulty, and (iii) exactly 2 are healthy given that at least 1 is healthy. (b) Separately, three independent protection alarms A, B, and C detect an over-current fault with probabilities P(A) = 0.80, P(B) = 0.75, and P(C) = 0.60. Find the probability that the fault is detected by (i) at least one alarm, and (ii) exactly two alarms.',
    given: [
      'Part (a): Total relays = 12 (8 healthy, 4 faulty); sample size = 3 without replacement ⇒ n(S) = ¹²C₃ = 220.',
      'Part (b): Independent alarms with P(A) = 0.80, P(B) = 0.75, P(C) = 0.60 ⇒ P(A′) = 0.20, P(B′) = 0.25, P(C′) = 0.40.',
    ],
    steps: [
      {
        heading: 'Part (a)(i) & (ii): Counting Combinations Without Replacement',
        work: [
          'Total combinations: ¹²C₃ = (12 × 11 × 10) / (3 × 2 × 1) = 220',
          '(i) P(all 3 healthy) = ⁸C₃ / ¹²C₃ = 56 / 220 = 14 / 55 ≈ 0.2545',
          '(ii) P(at least 1 faulty) = 1 − P(all 3 healthy) = 1 − 14/55 = 41 / 55 ≈ 0.7455',
        ],
      },
      {
        heading: 'Part (a)(iii): Conditional Probability P(2 Healthy, 1 Faulty | At Least 1 Healthy)',
        work: [
          'Let E = {2 healthy, 1 faulty} and F = {at least 1 healthy}. Notice E ⊆ F ⇒ E ∩ F = E.',
          'P(E) = (⁸C₂ × ⁴C₁) / 220 = (28 × 4) / 220 = 112 / 220 = 28 / 55',
          'P(F) = 1 − P(all 3 faulty) = 1 − (⁴C₃ / 220) = 1 − (4 / 220) = 216 / 220 = 54 / 55',
          'P(E | F) = P(E ∩ F) / P(F) = (112 / 220) / (216 / 220) = 112 / 216 = 14 / 27 ≈ 0.5185',
        ],
      },
      {
        heading: 'Part (b): Independent Protection Alarms (Multiplicative & Complement Rules)',
        work: [
          '(i) P(at least 1 alarm) = 1 − P(A′ ∩ B′ ∩ C′) = 1 − P(A′)·P(B′)·P(C′) = 1 − (0.20)(0.25)(0.40) = 1 − 0.020 = 0.980',
          '(ii) P(exactly 2 alarms) = P(A∩B∩C′) + P(A∩B′∩C) + P(A′∩B∩C)',
          '= (0.80)(0.75)(0.40) + (0.80)(0.25)(0.60) + (0.20)(0.75)(0.60) = 0.240 + 0.120 + 0.090 = 0.450',
        ],
      },
    ],
    finalAnswer: [
      '(a) (i) 14/55 (0.2545) · (ii) 41/55 (0.7455) · (iii) 14/27 (0.5185)',
      '(b) (i) P(≥ 1 alarm) = 0.980 (98%) · (ii) P(exactly 2 alarms) = 0.450 (45%)',
    ],
  },
  {
    id: 'ch3-extra-2',
    tag: 'Extra Exam-Level Numerical 2',
    title: "Digital Communication Channel: Total Probability, Bayes' Decoding & Bit Error Rate",
    marks: '10 Marks Pattern',
    source: "High-Yield PU Exam Practice (Electronics / ECE Bayes' Theorem)",
    statement:
      'In a noisy digital communication channel, binary symbols 0 and 1 are transmitted with prior probabilities P(T₀) = 0.45 and P(T₁) = 0.55. Due to channel noise, a transmitted 0 is received as 1 with probability 0.04, and a transmitted 1 is received as 0 with probability 0.02. Find: (a) the total probability that a randomly received bit is 1, P(R₁); (b) the posterior probability P(T₁ | R₁) that a 1 was transmitted given a 1 was received; and (c) the overall bit transmission error probability.',
    given: [
      'Priors: P(T₀) = 0.45, P(T₁) = 0.55',
      'Channel error transitions: P(R₁ | T₀) = 0.04 ⇒ P(R₀ | T₀) = 0.96;   P(R₀ | T₁) = 0.02 ⇒ P(R₁ | T₁) = 0.98',
    ],
    tableHeaders: ['Transmitted (Tᵢ)', 'Prior P(Tᵢ)', 'P(R₁ | Tᵢ)', 'Joint P(Tᵢ ∩ R₁)', 'Posterior P(Tᵢ | R₁)'],
    tableRows: [
      ['T₀ (Bit 0)', '0.45', '0.04', '0.45 × 0.04 = 0.0180', '0.0180 / 0.5570 = 0.0323'],
      ['T₁ (Bit 1)', '0.55', '0.98', '0.55 × 0.98 = 0.5390', '0.5390 / 0.5570 = 0.9677'],
    ],
    tableTotals: ['Total', '∑ = 1.00', '—', 'P(R₁) = 0.5570', '∑ = 1.0000'],
    steps: [
      {
        heading: 'Part (a): Total Probability of Receiving Bit 1',
        work: [
          'P(R₁) = P(T₀)·P(R₁ | T₀) + P(T₁)·P(R₁ | T₁)',
          'P(R₁) = (0.45)(0.04) + (0.55)(0.98) = 0.0180 + 0.5390 = 0.5570',
        ],
      },
      {
        heading: "Part (b): Posterior Probability P(T₁ | R₁) via Bayes' Theorem",
        work: [
          'P(T₁ | R₁) = [ P(T₁)·P(R₁ | T₁) ] / P(R₁) = 0.5390 / 0.5570 = 539 / 557 = 0.96768 ≈ 0.9677 (96.77%)',
        ],
      },
      {
        heading: 'Part (c): Overall Bit Transmission Error Probability',
        work: [
          'An error occurs if (T₀ and R₁) OR (T₁ and R₀):',
          'P(Error) = P(T₀)·P(R₁ | T₀) + P(T₁)·P(R₀ | T₁) = (0.45)(0.04) + (0.55)(0.02) = 0.0180 + 0.0110 = 0.0290 (2.90%)',
        ],
      },
    ],
    finalAnswer: [
      '(a) P(R₁) = 0.5570',
      '(b) P(T₁ | R₁) = 539/557 ≈ 0.9677 (96.77%)',
      '(c) Bit Error Probability = 0.0290 (2.90%)',
    ],
  },
];

export const CH3_EXAM_TRAPS: ExamTrap[] = [
  {
    id: 'ch3-trap-sign-1',
    category: 'Sign Convention',
    title: 'Additive Law Sign Error: Adding Instead of Subtracting P(A ∩ B)',
    wrongApproach: 'Writing P(A ∪ B) = P(A) + P(B) + P(A ∩ B), or forgetting to subtract P(A ∩ B) when events overlap (yields P > 1!).',
    correctRule: 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B). For three events, alternate signs via inclusion-exclusion: + singles − pairs + triple.',
    examTip: 'If your calculated probability ever falls outside [0, 1], immediately check the sign before P(A ∩ B).',
  },
  {
    id: 'ch3-trap-sign-2',
    category: 'Sign Convention',
    title: 'Confusing "Mutually Exclusive" with "Independent"',
    wrongApproach: 'Assuming mutually exclusive events satisfy P(A ∩ B) = P(A)·P(B), OR assuming independent events satisfy P(A ∪ B) = P(A) + P(B).',
    correctRule: 'Mutually exclusive ⇒ P(A ∩ B) = 0 and P(A ∪ B) = P(A) + P(B). Independent ⇒ P(A ∩ B) = P(A)·P(B) and P(A ∪ B) = P(A) + P(B) − P(A)P(B).',
    examTip: 'Two positive-probability events CANNOT be both mutually exclusive and independent.',
  },
  {
    id: 'ch3-trap-sign-3',
    category: 'Sign Convention',
    title: 'Using Independent Formula P(A)P(B) When Events Are Dependent (Model Q5)',
    wrongApproach: 'Computing P(A ∩ B′) = P(A)·(1 − P(B)) = 0.6 × 0.6 = 0.36 in Model Q5.',
    correctRule: 'In Model Q5, P(A)P(B) = 0.24 ≠ 0.2 = P(A ∩ B), so A and B are dependent! You MUST use P(A ∩ B′) = P(A) − P(A ∩ B) = 0.6 − 0.2 = 0.4.',
    examTip: 'Always check whether P(A ∩ B) equals P(A)P(B) before using complement multiplication.',
  },
  {
    id: 'ch3-trap-geom-1',
    category: 'Boundary & Slope Geometry',
    title: 'Reversing Conditional Direction: P(D | M₂) vs. P(M₂ | D)',
    wrongApproach: 'Confusing the forward branch probability P(D | M₂) = 0.02 with the inverse Bayes posterior P(M₂ | D).',
    correctRule: 'The event AFTER the vertical bar "|" is ALWAYS the KNOWN condition/evidence. In Model Q1, "given the component is defective" means D is after the bar: solve for P(M₂ | D).',
    examTip: 'Draw a 2-stage probability tree left-to-right: Stage 1 is causes (Mᵢ), Stage 2 is test/defect (D); Bayes reverses the arrows.',
  },
  {
    id: 'ch3-trap-geom-2',
    category: 'Boundary & Slope Geometry',
    title: 'Sampling Without Replacement vs. With Replacement',
    wrongApproach: 'Treating 3 draws from 12 relays as independent Bernoulli trials (8/12)³ instead of hypergeometric without-replacement draws.',
    correctRule: 'Without replacement changes the denominator and numerator on each draw: (8/12)(7/11)(6/10) = ⁸C₃ / ¹²C₃ = 14/55.',
    examTip: 'Read carefully for phrases like "drawn simultaneously", "without replacement", or "from a large batch" (infinite-batch approximation).',
  },
  {
    id: 'ch3-trap-geom-3',
    category: 'Boundary & Slope Geometry',
    title: 'Pairwise Independence ≠ Mutual Independence for 3 Events',
    wrongApproach: 'Checking only P(A∩B)=P(A)P(B), P(B∩C)=P(B)P(C), P(A∩C)=P(A)P(C) to claim A, B, C are mutually independent.',
    correctRule: 'Mutual independence of 3 events requires ALL THREE pairwise products PLUS the triple product P(A ∩ B ∩ C) = P(A)P(B)P(C).',
    examTip: 'For "at least one of A, B, C", complement 1 − P(A′∩B′∩C′) only simplifies to 1 − P(A′)P(B′)P(C′) under mutual independence.',
  },
  {
    id: 'ch3-trap-pu-1',
    category: 'High-Yield PU Topic',
    title: "Model Q1 (10 Marks): 3-Source Bayes' Theorem Table",
    wrongApproach: 'Leaving out the denominator P(D) calculation or forgetting to normalize posteriors.',
    correctRule: 'Present a clean 5-column Bayes table (Cause, Prior, Likelihood, Joint, Posterior), explicitly compute P(D), and verify ∑P(Mᵢ | D) = 1.',
    examTip: 'Unit 3 carries 15/60 marks in PU—Bayes’ Theorem is virtually guaranteed as a 10-mark Group A question.',
  },
  {
    id: 'ch3-trap-pu-2',
    category: 'High-Yield PU Topic',
    title: 'Model Q5 (5 Marks): Set Operations (At Least One / Only A / Neither)',
    wrongApproach: 'Mixing up "wins only the first" P(A ∩ B′) with "wins neither" P(A′ ∩ B′).',
    correctRule: 'Translate English phrases cleanly: "At least one" → A ∪ B; "A but not B" → A ∩ B′ = P(A) − P(A∩B); "Neither" → 1 − P(A∪B).',
    examTip: 'Sketching a small Venn diagram beside your 5-mark solution prevents any set-complement mix-ups.',
  },
];
