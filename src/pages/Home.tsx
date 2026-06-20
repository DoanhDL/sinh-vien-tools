import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  ALL_TOOLS,
  CATEGORY_LABELS,
  GAME_TOOLS,
  type ToolCategory,
} from "../data/toolsRegistry";

function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ToolCategory | "all">("all");

  const filtered = useMemo(() => {
    return ALL_TOOLS.filter((tool) => {
      const matchSearch =
        !search ||
        tool.title.toLowerCase().includes(search.toLowerCase()) ||
        tool.desc.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "all" || tool.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category]);

  const categories = Object.entries(CATEGORY_LABELS) as [ToolCategory, string][];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center py-16 md:py-20">
          <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold inline-block">
            🇻🇳 Công cụ & trò chơi miễn phí cho sinh viên
          </span>

          <h1 className="text-5xl md:text-7xl font-bold mt-6 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Sinh Viên Tools
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {ALL_TOOLS.length}+ công cụ học tập và {GAME_TOOLS.length} trò chơi giải trí —
            GPA, TOEIC, Pomodoro, game mini giải stress. Không giới hạn, dùng mọi lúc.
          </p>

          <div className="mt-8 max-w-md mx-auto">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Tìm công cụ hoặc game..."
              className="w-full px-5 py-3 rounded-2xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-300 outline-none text-center"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {[
            { val: `${ALL_TOOLS.length}+`, label: "Công cụ & game", color: "text-blue-600" },
            { val: `${GAME_TOOLS.length}`, label: "Trò chơi giải trí", color: "text-pink-600" },
            { val: "24/7", label: "Truy cập mọi lúc", color: "text-purple-600" },
            { val: "100%", label: "Miễn phí trọn đời", color: "text-amber-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
              <h3 className={`text-3xl font-bold ${s.color}`}>{s.val}</h3>
              <p className="text-gray-600 mt-1 text-sm">{s.label}</p>
            </div>
          ))}
        </div>

        {!search && category === "all" && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold">🎮 Trò chơi giải trí</h2>
              <button
                type="button"
                onClick={() => setCategory("giai-tri")}
                className="text-sm text-pink-600 hover:underline font-medium"
              >
                Xem tất cả →
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {GAME_TOOLS.slice(0, 8).map((game) => (
                <Link
                  key={game.id}
                  to={game.path}
                  className="group bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100 rounded-2xl p-4 text-center hover:-translate-y-1 hover:shadow-lg transition-all"
                >
                  <span className="text-3xl block group-hover:scale-110 transition-transform">{game.icon}</span>
                  <span className="text-xs font-semibold mt-2 block text-slate-700 leading-tight">{game.title}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              category === "all" ? "bg-blue-600 text-white shadow" : "bg-white border hover:border-blue-300"
            }`}
          >
            Tất cả
          </button>
          {categories.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setCategory(id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                category === id
                  ? id === "giai-tri"
                    ? "bg-pink-600 text-white shadow"
                    : "bg-blue-600 text-white shadow"
                  : "bg-white border hover:border-blue-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-20">
          {filtered.map((tool) => (
            <Link
              key={tool.id}
              to={tool.path}
              className={`group rounded-2xl border p-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden ${
                tool.category === "giai-tri"
                  ? "bg-gradient-to-br from-pink-50/80 to-white border-pink-100 hover:border-pink-300"
                  : "bg-white border-slate-100 hover:border-blue-200"
              }`}
            >
              {tool.isNew && (
                <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  MỚI
                </span>
              )}
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {tool.icon}
              </div>
              <h2 className={`font-bold text-lg mb-1 transition-colors ${
                tool.category === "giai-tri" ? "group-hover:text-pink-600" : "group-hover:text-blue-600"
              }`}>
                {tool.title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">{tool.desc}</p>
              <span className={`inline-block mt-3 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity ${
                tool.category === "giai-tri" ? "text-pink-500" : "text-blue-500"
              }`}>
                {tool.category === "giai-tri" ? "Chơi ngay →" : "Mở công cụ →"}
              </span>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-slate-500 pb-20">Không tìm thấy công cụ phù hợp</p>
        )}
      </div>
    </div>
  );
}

export default Home;
