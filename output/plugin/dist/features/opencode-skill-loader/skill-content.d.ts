import type { LoadedSkill } from "./types";
import type { GitMasterConfig, BrowserAutomationProvider } from "../../config/schema";
export interface SkillResolutionOptions {
    gitMasterConfig?: GitMasterConfig;
    browserProvider?: BrowserAutomationProvider;
}
declare function clearSkillCache(): void;
declare function getAllSkills(options?: SkillResolutionOptions): Promise<LoadedSkill[]>;
declare function extractSkillTemplate(skill: LoadedSkill): Promise<string>;
export { clearSkillCache, getAllSkills, extractSkillTemplate };
export declare function injectGitMasterConfig(template: string, config?: GitMasterConfig): string;
export declare function resolveSkillContent(skillName: string, options?: SkillResolutionOptions): string | null;
export declare function resolveMultipleSkills(skillNames: string[], options?: SkillResolutionOptions): {
    resolved: Map<string, string>;
    notFound: string[];
};
export declare function resolveSkillContentAsync(skillName: string, options?: SkillResolutionOptions): Promise<string | null>;
export declare function resolveMultipleSkillsAsync(skillNames: string[], options?: SkillResolutionOptions): Promise<{
    resolved: Map<string, string>;
    notFound: string[];
}>;
