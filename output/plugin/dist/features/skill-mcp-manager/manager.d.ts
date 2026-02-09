import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import type { Tool, Resource, Prompt } from "@modelcontextprotocol/sdk/types.js";
import type { ClaudeCodeMcpServer } from "../claude-code-mcp-loader/types";
import type { SkillMcpClientInfo, SkillMcpServerContext } from "./types";
export declare class SkillMcpManager {
    private clients;
    private pendingConnections;
    private authProviders;
    private cleanupRegistered;
    private cleanupInterval;
    private readonly IDLE_TIMEOUT;
    private getClientKey;
    /**
     * Get or create an McpOAuthProvider for a given server URL + oauth config.
     * Providers are cached by server URL to reuse tokens across reconnections.
     */
    private getOrCreateAuthProvider;
    private registerProcessCleanup;
    getOrCreateClient(info: SkillMcpClientInfo, config: ClaudeCodeMcpServer): Promise<Client>;
    private createClient;
    /**
     * Create an HTTP-based MCP client using StreamableHTTPClientTransport.
     * Supports remote MCP servers with optional authentication headers.
     */
    private createHttpClient;
    /**
     * Create a stdio-based MCP client using StdioClientTransport.
     * Spawns a local process and communicates via stdin/stdout.
     */
    private createStdioClient;
    disconnectSession(sessionID: string): Promise<void>;
    disconnectAll(): Promise<void>;
    private startCleanupTimer;
    private stopCleanupTimer;
    private cleanupIdleClients;
    listTools(info: SkillMcpClientInfo, context: SkillMcpServerContext): Promise<Tool[]>;
    listResources(info: SkillMcpClientInfo, context: SkillMcpServerContext): Promise<Resource[]>;
    listPrompts(info: SkillMcpClientInfo, context: SkillMcpServerContext): Promise<Prompt[]>;
    callTool(info: SkillMcpClientInfo, context: SkillMcpServerContext, name: string, args: Record<string, unknown>): Promise<unknown>;
    readResource(info: SkillMcpClientInfo, context: SkillMcpServerContext, uri: string): Promise<unknown>;
    getPrompt(info: SkillMcpClientInfo, context: SkillMcpServerContext, name: string, args: Record<string, string>): Promise<unknown>;
    private withOperationRetry;
    private handleStepUpIfNeeded;
    private forceReconnect;
    private getOrCreateClientWithRetry;
    getConnectedServers(): string[];
    isConnected(info: SkillMcpClientInfo): boolean;
}
