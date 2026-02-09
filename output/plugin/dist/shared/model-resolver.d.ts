import type { FallbackEntry } from "./model-requirements";
export type ModelResolutionInput = {
    userModel?: string;
    inheritedModel?: string;
    systemDefault?: string;
};
export type ModelSource = "override" | "category-default" | "provider-fallback" | "system-default";
export type ModelResolutionResult = {
    model: string;
    source: ModelSource;
    variant?: string;
};
export type ExtendedModelResolutionInput = {
    uiSelectedModel?: string;
    userModel?: string;
    categoryDefaultModel?: string;
    fallbackChain?: FallbackEntry[];
    availableModels: Set<string>;
    systemDefaultModel?: string;
};
export declare function resolveModel(input: ModelResolutionInput): string | undefined;
export declare function resolveModelWithFallback(input: ExtendedModelResolutionInput): ModelResolutionResult | undefined;
