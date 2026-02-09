export declare const CODE_BLOCK_PATTERN: RegExp;
export declare const INLINE_CODE_PATTERN: RegExp;
/**
 * Determines if the agent is a planner-type agent.
 * Planner agents should NOT be told to call plan agent (they ARE the planner).
 */
export declare function isPlannerAgent(agentName?: string): boolean;
/**
 * Generates the ultrawork message based on agent context.
 * Planner agents get context-gathering focused instructions.
 * Other agents get the original strong agent utilization instructions.
 */
export declare function getUltraworkMessage(agentName?: string): string;
export declare const KEYWORD_DETECTORS: Array<{
    pattern: RegExp;
    message: string | ((agentName?: string) => string);
}>;
