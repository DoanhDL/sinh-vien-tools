import { useMemo, useState } from "react";

function GraduationCalculator() {
  const [gpa, setGpa] = useState(3.2);
  const [thesis, setThesis] = useState(8);

  const graduationScore = useMemo(() => {
    const thesisGpa = thesis / 2.5;
    return (gpa * 0.7 + thesisGpa * 0.3).toFixed(2);
  }, [gpa, thesis]);

  const getRank = () => {
    const score = Number(graduationScore);

    if (score >= 3.6) return "Xuất sắc";
    if (score >= 3.2) return "Giỏi";
    if (score >= 2.5) return "Khá";
    if (score >= 2.0) return "Trung bình";
    return "Yếu";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6">
        Tính Điểm Tốt Nghiệp
      </h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <div>
          <label className="block mb-2">
            GPA tích lũy (hệ 4)
          </label>

          <input
            type="number"
            step="0.01"
            min="0"
            max="4"
            value={gpa}
            onChange={(e) =>
              setGpa(Number(e.target.value))
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2">
            Điểm khóa luận / đồ án (hệ 10)
          </label>

          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={thesis}
            onChange={(e) =>
              setThesis(Number(e.target.value))
            }
            className="w-full border rounded-lg p-3"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mt-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Điểm tốt nghiệp
          </h3>

          <p className="text-5xl font-bold text-blue-600">
            {graduationScore}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Xếp loại
          </h3>

          <p className="text-3xl font-bold text-green-600">
            {getRank()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default GraduationCalculator;