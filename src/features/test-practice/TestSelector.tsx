import { useMemo, useState } from "react";

import {

  TEST_SETS,

  YEARLY_TEST_SETS,

  getExamYears,

  getExamsByYear,

  examToTestSet,

} from "../../data/index";

import { PART_LABELS } from "../../types/toeic";

import type { TestSet } from "../../types/toeic";

import { useTestContext } from "../../context/TestContext";



interface TestSelectorProps {

  onStart: () => void;

}



function TestSelector({ onStart }: TestSelectorProps) {

  const { startTest } = useTestContext();

  const years = getExamYears();

  const [selectedYear, setSelectedYear] = useState<number | "all">("all");

  const [search, setSearch] = useState("");



  const handleSelect = (testSet: TestSet) => {

    startTest(testSet);

    onStart();

  };



  const yearlyExams = useMemo(() => {

    if (selectedYear === "all") return YEARLY_TEST_SETS;

    return getExamsByYear(selectedYear).map(examToTestSet);

  }, [selectedYear]);



  const practiceSets = TEST_SETS.filter(

    (t) => !t.examId && !t.id.startsWith("practice-"),

  );

  const partOnly = TEST_SETS.filter((t) => t.id.startsWith("practice-"));



  const filterBySearch = (tests: TestSet[]) =>

    search

      ? tests.filter(

          (t) =>

            t.title.toLowerCase().includes(search.toLowerCase()) ||

            t.description.toLowerCase().includes(search.toLowerCase()),

        )

      : tests;



  const filteredYearly = filterBySearch(yearlyExams);

  const filteredPractice = filterBySearch(practiceSets);

  const filteredParts = filterBySearch(partOnly);



  return (

    <div className="space-y-8">

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">

        <h2 className="text-2xl font-bold mb-2">Chọn đề luyện tập TOEIC</h2>

        <p className="text-blue-100 text-sm">

          {YEARLY_TEST_SETS.length} đề thi mô phỏng 2020–2026 · Audio nghe không giới hạn · Làm bài không giới hạn

        </p>

        <input

          type="search"

          value={search}

          onChange={(e) => setSearch(e.target.value)}

          placeholder="🔍 Tìm đề thi..."

          className="mt-4 w-full max-w-md px-4 py-2 rounded-xl text-slate-800 text-sm outline-none"

        />

      </div>



      <div>

        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">

          📅 Đề thi theo năm

          <span className="text-xs font-normal text-slate-500">({filteredYearly.length} đề)</span>

        </h3>

        <div className="flex flex-wrap gap-2 mb-4">

          <button

            type="button"

            onClick={() => setSelectedYear("all")}

            className={`px-4 py-2 rounded-xl text-sm border transition ${

              selectedYear === "all"

                ? "bg-blue-600 text-white border-blue-600 shadow"

                : "bg-white hover:border-blue-300"

            }`}

          >

            Tất cả ({YEARLY_TEST_SETS.length})

          </button>

          {years.map((y) => (

            <button

              key={y}

              type="button"

              onClick={() => setSelectedYear(y)}

              className={`px-4 py-2 rounded-xl text-sm border transition ${

                selectedYear === y

                  ? "bg-blue-600 text-white border-blue-600 shadow"

                  : "bg-white hover:border-blue-300"

              }`}

            >

              {y}

            </button>

          ))}

        </div>



        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {filteredYearly.map((test) => (

            <button

              key={test.id}

              type="button"

              onClick={() => handleSelect(test)}

              className="bg-white border border-slate-100 rounded-2xl p-5 text-left hover:border-blue-400 hover:shadow-xl transition group relative overflow-hidden"

            >

              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full opacity-50 group-hover:opacity-100 transition" />

              <div className="relative">

                <div className="flex items-center gap-2 mb-2">

                  <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-semibold">

                    {test.year}

                  </span>

                  <span className="text-xs text-slate-400">

                    Form {String(test.form).padStart(2, "0")}

                  </span>

                </div>

                <h3 className="font-bold group-hover:text-blue-600 transition">{test.title}</h3>

                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{test.description}</p>

                <div className="flex gap-3 mt-3 text-xs text-slate-500">

                  <span>📝 {test.questionIds.length} câu</span>

                  <span>⏱ {test.timeLimit} phút</span>

                  <span>🔊 Audio ∞</span>

                </div>

              </div>

            </button>

          ))}

        </div>

      </div>



      <div>

        <h3 className="font-bold text-lg mb-4">🎯 Luyện tập tổng hợp</h3>

        <div className="grid md:grid-cols-2 gap-4">

          {filteredPractice.map((test) => (

            <button

              key={test.id}

              type="button"

              onClick={() => handleSelect(test)}

              className="bg-white border rounded-2xl p-5 text-left hover:border-green-400 hover:shadow-xl transition group"

            >

              <h3 className="font-bold group-hover:text-green-600">{test.title}</h3>

              <p className="text-sm text-slate-600 mt-1">{test.description}</p>

              <div className="flex gap-3 mt-3 text-xs text-slate-500">

                <span>📝 {test.questionIds.length} câu</span>

                <span>⏱ {test.timeLimit} phút</span>

              </div>

            </button>

          ))}

        </div>

      </div>



      <div>

        <h3 className="font-bold text-lg mb-4">📋 Luyện theo từng Part</h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">

          {filteredParts.map((test) => (

            <button

              key={test.id}

              type="button"

              onClick={() => handleSelect(test)}

              className="bg-white border rounded-xl p-4 text-left hover:border-blue-400 hover:bg-blue-50 hover:shadow-md transition text-sm group"

            >

              <span className="font-semibold group-hover:text-blue-600">

                {PART_LABELS[test.parts[0]!].split("—")[0]?.trim()}

              </span>

              <div className="text-xs text-slate-500 mt-1">

                {test.questionIds.length} câu · {test.timeLimit} phút

              </div>

            </button>

          ))}

        </div>

      </div>

    </div>

  );

}



export default TestSelector;

