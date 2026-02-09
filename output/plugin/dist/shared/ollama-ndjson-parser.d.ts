/**
 * Ollama NDJSON Parser
 *
 * Parses newline-delimited JSON (NDJSON) responses from Ollama API.
 *
 * @module ollama-ndjson-parser
 * @see https://github.com/code-yeongyu/oh-my-opencode/issues/1124
 * @see https://github.com/ollama/ollama/blob/main/docs/api.md
 */
/**
 * Ollama message structure
 */
export interface OllamaMessage {
    tool_calls?: Array<{
        function: {
            name: string;
            arguments: Record<string, unknown>;
        };
    }>;
    content?: string;
}
/**
 * Ollama NDJSON line structure
 */
export interface OllamaNDJSONLine {
    message?: OllamaMessage;
    done: boolean;
    total_duration?: number;
    load_duration?: number;
    prompt_eval_count?: number;
    prompt_eval_duration?: number;
    eval_count?: number;
    eval_duration?: number;
}
/**
 * Merged Ollama response
 */
export interface OllamaMergedResponse {
    message: OllamaMessage;
    done: boolean;
    stats?: {
        total_duration?: number;
        load_duration?: number;
        prompt_eval_count?: number;
        prompt_eval_duration?: number;
        eval_count?: number;
        eval_duration?: number;
    };
}
/**
 * Parse Ollama streaming NDJSON response into a single merged object.
 *
 * Ollama returns streaming responses as newline-delimited JSON (NDJSON):
 * ```
 * {"message":{"tool_calls":[...]}, "done":false}
 * {"message":{"content":""}, "done":true}
 * ```
 *
 * This function:
 * 1. Splits the response by newlines
 * 2. Parses each line as JSON
 * 3. Merges tool_calls and content from all lines
 * 4. Returns a single merged response
 *
 * @param response - Raw NDJSON response string from Ollama API
 * @returns Merged response with all tool_calls and content combined
 * @throws {Error} If no valid JSON lines are found
 *
 * @example
 * ```typescript
 * const ndjsonResponse = `
 * {"message":{"tool_calls":[{"function":{"name":"read","arguments":{"filePath":"README.md"}}}]}, "done":false}
 * {"message":{"content":""}, "done":true}
 * `;
 *
 * const merged = parseOllamaStreamResponse(ndjsonResponse);
 * // Result:
 * // {
 * //   message: {
 * //     tool_calls: [{ function: { name: "read", arguments: { filePath: "README.md" } } }],
 * //     content: ""
 * //   },
 * //   done: true
 * // }
 * ```
 */
export declare function parseOllamaStreamResponse(response: string): OllamaMergedResponse;
/**
 * Check if a response string is NDJSON format.
 *
 * NDJSON is identified by:
 * - Multiple lines
 * - Each line is valid JSON
 * - At least one line has "done" field
 *
 * @param response - Response string to check
 * @returns true if response appears to be NDJSON
 *
 * @example
 * ```typescript
 * const ndjson = '{"done":false}\n{"done":true}';
 * const singleJson = '{"done":true}';
 *
 * isNDJSONResponse(ndjson);     // true
 * isNDJSONResponse(singleJson); // false
 * ```
 */
export declare function isNDJSONResponse(response: string): boolean;
