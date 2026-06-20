import type {
  ExamPack,
  Passage,
  Question,
  QuestionPart,
  TestSet,
  VocabCard,
} from "../types/toeic";

import examManifest from "./exams/manifest.json";
import vocabManifest from "./vocabulary/manifest.json";

const examModules = import.meta.glob("./exams/toeic-*.json", {
  eager: true,
}) as Record<string, { default: ExamPack }>;

const vocabModules = import.meta.glob("./vocabulary/topic-*.json", {
  eager: true,
}) as Record<string, { default: { topic: string; label: string; icon: string; cards: VocabCard[] } }>;

const exams: ExamPack[] = Object.values(examModules).map((m) => m.default);
const examMap = new Map(exams.map((e) => [e.id, e]));

export function getExamById(id: string): ExamPack | undefined {
  return examMap.get(id);
}

export function getAllExams(): ExamPack[] {
  return exams.sort((a, b) => b.year - a.year || a.form - b.form);
}

export function getExamsByYear(year: number): ExamPack[] {
  return exams.filter((e) => e.year === year).sort((a, b) => a.form - b.form);
}

export function getExamYears(): number[] {
  return [...new Set(exams.map((e) => e.year))].sort((a, b) => b - a);
}

export function examToTestSet(exam: ExamPack): TestSet {
  return {
    id: exam.id,
    examId: exam.id,
    year: exam.year,
    form: exam.form,
    title: exam.title,
    description: exam.description,
    parts: exam.parts,
    questionIds: exam.questions.map((q) => q.id),
    timeLimit: exam.timeLimit,
  };
}

export const YEARLY_TEST_SETS: TestSet[] = exams.map(examToTestSet);

function aggregateQuestionsByPart(part: QuestionPart): Question[] {
  return exams.flatMap((e) => e.questions.filter((q) => q.part === part));
}

export const TEST_SETS: TestSet[] = [
  ...YEARLY_TEST_SETS,
  {
    id: "listening-all",
    title: "Listening tổng hợp",
    description: "Tất cả câu Listening từ mọi đề",
    parts: ["part1", "part2", "part3", "part4"],
    questionIds: aggregateQuestionsByPart("part1")
      .concat(aggregateQuestionsByPart("part2"))
      .concat(aggregateQuestionsByPart("part3"))
      .concat(aggregateQuestionsByPart("part4"))
      .map((q) => q.id),
    timeLimit: 60,
  },
  {
    id: "reading-all",
    title: "Reading tổng hợp",
    description: "Tất cả câu Reading từ mọi đề",
    parts: ["part5", "part6", "part7"],
    questionIds: aggregateQuestionsByPart("part5")
      .concat(aggregateQuestionsByPart("part6"))
      .concat(aggregateQuestionsByPart("part7"))
      .map((q) => q.id),
    timeLimit: 55,
  },
  ...(["part1", "part2", "part3", "part4", "part5", "part6", "part7"] as QuestionPart[]).map(
    (part): TestSet => {
      const qs = aggregateQuestionsByPart(part);
      const partNum = part.replace("part", "");
      return {
        id: `practice-${part}`,
        title: `Luyện ${partNum} — Tổng hợp`,
        description: `${qs.length} câu từ tất cả đề thi`,
        parts: [part],
        questionIds: qs.map((q) => q.id),
        timeLimit: Math.max(15, Math.ceil(qs.length * 1.2)),
      };
    },
  ),
];

export function getTestSetById(id: string): TestSet | undefined {
  return TEST_SETS.find((t) => t.id === id);
}

export function loadTestData(testSet: TestSet): {
  questions: Question[];
  passages: Passage[];
} {
  if (testSet.examId) {
    const exam = getExamById(testSet.examId);
    if (!exam) return { questions: [], passages: [] };
    const qMap = new Map(exam.questions.map((q) => [q.id, q]));
    return {
      questions: testSet.questionIds
        .map((id) => qMap.get(id))
        .filter((q): q is Question => q !== undefined),
      passages: exam.passages ?? [],
    };
  }

  const allQuestions = exams.flatMap((e) => e.questions);
  const qMap = new Map(allQuestions.map((q) => [q.id, q]));
  const questions = testSet.questionIds
    .map((id) => qMap.get(id))
    .filter((q): q is Question => q !== undefined);

  const passageIds = new Set(questions.map((q) => q.passageId).filter(Boolean));
  const passages = exams
    .flatMap((e) => e.passages ?? [])
    .filter((p) => passageIds.has(p.id));

  return { questions, passages };
}

export const VOCAB_TOPICS = vocabManifest.topics.map((t) => ({
  id: t.id,
  label: t.label,
  icon: t.icon,
  count: t.count,
}));

const vocabMap: Record<string, VocabCard[]> = {};
for (const mod of Object.values(vocabModules)) {
  vocabMap[mod.default.topic] = mod.default.cards;
}

export function getVocabByTopic(topic: string): VocabCard[] {
  return vocabMap[topic] ?? [];
}

export function getAllVocabCards(): VocabCard[] {
  return Object.values(vocabMap).flat();
}

export { examManifest, vocabManifest };
