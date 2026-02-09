import { type ToolDefinition } from "@opencode-ai/plugin";
import type { BackgroundManager } from "../../features/background-agent";
type BackgroundOutputMessage = {
    info?: {
        role?: string;
        time?: string | {
            created?: number;
        };
        agent?: string;
    };
    parts?: Array<{
        type?: string;
        text?: string;
        content?: string | Array<{
            type: string;
            text?: string;
        }>;
        name?: string;
    }>;
};
type BackgroundOutputMessagesResult = {
    data?: BackgroundOutputMessage[];
    error?: unknown;
} | BackgroundOutputMessage[];
export type BackgroundOutputClient = {
    session: {
        messages: (args: {
            path: {
                id: string;
            };
        }) => Promise<BackgroundOutputMessagesResult>;
    };
};
export type BackgroundCancelClient = {
    session: {
        abort: (args: {
            path: {
                id: string;
            };
        }) => Promise<unknown>;
    };
};
export type BackgroundOutputManager = Pick<BackgroundManager, "getTask">;
export declare function createBackgroundTask(manager: BackgroundManager): ToolDefinition;
export declare function createBackgroundOutput(manager: BackgroundOutputManager, client: BackgroundOutputClient): ToolDefinition;
export declare function createBackgroundCancel(manager: BackgroundManager, client: BackgroundCancelClient): ToolDefinition;
export {};
