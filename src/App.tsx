import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Circle, Moon, Printer, RotateCcw, Sun } from 'lucide-react';
import {
  CHAPTER_IDS,
  ChapterId,
  computeChapterSummary,
  createEmptyChapterProgress,
  loadStudyProgress,
  normalizeStudyProgress,
  saveStudyProgress,
  SimpleSectionKey,
  STUDY_PROGRESS_STORAGE_KEY,
  StudyProgressMap,
} from './utils/studyProgress';
import {
  EXAM_TRAPS,
  FORMULA_SHEET,
  SOLVED_QUESTIONS,
  SUBTOPIC_NOTES,
  SYLLABUS_CONTEXT,
} from './data/chapter1Content';
import {
  CH2_EXAM_TRAPS,
  CH2_FORMULA_SHEET,
  CH2_SOLVED_QUESTIONS,
  CH2_SUBTOPIC_NOTES,
  CH2_SYLLABUS_CONTEXT,
} from './data/chapter2Content';
import {
  CH3_EXAM_TRAPS,
  CH3_FORMULA_SHEET,
  CH3_SOLVED_QUESTIONS,
  CH3_SUBTOPIC_NOTES,
  CH3_SYLLABUS_CONTEXT,
} from './data/chapter3Content';
import {
  CH4_EXAM_TRAPS,
  CH4_FORMULA_SHEET,
  CH4_SOLVED_QUESTIONS,
  CH4_SUBTOPIC_NOTES,
  CH4_SYLLABUS_CONTEXT,
} from './data/chapter4Content';
import {
  CH5_EXAM_TRAPS,
  CH5_FORMULA_SHEET,
  CH5_SOLVED_QUESTIONS,
  CH5_SUBTOPIC_NOTES,
  CH5_SYLLABUS_CONTEXT,
} from './data/chapter5Content';
import {
  CH6_EXAM_TRAPS,
  CH6_FORMULA_SHEET,
  CH6_SOLVED_QUESTIONS,
  CH6_SUBTOPIC_NOTES,
  CH6_SYLLABUS_CONTEXT,
} from './data/chapter6Content';
import {
  CH7_EXAM_TRAPS,
  CH7_FORMULA_SHEET,
  CH7_SOLVED_QUESTIONS,
  CH7_SUBTOPIC_NOTES,
  CH7_SYLLABUS_CONTEXT,
} from './data/chapter7Content';
import {
  CH8_EXAM_TRAPS,
  CH8_FORMULA_SHEET,
  CH8_SOLVED_QUESTIONS,
  CH8_SUBTOPIC_NOTES,
  CH8_SYLLABUS_CONTEXT,
} from './data/chapter8Content';
import { StatisticsLab } from './components/StatisticsLab';
import { RegressionLab } from './components/RegressionLab';
import { ProbabilityLab } from './components/ProbabilityLab';
import { RandomVariableLab } from './components/RandomVariableLab';
import { DiscreteDistLab } from './components/DiscreteDistLab';
import { ContinuousDistLab } from './components/ContinuousDistLab';
import { EstimationLab } from './components/EstimationLab';
import { HypothesisLab } from './components/HypothesisLab';
import { TheorySection } from './components/TheorySection';
import { FormulaSheetSection } from './components/FormulaSheetSection';
import { SolvedQuestionsSection } from './components/SolvedQuestionsSection';
import { ExamTrapsSection } from './components/ExamTrapsSection';

type ThemeMode = 'light' | 'dark';

const CHAPTER_SHORT_LABELS: Record<ChapterId, string> = {
  ch1: 'Ch 1 · Descriptive',
  ch2: 'Ch 2 · Corr & Reg',
  ch3: 'Ch 3 · Probability',
  ch4: 'Ch 4 · Random Var',
  ch5: 'Ch 5 · Discrete Dist',
  ch6: 'Ch 6 · Continuous Dist',
  ch7: 'Ch 7 · Estimation',
  ch8: 'Ch 8 · Hypothesis',
};

