import { TOOL_COMPONENTS } from "./studentTools";
import { EXTRA_TOOL_COMPONENTS } from "./extraTools";
import { GAME_COMPONENTS } from "./games";
import type { ReactElement } from "react";

export const ALL_TOOL_COMPONENTS: Record<string, () => ReactElement> = {
  ...TOOL_COMPONENTS,
  ...EXTRA_TOOL_COMPONENTS,
  ...GAME_COMPONENTS,
};

export { TOOL_COMPONENTS, EXTRA_TOOL_COMPONENTS, GAME_COMPONENTS };
