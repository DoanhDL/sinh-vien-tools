import { useState } from "react";

function GradeConverter() {
  const [score, setScore] = useState("");

  const getResult = () => {
    const num = Number(score);

    if (isNaN(num) || num < 0 || num > 10) {
      return null;
    }

    if (num >= 8.5) {
      return {
        letter: "A",
        gpa: 4.0,
        rank: "Giỏi",
      };
    }

    if (num >= 8.0) {
      return {
        letter: "B+",
        gpa: 3.5,
        rank: "Khá Giỏi",
      };
    }

    if (num >= 7.0) {
      return {
        letter: "B",
        gpa: 3.0,
        rank: "Khá",
      };
    }

    if (num >= 6.5) {
      return {
        letter: "C+",
        gpa: 2.5,
        rank: "Trung Bình Khá",
      };
    }

    if (num >= 5.5) {
      return {
        letter: "C",
        gpa: 2.0,
        rank: "Trung Bình",
      };
    }

    if (num >= 4.0) {
      return {
        letter: "D",
        gpa: 1.0,
        rank: "Đạt",
      };
    }

    return {
      letter: "F",
      gpa: 0,
      rank: "Trượt",
    };
  };

  const result = getResult();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-4">
          Quy đổi điểm chữ
        </h1>

        <p className="text-gray-600 mb-6">
          Nhập điểm hệ 10 để quy đổi sang GPA hệ 4
          và điểm chữ.
        </p>

        <div className="bg-white shadow rounded-xl p-6">
          <label className="block mb-2 font-medium">
            Điểm hệ 10
          </label>

          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            placeholder="Ví dụ: 8.5"
            value={score}
            onChange={(e) =>
              setScore(e.target.value)
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        {result && (
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            <div className="bg-white shadow rounded-xl p-6">
              <h3 className="text-gray-500">
                Điểm chữ
              </h3>

              <p className="text-4xl font-bold text-blue-600">
                {result.letter}
              </p>
            </div>

            <div className="bg-white shadow rounded-xl p-6">
              <h3 className="text-gray-500">
                GPA hệ 4
              </h3>

              <p className="text-4xl font-bold text-green-600">
                {result.gpa}
              </p>
            </div>

            <div className="bg-white shadow rounded-xl p-6">
              <h3 className="text-gray-500">
                Xếp loại
              </h3>

              <p className="text-2xl font-bold text-purple-600">
                {result.rank}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GradeConverter;