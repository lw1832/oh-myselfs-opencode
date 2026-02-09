import { type OpenCodeBinaryType, type OpenCodeConfigPaths } from "../shared";
import type { ConfigMergeResult, DetectedConfig, InstallConfig } from "./types";
interface ConfigContext {
    binary: OpenCodeBinaryType;
    version: string | null;
    paths: OpenCodeConfigPaths;
}
export declare function initConfigContext(binary: OpenCodeBinaryType, version: string | null): void;
export declare function getConfigContext(): ConfigContext;
export declare function resetConfigContext(): void;
export declare function fetchLatestVersion(packageName: string): Promise<string | null>;
interface NpmDistTags {
    latest?: string;
    beta?: string;
    next?: string;
    [tag: string]: string | undefined;
}
export declare function fetchNpmDistTags(packageName: string): Promise<NpmDistTags | null>;
export declare function getPluginNameWithVersion(currentVersion: string): Promise<string>;
type ConfigFormat = "json" | "jsonc" | "none";
export declare function detectConfigFormat(): {
    format: ConfigFormat;
    path: string;
};
export declare function addPluginToOpenCodeConfig(currentVersion: string): Promise<ConfigMergeResult>;
export declare function generateOmoConfig(installConfig: InstallConfig): Record<string, unknown>;
export declare function writeOmoConfig(installConfig: InstallConfig): ConfigMergeResult;
export declare function isOpenCodeInstalled(): Promise<boolean>;
export declare function getOpenCodeVersion(): Promise<string | null>;
export declare function addAuthPlugins(config: InstallConfig): Promise<ConfigMergeResult>;
export interface BunInstallResult {
    success: boolean;
    timedOut?: boolean;
    error?: string;
}
export declare function runBunInstall(): Promise<boolean>;
export declare function runBunInstallWithDetails(): Promise<BunInstallResult>;
/**
 * Antigravity Provider Configuration
 *
 * IMPORTANT: Model names MUST use `antigravity-` prefix for stability.
 *
 * Since opencode-antigravity-auth v1.3.0, models use a variant system:
 * - `antigravity-gemini-3-pro` with variants: low, high
 * - `antigravity-gemini-3-flash` with variants: minimal, low, medium, high
 *
 * Legacy tier-suffixed names (e.g., `antigravity-gemini-3-pro-high`) still work
 * but variants are the recommended approach.
 *
 * @see https://github.com/NoeFabris/opencode-antigravity-auth#models
 */
export declare const ANTIGRAVITY_PROVIDER_CONFIG: {
    google: {
        name: string;
        models: {
            "antigravity-gemini-3-pro": {
                name: string;
                limit: {
                    context: number;
                    output: number;
                };
                modalities: {
                    input: string[];
                    output: string[];
                };
                variants: {
                    low: {
                        thinkingLevel: string;
                    };
                    high: {
                        thinkingLevel: string;
                    };
                };
            };
            "antigravity-gemini-3-flash": {
                name: string;
                limit: {
                    context: number;
                    output: number;
                };
                modalities: {
                    input: string[];
                    output: string[];
                };
                variants: {
                    minimal: {
                        thinkingLevel: string;
                    };
                    low: {
                        thinkingLevel: string;
                    };
                    medium: {
                        thinkingLevel: string;
                    };
                    high: {
                        thinkingLevel: string;
                    };
                };
            };
            "antigravity-claude-sonnet-4-5": {
                name: string;
                limit: {
                    context: number;
                    output: number;
                };
                modalities: {
                    input: string[];
                    output: string[];
                };
            };
            "antigravity-claude-sonnet-4-5-thinking": {
                name: string;
                limit: {
                    context: number;
                    output: number;
                };
                modalities: {
                    input: string[];
                    output: string[];
                };
                variants: {
                    low: {
                        thinkingConfig: {
                            thinkingBudget: number;
                        };
                    };
                    max: {
                        thinkingConfig: {
                            thinkingBudget: number;
                        };
                    };
                };
            };
            "antigravity-claude-opus-4-5-thinking": {
                name: string;
                limit: {
                    context: number;
                    output: number;
                };
                modalities: {
                    input: string[];
                    output: string[];
                };
                variants: {
                    low: {
                        thinkingConfig: {
                            thinkingBudget: number;
                        };
                    };
                    max: {
                        thinkingConfig: {
                            thinkingBudget: number;
                        };
                    };
                };
            };
        };
    };
};
export declare function addProviderConfig(config: InstallConfig): ConfigMergeResult;
export declare function detectCurrentConfig(): DetectedConfig;
export {};
