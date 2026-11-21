import { SpecLearnAdapterRegistry } from "./registry.js";
import { claudeAdapter, copilotAdapter, cursorAdapter, antigravityAdapter, genericAdapter } from "./builtins.js";

export * from "./types.js";
export * from "./registry.js";
export * from "./templates.js";

export function createBuiltInAdapterRegistry(): SpecLearnAdapterRegistry {
  const registry = new SpecLearnAdapterRegistry();
  registry.register(claudeAdapter);
  registry.register(copilotAdapter);
  registry.register(antigravityAdapter);
  registry.register(cursorAdapter);
  registry.register(genericAdapter);
  return registry;
}
