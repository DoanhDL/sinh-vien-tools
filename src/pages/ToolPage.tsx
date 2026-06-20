import { useParams, Navigate } from "react-router-dom";
import { getToolById } from "../data/toolsRegistry";
import { ALL_TOOL_COMPONENTS } from "../tools/index";

function ToolPage() {
  const { toolId } = useParams<{ toolId: string }>();
  if (!toolId) return <Navigate to="/" replace />;

  const meta = getToolById(toolId);
  const Component = ALL_TOOL_COMPONENTS[toolId];

  if (!meta || !Component) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🔍</p>
          <h1 className="text-xl font-bold">Không tìm thấy công cụ</h1>
          <a href="/" className="text-blue-600 hover:underline mt-2 inline-block">← Về trang chủ</a>
        </div>
      </div>
    );
  }

  return <Component />;
}

export default ToolPage;
