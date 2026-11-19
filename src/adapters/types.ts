export type BuiltInAgentId = "claude" | "copilot" | "gemini" | "cursor";

export interface AgentAdapter {
  id: BuiltInAgentId | (string & {});
  name: string;
  apply(projectRoot: string): Promise<void>;
}

export interface AdapterRegistry {
  register(adapter: AgentAdapter): void;
  get(id: string): AgentAdapter | undefined;
  list(): AgentAdapter[];
}
