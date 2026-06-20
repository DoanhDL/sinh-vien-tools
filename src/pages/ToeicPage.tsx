import { useState, useEffect } from "react";



import { TestProvider, useTestContext } from "../context/TestContext";

import TestSelector from "../features/test-practice/TestSelector";

import TestRunner from "../features/test-practice/TestRunner";

import ResultSummary from "../features/results/ResultSummary";

import ReviewAnswers from "../features/results/ReviewAnswers";

import FlashcardDeck from "../features/vocabulary/FlashcardDeck";

import VocabQuiz from "../features/vocabulary/VocabQuiz";

import { VOCAB_TOPICS, getVocabByTopic, YEARLY_TEST_SETS } from "../data/index";

import { getTestHistory, initBackendSync, fetchTestHistoryFromServer } from "../utils/storage";

import type { TestResult } from "../types/toeic";

import { getScoreColor, getScoreLabel } from "../utils/scoring";



type Tab = "practice" | "vocabulary" | "history";

type PracticeView = "select" | "test" | "result" | "review";



function ToeicContent() {

  const [tab, setTab] = useState<Tab>("practice");

  const [practiceView, setPracticeView] = useState<PracticeView>("select");

  const [vocabTopic, setVocabTopic] = useState("business");

  const [vocabMode, setVocabMode] = useState<"flashcard" | "quiz">("flashcard");

  const [history, setHistory] = useState<TestResult[]>(getTestHistory);



  const {

    status,

    result,

    questions,

    passages,

    resetTest,

  } = useTestContext();



  useEffect(() => {

    void initBackendSync();

  }, []);



  useEffect(() => {

    if (status === "submitted") {

      setPracticeView("result");

    }

  }, [status]);



  const refreshHistory = async () => {

    const data = await fetchTestHistoryFromServer();

    setHistory(data);

  };



  const handleBackToSelect = () => {

    resetTest();

    setPracticeView("select");

    refreshHistory();

  };



  const avgScore = history.length > 0

    ? Math.round(history.reduce((s, h) => s + h.scaledScore, 0) / history.length)

    : null;

  const bestScore = history.length > 0

    ? Math.max(...history.map((h) => h.scaledScore))

    : null;



  const tabs: { id: Tab; label: string; icon: string; desc: string }[] = [

    { id: "practice", label: "Luyện đề", icon: "📝", desc: `${YEARLY_TEST_SETS.length} đề thi` },

    { id: "vocabulary", label: "Từ vựng", icon: "📖", desc: "300+ từ" },

    { id: "history", label: "Lịch sử", icon: "📊", desc: `${history.length} bài` },

  ];



  return (

    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-emerald-50/20">

      <div className="max-w-5xl mx-auto px-4 py-10">

        <div className="text-center mb-8">

          <span className="bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 px-5 py-1.5 rounded-full text-sm font-semibold inline-block">

            🎯 TOEIC Practice — Premium Free

          </span>

          <h1 className="text-4xl md:text-5xl font-bold mt-4 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">

            Luyện thi TOEIC

          </h1>

          <p className="text-slate-600 mt-3 max-w-xl mx-auto">

            14 đề thi (2020–2026) · 300+ từ vựng · Audio nghe không giới hạn · Làm bài không giới hạn

          </p>

        </div>



        {(avgScore !== null || bestScore !== null) && tab !== "practice" && (

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">

            <div className="bg-white rounded-xl p-4 text-center shadow-sm border">

              <p className="text-2xl font-bold text-blue-600">{history.length}</p>

              <p className="text-xs text-slate-500">Bài đã làm</p>

            </div>

            <div className="bg-white rounded-xl p-4 text-center shadow-sm border">

              <p className={`text-2xl font-bold ${getScoreColor(bestScore!)}`}>{bestScore}</p>

              <p className="text-xs text-slate-500">Điểm cao nhất</p>

            </div>

            <div className="bg-white rounded-xl p-4 text-center shadow-sm border">

              <p className={`text-2xl font-bold ${getScoreColor(avgScore!)}`}>{avgScore}</p>

              <p className="text-xs text-slate-500">Điểm trung bình</p>

            </div>

            <div className="bg-white rounded-xl p-4 text-center shadow-sm border">

              <p className="text-2xl font-bold text-emerald-600">{getScoreLabel(bestScore!)}</p>

              <p className="text-xs text-slate-500">Xếp loại tốt nhất</p>

            </div>

          </div>

        )}



        <div className="flex gap-2 mb-8 bg-white rounded-2xl p-1.5 shadow-lg border border-slate-100">

          {tabs.map((t) => (

            <button

              key={t.id}

              type="button"

              onClick={() => {

                setTab(t.id);

                if (t.id === "history") refreshHistory();

              }}

              className={`flex-1 py-3 px-2 rounded-xl text-sm font-medium transition ${

                tab === t.id

                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"

                  : "text-slate-600 hover:bg-slate-50"

              }`}

            >

              <span className="block text-lg">{t.icon}</span>

              {t.label}

              <span className={`block text-[10px] mt-0.5 ${tab === t.id ? "text-blue-100" : "text-slate-400"}`}>

                {t.desc}

              </span>

            </button>

          ))}

        </div>



        {tab === "practice" && (

          <>

            {practiceView === "select" && status === "not-started" && (

              <TestSelector onStart={() => setPracticeView("test")} />

            )}



            {practiceView === "test" && status === "in-progress" && (

              <TestRunner

                onSubmit={() => setPracticeView("result")}

              />

            )}



            {practiceView === "result" && result && (

              <ResultSummary

                result={result}

                onReview={() => setPracticeView("review")}

                onRetry={handleBackToSelect}

              />

            )}



            {practiceView === "review" && result && (

              <ReviewAnswers

                questions={questions}

                passages={passages}

                result={result}

                onBack={() => setPracticeView("result")}

              />

            )}

          </>

        )}



        {tab === "vocabulary" && (

          <div className="space-y-6">

            <div className="bg-white rounded-xl p-4 shadow-sm border">

              <p className="text-sm font-medium text-slate-600 mb-3">Chọn chủ đề từ vựng</p>

              <div className="flex flex-wrap gap-2">

                {VOCAB_TOPICS.map((topic) => (

                  <button

                    key={topic.id}

                    type="button"

                    onClick={() => setVocabTopic(topic.id)}

                    className={`px-4 py-2 rounded-xl border text-sm transition ${

                      vocabTopic === topic.id

                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow"

                        : "bg-white hover:border-blue-300 hover:shadow-sm"

                    }`}

                  >

                    {topic.icon} {topic.label}

                    <span className="ml-1 opacity-70">({topic.count})</span>

                  </button>

                ))}

              </div>

            </div>



            <div className="flex gap-2">

              {(["flashcard", "quiz"] as const).map((mode) => (

                <button

                  key={mode}

                  type="button"

                  onClick={() => setVocabMode(mode)}

                  className={`px-6 py-2.5 rounded-xl text-sm font-medium transition ${

                    vocabMode === mode

                      ? "bg-slate-800 text-white shadow"

                      : "bg-white border hover:border-slate-400"

                  }`}

                >

                  {mode === "flashcard" ? "🃏 Flashcard" : "❓ Quiz"}

                </button>

              ))}

            </div>



            {vocabMode === "flashcard" ? (

              <FlashcardDeck

                cards={getVocabByTopic(vocabTopic)}

                topicLabel={

                  VOCAB_TOPICS.find((t) => t.id === vocabTopic)?.label ?? ""

                }

              />

            ) : (

              <VocabQuiz cards={getVocabByTopic(vocabTopic)} />

            )}

          </div>

        )}



        {tab === "history" && (

          <div className="space-y-4">

            <div className="flex items-center justify-between">

              <h2 className="text-xl font-bold">Lịch sử làm bài</h2>

              <span className="text-sm text-slate-500">Không giới hạn số bài lưu</span>

            </div>

            {history.length === 0 ? (

              <div className="text-center py-16 bg-white rounded-2xl border">

                <p className="text-5xl mb-4">📝</p>

                <p className="text-slate-500">Chưa có lịch sử. Hãy làm một đề luyện tập!</p>

              </div>

            ) : (

              <div className="space-y-3">

                {history.map((h, i) => (

                  <div

                    key={h.id}

                    className="bg-white rounded-xl shadow-sm border p-4 flex items-center justify-between hover:shadow-md transition group"

                  >

                    <div className="flex items-center gap-4">

                      <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">

                        {i + 1}

                      </span>

                      <div>

                        <p className="font-semibold group-hover:text-blue-600 transition">{h.testSetTitle}</p>

                        <p className="text-sm text-slate-500">

                          {new Date(h.finishedAt).toLocaleDateString("vi-VN", {

                            day: "numeric",

                            month: "short",

                            year: "numeric",

                            hour: "2-digit",

                            minute: "2-digit",

                          })}{" "}

                          · {h.correctCount}/{h.totalQuestions} câu đúng ·{" "}

                          <span className={getScoreColor(h.scaledScore)}>

                            {getScoreLabel(h.scaledScore)}

                          </span>

                        </p>

                      </div>

                    </div>

                    <p className={`text-3xl font-bold ${getScoreColor(h.scaledScore)}`}>

                      {h.scaledScore}

                    </p>

                  </div>

                ))}

              </div>

            )}

          </div>

        )}

      </div>

    </div>

  );

}



function ToeicPage() {

  return (

    <TestProvider>

      <ToeicContent />

    </TestProvider>

  );

}



export default ToeicPage;

