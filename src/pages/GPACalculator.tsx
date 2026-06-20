import { useEffect, useMemo, useState } from "react";

interface Subject {
  id: number;
  name: string;
  credits: number;
  grade: string;
}

const gradeMap: Record<string, number> = {
  A: 4.0,
  "B+": 3.5,
  B: 3.0,
  "C+": 2.5,
  C: 2.0,
  D: 1.0,
  F: 0,
};

function GPACalculator() {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem("subjects");

    return saved
      ? JSON.parse(saved)
      : [
          {
            id: Date.now(),
            name: "",
            credits: 3,
            grade: "A",
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(subjects));
  }, [subjects]);

  const addSubject = () => {
    setSubjects([
      ...subjects,
      {
        id: Date.now(),
        name: "",
        credits: 3,
        grade: "A",
      },
    ]);
  };

  const removeSubject = (id: number) => {
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const resetSubjects = () => {
    setSubjects([
      {
        id: Date.now(),
        name: "",
        credits: 3,
        grade: "A",
      },
    ]);
  };

  const updateSubject = (
    id: number,
    field: keyof Subject,
    value: string | number
  ) => {
    setSubjects(
      subjects.map((subject) =>
        subject.id === id
          ? { ...subject, [field]: value }
          : subject
      )
    );
  };

  const totalCredits = useMemo(() => {
    return subjects.reduce(
      (sum, subject) => sum + subject.credits,
      0
    );
  }, [subjects]);

  const gpa = useMemo(() => {
    let totalPoints = 0;

    subjects.forEach((subject) => {
      totalPoints +=
        subject.credits *
        gradeMap[subject.grade];
    });

    if (totalCredits === 0) return 0;

    return totalPoints / totalCredits;
  }, [subjects, totalCredits]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-4">
          GPA Calculator
        </h1>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="font-medium">
            Nhập tên môn học, số tín chỉ và điểm chữ.
          </p>

          <p className="text-sm text-gray-600 mt-2">
            Ví dụ: Lập trình Web - 3 tín chỉ - A
          </p>
        </div>

        <div className="space-y-4">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="grid md:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tên môn học
                </label>

                <input
                  type="text"
                  placeholder="Ví dụ: Lập trình Web"
                  className="w-full border rounded-lg p-3"
                  value={subject.name}
                  onChange={(e) =>
                    updateSubject(
                      subject.id,
                      "name",
                      e.target.value
                    )
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Số tín chỉ
                </label>

                <input
                  type="number"
                  min={1}
                  placeholder="Ví dụ: 3"
                  className="w-full border rounded-lg p-3"
                  value={subject.credits}
                  onChange={(e) =>
                    updateSubject(
                      subject.id,
                      "credits",
                      Number(e.target.value)
                    )
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Điểm chữ
                </label>

                <select
                  className="w-full border rounded-lg p-3"
                  value={subject.grade}
                  onChange={(e) =>
                    updateSubject(
                      subject.id,
                      "grade",
                      e.target.value
                    )
                  }
                >
                  <option value="A">A (4.0)</option>
                  <option value="B+">B+ (3.5)</option>
                  <option value="B">B (3.0)</option>
                  <option value="C+">C+ (2.5)</option>
                  <option value="C">C (2.0)</option>
                  <option value="D">D (1.0)</option>
                  <option value="F">F (0)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() =>
                    removeSubject(subject.id)
                  }
                  className="w-full bg-red-500 text-white rounded-lg p-3"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={addSubject}
            className="bg-blue-600 text-white px-5 py-3 rounded-lg"
          >
            + Thêm môn
          </button>

          <button
            onClick={resetSubjects}
            className="bg-red-600 text-white px-5 py-3 rounded-lg"
          >
            Reset
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mt-10">
          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="text-gray-500">
              GPA Hệ 4
            </h3>

            <p className="text-4xl font-bold text-blue-600">
              {gpa.toFixed(2)}
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="text-gray-500">
              GPA Hệ 10
            </h3>

            <p className="text-4xl font-bold text-green-600">
              {(gpa * 2.5).toFixed(2)}
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="text-gray-500">
              Tổng tín chỉ
            </h3>

            <p className="text-4xl font-bold text-purple-600">
              {totalCredits}
            </p>
          </div>
        </div>

        <table className="w-full mt-10 bg-white shadow rounded-xl overflow-hidden">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">
                Môn học
              </th>
              <th className="p-3">
                Tín chỉ
              </th>
              <th className="p-3">
                Điểm chữ
              </th>
              <th className="p-3">
                GPA
              </th>
            </tr>
          </thead>

          <tbody>
            {subjects.map((subject) => (
              <tr
                key={subject.id}
                className="border-t"
              >
                <td className="p-3">
                  {subject.name || "Chưa nhập"}
                </td>

                <td className="p-3 text-center">
                  {subject.credits}
                </td>

                <td className="p-3 text-center">
                  {subject.grade}
                </td>

                <td className="p-3 text-center">
                  {gradeMap[subject.grade]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GPACalculator;