import { DepthCode, ExamTrap, FormulaItem, SolvedProblem, SubtopicNote } from './chapter1Content';

export const CH2_SYLLABUS_CONTEXT = {
  university: 'Purbanchal University — Faculty of Engineering, Biratnagar, Nepal',
  program: 'B.E. Biomedical / Electrical / Electronics, Com. & Automation Engineering',
  semester: 'Year III · Semester V (Effective from 2021 / 2078 Batch)',
  subject: 'Probability and Statistics',
  chapter: 'Unit 2: Correlation and Regression',
  lectureHours: '5 Hrs (Syllabus) / 4 Hrs (Detailed Contents)',
  finalMarks: 15,
  totalSubjectMarks: '60 Final Theory + 20 Internal Theory + 20 Practical = 100',
  syllabusTopics: [
    "Simple Correlation: Karl Pearson's correlation coefficient and its properties",
    'Simple Linear Regression: Model and assumptions of simple linear regression; Least square estimators of regression coefficients; properties of regression coefficients; Coefficient of determination',
  ],
  microSyllabusNote:
    'In the attached PU 5th Semester syllabus PDF, explicit SD/D/DR/I/E/A/EX/N checkmark grids appear for the other engineering subjects, whereas Probability & Statistics (pp. 2–9) provides the Detailed Course Contents, Mark Scheme (15 marks for Chapter II — 25% of the final paper), and 2024 Model Question Set. Every Unit 2 subtopic below is mapped across all applicable depths: SD, D, DR, I, E, A, and N.',
};

