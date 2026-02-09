import type { DelegateTaskArgs } from "./types";
/**
 * Parse a model string in "provider/model" format.
 */
export declare function parseModelString(model: string): {
    providerID: string;
    modelID: string;
} | undefined;
/**
 * Get the message directory for a session, checking both direct and nested paths.
 */
export declare function getMessageDir(sessionID: string): string | null;
/**
 * Format a duration between two dates as a human-readable string.
 */
export declare function formatDuration(start: Date, end?: Date): string;
/**
 * Context for error formatting.
 */
export interface ErrorContext {
    operation: string;
    args?: DelegateTaskArgs;
    sessionID?: string;
    agent?: string;
    category?: string;
}
/**
 * Format an error with detailed context for debugging.
 */
export declare function formatDetailedError(error: unknown, ctx: ErrorContext): string;
