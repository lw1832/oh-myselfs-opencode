import type { CheckResult, CheckDefinition } from "../types";
interface OAuthTokenData {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: number;
    clientInfo?: {
        clientId: string;
        clientSecret?: string;
    };
}
type TokenStore = Record<string, OAuthTokenData>;
export declare function readTokenStore(): TokenStore | null;
export declare function checkMcpOAuthTokens(): Promise<CheckResult>;
export declare function getMcpOAuthCheckDefinition(): CheckDefinition;
export {};
