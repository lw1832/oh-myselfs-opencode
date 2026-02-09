import type { OriginalMessageContext, ToolPermission } from "./types";
export interface StoredMessage {
    agent?: string;
    model?: {
        providerID?: string;
        modelID?: string;
        variant?: string;
    };
    tools?: Record<string, ToolPermission>;
}
export declare function findNearestMessageWithFields(messageDir: string): StoredMessage | null;
/**
 * Finds the FIRST (oldest) message in the session with agent field.
 * This is used to get the original agent that started the session,
 * avoiding issues where newer messages may have a different agent
 * due to OpenCode's internal agent switching.
 */
export declare function findFirstMessageWithAgent(messageDir: string): string | null;
export declare function injectHookMessage(sessionID: string, hookContent: string, originalMessage: OriginalMessageContext): boolean;
