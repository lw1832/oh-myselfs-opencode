import type { PluginInput } from "@opencode-ai/plugin";
export interface DelegateTaskErrorPattern {
    pattern: string;
    errorType: string;
    fixHint: string;
}
export declare const DELEGATE_TASK_ERROR_PATTERNS: DelegateTaskErrorPattern[];
export interface DetectedError {
    errorType: string;
    originalOutput: string;
}
export declare function detectDelegateTaskError(output: string): DetectedError | null;
export declare function buildRetryGuidance(errorInfo: DetectedError): string;
export declare function createDelegateTaskRetryHook(_ctx: PluginInput): {
    "tool.execute.after": (input: {
        tool: string;
        sessionID: string;
        callID: string;
    }, output: {
        title: string;
        output: string;
        metadata: unknown;
    }) => Promise<void>;
};
