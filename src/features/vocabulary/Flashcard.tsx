import { useRef, useState, type MouseEvent } from "react";
import type { VocabCard } from "../../types/toeic";

interface FlashcardProps {
  card: VocabCard;
  onRate: (level: "reviewing" | "mastered") => void;
}

function Flashcard({ card, onRate }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playAudio = (e: MouseEvent) => {
    e.stopPropagation();
    if (card.audioUrl && audioRef.current) {
      audioRef.current.play();
    } else if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(`${card.word}. ${card.exampleSentence}`);
      u.lang = "en-US";
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {card.audioUrl && <audio ref={audioRef} src={card.audioUrl} />}
      <button
        type="button"
        onClick={() => setFlipped(!flipped)}
        className="w-full min-h-64 bg-white rounded-2xl shadow-lg border p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition"
      >
        {!flipped ? (
          <>
            <span className="text-xs text-slate-400 uppercase tracking-wide mb-2">
              {card.partOfSpeech} · {card.topic}
            </span>
            <h2 className="text-4xl font-bold text-slate-800">{card.word}</h2>
            <p className="text-slate-500 mt-2">{card.phonetic}</p>
            <button
              type="button"
              onClick={playAudio}
              className="mt-4 text-sm text-blue-600 hover:underline"
            >
              🔊 Nghe phát âm
            </button>
            <p className="text-sm text-blue-500 mt-4">Nhấn thẻ để lật</p>
          </>
        ) : (
          <>
            <h3 className="text-2xl font-bold text-blue-700 mb-2">
              {card.meaning}
            </h3>
            <p className="text-slate-600 text-center italic">
              &ldquo;{card.exampleSentence}&rdquo;
            </p>
            <p className="text-sm text-slate-400 mt-4">Nhấn để lật lại</p>
          </>
        )}
      </button>

      {flipped && (
        <div className="flex gap-3 mt-4 justify-center">
          <button
            type="button"
            onClick={() => {
              onRate("reviewing");
              setFlipped(false);
            }}
            className="px-5 py-2 rounded-lg bg-orange-100 text-orange-800 border border-orange-300 hover:bg-orange-200 transition"
          >
            Cần ôn lại
          </button>
          <button
            type="button"
            onClick={() => {
              onRate("mastered");
              setFlipped(false);
            }}
            className="px-5 py-2 rounded-lg bg-green-100 text-green-800 border border-green-300 hover:bg-green-200 transition"
          >
            Đã thuộc ✓
          </button>
        </div>
      )}
    </div>
  );
}

export default Flashcard;
