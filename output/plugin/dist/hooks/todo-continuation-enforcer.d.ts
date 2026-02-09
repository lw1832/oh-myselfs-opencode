import type { PluginInput } from "@opencode-ai/plugin";
import type { BackgroundManager } from "../features/background-agent";
export interface TodoContinuationEnforcerOptions {
    backgroundManager?: BackgroundManager;
    skipAgents?: string[];
    isContinuationStopped?: (sessionID: string) => boolean;
}
export interface TodoContinuationEnforcer {
    handler: (input: {
        event: {
            type: string;
            properties?: unknown;
        };
    }) => Promise<void>;
    markRecovering: (sessionID: string) => void;
    markRecoveryComplete: (sessionID: string) => void;
    cancelAllCountdowns: () => void;
}
export declare function createTodoContinuationEnforcer(ctx: PluginInput, options?: TodoContinuationEnforcerOptions): TodoContinuationEnforcer;
