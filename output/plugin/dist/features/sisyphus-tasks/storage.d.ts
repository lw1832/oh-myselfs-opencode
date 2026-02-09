import type { z } from "zod";
import type { OhMyOpenCodeConfig } from "../../config/schema";
export declare function getTaskDir(listId: string, config: Partial<OhMyOpenCodeConfig>): string;
export declare function getTaskPath(listId: string, taskId: string, config: Partial<OhMyOpenCodeConfig>): string;
export declare function getTeamDir(teamName: string, config: Partial<OhMyOpenCodeConfig>): string;
export declare function getInboxPath(teamName: string, agentName: string, config: Partial<OhMyOpenCodeConfig>): string;
export declare function ensureDir(dirPath: string): void;
export declare function readJsonSafe<T>(filePath: string, schema: z.ZodType<T>): T | null;
export declare function writeJsonAtomic(filePath: string, data: unknown): void;
