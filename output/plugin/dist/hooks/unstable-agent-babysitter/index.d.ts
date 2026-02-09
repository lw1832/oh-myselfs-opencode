import type { BackgroundManager } from "../../features/background-agent";
type BabysittingConfig = {
    enabled?: boolean;
    timeout_ms?: number;
};
type BabysitterContext = {
    directory: string;
    client: {
        session: {
            messages: (args: {
                path: {
                    id: string;
                };
            }) => Promise<{
                data?: unknown;
            } | unknown[]>;
            prompt: (args: {
                path: {
                    id: string;
                };
                body: {
                    parts: Array<{
                        type: "text";
                        text: string;
                    }>;
                    agent?: string;
                    model?: {
                        providerID: string;
                        modelID: string;
                    };
                };
                query?: {
                    directory?: string;
                };
            }) => Promise<unknown>;
        };
    };
};
type BabysitterOptions = {
    backgroundManager: Pick<BackgroundManager, "getTasksByParentSession">;
    config?: BabysittingConfig;
};
export declare function createUnstableAgentBabysitterHook(ctx: BabysitterContext, options: BabysitterOptions): {
    event: ({ event }: {
        event: {
            type: string;
            properties?: unknown;
        };
    }) => Promise<void>;
};
export {};