export const CH2_SUBTOPIC_NOTES: SubtopicNote[] = [
  {
    id: 'ch2-sub-1',
    code: '2.1',
    title: "Simple Correlation & Karl Pearson's Correlation Coefficient (r)",
    depths: ['SD', 'D', 'DR', 'I', 'E', 'A', 'N'] as DepthCode[],
    definitionSD:
      "Correlation measures the strength and direction of the linear association between two quantitative variables X and Y. Karl Pearson's Product-Moment Correlation Coefficient (r) is the covariance of X and Y divided by the product of their standard deviations: r = Cov(X, Y) / (σ_x · σ_y).",
    descriptionD:
      'A bivariate relationship can be Positive (Y increases with X, r > 0), Negative (Y decreases as X increases, r < 0), or Uncorrelated (no linear trend, r = 0). On a scatter diagram, tightly clustered points along a straight line produce |r| close to 1, whereas circular or purely quadratic clouds yield r ≈ 0.',
    explanationE:
      'Because Cov(X, Y) = (1/n)∑(Xᵢ − X̄)(Yᵢ − Ȳ) carries units of (unit_x × unit_y), dividing by σ_x·σ_y standardizes both variables into dimensionless z-scores. Consequently, r is unit-free, strictly bounded in [−1, +1], symmetric (r_xy = r_yx), and invariant in magnitude under any linear shift of origin or scaling.',
    illustrationI:
      'Consider voltage V and current I across an ohmic resistor: points lie cleanly along a line with positive slope, giving r ≈ +0.99. Conversely, battery terminal voltage vs. load current drops linearly due to internal resistance, giving r ≈ −0.98.',
    applicationA:
      'Evaluating sensor linearity during calibration, quantifying advertising-to-sales elasticity (PU Model Q2), and screening multicollinearity before system modeling.',
    derivationDR: {
      title: 'Derivations (DR): Computational Formula, Bounds −1 ≤ r ≤ +1 & Origin/Scale Invariance',
      goal: 'Prove: (i) r computational form, (ii) −1 ≤ r ≤ +1, and (iii) r_UV = sgn(hk)·r_XY under U = (X − a)/h, V = (Y − c)/k.',
      steps: [
        {
          step: 1,
          title: 'Computational Raw-Score Formula',
          equation: 'Cov(X,Y) = (∑XY)/n − X̄Ȳ;   σ_x = √[(∑X²)/n − X̄²];   σ_y = √[(∑Y²)/n − Ȳ²]',
          note: 'Multiply numerator and denominator by n to eliminate fractions:',
        },
        {
          step: 2,
          title: 'Cleared-Fraction Form',
          equation: 'r = [ n∑XY − (∑X)(∑Y) ] / √( [n∑X² − (∑X)²] · [n∑Y² − (∑Y)²] )',
          note: 'Exact and numerically stable form for hand calculation with a scientific calculator.',
        },
        {
          step: 3,
          title: 'Proof of Bounds (−1 ≤ r ≤ +1)',
          equation: 'Let z_xi = (Xᵢ − X̄)/σ_x and z_yi = (Yᵢ − Ȳ)/σ_y.  Note ∑z_xi² = n and ∑z_yi² = n.',
          note: 'Sum of squares of real numbers is always non-negative:',
        },
        {
          step: 4,
          title: 'Expand Non-Negative Sum of Standardized Combinations',
          equation: '0 ≤ ∑(z_xi ± z_yi)² = ∑z_xi² + ∑z_yi² ± 2∑z_xi z_yi = n + n ± 2(n·r) = 2n(1 ± r)',
          note: 'Since 2n > 0, (1 + r) ≥ 0 ⇒ r ≥ −1 and (1 − r) ≥ 0 ⇒ r ≤ +1. Equality holds iff Y = a + bX.',
        },
        {
          step: 5,
          title: 'Origin & Scale Transformation (X = a + hU, Y = c + kV)',
          equation: 'Xᵢ − X̄ = h(Uᵢ − Ū),  Yᵢ − Ȳ = k(Vᵢ − V̄),  σ_x = |h|σ_u,  σ_y = |k|σ_v',
          note: 'Substitute into r_XY = ∑(Xᵢ − X̄)(Yᵢ − Ȳ) / (n·σ_x·σ_y):',
        },
        {
          step: 6,
          title: 'Simplify Sign Factor',
          equation: 'r_XY = [ hk · ∑(Uᵢ − Ū)(Vᵢ − V̄) ] / [ n · |h||k| · σ_u σ_v ] = [ hk / |hk| ] · r_UV',
          note: 'If h and k share the same sign (hk > 0), r_XY = r_UV. If opposite signs (hk < 0), r_XY = −r_UV.',
        },
      ],
      result: '−1 ≤ r ≤ +1;  r is independent of origin and magnitude-invariant under scale (flips sign iff hk < 0).',
    },
    keyTakeawayN:
      'Always verify |r| ≤ 1. If a calculation gives |r| > 1, re-check n∑X² − (∑X)² or sign of Cov(X, Y).',
  },
  {
    id: 'ch2-sub-2',
    code: '2.2',
    title: 'Simple Linear Regression: Model & Classical Assumptions',
    depths: ['SD', 'D', 'E', 'A'] as DepthCode[],
    definitionSD:
      'Simple Linear Regression models the average functional relationship between one dependent (response) variable Y and one independent (explanatory/predictor) variable X via the linear equation Yᵢ = β₀ + β₁Xᵢ + εᵢ, where β₀ is the intercept, β₁ is the slope, and εᵢ is the random error.',
    descriptionD:
      'Unlike correlation (which treats X and Y symmetrically), regression is directional: predicting Y from X requires the regression line of Y on X (Ŷ = a + b_yx·X), whereas predicting X from Y requires a different line, X on Y (X̂ = c + b_xy·Y).',
    explanationE:
      'To ensure the Ordinary Least Squares (OLS) estimators are BLUE (Best Linear Unbiased Estimators under the Gauss–Markov theorem), six classical assumptions are imposed: (1) Linearity in parameters, (2) Zero conditional mean error E(εᵢ | Xᵢ) = 0, (3) Homoscedasticity Var(εᵢ | Xᵢ) = σ², (4) No autocorrelation Cov(εᵢ, εⱼ) = 0 for i ≠ j, (5) Exogeneity Cov(Xᵢ, εᵢ) = 0, and (6) Normality εᵢ ~ N(0, σ²) for hypothesis tests and confidence intervals.',
    illustrationI:
      'In an advertising campaign (PU Model Q2), Sales (Y) depends on Advertising Expenditure (X): β₀ represents baseline sales at zero ad spend, β₁ is marginal sales gained per Rs. 1,000 spent, and εᵢ captures unmodeled market noise.',
    applicationA:
      'Forecasting power demand vs. ambient temperature, estimating transistor gain drift vs. bias current, and predicting sales from marketing budgets.',
    keyTakeawayN:
      'Never use the regression line of Y on X backwards by solving for X when asked to predict X from Y—always fit X on Y instead (unless r = ±1).',
  },
  {
    id: 'ch2-sub-3',
    code: '2.3',
    title: 'Least-Squares Estimators & Normal Equations (OLS Derivation)',
    depths: ['SD', 'D', 'DR', 'I', 'E', 'A', 'N'] as DepthCode[],
    definitionSD:
      'The Method of Least Squares selects estimates a (for β₀) and b (for β₁) that minimize the Sum of Squared Residuals (SSE): S(a, b) = ∑(Yᵢ − Ŷᵢ)² = ∑(Yᵢ − a − bXᵢ)².',
    descriptionD:
      'For each observed point (Xᵢ, Yᵢ), the vertical residual eᵢ = Yᵢ − Ŷᵢ measures the prediction error. Minimizing ∑eᵢ² prevents positive and negative errors from cancelling out and yields unique closed-form Normal Equations.',
    explanationE:
      'Setting partial derivatives ∂S/∂a = 0 and ∂S/∂b = 0 ensures the tangent plane to the convex paraboloid S(a, b) is flat. The first normal equation immediately forces ∑eᵢ = 0, meaning the fitted line must pass directly through the centroid (X̄, Ȳ).',
    illustrationI:
      'Geometrically, OLS drops vertical springs from every scatter point to the line Y = a + bX and settles at the unique slope and intercept that minimize total spring potential energy ∑eᵢ².',
    applicationA:
      'Fitting calibration curves to ADC/thermistor measurements and deriving trend forecasts in engineering economics.',
    derivationDR: {
      title: 'Derivation (DR): Normal Equations & Least-Squares Estimators (a, b_yx)',
      goal: 'Minimize S(a, b) = ∑(Yᵢ − a − bXᵢ)² to derive the Normal Equations and closed-form formulas for a and b_yx.',
      steps: [
        {
          step: 1,
          title: 'Formulate Objective Sum of Squared Errors (SSE)',
          equation: 'S(a, b) = ∑(Yᵢ − a − bXᵢ)²',
          note: 'Take first-order partial derivatives with respect to a and b and equate to zero.',
        },
        {
          step: 2,
          title: 'First Normal Equation (∂S/∂a = 0)',
          equation: '∂S/∂a = −2∑(Yᵢ − a − bXᵢ) = 0   ⇒   ∑Yᵢ = n·a + b∑Xᵢ',
          note: 'Dividing through by n gives Ȳ = a + bX̄, so a = Ȳ − bX̄ (line passes through (X̄, Ȳ)).',
        },
        {
          step: 3,
          title: 'Second Normal Equation (∂S/∂b = 0)',
          equation: '∂S/∂b = −2∑Xᵢ(Yᵢ − a − bXᵢ) = 0   ⇒   ∑XᵢYᵢ = a∑Xᵢ + b∑Xᵢ²',
          note: 'Substitute a = (∑Yᵢ − b∑Xᵢ)/n into this second equation.',
        },
        {
          step: 4,
          title: 'Solve for Slope Estimator b (b_yx)',
          equation: '∑XᵢYᵢ = [ (∑Yᵢ − b∑Xᵢ)/n ]∑Xᵢ + b∑Xᵢ²  ⇒  n∑XᵢYᵢ − (∑Xᵢ)(∑Yᵢ) = b[ n∑Xᵢ² − (∑Xᵢ)² ]',
          note: 'Rearranging yields the exact computational and centered forms:',
        },
        {
          step: 5,
          title: 'Closed-Form OLS Estimators',
          equation: 'b_yx = [ n∑XY − (∑X)(∑Y) ] / [ n∑X² − (∑X)² ] = ∑(Xᵢ − X̄)(Yᵢ − Ȳ) / ∑(Xᵢ − X̄)² = r·(σ_y / σ_x)',
          note: 'And intercept a = Ȳ − b_yx·X̄. Second partials ∂²S/∂a² = 2n > 0 and Hessian Δ = 4n∑(Xᵢ − X̄)² > 0 confirm a global minimum.',
        },
      ],
      result: 'b_yx = [n∑XY − (∑X)(∑Y)] / [n∑X² − (∑X)²] = r(σ_y/σ_x),  a = Ȳ − b_yx·X̄;  by symmetry b_xy = r(σ_x/σ_y).',
    },
    keyTakeawayN:
      'Always keep extra decimals in b_yx before computing a = Ȳ − b_yx·X̄, because rounding b_yx early shifts the intercept a across the whole range.',
  },
  {
    id: 'ch2-sub-4',
    code: '2.4',
    title: 'Properties of Regression Coefficients & Angle Between Regression Lines',
    depths: ['SD', 'D', 'DR', 'I', 'E', 'A', 'N'] as DepthCode[],
    definitionSD:
      'Regression coefficients b_yx (slope of Y on X) and b_xy (slope of X on Y) satisfy strict algebraic bounds, sign coupling, centroid intersection, and scale-dependence laws.',
    descriptionD:
      'Key properties examined frequently by PU: (1) r² = b_yx·b_xy, so |r| = √(b_yx·b_xy); (2) b_yx, b_xy, and r always have the same sign; (3) If |b_yx| > 1, then |b_xy| < 1 (product cannot exceed 1); (4) Both lines intersect at (X̄, Ȳ); (5) Independent of origin shift, NOT independent of scale: b_yx = (h_y/h_x)·b_vu.',
    explanationE:
      'When two unlabeled linear equations are given in an exam problem, you can immediately identify which line is Y on X and which is X on Y by testing the product condition b_yx · b_xy ≤ 1. Only one assignment yields r² ≤ 1 (unless both slopes equal ±1).',
    illustrationI:
      'As |r| approaches 1, the acute angle θ between the two lines narrows to 0° (perfect collinearity). As r approaches 0, the lines open to 90° (orthogonal lines Y = Ȳ and X = X̄).',
    applicationA:
      'Reconstructing means, standard deviations, correlation, and angular divergence directly from two empirical equations (Extra Numerical 1).',
    derivationDR: {
      title: 'Derivation (DR): Geometric Mean Property, Scale Rule & Angle θ Between Lines',
      goal: 'Prove: (i) r = ±√(b_yx·b_xy), (ii) b_yx = (h_y/h_x)·b_vu, and (iii) tan θ = [(1 − r²)/|r|] · [σ_x σ_y / (σ_x² + σ_y²)].',
      steps: [
        {
          step: 1,
          title: 'Product of Regression Coefficients',
          equation: 'b_yx · b_xy = [ r·(σ_y / σ_x) ] · [ r·(σ_x / σ_y) ] = r² ≤ 1',
          note: 'Taking square root gives r = ±√(b_yx·b_xy), choosing the common sign of b_yx and b_xy.',
        },
        {
          step: 2,
          title: 'Origin & Scale Transformation (U = (X − A)/h_x, V = (Y − C)/h_y)',
          equation: 'Xᵢ − X̄ = h_x(Uᵢ − Ū),   Yᵢ − Ȳ = h_y(Vᵢ − V̄)',
          note: 'Substitute into b_yx = ∑(Xᵢ − X̄)(Yᵢ − Ȳ) / ∑(Xᵢ − X̄)²:',
        },
        {
          step: 3,
          title: 'Scale Multiplier Rule',
          equation: 'b_yx = [ h_x h_y ∑(Uᵢ − Ū)(Vᵢ − V̄) ] / [ h_x² ∑(Uᵢ − Ū)² ] = (h_y / h_x) · b_vu',
          note: 'Origin constants A, C disappear, but scale ratio (h_y / h_x) remains!',
        },
        {
          step: 4,
          title: 'Slopes of Both Lines in the Standard (X, Y) Plane',
          equation: 'Line (Y on X): m₁ = b_yx = r(σ_y/σ_x);   Line (X on Y): Y = (1/b_xy)X − c/b_xy ⇒ m₂ = 1/b_xy = σ_y / (r·σ_x)',
          note: 'Apply the coordinate-geometry acute-angle formula tan θ = |(m₂ − m₁) / (1 + m₁m₂)|:',
        },
        {
          step: 5,
          title: 'Derive Acute Angle Formula',
          equation: 'tan θ = | [ σ_y/(rσ_x) − rσ_y/σ_x ] / [ 1 + (σ_y² / σ_x²) ] | = [ (1 − r²) / |r| ] · [ σ_x σ_y / (σ_x² + σ_y²) ]',
          note: 'Notice: r = ±1 ⇒ tan θ = 0 ⇒ θ = 0°;  r = 0 ⇒ tan θ → ∞ ⇒ θ = 90°.',
        },
      ],
      result: 'r² = b_yx·b_xy ≤ 1;  b_yx = (h_y/h_x)b_vu;  tan θ = [(1 − r²)/|r|] · [σ_x σ_y / (σ_x² + σ_y²)].',
    },
    keyTakeawayN:
      'For coded variables U = (X − A)/h_x and V = (Y − C)/h_y, NEVER forget the factor (h_y/h_x) when converting b_vu back to b_yx!',
  },
  {
    id: 'ch2-sub-5',
    code: '2.5',
    title: 'Coefficient of Determination (R²) & Variance Decomposition',
    depths: ['SD', 'D', 'DR', 'I', 'E', 'A', 'N'] as DepthCode[],
    definitionSD:
      'The Coefficient of Determination (R²) is the proportion of total variance in the dependent variable Y that is explained by the linear regression model on X: R² = SSR / SST = 1 − (SSE / SST).',
    descriptionD:
      'Total variation in Y around its mean (SST = ∑(Yᵢ − Ȳ)²) splits orthogonally into Explained / Regression variation (SSR = ∑(Ŷᵢ − Ȳ)²) and Unexplained / Residual variation (SSE = ∑(Yᵢ − Ŷᵢ)²).',
    explanationE:
      'In Simple Linear Regression (1 predictor), R² equals the square of Karl Pearson’s correlation coefficient (R² = r²). Thus R² ranges from 0 (0% explained) to 1 (100% explained), and 1 − R² represents the Coefficient of Alienation (unexplained noise fraction).',
    illustrationI:
      'In PU Model Q2, r = 0.9797 gives R² = 0.9598: 95.98% of the variation in firm sales is explained linearly by advertising expenditure, leaving only 4.02% to other market factors.',
    applicationA:
      'Evaluating goodness-of-fit of engineering models, reporting sensor calibration fidelity, and judging predictive reliability before extrapolating.',
    derivationDR: {
      title: 'Derivation (DR): SST = SSR + SSE Decomposition & Proof that R² = r²',
      goal: 'Prove ∑(Yᵢ − Ȳ)² = ∑(Ŷᵢ − Ȳ)² + ∑(Yᵢ − Ŷᵢ)² and show SSR / SST = r².',
      steps: [
        {
          step: 1,
          title: 'Add and Subtract Ŷᵢ Inside Total Deviation',
          equation: 'SST = ∑(Yᵢ − Ȳ)² = ∑[ (Ŷᵢ − Ȳ) + (Yᵢ − Ŷᵢ) ]²',
          note: 'Expand the binomial square across the summation.',
        },
        {
          step: 2,
          title: 'Show Cross-Product Term Vanishes via Normal Equations',
          equation: '∑(Ŷᵢ − Ȳ)(Yᵢ − Ŷᵢ) = ∑b(Xᵢ − X̄)eᵢ = b[ ∑Xᵢeᵢ − X̄∑eᵢ ] = 0',
          note: 'From Normal Equations: ∑eᵢ = 0 and ∑Xᵢeᵢ = 0!',
        },
        {
          step: 3,
          title: 'Variance Partition Identity',
          equation: 'SST = SSR + SSE,   where SSR = ∑(Ŷᵢ − Ȳ)² = b_yx² ∑(Xᵢ − X̄)²',
          note: 'Since Ŷᵢ − Ȳ = (a + b_yx Xᵢ) − (a + b_yx X̄) = b_yx(Xᵢ − X̄).',
        },
        {
          step: 4,
          title: 'Compute R² = SSR / SST',
          equation: 'R² = [ b_yx² ∑(Xᵢ − X̄)² ] / ∑(Yᵢ − Ȳ)² = [ r·(σ_y/σ_x) ]² · (nσ_x²) / (nσ_y²) = r²',
          note: 'Therefore, 0 ≤ R² = r² ≤ 1 identically in Simple Linear Regression.',
        },
      ],
      result: 'SST = SSR + SSE   and   R² = SSR / SST = 1 − (SSE / SST) = r².',
    },
    keyTakeawayN:
      'Always express R² both as a decimal (e.g., 0.9598) and a percentage interpretation ("95.98% of variation in Y is explained by X").',
  },
];

