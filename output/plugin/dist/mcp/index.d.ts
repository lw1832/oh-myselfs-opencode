export { McpNameSchema, type McpName } from "./types";
type RemoteMcpConfig = {
    type: "remote";
    url: string;
    enabled: boolean;
    headers?: Record<string, string>;
    oauth?: false;
};
export declare function createBuiltinMcps(disabledMcps?: string[]): Record<string, RemoteMcpConfig>;
