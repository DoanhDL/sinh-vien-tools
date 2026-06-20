import type {
  Question,
  QuestionPart,
  TestResult,
  UserAnswer,
  TestSet,
  Passage,
} from "../types/toeic";
import { LISTENING_PARTS, READING_PARTS } from "../types/toeic";

const CONVERSION_TABLE: Record<number, number> = {
  0: 5,
  5: 30,
  10: 60,
  15: 85,
  20: 110,
  25: 135,
  30: 160,
  35: 180,
  40: 200,
  45: 220,
  50: 240,
  55: 260,
  60: 280,
  65: 300,
  70: 320,
  75: 340,
  80: 365,
  85: 390,
  90: 420,
  95: 455,
  100: 495,
};

function convertRawScore(correct: number, total: number): number {
  if (total === 0) return 5;
  const ratio = correct / total;
  const scaledCorrect = Math.round(ratio * 100);
  const keys = Object.keys(CONVERSION_TABLE)
    .map(Number)
    .sort((a, b) => a - b);

  let lower = 0;
  let upper = 100;

  for (const key of keys) {
    if (key <= scaledCorrect) lower = key;
    if (key >= scaledCorrect && upper === 100) upper = key;
  }

  if (lower === upper) return CONVERSION_TABLE[lower] ?? 5;

  const lowerScore = CONVERSION_TABLE[lower] ?? 5;
  const upperScore = CONVERSION_TABLE[upper] ?? 495;
  const fraction = (scaledCorrect - lower) / (upper - lower);

  return Math.round(lowerScore + fraction * (upperScore - lowerScore));
}

export function calculateTestResult(
  testSet: TestSet,
  questions: Question[],
  answers: Map<string, string | null>,
  startedAt: string,
  finishedAt: string,
): TestResult {
  const userAnswers: UserAnswer[] = questions.map((q) => {
    const selected = answers.get(q.id) ?? null;
    return {
      questionId: q.id,
      selectedChoiceId: selected,
      isCorrect: selected === q.correctChoiceId,
      timeSpent: 0,
    };
  });

  const partBreakdown = {} as Record<
    QuestionPart,
    { correct: number; total: number }
  >;

  for (const q of questions) {
    if (!partBreakdown[q.part]) {
      partBreakdown[q.part] = { correct: 0, total: 0 };
    }
    partBreakdown[q.part].total++;
    const answer = userAnswers.find((a) => a.questionId === q.id);
    if (answer?.isCorrect) partBreakdown[q.part].correct++;
  }

  const listeningQuestions = questions.filter((q) =>
    LISTENING_PARTS.includes(q.part),
  );
  const readingQuestions = questions.filter((q) =>
    READING_PARTS.includes(q.part),
  );

  const rawScoreListening = userAnswers.filter(
    (a) =>
      a.isCorrect &&
      listeningQuestions.some((q) => q.id === a.questionId),
  ).length;

  const rawScoreReading = userAnswers.filter(
    (a) =>
      a.isCorrect &&
      readingQuestions.some((q) => q.id === a.questionId),
  ).length;

  const scaledScoreListening = convertRawScore(
    rawScoreListening,
    listeningQuestions.length || 100,
  );
  const scaledScoreReading = convertRawScore(
    rawScoreReading,
    readingQuestions.length || 100,
  );

  const correctCount = userAnswers.filter((a) => a.isCorrect).length;

  return {
    id: crypto.randomUUID(),
    testSetId: testSet.id,
    testSetTitle: testSet.title,
    userAnswers,
    startedAt,
    finishedAt,
    rawScoreListening,
    rawScoreReading,
    scaledScoreListening,
    scaledScoreReading,
    scaledScore: scaledScoreListening + scaledScoreReading,
    totalQuestions: questions.length,
    correctCount,
    partBreakdown,
  };
}

export function formatDuration(startedAt: string, finishedAt: string): string {
  const ms = new Date(finishedAt).getTime() - new Date(startedAt).getTime();
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes} phút ${seconds} giây`;
}

export function getScoreColor(score: number): string {
  if (score >= 800) return "text-green-600";
  if (score >= 600) return "text-blue-600";
  if (score >= 400) return "text-yellow-600";
  return "text-red-600";
}

export function getScoreLabel(score: number): string {
  if (score >= 900) return "Xuất sắc";
  if (score >= 800) return "Rất tốt";
  if (score >= 700) return "Tốt";
  if (score >= 600) return "Khá";
  if (score >= 500) return "Trung bình";
  return "Cần cải thiện";
}

export function buildReviewData(
  questions: Question[],
  passages: Passage[],
  result: TestResult,
) {
  return questions.map((q) => {
    const answer = result.userAnswers.find((a) => a.questionId === q.id);
    const passage = q.passageId
      ? passages.find((p) => p.id === q.passageId)
      : undefined;
    return { question: q, answer, passage };
  });
}
