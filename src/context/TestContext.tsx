import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type {
  Passage,
  Question,
  TestResult,
  TestSet,
  TestStatus,
} from "../types/toeic";
import { loadTestData } from "../data/index";
import { calculateTestResult } from "../utils/scoring";
import { saveTestResult } from "../utils/storage";

interface TestContextValue {
  currentTestSet: TestSet | null;
  questions: Question[];
  passages: Passage[];
  currentQuestionIndex: number;
  answers: Map<string, string | null>;
  flaggedQuestions: Set<string>;
  timeRemaining: number;
  status: TestStatus;
  result: TestResult | null;
  startedAt: string | null;
  startTest: (testSet: TestSet) => void;
  selectAnswer: (questionId: string, choiceId: string) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  toggleFlag: (questionId: string) => void;
  submitTest: () => TestResult;
  resetTest: () => void;
}

const TestContext = createContext<TestContextValue | null>(null);

export function TestProvider({ children }: { children: ReactNode }) {
  const [currentTestSet, setCurrentTestSet] = useState<TestSet | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [passages, setPassages] = useState<Passage[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, string | null>>(
    new Map(),
  );
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(
    new Set(),
  );
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [status, setStatus] = useState<TestStatus>("not-started");
  const [result, setResult] = useState<TestResult | null>(null);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const submitTest = useCallback((): TestResult => {
    clearTimer();
    const finishedAt = new Date().toISOString();
    const testResult = calculateTestResult(
      currentTestSet!,
      questions,
      answers,
      startedAt ?? finishedAt,
      finishedAt,
    );
    setResult(testResult);
    setStatus("submitted");
    void saveTestResult(testResult);
    return testResult;
  }, [clearTimer, currentTestSet, questions, answers, startedAt]);

  useEffect(() => {
    if (status !== "in-progress") return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [status, clearTimer]);

  useEffect(() => {
    if (status === "in-progress" && timeRemaining === 0 && startedAt) {
      submitTest();
    }
  }, [timeRemaining, status, startedAt, submitTest]);

  const startTest = useCallback(
    (testSet: TestSet) => {
      const { questions: qs, passages: ps } = loadTestData(testSet);
      setCurrentTestSet(testSet);
      setQuestions(qs);
      setPassages(ps);
      setCurrentQuestionIndex(0);
      setAnswers(new Map());
      setFlaggedQuestions(new Set());
      setTimeRemaining(testSet.timeLimit * 60);
      setStatus("in-progress");
      setResult(null);
      setStartedAt(new Date().toISOString());
    },
    [],
  );

  const selectAnswer = useCallback(
    (questionId: string, choiceId: string) => {
      if (status !== "in-progress") return;
      setAnswers((prev) => {
        const next = new Map(prev);
        next.set(questionId, choiceId);
        return next;
      });
    },
    [status],
  );

  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < questions.length) {
        setCurrentQuestionIndex(index);
      }
    },
    [questions.length],
  );

  const nextQuestion = useCallback(() => {
    goToQuestion(currentQuestionIndex + 1);
  }, [currentQuestionIndex, goToQuestion]);

  const prevQuestion = useCallback(() => {
    goToQuestion(currentQuestionIndex - 1);
  }, [currentQuestionIndex, goToQuestion]);

  const toggleFlag = useCallback((questionId: string) => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  }, []);

  const resetTest = useCallback(() => {
    clearTimer();
    setCurrentTestSet(null);
    setQuestions([]);
    setPassages([]);
    setCurrentQuestionIndex(0);
    setAnswers(new Map());
    setFlaggedQuestions(new Set());
    setTimeRemaining(0);
    setStatus("not-started");
    setResult(null);
    setStartedAt(null);
  }, [clearTimer]);

  const value = useMemo(
    () => ({
      currentTestSet,
      questions,
      passages,
      currentQuestionIndex,
      answers,
      flaggedQuestions,
      timeRemaining,
      status,
      result,
      startedAt,
      startTest,
      selectAnswer,
      goToQuestion,
      nextQuestion,
      prevQuestion,
      toggleFlag,
      submitTest,
      resetTest,
    }),
    [
      currentTestSet,
      questions,
      passages,
      currentQuestionIndex,
      answers,
      flaggedQuestions,
      timeRemaining,
      status,
      result,
      startedAt,
      startTest,
      selectAnswer,
      goToQuestion,
      nextQuestion,
      prevQuestion,
      toggleFlag,
      submitTest,
      resetTest,
    ],
  );

  return (
    <TestContext.Provider value={value}>{children}</TestContext.Provider>
  );
}

export function useTestContext(): TestContextValue {
  const ctx = useContext(TestContext);
  if (!ctx) {
    throw new Error("useTestContext must be used within TestProvider");
  }
  return ctx;
}