export default function App() {
  const [activeChapter, setActiveChapter] = useState<ChapterId>('ch8');
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) {
      return 'dark';
    }
    return 'light';
  });
  const [studyProgress, setStudyProgress] = useState<StudyProgressMap>(() => loadStudyProgress());
  const [confirmingReset, setConfirmingReset] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    try {
      window.localStorage.setItem('pu-probstat-theme', theme);
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [theme]);

  useEffect(() => {
    saveStudyProgress(studyProgress);
  }, [studyProgress]);

  useEffect(() => {
    const handleStorageSync = (event: StorageEvent) => {
      if (event.key === STUDY_PROGRESS_STORAGE_KEY) {
        if (!event.newValue) {
          setStudyProgress(loadStudyProgress());
          return;
        }
        try {
          setStudyProgress(normalizeStudyProgress(JSON.parse(event.newValue)));
        } catch {
          // Ignore malformed storage events from other tabs
        }
      }
    };
    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, []);

  useEffect(() => {
    setConfirmingReset(false);
  }, [activeChapter]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handlePrint = () => {
    window.print();
  };

  const allChapters = useMemo(
    () => ({
      ch1: {
        ctx: SYLLABUS_CONTEXT,
        unitLabel: 'Unit 1',
        formulaUnitLabel: 'Chapter 1',
        headline: 'Probability & Statistics — Unit 1: Descriptive Statistics',
        weightage: '10 / 60 Marks',
        hours: '6 Hours',
        derivations: '8 Step-by-Step',
        solvedCount: 'Model Q4, Q12a + 2 Extra',
        solvedSubtitle:
          'Complete step-by-step solutions for every Unit 1 question in the attached 2024 PU Model Question Set (Q4 & Q12a), plus two high-yield 10-mark exam numericals.',
        notes: SUBTOPIC_NOTES,
        formulas: FORMULA_SHEET,
        categoryLabels: undefined,
        questions: SOLVED_QUESTIONS,
        traps: EXAM_TRAPS,
      },
      ch2: {
        ctx: CH2_SYLLABUS_CONTEXT,
        unitLabel: 'Unit 2',
        formulaUnitLabel: 'Chapter 2',
        headline: 'Probability & Statistics — Unit 2: Correlation and Regression',
        weightage: '15 / 60 Marks',
        hours: '5 Hrs (4 Hrs Det.)',
        derivations: '6 Step-by-Step',
        solvedCount: 'Model Q2, Q11 + 2 Extra',
        solvedSubtitle:
          'Complete step-by-step solutions for every Unit 2 question in the attached 2024 PU Model Question Set (Group A Q2 & Group B Q11), plus two high-yield 10-mark exam numericals.',
        notes: CH2_SUBTOPIC_NOTES,
        formulas: CH2_FORMULA_SHEET,
        categoryLabels: {
          Location: 'Correlation',
          Dispersion: 'Regression & R²',
          'Properties & Constants': 'Properties & Angle',
        },
        questions: CH2_SOLVED_QUESTIONS,
        traps: CH2_EXAM_TRAPS,
      },
      ch3: {
        ctx: CH3_SYLLABUS_CONTEXT,
        unitLabel: 'Unit 3',
        formulaUnitLabel: 'Chapter 3',
        headline: 'Probability & Statistics — Unit 3: Probability',
        weightage: '15 / 60 Marks',
        hours: '6 Hrs (5 Hrs Det.)',
        derivations: '3 Step-by-Step',
        solvedCount: 'Model Q1, Q5 + 2 Extra',
        solvedSubtitle:
          'Complete step-by-step solutions for every Unit 3 question in the attached 2024 PU Model Question Set (Group A Q1 & Group B Q5), plus two high-yield 10-mark exam numericals.',
        notes: CH3_SUBTOPIC_NOTES,
        formulas: CH3_FORMULA_SHEET,
        categoryLabels: {
          Location: 'Axioms & Counting',
          Dispersion: 'Laws & Conditional',
          'Properties & Constants': "Independence & Bayes'",
        },
        questions: CH3_SOLVED_QUESTIONS,
        traps: CH3_EXAM_TRAPS,
      },
      ch4: {
        ctx: CH4_SYLLABUS_CONTEXT,
        unitLabel: 'Unit 4',
        formulaUnitLabel: 'Chapter 4',
        headline: 'Probability & Statistics — Unit 4: Random Variable and Expectation',
        weightage: '5 / 60 Marks',
        hours: '3 Hrs (2 Hrs Det.)',
        derivations: '4 Step-by-Step',
        solvedCount: 'Model Q6 + 2 Extra',
        solvedSubtitle:
          'Complete step-by-step solution for the Unit 4 question in the attached 2024 PU Model Question Set (Group B Q6), plus two high-yield exam numericals.',
        notes: CH4_SUBTOPIC_NOTES,
        formulas: CH4_FORMULA_SHEET,
        categoryLabels: {
          Location: 'PMF, PDF & CDF',
          Dispersion: 'Expectation & Variance',
          'Properties & Constants': 'Linear & Moment Laws',
        },
        questions: CH4_SOLVED_QUESTIONS,
        traps: CH4_EXAM_TRAPS,
      },
      ch5: {
        ctx: CH5_SYLLABUS_CONTEXT,
        unitLabel: 'Unit 5',
        formulaUnitLabel: 'Chapter 5',
        headline: 'Probability & Statistics — Unit 5: Discrete Probability Distributions',
        weightage: '5 / 60 Marks',
        hours: '5 Hours',
        derivations: '4 Step-by-Step',
        solvedCount: 'Model Q7 + 2 Extra',
        solvedSubtitle:
          'Complete step-by-step solution for the Unit 5 question in the attached 2024 PU Model Question Set (Group B Q7), plus two high-yield Binomial & Poisson fitting numericals.',
        notes: CH5_SUBTOPIC_NOTES,
        formulas: CH5_FORMULA_SHEET,
        categoryLabels: {
          Location: 'Binomial Distribution',
          Dispersion: 'Poisson Distribution',
          'Properties & Constants': 'Approximation & Sums',
        },
        questions: CH5_SOLVED_QUESTIONS,
        traps: CH5_EXAM_TRAPS,
      },
      ch6: {
        ctx: CH6_SYLLABUS_CONTEXT,
        unitLabel: 'Unit 6',
        formulaUnitLabel: 'Chapter 6',
        headline: 'Probability & Statistics — Unit 6: Continuous Probability Distributions',
        weightage: '10 / 60 Marks',
        hours: '7 Hours',
        derivations: '3 Step-by-Step',
        solvedCount: 'Model Q10 + 2 Extra',
        solvedSubtitle:
          'Complete step-by-step solution for the Unit 6 question in the attached 2024 PU Model Question Set (Group B Q10), plus two high-yield 10-mark Normal, t & χ² numericals.',
        notes: CH6_SUBTOPIC_NOTES,
        formulas: CH6_FORMULA_SHEET,
        categoryLabels: {
          Location: 'Normal Curve & Moments',
          Dispersion: 'Areas & Linear Sums',
          'Properties & Constants': "Student's t & Chi-Square",
        },
        questions: CH6_SOLVED_QUESTIONS,
        traps: CH6_EXAM_TRAPS,
      },
      ch7: {
        ctx: CH7_SYLLABUS_CONTEXT,
        unitLabel: 'Unit 7',
        formulaUnitLabel: 'Chapter 7',
        headline: 'Probability & Statistics — Unit 7: Estimation',
        weightage: '5 / 60 Marks',
        hours: '4 Hours',
        derivations: '3 Step-by-Step',
        solvedCount: 'Model Q8, Q12b + 2 Extra',
        solvedSubtitle:
          'Complete step-by-step solutions for every Unit 7 question in the attached 2024 PU Model Question Set (Group B Q8 & Q12b), plus two high-yield confidence interval & sample size numericals.',
        notes: CH7_SUBTOPIC_NOTES,
        formulas: CH7_FORMULA_SHEET,
        categoryLabels: {
          Location: 'Estimators & Sample Size',
          Dispersion: 'Mean & Two-Mean CIs',
          'Properties & Constants': 'Proportions & Critical z',
        },
        questions: CH7_SOLVED_QUESTIONS,
        traps: CH7_EXAM_TRAPS,
      },
      ch8: {
        ctx: CH8_SYLLABUS_CONTEXT,
        unitLabel: 'Unit 8',
        formulaUnitLabel: 'Chapter 8',
        headline: 'Probability & Statistics — Unit 8: Testing of Hypothesis',
        weightage: '15 / 60 Marks',
        hours: '8 Hours',
        derivations: '3 Step-by-Step',
        solvedCount: 'Model Q3, Q9 + 2 Extra',
        solvedSubtitle:
          'Complete step-by-step solutions for every Unit 8 question in the attached 2024 PU Model Question Set (Group A Q3 & Group B Q9), plus two high-yield paired-t, two-proportion Z & Goodness-of-Fit numericals.',
        notes: CH8_SUBTOPIC_NOTES,
        formulas: CH8_FORMULA_SHEET,
        categoryLabels: {
          Location: 'Concept & z-Tests',
          Dispersion: 't-Tests & Chi-Square',
          'Properties & Constants': 'Critical Values & Validity',
        },
        questions: CH8_SOLVED_QUESTIONS,
        traps: CH8_EXAM_TRAPS,
      },
    }),
    [],
  );

  const chapterConfig = allChapters[activeChapter];
  const activeChapterProgress = studyProgress[activeChapter];

  const chapterSummaries = useMemo(() => {
    return CHAPTER_IDS.reduce(
      (acc, id) => {
        const cfg = allChapters[id];
        acc[id] = computeChapterSummary(
          studyProgress[id],
          cfg.notes.map((n) => n.id),
          cfg.questions.map((q) => q.id),
        );
        return acc;
      },
      {} as Record<ChapterId, ReturnType<typeof computeChapterSummary>>,
    );
  }, [allChapters, studyProgress]);

  const activeSummary = chapterSummaries[activeChapter];

  const overallSummary = useMemo(() => {
    let completedItems = 0;
    let totalItems = 0;
    let completedChapters = 0;
    for (const id of CHAPTER_IDS) {
      const summary = chapterSummaries[id];
      completedItems += summary.completedItems;
      totalItems += summary.totalItems;
      if (summary.isChapterCompleted) {
        completedChapters += 1;
      }
    }
    const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    return {
      completedItems,
      totalItems,
      percentage,
      completedChapters,
      totalChapters: CHAPTER_IDS.length,
    };
  }, [chapterSummaries]);

  const toggleSubtopic = (subtopicId: string) => {
    setStudyProgress((prev) => {
      const current = prev[activeChapter];
      const exists = current.completedSubtopics.includes(subtopicId);
      const nextSubtopics = exists
        ? current.completedSubtopics.filter((id) => id !== subtopicId)
        : [...current.completedSubtopics, subtopicId];
      return {
        ...prev,
        [activeChapter]: {
          ...current,
          completedSubtopics: nextSubtopics,
        },
      };
    });
  };

  const toggleAllSubtopics = () => {
    const allIds = chapterConfig.notes.map((n) => n.id);
    setStudyProgress((prev) => {
      const current = prev[activeChapter];
      const allDone = allIds.every((id) => current.completedSubtopics.includes(id));
      return {
        ...prev,
        [activeChapter]: {
          ...current,
          completedSubtopics: allDone ? [] : allIds,
        },
      };
    });
  };

  const toggleQuestion = (questionId: string) => {
    setStudyProgress((prev) => {
      const current = prev[activeChapter];
      const exists = current.completedQuestions.includes(questionId);
      const nextQuestions = exists
        ? current.completedQuestions.filter((id) => id !== questionId)
        : [...current.completedQuestions, questionId];
      return {
        ...prev,
        [activeChapter]: {
          ...current,
          completedQuestions: nextQuestions,
        },
      };
    });
  };

  const toggleAllQuestions = () => {
    const allIds = chapterConfig.questions.map((q) => q.id);
    setStudyProgress((prev) => {
      const current = prev[activeChapter];
      const allDone = allIds.every((id) => current.completedQuestions.includes(id));
      return {
        ...prev,
        [activeChapter]: {
          ...current,
          completedQuestions: allDone ? [] : allIds,
        },
      };
    });
  };

  const toggleSimpleSection = (sectionKey: SimpleSectionKey) => {
    setStudyProgress((prev) => {
      const current = prev[activeChapter];
      const exists = current.completedSections.includes(sectionKey);
      const nextSections = exists
        ? current.completedSections.filter((key) => key !== sectionKey)
        : [...current.completedSections, sectionKey];
      return {
        ...prev,
        [activeChapter]: {
          ...current,
          completedSections: nextSections,
        },
      };
    });
  };

  const resetActiveChapterProgress = () => {
    setStudyProgress((prev) => ({
      ...prev,
      [activeChapter]: createEmptyChapterProgress(),
    }));
    setConfirmingReset(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          <a
            href="#top"
            className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 font-display"
          >
            PU Exam Mastery
          </a>

          <nav aria-label="Study Guide Sections" className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#theory" className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0">
              Theory &amp; DR
            </a>
            <a href="#formulas" className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0">
              Formula Sheet
            </a>
            <a href="#solved" className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0">
              Model Questions
            </a>
            <a href="#traps" className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0">
              Exam Traps
            </a>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-sky-700 hover:bg-sky-800 dark:bg-sky-600 dark:hover:bg-sky-500 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              <Printer className="w-3.5 h-3.5" aria-hidden="true" />
              Print Guide
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-14">
        {/* Hero Header + Chapter Switcher Toolbar */}
        <section className="space-y-5">
          <div className="flex flex-col gap-3 no-print">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span>{chapterConfig.ctx.university}</span>
                <span aria-hidden="true"> · </span>
                <span>{chapterConfig.ctx.semester}</span>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                aria-pressed={theme === 'dark'}
                aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
                    Dark Mode
                  </>
                )}
              </button>
            </div>

            <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-lg self-start">
              {CHAPTER_IDS.map((chapterId) => {
                const summary = chapterSummaries[chapterId];
                const isActive = activeChapter === chapterId;
                return (
                  <button
                    key={chapterId}
                    type="button"
                    onClick={() => setActiveChapter(chapterId)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <span>{CHAPTER_SHORT_LABELS[chapterId]}</span>
                    {summary.isChapterCompleted ? (
                      <CheckCircle2
                        className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0"
                        aria-label="Completed"
                      />
                    ) : summary.completedItems > 0 ? (
                      <span className="font-mono text-[11px] tabular-nums text-sky-700 dark:text-sky-400">
                        {summary.completedItems}/{summary.totalItems}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 tracking-tight text-balance max-w-3xl">
            {chapterConfig.headline}
          </h1>

          {activeChapter === 'ch8' && (
            <p className="text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {CH8_SYLLABUS_CONTEXT.program}. Exam-mastery reference covering{' '}
              <span className="text-slate-800 dark:text-slate-100 font-medium">hypothesis testing fundamentals</span> (null/alternative hypotheses, Type I &amp; II errors, α &amp; df),{' '}
              <span className="text-slate-800 dark:text-slate-100 font-medium">z-tests &amp; t-tests</span> (single, two-sample &amp; paired), and{' '}
              <span className="text-slate-800 dark:text-slate-100 font-medium">chi-square (χ²) tests</span> (goodness of fit, independence of attributes &amp; validity).
            </p>
          )}
          {activeChapter === 'ch7' && (
            <p className="text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {CH7_SYLLABUS_CONTEXT.program}. Exam-mastery reference covering{' '}
              <span className="text-slate-800 dark:text-slate-100 font-medium">sampling, estimator criteria &amp; sample size</span>,{' '}
              <span className="text-slate-800 dark:text-slate-100 font-medium">standard error &amp; confidence intervals for means</span>, and{' '}
              <span className="text-slate-800 dark:text-slate-100 font-medium">confidence intervals for single and two proportions</span>.
            </p>
          )}
          {activeChapter === 'ch6' && (
            <p className="text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {CH6_SYLLABUS_CONTEXT.program}. Exam-mastery reference covering{' '}
              <span className="text-slate-800 dark:text-slate-100 font-medium">normal &amp; standard normal distributions</span> (curves, properties &amp; area calculations),{' '}
              <span className="text-slate-800 dark:text-slate-100 font-medium">Student&apos;s t-distribution</span>, and{' '}
              <span className="text-slate-800 dark:text-slate-100 font-medium">Chi-square (χ²) distribution &amp; applications</span>.
            </p>
          )}
          {activeChapter === 'ch5' && (
            <p className="text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {CH5_SYLLABUS_CONTEXT.program}. Exam-mastery reference covering{' '}
              <span className="text-slate-800 dark:text-slate-100 font-medium">Binomial distribution</span> (conditions, properties, probability computation &amp; distribution fitting) and{' '}
              <span className="text-slate-800 dark:text-slate-100 font-medium">Poisson distribution</span> (conditions, properties, Binomial limit, probability computation &amp; fitting).
            </p>
          )}
          {activeChapter === 'ch4' && (
            <p className="text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {CH4_SYLLABUS_CONTEXT.program}. Exam-mastery reference covering{' '}
              <span className="text-slate-800 dark:text-slate-100 font-medium">discrete and continuous random variables</span>,{' '}
              <span className="text-slate-800 dark:text-slate-100 font-medium">probability distributions (PMF, PDF &amp; CDF)</span>, and{' '}
              <span className="text-slate-800 dark:text-slate-100 font-medium">expected value, variance &amp; linear moment properties</span>.
            </p>
          )}
          {activeChapter === 'ch3' && (
            <p className="text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {CH3_SYLLABUS_CONTEXT.program}. Exam-mastery reference covering{' '}
              <span className="text-slate-800 dark:text-slate-100 font-medium">probability fundamentals &amp; counting</span> (sample space, mutually exclusive, equally likely, independent events, permutations &amp; combinations) and{' '}
              <span className="text-slate-800 dark:text-slate-100 font-medium">laws &amp; inverse inference</span> (additive and multiplicative laws, conditional probability, total probability, and Bayes&apos; Theorem).
            </p>
          )}
          {activeChapter === 'ch2' && (
            <p className="text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {CH2_SYLLABUS_CONTEXT.program}. Exam-mastery reference covering{' '}
              <span className="text-slate-800 dark:text-slate-100 font-medium">simple correlation</span> (Karl Pearson&apos;s coefficient r &amp; properties) and{' '}
              <span className="text-slate-800 dark:text-slate-100 font-medium">simple linear regression</span> (model, classical assumptions, least-squares estimators, regression coefficient properties, angle between lines, and coefficient of determination R²).
            </p>
          )}
          {activeChapter === 'ch1' && (
            <p className="text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {SYLLABUS_CONTEXT.program}. Exam-mastery reference covering{' '}
              <span className="text-slate-800 dark:text-slate-100 font-medium">measures of location</span> (mean, combined mean, median, mode, quartiles, percentiles &amp; properties) and{' '}
              <span className="text-slate-800 dark:text-slate-100 font-medium">measures of dispersion</span> (absolute &amp; relative variation, variance, standard deviation, and coefficient of variation).
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">Exam Weightage</div>
              <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums mt-0.5">
                {chapterConfig.weightage}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">Syllabus Allocation</div>
              <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums mt-0.5">
                {chapterConfig.hours}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">Derivations Covered</div>
              <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums mt-0.5">
                {chapterConfig.derivations}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">Solved Numericals</div>
              <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums mt-0.5">
                {chapterConfig.solvedCount}
              </div>
            </div>
          </div>

          {/* Study Progress Tracker Card (Saved to localStorage) */}
          <div className="no-print bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {chapterConfig.unitLabel} Study Progress
                  </span>
                  <span className="text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300">
                    {activeSummary.completedItems}/{activeSummary.totalItems} items ({activeSummary.percentage}%)
                  </span>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    All 8 Units:{' '}
                    <span className="font-mono tabular-nums text-slate-700 dark:text-slate-200 font-medium">
                      {overallSummary.completedItems}/{overallSummary.totalItems} ({overallSummary.percentage}%)
                    </span>
                    {overallSummary.completedChapters > 0 && (
                      <span> · {overallSummary.completedChapters}/8 completed</span>
                    )}
                  </span>
                </div>
                <div
                  className="w-full max-w-md h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={activeSummary.percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${chapterConfig.unitLabel} completion percentage`}
                >
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      activeSummary.isChapterCompleted
                        ? 'bg-emerald-600 dark:bg-emerald-500'
                        : 'bg-sky-600 dark:bg-sky-500'
                    }`}
                    style={{ width: `${activeSummary.percentage}%` }}
                  />
                </div>
              </div>

              {activeSummary.completedItems > 0 && (
                <div className="flex items-center gap-2 shrink-0">
                  {confirmingReset ? (
                    <>
                      <button
                        type="button"
                        onClick={resetActiveChapterProgress}
                        className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer"
                      >
                        Confirm Reset {chapterConfig.unitLabel}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmingReset(false)}
                        className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmingReset(true)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                      Reset {chapterConfig.unitLabel}
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              <div
                className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-xs transition-colors ${
                  activeSummary.isTheoryCompleted
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/35 border-emerald-200 dark:border-emerald-800/70'
                    : 'bg-slate-50/80 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800'
                }`}
              >
                <a
                  href="#theory"
                  className="font-medium text-slate-800 dark:text-slate-200 hover:text-sky-700 dark:hover:text-sky-400 truncate"
                >
                  01. Theory ({activeSummary.theoryDone}/{activeSummary.theoryTotal})
                </a>
                <button
                  type="button"
                  onClick={toggleAllSubtopics}
                  aria-pressed={activeSummary.isTheoryCompleted}
                  aria-label={activeSummary.isTheoryCompleted ? 'Mark Theory section incomplete' : 'Mark Theory section completed'}
                  className="p-0.5 rounded text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer shrink-0"
                >
                  {activeSummary.isTheoryCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  ) : (
                    <Circle className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>

              <div
                className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-xs transition-colors ${
                  activeSummary.isFormulasCompleted
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/35 border-emerald-200 dark:border-emerald-800/70'
                    : 'bg-slate-50/80 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800'
                }`}
              >
                <a
                  href="#formulas"
                  className="font-medium text-slate-800 dark:text-slate-200 hover:text-sky-700 dark:hover:text-sky-400 truncate"
                >
                  02. Formula Sheet
                </a>
                <button
                  type="button"
                  onClick={() => toggleSimpleSection('formulas')}
                  aria-pressed={activeSummary.isFormulasCompleted}
                  aria-label={activeSummary.isFormulasCompleted ? 'Mark Formula Sheet section incomplete' : 'Mark Formula Sheet section completed'}
                  className="p-0.5 rounded text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer shrink-0"
                >
                  {activeSummary.isFormulasCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  ) : (
                    <Circle className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>

              <div
                className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-xs transition-colors ${
                  activeSummary.isSolvedCompleted
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/35 border-emerald-200 dark:border-emerald-800/70'
                    : 'bg-slate-50/80 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800'
                }`}
              >
                <a
                  href="#solved"
                  className="font-medium text-slate-800 dark:text-slate-200 hover:text-sky-700 dark:hover:text-sky-400 truncate"
                >
                  03. Solved Qs ({activeSummary.solvedDone}/{activeSummary.solvedTotal})
                </a>
                <button
                  type="button"
                  onClick={toggleAllQuestions}
                  aria-pressed={activeSummary.isSolvedCompleted}
                  aria-label={activeSummary.isSolvedCompleted ? 'Mark Solved Questions section incomplete' : 'Mark Solved Questions section completed'}
                  className="p-0.5 rounded text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer shrink-0"
                >
                  {activeSummary.isSolvedCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  ) : (
                    <Circle className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>

              <div
                className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-xs transition-colors ${
                  activeSummary.isTrapsCompleted
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/35 border-emerald-200 dark:border-emerald-800/70'
                    : 'bg-slate-50/80 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800'
                }`}
              >
                <a
                  href="#traps"
                  className="font-medium text-slate-800 dark:text-slate-200 hover:text-sky-700 dark:hover:text-sky-400 truncate"
                >
                  04. Exam Traps
                </a>
                <button
                  type="button"
                  onClick={() => toggleSimpleSection('traps')}
                  aria-pressed={activeSummary.isTrapsCompleted}
                  aria-label={activeSummary.isTrapsCompleted ? 'Mark Exam Traps section incomplete' : 'Mark Exam Traps section completed'}
                  className="p-0.5 rounded text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer shrink-0"
                >
                  {activeSummary.isTrapsCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  ) : (
                    <Circle className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Two-Zone Lab */}
        {activeChapter === 'ch8' && <HypothesisLab />}
        {activeChapter === 'ch7' && <EstimationLab />}
        {activeChapter === 'ch6' && <ContinuousDistLab />}
        {activeChapter === 'ch5' && <DiscreteDistLab />}
        {activeChapter === 'ch4' && <RandomVariableLab />}
        {activeChapter === 'ch3' && <ProbabilityLab />}
        {activeChapter === 'ch2' && <RegressionLab />}
        {activeChapter === 'ch1' && <StatisticsLab />}

        {/* Section 1: Theory & Derivations */}
        <TheorySection
          unitLabel={chapterConfig.unitLabel}
          microSyllabusNote={chapterConfig.ctx.microSyllabusNote}
          notes={chapterConfig.notes}
          completedSubtopics={activeChapterProgress.completedSubtopics}
          onToggleSubtopic={toggleSubtopic}
          onToggleAllSubtopics={toggleAllSubtopics}
        />

        {/* Section 2: Master Formula & Design Constant Sheet */}
        <FormulaSheetSection
          unitLabel={chapterConfig.formulaUnitLabel}
          formulas={chapterConfig.formulas}
          categoryLabels={chapterConfig.categoryLabels}
          isCompleted={activeSummary.isFormulasCompleted}
          onToggleCompleted={() => toggleSimpleSection('formulas')}
        />

        {/* Section 3: Solved PU Model Questions + Extra Numericals */}
        <SolvedQuestionsSection
          subtitle={chapterConfig.solvedSubtitle}
          questions={chapterConfig.questions}
          completedQuestions={activeChapterProgress.completedQuestions}
          onToggleQuestion={toggleQuestion}
          onToggleAllQuestions={toggleAllQuestions}
        />

        {/* Section 4: Exam Traps */}
        <ExamTrapsSection
          traps={chapterConfig.traps}
          isCompleted={activeSummary.isTrapsCompleted}
          onToggleCompleted={() => toggleSimpleSection('traps')}
        />
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-16 no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            {chapterConfig.ctx.subject} · {chapterConfig.ctx.chapter} · {SYLLABUS_CONTEXT.totalSubjectMarks}
          </div>
          <div>
            Aligned to Purbanchal University Faculty of Engineering 2021 (2078) Batch Syllabus &amp; 2024 Model Question Set
          </div>
        </div>
      </footer>
    </div>
  );
}