export const CH2_FORMULA_SHEET: FormulaItem[] = [
  {
    id: 'ch2-f-cov',
    category: 'Location',
    quantity: 'Sample / Empirical Covariance',
    symbol: 'Cov(X, Y)',
    formula: 'Cov(X, Y) = (1/n)∑(Xᵢ − X̄)(Yᵢ − Ȳ) = (∑XY)/n − X̄Ȳ',
    assumptionOrConstant: 'Can be positive, zero, or negative; sensitive to scale',
    unit: 'Unit(X) · Unit(Y)',
  },
  {
    id: 'ch2-f-r-def',
    category: 'Location',
    quantity: "Karl Pearson's Correlation Coefficient",
    symbol: 'r',
    formula: 'r = Cov(X, Y) / (σ_x · σ_y) = [n∑XY − (∑X)(∑Y)] / √([n∑X² − (∑X)²][n∑Y² − (∑Y)²])',
    assumptionOrConstant: 'Bounds: −1 ≤ r ≤ +1; measures linear strength only',
    unit: 'Dimensionless',
  },
  {
    id: 'ch2-f-r-code',
    category: 'Location',
    quantity: 'Coded Correlation (U = (X−A)/h_x, V = (Y−C)/h_y)',
    symbol: 'r_uv',
    formula: 'r_xy = sgn(h_x · h_y) · [n∑UV − (∑U)(∑V)] / √([n∑U² − (∑U)²][n∑V² − (∑V)²])',
    assumptionOrConstant: 'r_xy = r_uv if h_x·h_y > 0; flips sign if h_x·h_y < 0',
    unit: 'Dimensionless',
  },
  {
    id: 'ch2-f-reg-model',
    category: 'Dispersion',
    quantity: 'Simple Linear Regression Model',
    symbol: 'Yᵢ',
    formula: 'Yᵢ = β₀ + β₁Xᵢ + εᵢ   (Estimated: Ŷ = a + b_yx·X)',
    assumptionOrConstant: 'E(εᵢ|Xᵢ)=0, Var(εᵢ|Xᵢ)=σ², Cov(εᵢ,εⱼ)=0, Cov(Xᵢ,εᵢ)=0',
    unit: 'Same as Y',
  },
  {
    id: 'ch2-f-normal-eq',
    category: 'Dispersion',
    quantity: 'OLS Normal Equations (Y on X)',
    symbol: 'a, b_yx',
    formula: '∑Y = n·a + b_yx∑X   and   ∑XY = a∑X + b_yx∑X²',
    assumptionOrConstant: 'Minimizes vertical SSE = ∑(Yᵢ − Ŷᵢ)²; forces ∑eᵢ = 0',
    unit: 'a: Unit(Y); b_yx: Unit(Y)/Unit(X)',
  },
  {
    id: 'ch2-f-byx',
    category: 'Dispersion',
    quantity: 'Regression Coefficient of Y on X',
    symbol: 'b_yx',
    formula: 'b_yx = [n∑XY − (∑X)(∑Y)] / [n∑X² − (∑X)²] = r · (σ_y / σ_x)',
    assumptionOrConstant: 'Marginal change in Y per +1 unit increase in X; a = Ȳ − b_yx·X̄',
    unit: 'Unit(Y) / Unit(X)',
  },
  {
    id: 'ch2-f-bxy',
    category: 'Dispersion',
    quantity: 'Regression Coefficient of X on Y',
    symbol: 'b_xy',
    formula: 'b_xy = [n∑XY − (∑X)(∑Y)] / [n∑Y² − (∑Y)²] = r · (σ_x / σ_y)',
    assumptionOrConstant: 'Minimizes horizontal SSE = ∑(Xᵢ − X̂ᵢ)²; c = X̄ − b_xy·Ȳ',
    unit: 'Unit(X) / Unit(Y)',
  },
  {
    id: 'ch2-f-r2-det',
    category: 'Dispersion',
    quantity: 'Coefficient of Determination',
    symbol: 'R²',
    formula: 'R² = SSR / SST = 1 − (SSE / SST) = r² = b_yx · b_xy',
    assumptionOrConstant: '0 ≤ R² ≤ 1; fraction of Y variance linearly explained by X',
    unit: 'Dimensionless (or %)',
  },
  {
    id: 'ch2-f-geom-mean',
    category: 'Properties & Constants',
    quantity: 'Correlation from Two Regression Slopes',
    symbol: 'r',
    formula: 'r = sgn(b_yx) · √(b_yx · b_xy),   with b_yx · b_xy ≤ 1',
    assumptionOrConstant: 'b_yx, b_xy, and r MUST share the exact same sign',
    unit: 'Dimensionless',
  },
  {
    id: 'ch2-f-scale-slope',
    category: 'Properties & Constants',
    quantity: 'Origin & Scale Transformation on Slope',
    symbol: 'b_yx',
    formula: 'b_yx = (h_y / h_x) · b_vu   where U = (X−A)/h_x, V = (Y−C)/h_y',
    assumptionOrConstant: 'Independent of origin shifts A, C; scales by ratio h_y / h_x',
    unit: 'Unit(Y) / Unit(X)',
  },
  {
    id: 'ch2-f-angle',
    category: 'Properties & Constants',
    quantity: 'Acute Angle Between Regression Lines',
    symbol: 'θ',
    formula: 'tan θ = [ (1 − r²) / |r| ] · [ (σ_x · σ_y) / (σ_x² + σ_y²) ]',
    assumptionOrConstant: 'r = ±1 ⇒ θ = 0° (coincident); r = 0 ⇒ θ = 90° (perpendicular)',
    unit: 'Degrees (°) or Radians (rad)',
  },
  {
    id: 'ch2-f-se-est',
    category: 'Properties & Constants',
    quantity: 'Standard Error of Estimate (Residual SD)',
    symbol: 'S_e',
    formula: 'S_e = √[ SSE / (n − 2) ] = √[ (∑Y² − a∑Y − b_yx∑XY) / (n − 2) ]',
    assumptionOrConstant: 'Degrees of freedom = n − 2 (2 parameters estimated: a and b_yx)',
    unit: 'Same as Y',
  },
];

