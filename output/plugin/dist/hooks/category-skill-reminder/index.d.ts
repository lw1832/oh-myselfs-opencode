import type { PluginInput } from "@opencode-ai/plugin";
interface ToolExecuteInput {
    tool: string;
    sessionID: string;
    callID: string;
    agent?: string;
}
interface ToolExecuteOutput {
    title: string;
    output: string;
    metadata: unknown;
}
export declare function createCategorySkillReminderHook(_ctx: PluginInput): {
    "tool.execute.after": (input: ToolExecuteInput, output: ToolExecuteOutput) => Promise<void>;
    event: ({ event }: {
        event: {
            type: string;
            properties?: unknown;
        };
    }) => Promise<void>;
};
export {};
