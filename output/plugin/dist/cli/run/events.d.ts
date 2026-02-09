import type { RunContext } from "./types";
export declare function serializeError(error: unknown): string;
export interface EventState {
    mainSessionIdle: boolean;
    mainSessionError: boolean;
    lastError: string | null;
    lastOutput: string;
    lastPartText: string;
    currentTool: string | null;
    /** Set to true when the main session has produced meaningful work (text, tool call, or tool result) */
    hasReceivedMeaningfulWork: boolean;
}
export declare function createEventState(): EventState;
export declare function processEvents(ctx: RunContext, stream: AsyncIterable<unknown>, state: EventState): Promise<void>;