export const CH2_SOLVED_QUESTIONS: SolvedProblem[] = [
  {
    id: 'pu-model-q2',
    tag: 'PU Model Set · Group A, Q2',
    title: 'Regression Equation of Sales on Advertising Expenditure & Forecast',
    marks: '10 Marks',
    source: 'Attached PDF — PU V Sem Final Exam 2024 Model Question, Page 7',
    statement:
      "In trying to evaluate the effectiveness in its advertising campaign, a firm compiled the following information for years 2001–2007: Advertising Expenditure ('000 Rs): [12, 14, 17, 22, 35, 42, 50], Sales (lakh Rs.): [5.1, 5.5, 5.8, 7.0, 7.5, 8.2, 9.5]. (a) Obtain the regression equation of sales on advertising expenditure. (b) Estimate the probable sales when advertisement expenditure is Rs. 65 thousand.",
    given: [
      "Let X = Advertising Expenditure (in '000 Rs) [independent variable]",
      'Let Y = Sales (in lakh Rs.) [dependent variable], number of pairs n = 7',
      'Target prediction in part (b): Rs. 65 thousand ⇒ X = 65 (matching table unit of \'000 Rs)',
    ],
    tableHeaders: ['Year', "Ad Exp. X ('000 Rs)", 'Sales Y (lakh Rs.)', 'X²', 'Y²', 'X · Y'],
    tableRows: [
      ['2001', '12', '5.1', '144', '26.01', '61.2'],
      ['2002', '14', '5.5', '196', '30.25', '77.0'],
      ['2003', '17', '5.8', '289', '33.64', '98.6'],
      ['2004', '22', '7.0', '484', '49.00', '154.0'],
      ['2005', '35', '7.5', '1225', '56.25', '262.5'],
      ['2006', '42', '8.2', '1764', '67.24', '344.4'],
      ['2007', '50', '9.5', '2500', '90.25', '475.0'],
    ],
    tableTotals: ['n = 7', '∑X = 192', '∑Y = 48.6', '∑X² = 6602', '∑Y² = 352.64', '∑XY = 1472.7'],
    steps: [
      {
        heading: 'Step 1: Compute Sample Means X̄ and Ȳ',
        work: [
          'X̄ = ∑X / n = 192 / 7 = 27.4286 thousand Rs.',
          'Ȳ = ∑Y / n = 48.6 / 7 = 6.9429 lakh Rs.',
        ],
      },
      {
        heading: 'Step 2: Compute Regression Coefficient b_yx (Sales on Advertising)',
        work: [
          'Numerator: n∑XY − (∑X)(∑Y) = 7(1472.7) − (192)(48.6) = 10308.9 − 9331.2 = 977.7',
          'Denominator: n∑X² − (∑X)² = 7(6602) − (192)² = 46214 − 36864 = 9350',
          'b_yx = 977.7 / 9350 = 0.104567 ≈ 0.1046 lakh Rs. per thousand Rs. ad spend',
        ],
      },
      {
        heading: 'Step 3: Compute Intercept (a) & Write Regression Equation',
        work: [
          'a = Ȳ − b_yx·X̄ = (48.6 / 7) − 0.1045668 × (192 / 7) = 6.942857 − 2.868119 = 4.074738 ≈ 4.0747 lakh Rs.',
          'Regression equation of Sales (Y) on Advertising Expenditure (X): Ŷ = 4.0747 + 0.1046·X',
          '(Verification check: r = 977.7 / √(9350 × 106.52) = 0.9797, R² = 95.98%)',
        ],
      },
      {
        heading: 'Step 4: Estimate Probable Sales When Ad Expenditure = Rs. 65 Thousand (X = 65)',
        work: [
          'Substitute X = 65 into the regression equation:',
          'Ŷ(65) = 4.074738 + 0.104567 × 65 = 4.074738 + 6.796845 = 10.8716 lakh Rs.',
          '(Note: Using 4-decimal rounded coefficients 4.0747 + 0.1046(65) gives 10.8737 lakh Rs.; both are accepted in PU marking)',
        ],
      },
    ],
    finalAnswer: [
      '(a) Regression Equation of Sales on Ad Expenditure: Ŷ = 4.0747 + 0.1046·X (X in \'000 Rs, Ŷ in lakh Rs.)',
      '(b) Estimated Sales at Rs. 65 thousand Ad Spend: 10.8716 lakh Rs. (≈ Rs. 10,87,160)',
    ],
  },
  {
    id: 'pu-model-q11',
    tag: 'PU Model Set · Group B, Q11',
    title: 'Distinguish Between Correlation and Regression',
    marks: '5 Marks',
    source: 'Attached PDF — PU V Sem Final Exam 2024 Model Question, Page 9',
    statement: 'Distinguish between correlation and regression.',
    given: [
      '5-Mark theory comparison: Write 5–6 crisp, structured points contrasting Meaning, Causality, Symmetry, Scale/Origin Invariance, Bounds, and Graphical Representation.',
    ],
    tableHeaders: ['Basis of Comparison', 'Correlation (r)', 'Regression (Ŷ = a + b_yx·X)'],
    tableRows: [
      [
        '1. Core Purpose',
        'Measures the degree (strength) and direction of linear association between two variables.',
        'Establishes the functional equation to predict/estimate the average value of one variable from the other.',
      ],
      [
        '2. Cause & Effect',
        'Does not imply causation; two variables may move together due to a third confounding variable.',
        'Assumes a directional dependency: independent variable X predicts dependent variable Y.',
      ],
      [
        '3. Symmetry',
        'Completely symmetric: r_xy = r_yx (no distinction between X and Y).',
        'Asymmetric / directional: regression line of Y on X differs from X on Y (b_yx ≠ b_xy in general).',
      ],
      [
        '4. Origin & Scale',
        'Independent of both origin shift and scale magnitude (r_uv = ±r_xy).',
        'Independent of origin shift, but NOT independent of scale: b_yx = (h_y/h_x)·b_vu.',
      ],
      [
        '5. Bounds & Units',
        'Pure dimensionless number strictly bounded between −1 and +1.',
        'Carries physical units: b_yx has units of Y/X; unbounded individually, subject to b_yx·b_xy ≤ 1.',
      ],
    ],
    steps: [
      {
        heading: 'Mathematical Bridge Between Both Concepts (Bonus Marks Sentence)',
        work: [
          'Regression slopes and correlation are linked by: b_yx = r·(σ_y/σ_x),  b_xy = r·(σ_x/σ_y),  and  r² = b_yx·b_xy.',
        ],
      },
    ],
    finalAnswer: [
      'Summary: Correlation quantifies linear co-movement (−1 ≤ r ≤ +1, unit-free, symmetric), whereas Regression provides a directional predictive equation (unit-dependent, asymmetric).',
    ],
  },
  {
    id: 'ch2-extra-1',
    tag: 'Extra Exam-Level Numerical 1',
    title: 'Two Regression Lines: Centroid Means, Line Identification, r, R², σ_y & Acute Angle θ',
    marks: '10 Marks Pattern',
    source: 'High-Yield PU Exam Practice (Two Regression Equations)',
    statement:
      'In an electrical load-temperature study, the two regression equations obtained are (i) 8X − 10Y + 66 = 0 and (ii) 40X − 18Y = 214. If the variance of X is σ_x² = 9, find: (a) Mean values X̄ and Ȳ, (b) Correlation coefficient r and Coefficient of Determination R², (c) Standard deviation σ_y, and (d) Acute angle θ between the two regression lines.',
    given: [
      'Line (i): 8X − 10Y = −66',
      'Line (ii): 40X − 18Y = 214',
      'Variance of X: σ_x² = 9 ⇒ Standard deviation σ_x = 3',
    ],
    steps: [
      {
        heading: 'Part (a): Find Means X̄ and Ȳ (Intersection of Both Regression Lines)',
        work: [
          'Both lines pass through (X̄, Ȳ). Multiply (i) by 5:  40X̄ − 50Ȳ = −330',
          'Subtract from (ii) 40X̄ − 18Ȳ = 214:  (−18 + 50)Ȳ = 214 − (−330)  ⇒  32Ȳ = 544  ⇒  Ȳ = 17',
          'Substitute Ȳ = 17 into (i):  8X̄ − 10(17) + 66 = 0  ⇒  8X̄ = 104  ⇒  X̄ = 13',
        ],
      },
      {
        heading: 'Part (b): Identify Each Line & Compute r and R²',
        work: [
          'Assume Line (i) is Y on X:  10Y = 8X + 66  ⇒  Y = 0.8X + 6.6  ⇒  b_yx = 0.8',
          'Assume Line (ii) is X on Y:  40X = 18Y + 214  ⇒  X = 0.45Y + 5.35  ⇒  b_xy = 0.45',
          'Check product condition: b_yx · b_xy = (0.8)(0.45) = 0.36 ≤ 1 (VALID! Reversing would give (40/18)(10/8) = 2.78 > 1, impossible).',
          'Since b_yx > 0 and b_xy > 0:  r = +√0.36 = +0.60,   and   R² = r² = 0.36 (36% variation explained).',
        ],
      },
      {
        heading: 'Part (c): Find Standard Deviation σ_y',
        work: [
          'Use b_yx = r · (σ_y / σ_x)  ⇒  0.8 = 0.6 × (σ_y / 3)',
          'σ_y = (0.8 × 3) / 0.6 = 4.0',
        ],
      },
      {
        heading: 'Part (d): Find Acute Angle θ Between the Two Regression Lines',
        work: [
          'tan θ = [ (1 − r²) / |r| ] · [ (σ_x · σ_y) / (σ_x² + σ_y²) ]',
          'tan θ = [ (1 − 0.36) / 0.6 ] · [ (3 × 4) / (3² + 4²) ] = (0.64 / 0.6) × (12 / 25) = (16/15) × (12/25) = 64 / 125 = 0.512',
          'θ = arctan(0.512) = 27.11° (0.4732 rad)',
        ],
      },
    ],
    finalAnswer: [
      '(a) X̄ = 13, Ȳ = 17',
      '(b) Line (i) is Y on X, Line (ii) is X on Y · r = +0.60 · R² = 0.36 (36%)',
      '(c) σ_y = 4.0',
      '(d) Acute angle θ = 27.11°',
    ],
  },
  {
    id: 'ch2-extra-2',
    tag: 'Extra Exam-Level Numerical 2',
    title: 'Coded Correlation, Scale Invariance & Regression of Voltage Drift on Temperature',
    marks: '10 Marks Pattern',
    source: 'High-Yield PU Exam Practice (Origin/Scale Coding & Regression)',
    statement:
      'An electronics engineer measured ambient temperature X (°C) and voltage drift Y (mV) across n = 8 runs: X = [20, 22, 25, 28, 30, 32, 35, 38], Y = [1.2, 1.5, 1.8, 2.3, 2.5, 2.9, 3.1, 3.5]. (a) Using coded variables u = X − 30 and v = 10(Y − 2.5), compute r and R². (b) State what r would be if X is converted to °F (F = 1.8X + 32) and Y to Volts (V = Y/1000). (c) Obtain the regression equation of Y on X.',
    given: [
      'n = 8 paired observations; A_x = 30, h_x = 1 (u = X − 30)',
      'A_y = 2.5, h_y = 0.1 (since v = (Y − 2.5)/0.1 = 10(Y − 2.5))',
    ],
    tableHeaders: ['X (°C)', 'Y (mV)', 'u = X−30', 'v = 10(Y−2.5)', 'u²', 'v²', 'u · v'],
    tableRows: [
      ['20', '1.2', '-10', '-13', '100', '169', '130'],
      ['22', '1.5', '-8', '-10', '64', '100', '80'],
      ['25', '1.8', '-5', '-7', '25', '49', '35'],
      ['28', '2.3', '-2', '-2', '4', '4', '4'],
      ['30', '2.5', '0', '0', '0', '0', '0'],
      ['32', '2.9', '+2', '+4', '4', '16', '8'],
      ['35', '3.1', '+5', '+6', '25', '36', '30'],
      ['38', '3.5', '+8', '+10', '64', '100', '80'],
    ],
    tableTotals: ['n = 8', '—', '∑u = -10', '∑v = -12', '∑u² = 286', '∑v² = 474', '∑uv = 367'],
    steps: [
      {
        heading: 'Part (a): Compute Coded Sums, Correlation r & Coefficient of Determination R²',
        work: [
          'S_uv = n∑uv − (∑u)(∑v) = 8(367) − (−10)(−12) = 2936 − 120 = 2816',
          'S_uu = n∑u² − (∑u)² = 8(286) − (−10)² = 2288 − 100 = 2188',
          'S_vv = n∑v² − (∑v)² = 8(474) − (−12)² = 3792 − 144 = 3648',
          'r_uv = 2816 / √(2188 × 3648) = 2816 / √7981824 = 2816 / 2825.2122 = +0.9967',
          'Since h_x = +1 > 0 and h_y = +0.1 > 0 (same sign), r_xy = r_uv = +0.9967',
          'Coefficient of Determination: R² = r² = (0.996739)² = 0.9935 (99.35% of drift variance explained by temperature)',
        ],
      },
      {
        heading: 'Part (b): Origin & Scale Invariance Check (F = 1.8X + 32, V = 0.001Y)',
        work: [
          'Both scale factors are strictly positive (+1.8 > 0 and +0.001 > 0), so h_F·h_V > 0.',
          'Therefore r(F, V) = r(X, Y) = +0.9967 (completely unchanged by °C → °F or mV → V conversion).',
        ],
      },
      {
        heading: 'Part (c): Regression Equation of Drift Y on Temperature X',
        work: [
          'X̄ = 30 + (∑u / n) = 30 − 10/8 = 28.75 °C;   Ȳ = 2.5 + h_y·(∑v / n) = 2.5 + 0.1(−12/8) = 2.35 mV',
          'Slope in coded units: b_vu = S_uv / S_uu = 2816 / 2188 = 1.28702',
          'Apply scale restoration rule: b_yx = (h_y / h_x) · b_vu = (0.1 / 1) × 1.28702 = 0.1287 mV/°C',
          'Intercept: a = Ȳ − b_yx·X̄ = 2.35 − 0.128702(28.75) = 2.35 − 3.7002 = −1.3502 mV',
          'Equation: Ŷ = −1.3502 + 0.1287·X',
        ],
      },
    ],
    finalAnswer: [
      '(a) r = +0.9967 · R² = 0.9935 (99.35%)',
      '(b) r(F, V) = +0.9967 (invariant under positive linear scaling)',
      '(c) Ŷ = −1.3502 + 0.1287·X (mV)',
    ],
  },
];

