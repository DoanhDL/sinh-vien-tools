export type QuestionPart =
  | "part1"
  | "part2"
  | "part3"
  | "part4"
  | "part5"
  | "part6"
  | "part7";

export type TestStatus = "not-started" | "in-progress" | "submitted";

export type MasteryLevel = "new" | "reviewing" | "mastered";

export interface Choice {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  part: QuestionPart;
  audioUrl?: string;
  transcript?: string;
  imageUrl?: string;
  passageId?: string;
  questionText: string;
  choices: Choice[];
  correctChoiceId: string;
  explanation: string;
}

export interface Passage {
  id: string;
  title: string;
  content: string;
  questionIds: string[];
}

export interface PartData {
  passages?: Passage[];
  questions: Question[];
}

export interface TestSet {
  id: string;
  title: string;
  description: string;
  parts: QuestionPart[];
  questionIds: string[];
  timeLimit: number;
  examId?: string;
  year?: number;
  form?: number;
}

export interface ExamPack {
  id: string;
  year: number;
  form: number;
  title: string;
  description: string;
  timeLimit: number;
  parts: QuestionPart[];
  passages: Passage[];
  questions: Question[];
}

export interface UserAnswer {
  questionId: string;
  selectedChoiceId: string | null;
  isCorrect: boolean;
  timeSpent: number;
}

export interface TestResult {
  id: string;
  testSetId: string;
  testSetTitle: string;
  userAnswers: UserAnswer[];
  startedAt: string;
  finishedAt: string;
  rawScoreListening: number;
  rawScoreReading: number;
  scaledScoreListening: number;
  scaledScoreReading: number;
  scaledScore: number;
  totalQuestions: number;
  correctCount: number;
  partBreakdown: Record<QuestionPart, { correct: number; total: number }>;
}

export interface VocabCard {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaning: string;
  exampleSentence: string;
  topic: string;
  audioUrl?: string;
}

export interface VocabProgress {
  cardId: string;
  reviewCount: number;
  lastReviewedAt: string;
  masteryLevel: MasteryLevel;
}

export const LISTENING_PARTS: QuestionPart[] = [
  "part1",
  "part2",
  "part3",
  "part4",
];

export const READING_PARTS: QuestionPart[] = ["part5", "part6", "part7"];

export const PART_LABELS: Record<QuestionPart, string> = {
  part1: "Part 1 — Mô tả tranh",
  part2: "Part 2 — Hỏi đáp",
  part3: "Part 3 — Hội thoại",
  part4: "Part 4 — Bài nói ngắn",
  part5: "Part 5 — Hoàn thành câu",
  part6: "Part 6 — Hoàn thành đoạn văn",
  part7: "Part 7 — Đọc hiểu",
};
