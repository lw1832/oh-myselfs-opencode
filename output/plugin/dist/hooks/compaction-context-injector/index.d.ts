export interface SummarizeContext {
    sessionID: string;
    providerID: string;
    modelID: string;
    usageRatio: number;
    directory: string;
}
export declare function createCompactionContextInjector(): (ctx: SummarizeContext) => Promise<void>;
