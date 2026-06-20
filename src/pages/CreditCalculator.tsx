import { useMemo, useState } from "react";

function CreditCalculator() {
  const [requiredCredits, setRequiredCredits] =
    useState(120);

  const [completedCredits, setCompletedCredits] =
    useState(80);

  const remainingCredits = useMemo(() => {
    return Math.max(
      requiredCredits - completedCredits,
      0
    );
  }, [requiredCredits, completedCredits]);

  const progress = useMemo(() => {
    return (
      (completedCredits / requiredCredits) *
      100
    ).toFixed(1);
  }, [requiredCredits, completedCredits]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6">
        Tính Tín Chỉ Còn Thiếu
      </h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <div>
          <label className="block mb-2">
            Tổng tín chỉ chương trình
          </label>

          <input
            type="number"
            value={requiredCredits}
            onChange={(e) =>
              setRequiredCredits(
                Number(e.target.value)
              )
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2">
            Tín chỉ đã hoàn thành
          </label>

          <input
            type="number"
            value={completedCredits}
            onChange={(e) =>
              setCompletedCredits(
                Number(e.target.value)
              )
            }
            className="w-full border rounded-lg p-3"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mt-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Còn thiếu
          </h3>

          <p className="text-5xl font-bold text-red-600">
            {remainingCredits}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Tiến độ hoàn thành
          </h3>

          <p className="text-5xl font-bold text-green-600">
            {progress}%
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreditCalculator;