import type { PluginInput } from "@opencode-ai/plugin";
import type { BackgroundManager } from "../../features/background-agent";
export declare const HOOK_NAME = "atlas";
interface ToolExecuteAfterInput {
    tool: string;
    sessionID?: string;
    callID?: string;
}
interface ToolExecuteAfterOutput {
    title: string;
    output: string;
    metadata: Record<string, unknown>;
}
export interface AtlasHookOptions {
    directory: string;
    backgroundManager?: BackgroundManager;
}
export declare function createAtlasHook(ctx: PluginInput, options?: AtlasHookOptions): {
    handler: ({ event }: {
        event: {
            type: string;
            properties?: unknown;
        };
    }) => Promise<void>;
    "tool.execute.before": (input: {
        tool: string;
        sessionID?: string;
        callID?: string;
    }, output: {
        args: Record<string, unknown>;
        message?: string;
    }) => Promise<void>;
    "tool.execute.after": (input: ToolExecuteAfterInput, output: ToolExecuteAfterOutput) => Promise<void>;
};
export {};
