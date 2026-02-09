import { z } from "zod";
export declare const MailboxMessageSchema: z.ZodObject<{
    from: z.ZodString;
    text: z.ZodString;
    timestamp: z.ZodString;
    color: z.ZodOptional<z.ZodString>;
    read: z.ZodBoolean;
}, z.core.$strip>;
export type MailboxMessage = z.infer<typeof MailboxMessageSchema>;
export declare const PermissionRequestSchema: z.ZodObject<{
    type: z.ZodLiteral<"permission_request">;
    requestId: z.ZodString;
    toolName: z.ZodString;
    input: z.ZodUnknown;
    agentId: z.ZodString;
    timestamp: z.ZodNumber;
}, z.core.$strip>;
export type PermissionRequest = z.infer<typeof PermissionRequestSchema>;
export declare const PermissionResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"permission_response">;
    requestId: z.ZodString;
    decision: z.ZodEnum<{
        rejected: "rejected";
        approved: "approved";
    }>;
    updatedInput: z.ZodOptional<z.ZodUnknown>;
    feedback: z.ZodOptional<z.ZodString>;
    permissionUpdates: z.ZodOptional<z.ZodUnknown>;
}, z.core.$strip>;
export type PermissionResponse = z.infer<typeof PermissionResponseSchema>;
export declare const ShutdownRequestSchema: z.ZodObject<{
    type: z.ZodLiteral<"shutdown_request">;
}, z.core.$strip>;
export type ShutdownRequest = z.infer<typeof ShutdownRequestSchema>;
export declare const ShutdownApprovedSchema: z.ZodObject<{
    type: z.ZodLiteral<"shutdown_approved">;
}, z.core.$strip>;
export type ShutdownApproved = z.infer<typeof ShutdownApprovedSchema>;
export declare const ShutdownRejectedSchema: z.ZodObject<{
    type: z.ZodLiteral<"shutdown_rejected">;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ShutdownRejected = z.infer<typeof ShutdownRejectedSchema>;
export declare const TaskAssignmentSchema: z.ZodObject<{
    type: z.ZodLiteral<"task_assignment">;
    taskId: z.ZodString;
    subject: z.ZodString;
    description: z.ZodString;
    assignedBy: z.ZodString;
    timestamp: z.ZodNumber;
}, z.core.$strip>;
export type TaskAssignment = z.infer<typeof TaskAssignmentSchema>;
export declare const TaskCompletedSchema: z.ZodObject<{
    type: z.ZodLiteral<"task_completed">;
    taskId: z.ZodString;
    agentId: z.ZodString;
    timestamp: z.ZodNumber;
}, z.core.$strip>;
export type TaskCompleted = z.infer<typeof TaskCompletedSchema>;
export declare const IdleNotificationSchema: z.ZodObject<{
    type: z.ZodLiteral<"idle_notification">;
}, z.core.$strip>;
export type IdleNotification = z.infer<typeof IdleNotificationSchema>;
export declare const JoinRequestSchema: z.ZodObject<{
    type: z.ZodLiteral<"join_request">;
    agentName: z.ZodString;
    sessionId: z.ZodString;
}, z.core.$strip>;
export type JoinRequest = z.infer<typeof JoinRequestSchema>;
export declare const JoinApprovedSchema: z.ZodObject<{
    type: z.ZodLiteral<"join_approved">;
    agentName: z.ZodString;
    teamName: z.ZodString;
}, z.core.$strip>;
export type JoinApproved = z.infer<typeof JoinApprovedSchema>;
export declare const JoinRejectedSchema: z.ZodObject<{
    type: z.ZodLiteral<"join_rejected">;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type JoinRejected = z.infer<typeof JoinRejectedSchema>;
export declare const PlanApprovalRequestSchema: z.ZodObject<{
    type: z.ZodLiteral<"plan_approval_request">;
    requestId: z.ZodString;
    plan: z.ZodString;
    agentId: z.ZodString;
}, z.core.$strip>;
export type PlanApprovalRequest = z.infer<typeof PlanApprovalRequestSchema>;
export declare const PlanApprovalResponseSchema: z.ZodObject<{
    type: z.ZodLiteral<"plan_approval_response">;
    requestId: z.ZodString;
    decision: z.ZodEnum<{
        rejected: "rejected";
        approved: "approved";
    }>;
    feedback: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type PlanApprovalResponse = z.infer<typeof PlanApprovalResponseSchema>;
export declare const ModeSetRequestSchema: z.ZodObject<{
    type: z.ZodLiteral<"mode_set_request">;
    mode: z.ZodEnum<{
        default: "default";
        plan: "plan";
        acceptEdits: "acceptEdits";
        bypassPermissions: "bypassPermissions";
        delegate: "delegate";
        dontAsk: "dontAsk";
    }>;
}, z.core.$strip>;
export type ModeSetRequest = z.infer<typeof ModeSetRequestSchema>;
export declare const TeamPermissionUpdateSchema: z.ZodObject<{
    type: z.ZodLiteral<"team_permission_update">;
    permissions: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, z.core.$strip>;
export type TeamPermissionUpdate = z.infer<typeof TeamPermissionUpdateSchema>;
export declare const ProtocolMessageSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"permission_request">;
    requestId: z.ZodString;
    toolName: z.ZodString;
    input: z.ZodUnknown;
    agentId: z.ZodString;
    timestamp: z.ZodNumber;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"permission_response">;
    requestId: z.ZodString;
    decision: z.ZodEnum<{
        rejected: "rejected";
        approved: "approved";
    }>;
    updatedInput: z.ZodOptional<z.ZodUnknown>;
    feedback: z.ZodOptional<z.ZodString>;
    permissionUpdates: z.ZodOptional<z.ZodUnknown>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"shutdown_request">;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"shutdown_approved">;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"shutdown_rejected">;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"task_assignment">;
    taskId: z.ZodString;
    subject: z.ZodString;
    description: z.ZodString;
    assignedBy: z.ZodString;
    timestamp: z.ZodNumber;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"task_completed">;
    taskId: z.ZodString;
    agentId: z.ZodString;
    timestamp: z.ZodNumber;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"idle_notification">;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"join_request">;
    agentName: z.ZodString;
    sessionId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"join_approved">;
    agentName: z.ZodString;
    teamName: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"join_rejected">;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"plan_approval_request">;
    requestId: z.ZodString;
    plan: z.ZodString;
    agentId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"plan_approval_response">;
    requestId: z.ZodString;
    decision: z.ZodEnum<{
        rejected: "rejected";
        approved: "approved";
    }>;
    feedback: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"mode_set_request">;
    mode: z.ZodEnum<{
        default: "default";
        plan: "plan";
        acceptEdits: "acceptEdits";
        bypassPermissions: "bypassPermissions";
        delegate: "delegate";
        dontAsk: "dontAsk";
    }>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"team_permission_update">;
    permissions: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, z.core.$strip>], "type">;
export type ProtocolMessage = z.infer<typeof ProtocolMessageSchema>;
