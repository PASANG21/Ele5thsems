export type ChapterId = 'ch1' | 'ch2' | 'ch3' | 'ch4' | 'ch5' | 'ch6' | 'ch7' | 'ch8';

export type SimpleSectionKey = 'formulas' | 'traps';

export interface ChapterProgress {
  completedSubtopics: string[];
  completedQuestions: string[];
  completedSections: SimpleSectionKey[];
}

export type StudyProgressMap = Record<ChapterId, ChapterProgress>;

export const STUDY_PROGRESS_STORAGE_KEY = 'pu-probstat-progress-v1';

export const CHAPTER_IDS: ChapterId[] = ['ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6', 'ch7', 'ch8'];

export function createEmptyChapterProgress(): ChapterProgress {
  return {
    completedSubtopics: [],
    completedQuestions: [],
    completedSections: [],
  };
}

export function createInitialStudyProgress(): StudyProgressMap {
  return {
    ch1: createEmptyChapterProgress(),
    ch2: createEmptyChapterProgress(),
    ch3: createEmptyChapterProgress(),
    ch4: createEmptyChapterProgress(),
    ch5: createEmptyChapterProgress(),
    ch6: createEmptyChapterProgress(),
    ch7: createEmptyChapterProgress(),
    ch8: createEmptyChapterProgress(),
  };
}

function sanitizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  for (const item of value) {
    if (typeof item === 'string' && item.trim().length > 0) {
      seen.add(item);
    }
  }
  return Array.from(seen);
}

function sanitizeSimpleSections(value: unknown): SimpleSectionKey[] {
  if (!Array.isArray(value)) return [];
  const valid = new Set<SimpleSectionKey>();
  for (const item of value) {
    if (item === 'formulas' || item === 'traps') {
      valid.add(item);
    }
  }
  return Array.from(valid);
}

export function normalizeStudyProgress(raw: unknown): StudyProgressMap {
  const base = createInitialStudyProgress();
  if (!raw || typeof raw !== 'object') {
    return base;
  }

  const record = raw as Record<string, unknown>;
  for (const chapterId of CHAPTER_IDS) {
    const entry = record[chapterId];
    if (entry && typeof entry === 'object') {
      const chObj = entry as Record<string, unknown>;
      base[chapterId] = {
        completedSubtopics: sanitizeStringArray(chObj.completedSubtopics),
        completedQuestions: sanitizeStringArray(chObj.completedQuestions),
        completedSections: sanitizeSimpleSections(chObj.completedSections),
      };
    }
  }

  return base;
}

export function loadStudyProgress(): StudyProgressMap {
  if (typeof window === 'undefined') {
    return createInitialStudyProgress();
  }
  try {
    const raw = window.localStorage.getItem(STUDY_PROGRESS_STORAGE_KEY);
    if (!raw) {
      return createInitialStudyProgress();
    }
    return normalizeStudyProgress(JSON.parse(raw));
  } catch {
    return createInitialStudyProgress();
  }
}

export function saveStudyProgress(progress: StudyProgressMap): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STUDY_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage quota or restricted-context errors
  }
}

export interface ChapterProgressSummary {
  completedItems: number;
  totalItems: number;
  percentage: number;
  theoryDone: number;
  theoryTotal: number;
  isTheoryCompleted: boolean;
  isFormulasCompleted: boolean;
  solvedDone: number;
  solvedTotal: number;
  isSolvedCompleted: boolean;
  isTrapsCompleted: boolean;
  completedSectionsCount: number;
  isChapterCompleted: boolean;
}

export function computeChapterSummary(
  progress: ChapterProgress,
  subtopicIds: string[],
  questionIds: string[],
): ChapterProgressSummary {
  const subtopicSet = new Set(progress.completedSubtopics);
  const questionSet = new Set(progress.completedQuestions);

  const theoryDone = subtopicIds.filter((id) => subtopicSet.has(id)).length;
  const theoryTotal = subtopicIds.length;
  const isTheoryCompleted = theoryTotal > 0 && theoryDone === theoryTotal;

  const isFormulasCompleted = progress.completedSections.includes('formulas');

  const solvedDone = questionIds.filter((id) => questionSet.has(id)).length;
  const solvedTotal = questionIds.length;
  const isSolvedCompleted = solvedTotal > 0 && solvedDone === solvedTotal;

  const isTrapsCompleted = progress.completedSections.includes('traps');

  const completedItems =
    theoryDone + (isFormulasCompleted ? 1 : 0) + solvedDone + (isTrapsCompleted ? 1 : 0);
  const totalItems = theoryTotal + 1 + solvedTotal + 1;
  const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const completedSectionsCount =
    (isTheoryCompleted ? 1 : 0) +
    (isFormulasCompleted ? 1 : 0) +
    (isSolvedCompleted ? 1 : 0) +
    (isTrapsCompleted ? 1 : 0);

  return {
    completedItems,
    totalItems,
    percentage,
    theoryDone,
    theoryTotal,
    isTheoryCompleted,
    isFormulasCompleted,
    solvedDone,
    solvedTotal,
    isSolvedCompleted,
    isTrapsCompleted,
    completedSectionsCount,
    isChapterCompleted: completedItems === totalItems && totalItems > 0,
  };
}
