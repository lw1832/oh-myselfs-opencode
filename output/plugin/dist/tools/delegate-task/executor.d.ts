import type { BackgroundManager } from "../../features/background-agent";
import type { CategoriesConfig, GitMasterConfig, BrowserAutomationProvider } from "../../config/schema";
import type { ModelFallbackInfo } from "../../features/task-toast-manager/types";
import type { DelegateTaskArgs, ToolContextWithMetadata, OpencodeClient } from "./types";
export interface ExecutorContext {
    manager: BackgroundManager;
    client: OpencodeClient;
    directory: string;
    userCategories?: CategoriesConfig;
    gitMasterConfig?: GitMasterConfig;
    sisyphusJuniorModel?: string;
    browserProvider?: BrowserAutomationProvider;
    onSyncSessionCreated?: (event: {
        sessionID: string;
        parentID: string;
        title: string;
    }) => Promise<void>;
    skipModelListFetch?: boolean;
}
export interface ParentContext {
    sessionID: string;
    messageID: string;
    agent?: string;
    model?: {
        providerID: string;
        modelID: string;
        variant?: string;
    };
}
export declare function resolveSkillContent(skills: string[], options: {
    gitMasterConfig?: GitMasterConfig;
    browserProvider?: BrowserAutomationProvider;
}): Promise<{
    content: string | undefined;
    error: string | null;
}>;
export declare function resolveParentContext(ctx: ToolContextWithMetadata): ParentContext;
export declare function executeBackgroundContinuation(args: DelegateTaskArgs, ctx: ToolContextWithMetadata, executorCtx: ExecutorContext, parentContext: ParentContext): Promise<string>;
export declare function executeSyncContinuation(args: DelegateTaskArgs, ctx: ToolContextWithMetadata, executorCtx: ExecutorContext): Promise<string>;
export declare function executeUnstableAgentTask(args: DelegateTaskArgs, ctx: ToolContextWithMetadata, executorCtx: ExecutorContext, parentContext: ParentContext, agentToUse: string, categoryModel: {
    providerID: string;
    modelID: string;
    variant?: string;
} | undefined, systemContent: string | undefined, actualModel: string | undefined): Promise<string>;
export declare function executeBackgroundTask(args: DelegateTaskArgs, ctx: ToolContextWithMetadata, executorCtx: ExecutorContext, parentContext: ParentContext, agentToUse: string, categoryModel: {
    providerID: string;
    modelID: string;
    variant?: string;
} | undefined, systemContent: string | undefined): Promise<string>;
export declare function executeSyncTask(args: DelegateTaskArgs, ctx: ToolContextWithMetadata, executorCtx: ExecutorContext, parentContext: ParentContext, agentToUse: string, categoryModel: {
    providerID: string;
    modelID: string;
    variant?: string;
} | undefined, systemContent: string | undefined, modelInfo?: ModelFallbackInfo): Promise<string>;
export interface CategoryResolutionResult {
    agentToUse: string;
    categoryModel: {
        providerID: string;
        modelID: string;
        variant?: string;
    } | undefined;
    categoryPromptAppend: string | undefined;
    modelInfo: ModelFallbackInfo | undefined;
    actualModel: string | undefined;
    isUnstableAgent: boolean;
    error?: string;
}
export declare function resolveCategoryExecution(args: DelegateTaskArgs, executorCtx: ExecutorContext, inheritedModel: string | undefined, systemDefaultModel: string | undefined): Promise<CategoryResolutionResult>;
export declare function resolveSubagentExecution(args: DelegateTaskArgs, executorCtx: ExecutorContext, parentAgent: string | undefined, categoryExamples: string): Promise<{
    agentToUse: string;
    categoryModel: {
        providerID: string;
        modelID: string;
    } | undefined;
    error?: string;
}>;
