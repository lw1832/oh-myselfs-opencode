import { z } from "zod";
export declare const TaskStatusSchema: z.ZodEnum<{
    pending: "pending";
    completed: "completed";
    in_progress: "in_progress";
}>;
export type TaskStatus = z.infer<typeof TaskStatusSchema>;
export declare const TaskSchema: z.ZodObject<{
    id: z.ZodString;
    subject: z.ZodString;
    description: z.ZodString;
    activeForm: z.ZodOptional<z.ZodString>;
    owner: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<{
        pending: "pending";
        completed: "completed";
        in_progress: "in_progress";
    }>;
    blocks: z.ZodArray<z.ZodString>;
    blockedBy: z.ZodArray<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export type Task = z.infer<typeof TaskSchema>;
export declare const TaskCreateInputSchema: z.ZodObject<{
    subject: z.ZodString;
    description: z.ZodString;
    activeForm: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export type TaskCreateInput = z.infer<typeof TaskCreateInputSchema>;
export declare const TaskUpdateInputSchema: z.ZodObject<{
    taskId: z.ZodString;
    subject: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    activeForm: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        pending: "pending";
        completed: "completed";
        in_progress: "in_progress";
        deleted: "deleted";
    }>>;
    addBlocks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    addBlockedBy: z.ZodOptional<z.ZodArray<z.ZodString>>;
    owner: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export type TaskUpdateInput = z.infer<typeof TaskUpdateInputSchema>;
