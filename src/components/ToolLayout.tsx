import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface ToolLayoutProps {
  icon: string;
  title: string;
  description: string;
  children: ReactNode;
}

function ToolLayout({ icon, title, description, children }: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-6"
        >
          ← Về trang chủ
        </Link>

        <div className="text-center mb-8">
          <span className="text-5xl">{icon}</span>
          <h1 className="text-3xl font-bold mt-3">{title}</h1>
          <p className="text-slate-600 mt-2">{description}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export default ToolLayout;
