import { useMemo, useState } from "react";

interface Semester {
  id: number;
  credits: number;
  gpa: number;
}

function CumulativeGPA() {
  const [semesters, setSemesters] = useState<Semester[]>([
    {
      id: Date.now(),
      credits: 20,
      gpa: 3.0,
    },
  ]);

  const addSemester = () => {
    setSemesters([
      ...semesters,
      {
        id: Date.now(),
        credits: 20,
        gpa: 3.0,
      },
    ]);
  };

  const removeSemester = (id: number) => {
    setSemesters(
      semesters.filter((s) => s.id !== id)
    );
  };

  const updateSemester = (
    id: number,
    field: keyof Semester,
    value: number
  ) => {
    setSemesters(
      semesters.map((semester) =>
        semester.id === id
          ? { ...semester, [field]: value }
          : semester
      )
    );
  };

  const cumulativeGPA = useMemo(() => {
    let totalCredits = 0;
    let totalPoints = 0;

    semesters.forEach((semester) => {
      totalCredits += semester.credits;
      totalPoints +=
        semester.credits * semester.gpa;
    });

    if (totalCredits === 0) return 0;

    return totalPoints / totalCredits;
  }, [semesters]);

  const totalCredits = useMemo(() => {
    return semesters.reduce(
      (sum, semester) =>
        sum + semester.credits,
      0
    );
  }, [semesters]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-4">
          GPA Tích Lũy
        </h1>

        <p className="text-gray-600 mb-8">
          Nhập GPA từng học kỳ để tính GPA
          tích lũy toàn khóa.
        </p>

        <div className="space-y-4">
          {semesters.map((semester, index) => (
            <div
              key={semester.id}
              className="grid md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow"
            >
              <div>
                <label className="block mb-1 font-medium">
                  Học kỳ {index + 1}
                </label>

                <input
                  type="number"
                  min="1"
                  value={semester.credits}
                  onChange={(e) =>
                    updateSemester(
                      semester.id,
                      "credits",
                      Number(e.target.value)
                    )
                  }
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  GPA học kỳ
                </label>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  value={semester.gpa}
                  onChange={(e) =>
                    updateSemester(
                      semester.id,
                      "gpa",
                      Number(e.target.value)
                    )
                  }
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={() =>
                    removeSemester(semester.id)
                  }
                  className="w-full bg-red-500 text-white p-3 rounded-lg"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addSemester}
          className="mt-6 bg-blue-600 text-white px-5 py-3 rounded-lg"
        >
          + Thêm học kỳ
        </button>

        <div className="grid md:grid-cols-2 gap-5 mt-10">
          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="text-gray-500">
              GPA Tích Lũy
            </h3>

            <p className="text-5xl font-bold text-blue-600">
              {cumulativeGPA.toFixed(2)}
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="text-gray-500">
              Tổng tín chỉ
            </h3>

            <p className="text-5xl font-bold text-green-600">
              {totalCredits}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CumulativeGPA;