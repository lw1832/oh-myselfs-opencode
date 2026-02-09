import type { CheckResult, CheckDefinition } from "../types";
import { type ModelRequirement } from "../../../shared/model-requirements";
export interface AgentResolutionInfo {
    name: string;
    requirement: ModelRequirement;
    userOverride?: string;
    effectiveModel: string;
    effectiveResolution: string;
}
export interface CategoryResolutionInfo {
    name: string;
    requirement: ModelRequirement;
    userOverride?: string;
    effectiveModel: string;
    effectiveResolution: string;
}
export interface ModelResolutionInfo {
    agents: AgentResolutionInfo[];
    categories: CategoryResolutionInfo[];
}
interface OmoConfig {
    agents?: Record<string, {
        model?: string;
    }>;
    categories?: Record<string, {
        model?: string;
    }>;
}
export declare function getModelResolutionInfo(): ModelResolutionInfo;
export declare function getModelResolutionInfoWithOverrides(config: OmoConfig): ModelResolutionInfo;
export declare function checkModelResolution(): Promise<CheckResult>;
export declare function getModelResolutionCheckDefinition(): CheckDefinition;
export {};
