import { useState } from 'react';
import { Printer } from 'lucide-react';
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
import { StatisticsLab } from './components/StatisticsLab';
import { RegressionLab } from './components/RegressionLab';
import { TheorySection } from './components/TheorySection';
import { FormulaSheetSection } from './components/FormulaSheetSection';
import { SolvedQuestionsSection } from './components/SolvedQuestionsSection';
import { ExamTrapsSection } from './components/ExamTrapsSection';

type ChapterId = 'ch1' | 'ch2';

export default function App() {
  const [activeChapter, setActiveChapter] = useState<ChapterId>('ch2');

  const handlePrint = () => {
    window.print();
  };

  const isCh2 = activeChapter === 'ch2';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          <a
            href="#top"
            className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 font-display"
          >
            PU Exam Mastery
          </a>

          <nav aria-label="Study Guide Sections" className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#theory" className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0">
              Theory &amp; DR
            </a>
            <a href="#formulas" className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0">
              Formula Sheet
            </a>
            <a href="#solved" className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0">
              Model Questions
            </a>
            <a href="#traps" className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0">
              Exam Traps
            </a>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
            <div className="text-xs text-slate-500 font-medium">
              <span>{isCh2 ? CH2_SYLLABUS_CONTEXT.university : SYLLABUS_CONTEXT.university}</span>
              <span aria-hidden="true"> · </span>
              <span>{isCh2 ? CH2_SYLLABUS_CONTEXT.semester : SYLLABUS_CONTEXT.semester}</span>
            </div>

            <div className="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveChapter('ch1')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeChapter === 'ch1' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ch 1 · Descriptive Statistics
              </button>
              <button
                type="button"
                onClick={() => setActiveChapter('ch2')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeChapter === 'ch2' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ch 2 · Correlation &amp; Regression
              </button>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance max-w-3xl">
            {isCh2
              ? 'Probability & Statistics — Unit 2: Correlation and Regression'
              : 'Probability & Statistics — Unit 1: Descriptive Statistics'}
          </h1>

          {isCh2 ? (
            <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
              {CH2_SYLLABUS_CONTEXT.program}. Exam-mastery reference covering{' '}
              <span className="text-slate-800 font-medium">simple correlation</span> (Karl Pearson&apos;s coefficient r &amp; properties) and{' '}
              <span className="text-slate-800 font-medium">simple linear regression</span> (model, classical assumptions, least-squares estimators, regression coefficient properties, angle between lines, and coefficient of determination R²).
            </p>
          ) : (
            <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
              {SYLLABUS_CONTEXT.program}. Exam-mastery reference covering{' '}
              <span className="text-slate-800 font-medium">measures of location</span> (mean, combined mean, median, mode, quartiles, percentiles &amp; properties) and{' '}
              <span className="text-slate-800 font-medium">measures of dispersion</span> (absolute &amp; relative variation, variance, standard deviation, and coefficient of variation).
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
            <div className="bg-white border border-slate-200 rounded-lg px-4 py-3">
              <div className="text-xs text-slate-500">Exam Weightage</div>
              <div className="text-lg font-semibold text-slate-900 font-mono tabular-nums mt-0.5">
                {isCh2 ? '15 / 60 Marks' : '10 / 60 Marks'}
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg px-4 py-3">
              <div className="text-xs text-slate-500">Syllabus Allocation</div>
              <div className="text-lg font-semibold text-slate-900 font-mono tabular-nums mt-0.5">
                {isCh2 ? '5 Hrs (4 Hrs Det.)' : '6 Hours'}
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg px-4 py-3">
              <div className="text-xs text-slate-500">Derivations Covered</div>
              <div className="text-lg font-semibold text-slate-900 font-mono tabular-nums mt-0.5">
                {isCh2 ? '6 Step-by-Step' : '8 Step-by-Step'}
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg px-4 py-3">
              <div className="text-xs text-slate-500">Solved Numericals</div>
              <div className="text-lg font-semibold text-slate-900 font-mono tabular-nums mt-0.5">
                {isCh2 ? 'Model Q2, Q11 + 2 Extra' : 'Model Q4, Q12a + 2 Extra'}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Two-Zone Lab */}
        {isCh2 ? <RegressionLab /> : <StatisticsLab />}

        {/* Section 1: Theory & Derivations */}
        <TheorySection
          unitLabel={isCh2 ? 'Unit 2' : 'Unit 1'}
          microSyllabusNote={isCh2 ? CH2_SYLLABUS_CONTEXT.microSyllabusNote : SYLLABUS_CONTEXT.microSyllabusNote}
          notes={isCh2 ? CH2_SUBTOPIC_NOTES : SUBTOPIC_NOTES}
        />

        {/* Section 2: Master Formula & Design Constant Sheet */}
        <FormulaSheetSection
          unitLabel={isCh2 ? 'Chapter 2' : 'Chapter 1'}
          formulas={isCh2 ? CH2_FORMULA_SHEET : FORMULA_SHEET}
          categoryLabels={
            isCh2
              ? {
                  Location: 'Correlation',
                  Dispersion: 'Regression & R²',
                  'Properties & Constants': 'Properties & Angle',
                }
              : undefined
          }
        />

        {/* Section 3: Solved PU Model Questions + Extra Numericals */}
        <SolvedQuestionsSection
          subtitle={
            isCh2
              ? 'Complete step-by-step solutions for every Unit 2 question in the attached 2024 PU Model Question Set (Group A Q2 & Group B Q11), plus two high-yield 10-mark exam numericals.'
              : 'Complete step-by-step solutions for every Unit 1 question in the attached 2024 PU Model Question Set (Q4 & Q12a), plus two high-yield 10-mark exam numericals.'
          }
          questions={isCh2 ? CH2_SOLVED_QUESTIONS : SOLVED_QUESTIONS}
        />

        {/* Section 4: Exam Traps */}
        <ExamTrapsSection traps={isCh2 ? CH2_EXAM_TRAPS : EXAM_TRAPS} />
      </main>

      <footer className="border-t border-slate-200 bg-white mt-16 no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            {isCh2 ? CH2_SYLLABUS_CONTEXT.subject : SYLLABUS_CONTEXT.subject} ·{' '}
            {isCh2 ? CH2_SYLLABUS_CONTEXT.chapter : SYLLABUS_CONTEXT.chapter} ·{' '}
            {SYLLABUS_CONTEXT.totalSubjectMarks}
          </div>
          <div>
            Aligned to Purbanchal University Faculty of Engineering 2021 (2078) Batch Syllabus &amp; 2024 Model Question Set
          </div>
        </div>
      </footer>
    </div>
  );
}
