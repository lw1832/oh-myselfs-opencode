import type { AgentConfig } from "@opencode-ai/sdk";
import type { AgentOverrideConfig } from "../config/schema";
export declare const SISYPHUS_JUNIOR_DEFAULTS: {
    readonly model: "anthropic/claude-sonnet-4-5";
    readonly temperature: 0.1;
};
export declare function createSisyphusJuniorAgentWithOverrides(override: AgentOverrideConfig | undefined, systemDefaultModel?: string): AgentConfig;
export declare namespace createSisyphusJuniorAgentWithOverrides {
    var mode: "subagent";
}
