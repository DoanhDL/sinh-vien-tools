import type { Passage, Question } from "../../types/toeic";
import { LISTENING_PARTS, PART_LABELS } from "../../types/toeic";
import AudioPlayer from "./AudioPlayer";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedChoiceId: string | null;
  isFlagged: boolean;
  passage?: Passage;
  onSelectChoice: (choiceId: string) => void;
  onToggleFlag: () => void;
}

function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedChoiceId,
  isFlagged,
  passage,
  onSelectChoice,
  onToggleFlag,
}: QuestionCardProps) {
  const isListening = LISTENING_PARTS.includes(question.part);
  const hasPassageLayout =
    (question.part === "part6" || question.part === "part7") && passage;

  const questionContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-blue-600">
          {PART_LABELS[question.part]}
        </span>
        <button
          type="button"
          onClick={onToggleFlag}
          className={`text-sm px-3 py-1 rounded-full border transition ${
            isFlagged
              ? "bg-yellow-100 border-yellow-400 text-yellow-800"
              : "bg-white border-slate-300 text-slate-600 hover:border-yellow-400"
          }`}
        >
          {isFlagged ? "🚩 Đã đánh dấu" : "🏳 Đánh dấu xem lại"}
        </button>
      </div>

      {isListening && (
        <AudioPlayer
          key={question.id}
          audioUrl={question.audioUrl}
          transcript={question.transcript}
        />
      )}

      {question.part === "part1" && question.imageUrl && (
        <img
          src={question.imageUrl}
          alt="TOEIC Part 1"
          className="w-full max-w-md mx-auto rounded-lg border shadow-sm"
        />
      )}

      <p className="text-lg font-medium text-slate-800">
        {question.questionText}
      </p>

      <div className="space-y-2">
        {question.choices.map((choice) => {
          const isSelected = selectedChoiceId === choice.id;
          return (
            <button
              key={choice.id}
              type="button"
              onClick={() => onSelectChoice(choice.id)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition ${
                isSelected
                  ? "bg-blue-50 border-blue-500 text-blue-900"
                  : "bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50"
              }`}
            >
              {choice.text}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="text-sm text-slate-500 mb-4">
        Câu {questionNumber}/{totalQuestions}
      </div>

      {hasPassageLayout ? (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-50 rounded-lg p-4 border max-h-96 overflow-y-auto">
            <h3 className="font-bold text-slate-800 mb-2">{passage.title}</h3>
            <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans leading-relaxed">
              {passage.content}
            </pre>
          </div>
          <div>{questionContent}</div>
        </div>
      ) : (
        questionContent
      )}
    </div>
  );
}

export default QuestionCard;
