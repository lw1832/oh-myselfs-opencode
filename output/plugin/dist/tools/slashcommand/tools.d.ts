import { type ToolDefinition } from "@opencode-ai/plugin";
import type { CommandInfo, SlashcommandToolOptions } from "./types";
export declare function discoverCommandsSync(): CommandInfo[];
export declare function createSlashcommandTool(options?: SlashcommandToolOptions): ToolDefinition;
export declare const slashcommand: ToolDefinition;
