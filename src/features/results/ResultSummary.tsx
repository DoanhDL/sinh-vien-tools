import type { TestResult } from "../../types/toeic";
import { PART_LABELS } from "../../types/toeic";
import {
  formatDuration,
  getScoreColor,
  getScoreLabel,
} from "../../utils/scoring";

interface ResultSummaryProps {
  result: TestResult;
  onReview: () => void;
  onRetry: () => void;
}

function ResultSummary({ result, onReview, onRetry }: ResultSummaryProps) {
  const parts = Object.entries(result.partBreakdown).filter(
    ([, v]) => v.total > 0,
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow p-8 text-center">
        <p className="text-sm text-slate-500 mb-1">Điểm ước tính TOEIC</p>
        <p
          className={`text-6xl font-bold ${getScoreColor(result.scaledScore)}`}
        >
          {result.scaledScore}
        </p>
        <p className="text-lg text-slate-600 mt-1">
          {getScoreLabel(result.scaledScore)}
        </p>
        <p className="text-xs text-amber-600 mt-3 bg-amber-50 inline-block px-3 py-1 rounded-full">
          ⚠ Điểm ước tính — không phải điểm thi thật của ETS
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {result.scaledScoreListening}
          </p>
          <p className="text-sm text-slate-500">Listening</p>
          <p className="text-xs text-slate-400">
            {result.rawScoreListening} câu đúng
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">
            {result.scaledScoreReading}
          </p>
          <p className="text-sm text-slate-500">Reading</p>
          <p className="text-xs text-slate-400">
            {result.rawScoreReading} câu đúng
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {result.correctCount}/{result.totalQuestions}
          </p>
          <p className="text-sm text-slate-500">Câu đúng</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-2xl font-bold text-slate-700">
            {formatDuration(result.startedAt, result.finishedAt)}
          </p>
          <p className="text-sm text-slate-500">Thời gian làm bài</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-bold mb-4">Tỷ lệ đúng theo Part</h3>
        <div className="space-y-3">
          {parts.map(([part, data]) => {
            const pct = Math.round((data.correct / data.total) * 100);
            return (
              <div key={part}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{PART_LABELS[part as keyof typeof PART_LABELS]}</span>
                  <span>
                    {data.correct}/{data.total} ({pct}%)
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      pct >= 70
                        ? "bg-green-500"
                        : pct >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          type="button"
          onClick={onReview}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Xem lại đáp án
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="px-6 py-3 border rounded-lg hover:bg-slate-50"
        >
          Làm đề khác
        </button>
      </div>
    </div>
  );
}

export default ResultSummary;
