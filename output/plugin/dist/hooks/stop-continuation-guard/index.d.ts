import type { PluginInput } from "@opencode-ai/plugin";
export interface StopContinuationGuard {
    event: (input: {
        event: {
            type: string;
            properties?: unknown;
        };
    }) => Promise<void>;
    "chat.message": (input: {
        sessionID?: string;
    }) => Promise<void>;
    stop: (sessionID: string) => void;
    isStopped: (sessionID: string) => boolean;
    clear: (sessionID: string) => void;
}
export declare function createStopContinuationGuardHook(_ctx: PluginInput): StopContinuationGuard;
