import { useMemo, useState } from "react";
import type { VocabCard } from "../../types/toeic";
import { getVocabProgress, updateVocabCardProgress } from "../../utils/storage";
import Flashcard from "./Flashcard";

interface FlashcardDeckProps {
  cards: VocabCard[];
  topicLabel: string;
}

function FlashcardDeck({ cards, topicLabel }: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(getVocabProgress);

  const sortedCards = useMemo(() => {
    return [...cards].sort((a, b) => {
      const levelOrder = { new: 0, reviewing: 1, mastered: 2 };
      const aLevel = progress[a.id]?.masteryLevel ?? "new";
      const bLevel = progress[b.id]?.masteryLevel ?? "new";
      return levelOrder[aLevel] - levelOrder[bLevel];
    });
  }, [cards, progress]);

  const currentCard = sortedCards[currentIndex];

  const handleRate = async (level: "reviewing" | "mastered") => {
    if (!currentCard) return;
    await updateVocabCardProgress(currentCard.id, level);
    setProgress(getVocabProgress());
    setCurrentIndex((i) => Math.min(i + 1, sortedCards.length - 1));
  };

  const stats = useMemo(() => {
    const mastered = cards.filter(
      (c) => progress[c.id]?.masteryLevel === "mastered",
    ).length;
    const reviewing = cards.filter(
      (c) => progress[c.id]?.masteryLevel === "reviewing",
    ).length;
    return { mastered, reviewing, new: cards.length - mastered - reviewing };
  }, [cards, progress]);

  if (!currentCard) {
    return (
      <p className="text-center text-slate-500 py-10">
        Không có từ vựng trong chủ đề này.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-bold text-lg">{topicLabel}</h3>
        <div className="flex gap-3 text-sm">
          <span className="px-2 py-1 bg-slate-100 rounded">
            Mới: {stats.new}
          </span>
          <span className="px-2 py-1 bg-orange-100 rounded text-orange-800">
            Ôn: {stats.reviewing}
          </span>
          <span className="px-2 py-1 bg-green-100 rounded text-green-800">
            Thuộc: {stats.mastered}
          </span>
        </div>
      </div>

      <Flashcard card={currentCard} onRate={handleRate} />

      <div className="flex items-center justify-between max-w-lg mx-auto">
        <button
          type="button"
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="px-4 py-2 rounded-lg border disabled:opacity-40 hover:bg-slate-50"
        >
          ← Trước
        </button>
        <span className="text-sm text-slate-500">
          {currentIndex + 1}/{sortedCards.length}
        </span>
        <button
          type="button"
          onClick={() =>
            setCurrentIndex((i) => Math.min(sortedCards.length - 1, i + 1))
          }
          disabled={currentIndex === sortedCards.length - 1}
          className="px-4 py-2 rounded-lg border disabled:opacity-40 hover:bg-slate-50"
        >
          Sau →
        </button>
      </div>
    </div>
  );
}

export default FlashcardDeck;
