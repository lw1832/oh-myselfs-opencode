import type { OhMyOpenCodeConfig } from "../config";
import type { ModelCacheState } from "../plugin-state";
import type { CategoryConfig } from "../config/schema";
export interface ConfigHandlerDeps {
    ctx: {
        directory: string;
        client?: any;
    };
    pluginConfig: OhMyOpenCodeConfig;
    modelCacheState: ModelCacheState;
}
export declare function resolveCategoryConfig(categoryName: string, userCategories?: Record<string, CategoryConfig>): CategoryConfig | undefined;
export declare function createConfigHandler(deps: ConfigHandlerDeps): (config: Record<string, unknown>) => Promise<void>;
