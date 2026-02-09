import type { TmuxConfig, TmuxLayout } from "../../config/schema";
import type { SpawnPaneResult } from "./types";
export declare function isInsideTmux(): boolean;
export declare function isServerRunning(serverUrl: string): Promise<boolean>;
export declare function resetServerCheck(): void;
export type SplitDirection = "-h" | "-v";
export declare function getCurrentPaneId(): string | undefined;
export interface PaneDimensions {
    paneWidth: number;
    windowWidth: number;
}
export declare function getPaneDimensions(paneId: string): Promise<PaneDimensions | null>;
export declare function spawnTmuxPane(sessionId: string, description: string, config: TmuxConfig, serverUrl: string, targetPaneId?: string, splitDirection?: SplitDirection): Promise<SpawnPaneResult>;
export declare function closeTmuxPane(paneId: string): Promise<boolean>;
export declare function replaceTmuxPane(paneId: string, sessionId: string, description: string, config: TmuxConfig, serverUrl: string): Promise<SpawnPaneResult>;
export declare function applyLayout(tmux: string, layout: TmuxLayout, mainPaneSize: number): Promise<void>;
export declare function enforceMainPaneWidth(mainPaneId: string, windowWidth: number): Promise<void>;
