import { useState } from "react";
import type { Passage, Question } from "../../types/toeic";
import type { TestResult } from "../../types/toeic";
import { LISTENING_PARTS, PART_LABELS } from "../../types/toeic";
import { buildReviewData } from "../../utils/scoring";
import AudioPlayer from "../test-practice/AudioPlayer";

interface ReviewAnswersProps {
  questions: Question[];
  passages: Passage[];
  result: TestResult;
  onBack: () => void;
}

function ReviewAnswers({
  questions,
  passages,
  result,
  onBack,
}: ReviewAnswersProps) {
  const [filter, setFilter] = useState<"all" | "wrong" | "correct">("all");
  const reviewItems = buildReviewData(questions, passages, result);

  const filtered = reviewItems
    .map((item, i) => ({ ...item, num: i + 1 }))
    .filter(({ answer }) => {
      if (filter === "all") return true;
      if (filter === "wrong") return !answer?.isCorrect;
      return answer?.isCorrect;
    });

  const wrongCount = reviewItems.filter((r) => !r.answer?.isCorrect).length;
  const correctCount = reviewItems.length - wrongCount;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Xem lại đáp án</h2>
          <p className="text-sm text-slate-500">
            ✅ {correctCount} đúng · ❌ {wrongCount} sai
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Quay lại kết quả
        </button>
      </div>

      <div className="flex gap-2">
        {([
          { id: "all" as const, label: `Tất cả (${reviewItems.length})` },
          { id: "wrong" as const, label: `Sai (${wrongCount})` },
          { id: "correct" as const, label: `Đúng (${correctCount})` },
        ]).map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === f.id
                ? "bg-blue-600 text-white"
                : "bg-white border hover:border-blue-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.map(({ question, answer, passage, num }) => {
        const isCorrect = answer?.isCorrect ?? false;
        const selectedId = answer?.selectedChoiceId;
        const correctChoice = question.choices.find(
          (c) => c.id === question.correctChoiceId,
        );
        const selectedChoice = question.choices.find(
          (c) => c.id === selectedId,
        );
        const isListening = LISTENING_PARTS.includes(question.part);

        return (
          <div
            key={question.id}
            className={`bg-white rounded-xl shadow p-5 border-l-4 ${
              isCorrect ? "border-green-500" : "border-red-500"
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  {PART_LABELS[question.part]}
                </span>
                <p className="font-medium text-slate-800 mt-2">
                  Câu {num}: {question.questionText}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full shrink-0 ${
                  isCorrect
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {isCorrect ? "Đúng" : "Sai"}
              </span>
            </div>

            {isListening && (
              <div className="my-3">
                <AudioPlayer
                  key={question.id}
                  audioUrl={question.audioUrl}
                  transcript={question.transcript}
                />
              </div>
            )}

            {passage && (
              <details className="mt-2">
                <summary className="text-sm text-blue-600 cursor-pointer font-medium">
                  Xem đoạn văn
                </summary>
                <pre className="mt-2 text-xs bg-slate-50 p-3 rounded-lg whitespace-pre-wrap leading-relaxed">
                  {passage.content}
                </pre>
              </details>
            )}

            <div className="mt-3 space-y-1 text-sm">
              <p>
                <span className="text-slate-500">Bạn chọn: </span>
                <span className={isCorrect ? "text-green-700 font-medium" : "text-red-700 font-medium"}>
                  {selectedChoice?.text ?? "Chưa trả lời"}
                </span>
              </p>
              {!isCorrect && (
                <p>
                  <span className="text-slate-500">Đáp án đúng: </span>
                  <span className="text-green-700 font-medium">
                    {correctChoice?.text}
                  </span>
                </p>
              )}
              <p className="text-slate-600 mt-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                💡 {question.explanation}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ReviewAnswers;
