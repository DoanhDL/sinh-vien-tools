import { Link } from "react-router-dom";

import { useState } from "react";

import { ALL_TOOLS, CATEGORY_LABELS, type ToolCategory } from "../data/toolsRegistry";



function Header() {

  const [toolsOpen, setToolsOpen] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);



  const coreLinks = [
    { to: "/", label: "Trang chủ" },
    { to: "/gpa", label: "GPA" },
    { to: "/toeic", label: "TOEIC" },
    { to: "/tools/game-snake", label: "🎮 Game" },
  ];



  const categories = Object.entries(CATEGORY_LABELS) as [ToolCategory, string][];



  return (

    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200 shadow-sm">

      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-3 shrink-0">

          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow">

            SV

          </div>

          <div className="hidden sm:block">

            <h1 className="font-bold text-lg md:text-xl">SinhVienTools</h1>

            <p className="text-xs text-gray-500">{ALL_TOOLS.length}+ công cụ miễn phí</p>

          </div>

        </Link>



        <nav className="hidden lg:flex items-center gap-6">

          {coreLinks.map((l) => (

            <Link key={l.to} to={l.to} className="text-sm font-medium text-slate-700 hover:text-blue-600 transition">

              {l.label}

            </Link>

          ))}



          <div className="relative">

            <button

              type="button"

              onClick={() => setToolsOpen(!toolsOpen)}

              className="text-sm font-medium text-slate-700 hover:text-blue-600 flex items-center gap-1"

            >

              Công cụ ▾

            </button>

            {toolsOpen && (

              <div className="absolute top-full right-0 mt-2 w-[480px] bg-white rounded-2xl shadow-2xl border p-4 grid grid-cols-2 gap-1 max-h-[70vh] overflow-y-auto">

                {categories.map(([catId, catLabel]) => (

                  <div key={catId} className="col-span-2 first:col-span-2">

                    <p className="text-xs font-bold text-slate-400 px-2 py-1 mt-2 first:mt-0">{catLabel}</p>

                    {ALL_TOOLS.filter((t) => t.category === catId).map((tool) => (

                      <Link

                        key={tool.id}

                        to={tool.path}

                        onClick={() => setToolsOpen(false)}

                        className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-blue-50 text-sm"

                      >

                        <span>{tool.icon}</span>

                        <span>{tool.title}</span>

                        {tool.isNew && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1 rounded">MỚI</span>}

                      </Link>

                    ))}

                  </div>

                ))}

              </div>

            )}

          </div>

        </nav>



        <div className="flex items-center gap-2">

          <span className="hidden md:inline bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow">

            Miễn phí ∞

          </span>

          <button

            type="button"

            onClick={() => setMobileOpen(!mobileOpen)}

            className="lg:hidden p-2 rounded-lg border"

            aria-label="Menu"

          >

            ☰

          </button>

        </div>

      </div>



      {mobileOpen && (

        <div className="lg:hidden border-t bg-white px-4 py-4 space-y-2 max-h-[70vh] overflow-y-auto">

          {ALL_TOOLS.map((tool) => (

            <Link

              key={tool.id}

              to={tool.path}

              onClick={() => setMobileOpen(false)}

              className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50"

            >

              <span className="text-xl">{tool.icon}</span>

              <span className="font-medium text-sm">{tool.title}</span>

            </Link>

          ))}

        </div>

      )}

    </header>

  );

}



export default Header;

