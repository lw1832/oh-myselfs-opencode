import type { InstallConfig } from "./types";
interface AgentConfig {
    model: string;
    variant?: string;
}
interface CategoryConfig {
    model: string;
    variant?: string;
}
export interface GeneratedOmoConfig {
    $schema: string;
    agents?: Record<string, AgentConfig>;
    categories?: Record<string, CategoryConfig>;
    [key: string]: unknown;
}
export declare function generateModelConfig(config: InstallConfig): GeneratedOmoConfig;
export declare function shouldShowChatGPTOnlyWarning(config: InstallConfig): boolean;
export {};
