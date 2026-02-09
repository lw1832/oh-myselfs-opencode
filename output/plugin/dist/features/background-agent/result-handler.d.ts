import type { BackgroundTask } from "./types";
import type { OpencodeClient } from "./constants";
import type { ConcurrencyManager } from "./concurrency";
import type { TaskStateManager } from "./state";
export interface ResultHandlerContext {
    client: OpencodeClient;
    concurrencyManager: ConcurrencyManager;
    state: TaskStateManager;
}
export declare function checkSessionTodos(client: OpencodeClient, sessionID: string): Promise<boolean>;
export declare function validateSessionHasOutput(client: OpencodeClient, sessionID: string): Promise<boolean>;
export declare function formatDuration(start: Date, end?: Date): string;
export declare function getMessageDir(sessionID: string): string | null;
export declare function tryCompleteTask(task: BackgroundTask, source: string, ctx: ResultHandlerContext): Promise<boolean>;
export declare function notifyParentSession(task: BackgroundTask, ctx: ResultHandlerContext): Promise<void>;