export const CH2_EXAM_TRAPS: ExamTrap[] = [
  {
    id: 'ch2-trap-sign-1',
    category: 'Sign Convention',
    title: 'Forgetting Negative Sign When Extracting r = ±√(b_yx · b_xy)',
    wrongApproach: 'Always writing r = +√(b_yx · b_xy) even when both b_yx and b_xy are negative (e.g. b_yx = −0.8, b_xy = −0.45 → writing r = +0.6).',
    correctRule: 'r, b_yx, and b_xy MUST always share the exact same sign! If both slopes are negative, r = −√(b_yx · b_xy) = −0.60.',
    examTip: 'If a problem produces opposite signs for b_yx and b_xy, your arithmetic has an error—that pair is mathematically impossible.',
  },
  {
    id: 'ch2-trap-sign-2',
    category: 'Sign Convention',
    title: 'Sign Flip of r Under Opposite-Sign Coding or Linear Scaling',
    wrongApproach: 'Assuming r is always invariant when transforming X or Y with a negative multiplier (e.g., U = 50 − X and V = Y − 10).',
    correctRule: 'r_xy = sgn(h_x · h_y) · r_uv. When one variable is reversed (negative scale) and the other keeps positive scale, r flips sign (r_xy = −r_uv).',
    examTip: 'Write out X = A + h_x U and Y = C + h_y V explicitly before computing so the signs of h_x and h_y are unmistakable.',
  },
  {
    id: 'ch2-trap-sign-3',
    category: 'Sign Convention',
    title: 'Unit Mismatch Trap in Prediction (PU Model Q2 Pattern)',
    wrongApproach: 'Plugging X = 65000 into Ŷ = 4.0747 + 0.1046·X when the table defines X in \'000 Rs.',
    correctRule: 'Match the predictor unit strictly to the column header: "Rs. 65 thousand" means X = 65, yielding 10.8716 lakh Rs. (not 6803 lakh Rs.!).',
    examTip: 'Always state units next to both variables at the top of your solution (e.g., X in \'000 Rs, Y in lakh Rs.).',
  },
  {
    id: 'ch2-trap-geom-1',
    category: 'Boundary & Slope Geometry',
    title: 'Angle θ Mistake: Using Slopes Directly Without Converting X-on-Y to Y = m₂X + c',
    wrongApproach: 'Computing tan θ = |(b_yx − b_xy) / (1 + b_yx·b_xy)| directly using b_xy as if it were dY/dX.',
    correctRule: 'In the (X, Y) plane, line Y on X has slope m₁ = b_yx, whereas line X on Y (X = c + b_xy Y) has slope m₂ = 1 / b_xy! Hence tan θ = [(1 − r²)/|r|] · [σ_x σ_y / (σ_x² + σ_y²)].',
    examTip: 'Check special cases: when r = ±1, θ = 0° (lines coincide); when r = 0, θ = 90° (lines are perpendicular).',
  },
  {
    id: 'ch2-trap-geom-2',
    category: 'Boundary & Slope Geometry',
    title: 'Confusing Y-on-X with X-on-Y & Failing the b_yx · b_xy ≤ 1 Test',
    wrongApproach: 'Arbitrarily labeling the first given equation as Y on X without verifying r² = b_yx · b_xy ≤ 1.',
    correctRule: 'Solve one equation for Y (giving candidate b_yx) and the other for X (giving candidate b_xy). If their product > 1, swap the assignment immediately!',
    examTip: 'Also remember: never solve Y = a + b_yx X algebraically for X to predict X from a given Y—use the X-on-Y line instead.',
  },
  {
    id: 'ch2-trap-geom-3',
    category: 'Boundary & Slope Geometry',
    title: 'Dropping the Scale Factor (h_y / h_x) in Coded Regression Coefficients',
    wrongApproach: 'Assuming b_yx = b_vu when using coded variables U = (X − A)/h_x and V = (Y − C)/h_y.',
    correctRule: 'Correlation r is scale-invariant, but regression slope is NOT: b_yx = (h_y / h_x) · b_vu.',
    examTip: 'Check dimensions: b_vu is in coded units, so multiplying by (h_y / h_x) restores Unit(Y)/Unit(X).',
  },
  {
    id: 'ch2-trap-pu-1',
    category: 'High-Yield PU Topic',
    title: 'Model Q2 (10 Marks): Full Regression Fitting + Future Prediction',
    wrongApproach: 'Computing only b_yx and forgetting intercept a = Ȳ − b_yx X̄, or rounding b_yx to 2 decimals.',
    correctRule: 'Keep at least 4 decimal places in b_yx and a, write the full equation Ŷ = a + b_yx·X, and clearly box the substituted prediction with units.',
    examTip: 'Chapter 2 carries 15/60 marks in PU—expect one 10-mark Group A numerical (regression fitting or two-lines problem) plus one 5-mark Group B theory/numerical.',
  },
  {
    id: 'ch2-trap-pu-2',
    category: 'High-Yield PU Topic',
    title: 'Model Q11 (5 Marks): Correlation vs. Regression & R² Interpretation',
    wrongApproach: 'Writing vague prose paragraphs without addressing symmetry, origin/scale properties, and causality.',
    correctRule: 'Present a clean 5-row comparison table (Purpose, Causality, Symmetry, Origin/Scale, Bounds/Units) and cite r² = b_yx·b_xy.',
    examTip: 'Examiners love seeing the exact distinction: Correlation is origin & scale invariant; Regression is origin invariant but scale dependent.',
  },
];
