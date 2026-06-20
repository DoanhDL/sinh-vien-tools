import { useMemo, useState } from "react";

import type { VocabCard } from "../../types/toeic";



interface VocabQuizProps {

  cards: VocabCard[];

}



function shuffle<T>(arr: T[]): T[] {

  const copy = [...arr];

  for (let i = copy.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [copy[i], copy[j]] = [copy[j]!, copy[i]!];

  }

  return copy;

}



const QUIZ_LENGTHS = [

  { label: "10 câu", value: 10 },

  { label: "25 câu", value: 25 },

  { label: "Tất cả", value: 0 },

] as const;



function VocabQuiz({ cards }: VocabQuizProps) {

  const [quizLength, setQuizLength] = useState(10);

  const [sessionKey, setSessionKey] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [score, setScore] = useState(0);

  const [selected, setSelected] = useState<string | null>(null);

  const [finished, setFinished] = useState(false);



  const quizCards = useMemo(() => {

    const shuffled = shuffle(cards);

    if (quizLength === 0) return shuffled;

    return shuffled.slice(0, Math.min(quizLength, cards.length));

  }, [cards, quizLength, sessionKey]);



  const current = quizCards[currentIndex];



  const choices = useMemo(() => {

    if (!current) return [];

    const wrong = cards

      .filter((c) => c.id !== current.id)

      .sort(() => Math.random() - 0.5)

      .slice(0, 3)

      .map((c) => c.meaning);

    return shuffle([current.meaning, ...wrong]);

  }, [current, cards]);



  const handleSelect = (meaning: string) => {

    if (selected || !current) return;

    setSelected(meaning);

    if (meaning === current.meaning) setScore((s) => s + 1);

  };



  const handleNext = () => {

    if (currentIndex < quizCards.length - 1) {

      setCurrentIndex((i) => i + 1);

      setSelected(null);

    } else {

      setFinished(true);

    }

  };



  const restart = () => {

    setCurrentIndex(0);

    setScore(0);

    setSelected(null);

    setFinished(false);

    setSessionKey((k) => k + 1);

  };



  if (cards.length < 4) {

    return (

      <p className="text-center text-slate-500">

        Cần ít nhất 4 từ để làm quiz.

      </p>

    );

  }



  if (finished) {

    const pct = Math.round((score / quizCards.length) * 100);

    return (

      <div className="text-center py-10 space-y-4">

        <div className="inline-block p-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100">

          <p className="text-5xl font-bold text-blue-600">

            {score}/{quizCards.length}

          </p>

        </div>

        <h3 className="text-2xl font-bold">

          {pct >= 80 ? "Xuất sắc! 🎉" : pct >= 60 ? "Khá tốt! 👍" : "Cố gắng thêm nhé! 💪"}

        </h3>

        <p className="text-slate-500">{pct}% chính xác</p>

        <button

          type="button"

          onClick={restart}

          className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium shadow"

        >

          Làm lại không giới hạn

        </button>

      </div>

    );

  }



  if (!current) return null;



  return (

    <div className="max-w-lg mx-auto space-y-6">

      <div className="flex flex-wrap gap-2 justify-center">

        {QUIZ_LENGTHS.filter((q) => q.value === 0 || q.value <= cards.length).map((q) => (

          <button

            key={q.label}

            type="button"

            onClick={() => { setQuizLength(q.value || cards.length); restart(); }}

            className={`px-3 py-1 rounded-full text-xs font-medium transition ${

              (q.value === 0 ? cards.length : q.value) === quizCards.length && !finished

                ? "bg-blue-600 text-white"

                : "bg-white border hover:border-blue-300"

            }`}

          >

            {q.label}

          </button>

        ))}

      </div>



      <div className="relative">

        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">

          <div

            className="h-full bg-blue-500 rounded-full transition-all"

            style={{ width: `${((currentIndex + 1) / quizCards.length) * 100}%` }}

          />

        </div>

        <p className="text-sm text-slate-500 text-center mt-2">

          Câu {currentIndex + 1}/{quizCards.length} · Điểm: {score}

        </p>

      </div>



      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-8 text-center border border-blue-100">

        <p className="text-sm text-slate-400 mb-2">Chọn nghĩa đúng của từ</p>

        <h2 className="text-4xl font-bold text-slate-800">{current.word}</h2>

        <p className="text-slate-500 mt-2 text-lg">{current.phonetic}</p>

      </div>



      <div className="grid gap-3">

        {choices.map((meaning, i) => {

          let style = "bg-white border-slate-200 hover:border-blue-400 hover:shadow-md";

          if (selected) {

            if (meaning === current.meaning)

              style = "bg-green-50 border-green-500 text-green-800 shadow-md";

            else if (meaning === selected)

              style = "bg-red-50 border-red-500 text-red-800";

            else style = "bg-white border-slate-200 opacity-40";

          }

          return (

            <button

              key={meaning}

              type="button"

              onClick={() => handleSelect(meaning)}

              disabled={!!selected}

              className={`w-full text-left px-5 py-4 rounded-xl border transition ${style}`}

            >

              <span className="text-slate-400 mr-2">{String.fromCharCode(65 + i)}.</span>

              {meaning}

            </button>

          );

        })}

      </div>



      {selected && (

        <button

          type="button"

          onClick={handleNext}

          className="w-full py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium shadow-lg"

        >

          {currentIndex < quizCards.length - 1 ? "Câu tiếp →" : "Xem kết quả"}

        </button>

      )}

    </div>

  );

}



export default VocabQuiz;

