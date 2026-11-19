import type { AgentAdapter, AdapterRegistry } from "./types.js";

export class SpecLearnAdapterRegistry implements AdapterRegistry {
  private readonly adapters = new Map<string, AgentAdapter>();

  register(adapter: AgentAdapter): void {
    this.adapters.set(adapter.id, adapter);
  }

  get(id: string): AgentAdapter | undefined {
    return this.adapters.get(id);
  }

  list(): AgentAdapter[] {
    return [...this.adapters.values()];
  }
}
