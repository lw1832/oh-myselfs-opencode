import type { CheckResult, CheckDefinition, OpenCodeInfo } from "../types";
export declare function getBinaryLookupCommand(platform: NodeJS.Platform): "which" | "where";
export declare function parseBinaryPaths(output: string): string[];
export declare function selectBinaryPath(paths: string[], platform: NodeJS.Platform): string | null;
export declare function buildVersionCommand(binaryPath: string, platform: NodeJS.Platform): string[];
export declare function findOpenCodeBinary(): Promise<{
    binary: string;
    path: string;
} | null>;
export declare function getOpenCodeVersion(binaryPath: string, platform?: NodeJS.Platform): Promise<string | null>;
export declare function compareVersions(current: string, minimum: string): boolean;
export declare function getOpenCodeInfo(): Promise<OpenCodeInfo>;
export declare function checkOpenCodeInstallation(): Promise<CheckResult>;
export declare function getOpenCodeCheckDefinition(): CheckDefinition;
