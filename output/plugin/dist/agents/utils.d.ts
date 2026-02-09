import type { AgentConfig } from "@opencode-ai/sdk";
import type { AgentOverrides, AgentFactory } from "./types";
import type { CategoriesConfig, GitMasterConfig } from "../config/schema";
import type { LoadedSkill } from "../features/opencode-skill-loader/types";
import type { BrowserAutomationProvider } from "../config/schema";
type AgentSource = AgentFactory | AgentConfig;
export declare function buildAgent(source: AgentSource, model: string, categories?: CategoriesConfig, gitMasterConfig?: GitMasterConfig, browserProvider?: BrowserAutomationProvider): AgentConfig;
/**
 * Creates OmO-specific environment context (time, timezone, locale).
 * Note: Working directory, platform, and date are already provided by OpenCode's system.ts,
 * so we only include fields that OpenCode doesn't provide to avoid duplication.
 * See: https://github.com/code-yeongyu/oh-my-opencode/issues/379
 */
export declare function createEnvContext(): string;
export declare function createBuiltinAgents(disabledAgents?: string[], agentOverrides?: AgentOverrides, directory?: string, systemDefaultModel?: string, categories?: CategoriesConfig, gitMasterConfig?: GitMasterConfig, discoveredSkills?: LoadedSkill[], client?: any, browserProvider?: BrowserAutomationProvider, uiSelectedModel?: string): Promise<Record<string, AgentConfig>>;
export {};
