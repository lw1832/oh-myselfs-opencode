import { type PluginInput, type ToolDefinition } from "@opencode-ai/plugin";
import type { LookAtArgs } from "./types";
interface LookAtArgsWithAlias extends LookAtArgs {
    path?: string;
}
export declare function normalizeArgs(args: LookAtArgsWithAlias): LookAtArgs;
export declare function validateArgs(args: LookAtArgs): string | null;
export declare function createLookAt(ctx: PluginInput): ToolDefinition;
export {};
