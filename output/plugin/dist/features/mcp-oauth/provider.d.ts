import type { OAuthTokenData } from "./storage";
import type { OAuthServerMetadata } from "./discovery";
import type { ClientCredentials } from "./dcr";
export type McpOAuthProviderOptions = {
    serverUrl: string;
    clientId?: string;
    scopes?: string[];
};
type CallbackResult = {
    code: string;
    state: string;
};
declare function generateCodeVerifier(): string;
declare function generateCodeChallenge(verifier: string): string;
declare function buildAuthorizationUrl(authorizationEndpoint: string, options: {
    clientId: string;
    redirectUri: string;
    codeChallenge: string;
    state: string;
    scopes?: string[];
    resource?: string;
}): string;
declare function startCallbackServer(port: number): Promise<CallbackResult>;
export declare class McpOAuthProvider {
    private readonly serverUrl;
    private readonly configClientId;
    private readonly scopes;
    private storedCodeVerifier;
    private storedClientInfo;
    private callbackPort;
    constructor(options: McpOAuthProviderOptions);
    tokens(): OAuthTokenData | null;
    saveTokens(tokenData: OAuthTokenData): boolean;
    clientInformation(): ClientCredentials | null;
    redirectUrl(): string;
    saveCodeVerifier(verifier: string): void;
    codeVerifier(): string | null;
    redirectToAuthorization(metadata: OAuthServerMetadata): Promise<CallbackResult>;
    login(): Promise<OAuthTokenData>;
}
export { generateCodeVerifier, generateCodeChallenge, buildAuthorizationUrl, startCallbackServer };
