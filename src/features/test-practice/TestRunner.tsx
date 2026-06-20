import { useTestContext } from "../../context/TestContext";
import Timer from "./Timer";
import QuestionCard from "./QuestionCard";

interface TestRunnerProps {
  onSubmit: () => void;
}

function TestRunner({ onSubmit }: TestRunnerProps) {
  const {
    currentTestSet,
    questions,
    passages,
    currentQuestionIndex,
    answers,
    flaggedQuestions,
    timeRemaining,
    selectAnswer,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    toggleFlag,
    submitTest,
  } = useTestContext();

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion || !currentTestSet) return null;

  const passage = currentQuestion.passageId
    ? passages.find((p) => p.id === currentQuestion.passageId)
    : undefined;

  const answeredCount = answers.size;
  const flaggedCount = flaggedQuestions.size;

  const handleSubmit = () => {
    if (
      window.confirm(
        `Bạn đã trả lời ${answeredCount}/${questions.length} câu. Nộp bài?`,
      )
    ) {
      submitTest();
      onSubmit();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-xl shadow p-4">
        <div>
          <h2 className="font-bold text-lg">{currentTestSet.title}</h2>
          <p className="text-sm text-slate-500">
            Đã trả lời: {answeredCount}/{questions.length}
            {flaggedCount > 0 && ` · 🚩 ${flaggedCount} câu đánh dấu`}
          </p>
        </div>
        <Timer secondsRemaining={timeRemaining} />
      </div>

      <QuestionCard
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        selectedChoiceId={answers.get(currentQuestion.id) ?? null}
        isFlagged={flaggedQuestions.has(currentQuestion.id)}
        passage={passage}
        onSelectChoice={(choiceId) =>
          selectAnswer(currentQuestion.id, choiceId)
        }
        onToggleFlag={() => toggleFlag(currentQuestion.id)}
      />

      <div className="bg-white rounded-xl shadow p-4">
        <p className="text-xs text-slate-500 mb-2">Danh sách câu hỏi</p>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, i) => {
            const isAnswered = answers.has(q.id);
            const isCurrent = i === currentQuestionIndex;
            const isFlagged = flaggedQuestions.has(q.id);
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => goToQuestion(i)}
                className={`w-9 h-9 rounded-lg text-sm font-medium border transition ${
                  isCurrent
                    ? "bg-blue-600 text-white border-blue-600"
                    : isAnswered
                      ? "bg-green-50 border-green-400 text-green-800"
                      : isFlagged
                        ? "bg-yellow-50 border-yellow-400 text-yellow-800"
                        : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <button
          type="button"
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-3 rounded-lg border bg-white disabled:opacity-40 hover:bg-slate-50 transition"
        >
          ← Câu trước
        </button>

        {currentQuestionIndex < questions.length - 1 ? (
          <button
            type="button"
            onClick={nextQuestion}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Câu tiếp →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-semibold"
          >
            Nộp bài ✓
          </button>
        )}
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={handleSubmit}
          className="text-sm text-red-600 hover:underline"
        >
          Nộp bài ngay
        </button>
      </div>
    </div>
  );
}

export default TestRunner;
