import type { WindowState, PaneAction, SpawnDecision, CapacityConfig, TmuxPaneInfo, SplitDirection } from "./types";
export interface SessionMapping {
    sessionId: string;
    paneId: string;
    createdAt: Date;
}
export interface GridCapacity {
    cols: number;
    rows: number;
    total: number;
}
export interface GridSlot {
    row: number;
    col: number;
}
export interface GridPlan {
    cols: number;
    rows: number;
    slotWidth: number;
    slotHeight: number;
}
export interface SpawnTarget {
    targetPaneId: string;
    splitDirection: SplitDirection;
}
export declare function getColumnCount(paneCount: number): number;
export declare function getColumnWidth(agentAreaWidth: number, paneCount: number): number;
export declare function isSplittableAtCount(agentAreaWidth: number, paneCount: number): boolean;
export declare function findMinimalEvictions(agentAreaWidth: number, currentCount: number): number | null;
export declare function canSplitPane(pane: TmuxPaneInfo, direction: SplitDirection): boolean;
export declare function canSplitPaneAnyDirection(pane: TmuxPaneInfo): boolean;
export declare function getBestSplitDirection(pane: TmuxPaneInfo): SplitDirection | null;
export declare function calculateCapacity(windowWidth: number, windowHeight: number): GridCapacity;
export declare function computeGridPlan(windowWidth: number, windowHeight: number, paneCount: number): GridPlan;
export declare function mapPaneToSlot(pane: TmuxPaneInfo, plan: GridPlan, mainPaneWidth: number): GridSlot;
export declare function findSpawnTarget(state: WindowState): SpawnTarget | null;
export declare function decideSpawnActions(state: WindowState, sessionId: string, description: string, _config: CapacityConfig, sessionMappings: SessionMapping[]): SpawnDecision;
export declare function decideCloseAction(state: WindowState, sessionId: string, sessionMappings: SessionMapping[]): PaneAction | null;
