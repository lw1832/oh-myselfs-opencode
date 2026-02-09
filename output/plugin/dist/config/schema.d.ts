import { z } from "zod";
export declare const BuiltinAgentNameSchema: z.ZodEnum<{
    "multimodal-looker": "multimodal-looker";
    oracle: "oracle";
    librarian: "librarian";
    sisyphus: "sisyphus";
    prometheus: "prometheus";
    atlas: "atlas";
    metis: "metis";
    momus: "momus";
    explore: "explore";
}>;
export declare const BuiltinSkillNameSchema: z.ZodEnum<{
    playwright: "playwright";
    "agent-browser": "agent-browser";
    "frontend-ui-ux": "frontend-ui-ux";
    "git-master": "git-master";
}>;
export declare const OverridableAgentNameSchema: z.ZodEnum<{
    "multimodal-looker": "multimodal-looker";
    oracle: "oracle";
    librarian: "librarian";
    plan: "plan";
    sisyphus: "sisyphus";
    prometheus: "prometheus";
    atlas: "atlas";
    metis: "metis";
    momus: "momus";
    "sisyphus-junior": "sisyphus-junior";
    build: "build";
    explore: "explore";
    "OpenCode-Builder": "OpenCode-Builder";
}>;
export declare const AgentNameSchema: z.ZodEnum<{
    "multimodal-looker": "multimodal-looker";
    oracle: "oracle";
    librarian: "librarian";
    sisyphus: "sisyphus";
    prometheus: "prometheus";
    atlas: "atlas";
    metis: "metis";
    momus: "momus";
    explore: "explore";
}>;
export declare const HookNameSchema: z.ZodEnum<{
    atlas: "atlas";
    "anthropic-context-window-limit-recovery": "anthropic-context-window-limit-recovery";
    "todo-continuation-enforcer": "todo-continuation-enforcer";
    "context-window-monitor": "context-window-monitor";
    "session-recovery": "session-recovery";
    "session-notification": "session-notification";
    "comment-checker": "comment-checker";
    "grep-output-truncator": "grep-output-truncator";
    "tool-output-truncator": "tool-output-truncator";
    "directory-agents-injector": "directory-agents-injector";
    "directory-readme-injector": "directory-readme-injector";
    "empty-task-response-detector": "empty-task-response-detector";
    "think-mode": "think-mode";
    "rules-injector": "rules-injector";
    "background-notification": "background-notification";
    "auto-update-checker": "auto-update-checker";
    "startup-toast": "startup-toast";
    "keyword-detector": "keyword-detector";
    "agent-usage-reminder": "agent-usage-reminder";
    "non-interactive-env": "non-interactive-env";
    "interactive-bash-session": "interactive-bash-session";
    "thinking-block-validator": "thinking-block-validator";
    "ralph-loop": "ralph-loop";
    "category-skill-reminder": "category-skill-reminder";
    "compaction-context-injector": "compaction-context-injector";
    "claude-code-hooks": "claude-code-hooks";
    "auto-slash-command": "auto-slash-command";
    "edit-error-recovery": "edit-error-recovery";
    "delegate-task-retry": "delegate-task-retry";
    "prometheus-md-only": "prometheus-md-only";
    "sisyphus-junior-notepad": "sisyphus-junior-notepad";
    "start-work": "start-work";
    "unstable-agent-babysitter": "unstable-agent-babysitter";
    "stop-continuation-guard": "stop-continuation-guard";
}>;
export declare const BuiltinCommandNameSchema: z.ZodEnum<{
    "start-work": "start-work";
    "init-deep": "init-deep";
}>;
export declare const AgentOverrideConfigSchema: z.ZodObject<{
    model: z.ZodOptional<z.ZodString>;
    variant: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
    temperature: z.ZodOptional<z.ZodNumber>;
    top_p: z.ZodOptional<z.ZodNumber>;
    prompt: z.ZodOptional<z.ZodString>;
    prompt_append: z.ZodOptional<z.ZodString>;
    tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
    disable: z.ZodOptional<z.ZodBoolean>;
    description: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
        subagent: "subagent";
        primary: "primary";
        all: "all";
    }>>;
    color: z.ZodOptional<z.ZodString>;
    permission: z.ZodOptional<z.ZodObject<{
        edit: z.ZodOptional<z.ZodEnum<{
            allow: "allow";
            deny: "deny";
            ask: "ask";
        }>>;
        bash: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
            allow: "allow";
            deny: "deny";
            ask: "ask";
        }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
            allow: "allow";
            deny: "deny";
            ask: "ask";
        }>>]>>;
        webfetch: z.ZodOptional<z.ZodEnum<{
            allow: "allow";
            deny: "deny";
            ask: "ask";
        }>>;
        doom_loop: z.ZodOptional<z.ZodEnum<{
            allow: "allow";
            deny: "deny";
            ask: "ask";
        }>>;
        external_directory: z.ZodOptional<z.ZodEnum<{
            allow: "allow";
            deny: "deny";
            ask: "ask";
        }>>;
    }, z.core.$strip>>;
    maxTokens: z.ZodOptional<z.ZodNumber>;
    thinking: z.ZodOptional<z.ZodObject<{
        type: z.ZodEnum<{
            enabled: "enabled";
            disabled: "disabled";
        }>;
        budgetTokens: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    reasoningEffort: z.ZodOptional<z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
        xhigh: "xhigh";
    }>>;
    textVerbosity: z.ZodOptional<z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
    }>>;
    providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export declare const AgentOverridesSchema: z.ZodObject<{
    build: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
        temperature: z.ZodOptional<z.ZodNumber>;
        top_p: z.ZodOptional<z.ZodNumber>;
        prompt: z.ZodOptional<z.ZodString>;
        prompt_append: z.ZodOptional<z.ZodString>;
        tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
        disable: z.ZodOptional<z.ZodBoolean>;
        description: z.ZodOptional<z.ZodString>;
        mode: z.ZodOptional<z.ZodEnum<{
            subagent: "subagent";
            primary: "primary";
            all: "all";
        }>>;
        color: z.ZodOptional<z.ZodString>;
        permission: z.ZodOptional<z.ZodObject<{
            edit: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            bash: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>]>>;
            webfetch: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            doom_loop: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            external_directory: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
        }, z.core.$strip>>;
        maxTokens: z.ZodOptional<z.ZodNumber>;
        thinking: z.ZodOptional<z.ZodObject<{
            type: z.ZodEnum<{
                enabled: "enabled";
                disabled: "disabled";
            }>;
            budgetTokens: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        reasoningEffort: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
            xhigh: "xhigh";
        }>>;
        textVerbosity: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
        }>>;
        providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    plan: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
        temperature: z.ZodOptional<z.ZodNumber>;
        top_p: z.ZodOptional<z.ZodNumber>;
        prompt: z.ZodOptional<z.ZodString>;
        prompt_append: z.ZodOptional<z.ZodString>;
        tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
        disable: z.ZodOptional<z.ZodBoolean>;
        description: z.ZodOptional<z.ZodString>;
        mode: z.ZodOptional<z.ZodEnum<{
            subagent: "subagent";
            primary: "primary";
            all: "all";
        }>>;
        color: z.ZodOptional<z.ZodString>;
        permission: z.ZodOptional<z.ZodObject<{
            edit: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            bash: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>]>>;
            webfetch: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            doom_loop: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            external_directory: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
        }, z.core.$strip>>;
        maxTokens: z.ZodOptional<z.ZodNumber>;
        thinking: z.ZodOptional<z.ZodObject<{
            type: z.ZodEnum<{
                enabled: "enabled";
                disabled: "disabled";
            }>;
            budgetTokens: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        reasoningEffort: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
            xhigh: "xhigh";
        }>>;
        textVerbosity: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
        }>>;
        providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    sisyphus: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
        temperature: z.ZodOptional<z.ZodNumber>;
        top_p: z.ZodOptional<z.ZodNumber>;
        prompt: z.ZodOptional<z.ZodString>;
        prompt_append: z.ZodOptional<z.ZodString>;
        tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
        disable: z.ZodOptional<z.ZodBoolean>;
        description: z.ZodOptional<z.ZodString>;
        mode: z.ZodOptional<z.ZodEnum<{
            subagent: "subagent";
            primary: "primary";
            all: "all";
        }>>;
        color: z.ZodOptional<z.ZodString>;
        permission: z.ZodOptional<z.ZodObject<{
            edit: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            bash: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>]>>;
            webfetch: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            doom_loop: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            external_directory: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
        }, z.core.$strip>>;
        maxTokens: z.ZodOptional<z.ZodNumber>;
        thinking: z.ZodOptional<z.ZodObject<{
            type: z.ZodEnum<{
                enabled: "enabled";
                disabled: "disabled";
            }>;
            budgetTokens: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        reasoningEffort: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
            xhigh: "xhigh";
        }>>;
        textVerbosity: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
        }>>;
        providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    "sisyphus-junior": z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
        temperature: z.ZodOptional<z.ZodNumber>;
        top_p: z.ZodOptional<z.ZodNumber>;
        prompt: z.ZodOptional<z.ZodString>;
        prompt_append: z.ZodOptional<z.ZodString>;
        tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
        disable: z.ZodOptional<z.ZodBoolean>;
        description: z.ZodOptional<z.ZodString>;
        mode: z.ZodOptional<z.ZodEnum<{
            subagent: "subagent";
            primary: "primary";
            all: "all";
        }>>;
        color: z.ZodOptional<z.ZodString>;
        permission: z.ZodOptional<z.ZodObject<{
            edit: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            bash: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>]>>;
            webfetch: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            doom_loop: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            external_directory: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
        }, z.core.$strip>>;
        maxTokens: z.ZodOptional<z.ZodNumber>;
        thinking: z.ZodOptional<z.ZodObject<{
            type: z.ZodEnum<{
                enabled: "enabled";
                disabled: "disabled";
            }>;
            budgetTokens: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        reasoningEffort: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
            xhigh: "xhigh";
        }>>;
        textVerbosity: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
        }>>;
        providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    "OpenCode-Builder": z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
        temperature: z.ZodOptional<z.ZodNumber>;
        top_p: z.ZodOptional<z.ZodNumber>;
        prompt: z.ZodOptional<z.ZodString>;
        prompt_append: z.ZodOptional<z.ZodString>;
        tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
        disable: z.ZodOptional<z.ZodBoolean>;
        description: z.ZodOptional<z.ZodString>;
        mode: z.ZodOptional<z.ZodEnum<{
            subagent: "subagent";
            primary: "primary";
            all: "all";
        }>>;
        color: z.ZodOptional<z.ZodString>;
        permission: z.ZodOptional<z.ZodObject<{
            edit: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            bash: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>]>>;
            webfetch: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            doom_loop: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            external_directory: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
        }, z.core.$strip>>;
        maxTokens: z.ZodOptional<z.ZodNumber>;
        thinking: z.ZodOptional<z.ZodObject<{
            type: z.ZodEnum<{
                enabled: "enabled";
                disabled: "disabled";
            }>;
            budgetTokens: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        reasoningEffort: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
            xhigh: "xhigh";
        }>>;
        textVerbosity: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
        }>>;
        providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    prometheus: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
        temperature: z.ZodOptional<z.ZodNumber>;
        top_p: z.ZodOptional<z.ZodNumber>;
        prompt: z.ZodOptional<z.ZodString>;
        prompt_append: z.ZodOptional<z.ZodString>;
        tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
        disable: z.ZodOptional<z.ZodBoolean>;
        description: z.ZodOptional<z.ZodString>;
        mode: z.ZodOptional<z.ZodEnum<{
            subagent: "subagent";
            primary: "primary";
            all: "all";
        }>>;
        color: z.ZodOptional<z.ZodString>;
        permission: z.ZodOptional<z.ZodObject<{
            edit: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            bash: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>]>>;
            webfetch: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            doom_loop: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            external_directory: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
        }, z.core.$strip>>;
        maxTokens: z.ZodOptional<z.ZodNumber>;
        thinking: z.ZodOptional<z.ZodObject<{
            type: z.ZodEnum<{
                enabled: "enabled";
                disabled: "disabled";
            }>;
            budgetTokens: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        reasoningEffort: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
            xhigh: "xhigh";
        }>>;
        textVerbosity: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
        }>>;
        providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    metis: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
        temperature: z.ZodOptional<z.ZodNumber>;
        top_p: z.ZodOptional<z.ZodNumber>;
        prompt: z.ZodOptional<z.ZodString>;
        prompt_append: z.ZodOptional<z.ZodString>;
        tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
        disable: z.ZodOptional<z.ZodBoolean>;
        description: z.ZodOptional<z.ZodString>;
        mode: z.ZodOptional<z.ZodEnum<{
            subagent: "subagent";
            primary: "primary";
            all: "all";
        }>>;
        color: z.ZodOptional<z.ZodString>;
        permission: z.ZodOptional<z.ZodObject<{
            edit: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            bash: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>]>>;
            webfetch: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            doom_loop: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            external_directory: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
        }, z.core.$strip>>;
        maxTokens: z.ZodOptional<z.ZodNumber>;
        thinking: z.ZodOptional<z.ZodObject<{
            type: z.ZodEnum<{
                enabled: "enabled";
                disabled: "disabled";
            }>;
            budgetTokens: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        reasoningEffort: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
            xhigh: "xhigh";
        }>>;
        textVerbosity: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
        }>>;
        providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    momus: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
        temperature: z.ZodOptional<z.ZodNumber>;
        top_p: z.ZodOptional<z.ZodNumber>;
        prompt: z.ZodOptional<z.ZodString>;
        prompt_append: z.ZodOptional<z.ZodString>;
        tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
        disable: z.ZodOptional<z.ZodBoolean>;
        description: z.ZodOptional<z.ZodString>;
        mode: z.ZodOptional<z.ZodEnum<{
            subagent: "subagent";
            primary: "primary";
            all: "all";
        }>>;
        color: z.ZodOptional<z.ZodString>;
        permission: z.ZodOptional<z.ZodObject<{
            edit: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            bash: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>]>>;
            webfetch: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            doom_loop: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            external_directory: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
        }, z.core.$strip>>;
        maxTokens: z.ZodOptional<z.ZodNumber>;
        thinking: z.ZodOptional<z.ZodObject<{
            type: z.ZodEnum<{
                enabled: "enabled";
                disabled: "disabled";
            }>;
            budgetTokens: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        reasoningEffort: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
            xhigh: "xhigh";
        }>>;
        textVerbosity: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
        }>>;
        providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    oracle: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
        temperature: z.ZodOptional<z.ZodNumber>;
        top_p: z.ZodOptional<z.ZodNumber>;
        prompt: z.ZodOptional<z.ZodString>;
        prompt_append: z.ZodOptional<z.ZodString>;
        tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
        disable: z.ZodOptional<z.ZodBoolean>;
        description: z.ZodOptional<z.ZodString>;
        mode: z.ZodOptional<z.ZodEnum<{
            subagent: "subagent";
            primary: "primary";
            all: "all";
        }>>;
        color: z.ZodOptional<z.ZodString>;
        permission: z.ZodOptional<z.ZodObject<{
            edit: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            bash: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>]>>;
            webfetch: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            doom_loop: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            external_directory: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
        }, z.core.$strip>>;
        maxTokens: z.ZodOptional<z.ZodNumber>;
        thinking: z.ZodOptional<z.ZodObject<{
            type: z.ZodEnum<{
                enabled: "enabled";
                disabled: "disabled";
            }>;
            budgetTokens: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        reasoningEffort: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
            xhigh: "xhigh";
        }>>;
        textVerbosity: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
        }>>;
        providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    librarian: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
        temperature: z.ZodOptional<z.ZodNumber>;
        top_p: z.ZodOptional<z.ZodNumber>;
        prompt: z.ZodOptional<z.ZodString>;
        prompt_append: z.ZodOptional<z.ZodString>;
        tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
        disable: z.ZodOptional<z.ZodBoolean>;
        description: z.ZodOptional<z.ZodString>;
        mode: z.ZodOptional<z.ZodEnum<{
            subagent: "subagent";
            primary: "primary";
            all: "all";
        }>>;
        color: z.ZodOptional<z.ZodString>;
        permission: z.ZodOptional<z.ZodObject<{
            edit: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            bash: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>]>>;
            webfetch: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            doom_loop: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            external_directory: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
        }, z.core.$strip>>;
        maxTokens: z.ZodOptional<z.ZodNumber>;
        thinking: z.ZodOptional<z.ZodObject<{
            type: z.ZodEnum<{
                enabled: "enabled";
                disabled: "disabled";
            }>;
            budgetTokens: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        reasoningEffort: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
            xhigh: "xhigh";
        }>>;
        textVerbosity: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
        }>>;
        providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    explore: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
        temperature: z.ZodOptional<z.ZodNumber>;
        top_p: z.ZodOptional<z.ZodNumber>;
        prompt: z.ZodOptional<z.ZodString>;
        prompt_append: z.ZodOptional<z.ZodString>;
        tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
        disable: z.ZodOptional<z.ZodBoolean>;
        description: z.ZodOptional<z.ZodString>;
        mode: z.ZodOptional<z.ZodEnum<{
            subagent: "subagent";
            primary: "primary";
            all: "all";
        }>>;
        color: z.ZodOptional<z.ZodString>;
        permission: z.ZodOptional<z.ZodObject<{
            edit: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            bash: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>]>>;
            webfetch: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            doom_loop: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            external_directory: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
        }, z.core.$strip>>;
        maxTokens: z.ZodOptional<z.ZodNumber>;
        thinking: z.ZodOptional<z.ZodObject<{
            type: z.ZodEnum<{
                enabled: "enabled";
                disabled: "disabled";
            }>;
            budgetTokens: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        reasoningEffort: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
            xhigh: "xhigh";
        }>>;
        textVerbosity: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
        }>>;
        providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    "multimodal-looker": z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
        temperature: z.ZodOptional<z.ZodNumber>;
        top_p: z.ZodOptional<z.ZodNumber>;
        prompt: z.ZodOptional<z.ZodString>;
        prompt_append: z.ZodOptional<z.ZodString>;
        tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
        disable: z.ZodOptional<z.ZodBoolean>;
        description: z.ZodOptional<z.ZodString>;
        mode: z.ZodOptional<z.ZodEnum<{
            subagent: "subagent";
            primary: "primary";
            all: "all";
        }>>;
        color: z.ZodOptional<z.ZodString>;
        permission: z.ZodOptional<z.ZodObject<{
            edit: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            bash: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>]>>;
            webfetch: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            doom_loop: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            external_directory: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
        }, z.core.$strip>>;
        maxTokens: z.ZodOptional<z.ZodNumber>;
        thinking: z.ZodOptional<z.ZodObject<{
            type: z.ZodEnum<{
                enabled: "enabled";
                disabled: "disabled";
            }>;
            budgetTokens: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        reasoningEffort: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
            xhigh: "xhigh";
        }>>;
        textVerbosity: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
        }>>;
        providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    atlas: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
        temperature: z.ZodOptional<z.ZodNumber>;
        top_p: z.ZodOptional<z.ZodNumber>;
        prompt: z.ZodOptional<z.ZodString>;
        prompt_append: z.ZodOptional<z.ZodString>;
        tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
        disable: z.ZodOptional<z.ZodBoolean>;
        description: z.ZodOptional<z.ZodString>;
        mode: z.ZodOptional<z.ZodEnum<{
            subagent: "subagent";
            primary: "primary";
            all: "all";
        }>>;
        color: z.ZodOptional<z.ZodString>;
        permission: z.ZodOptional<z.ZodObject<{
            edit: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            bash: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>]>>;
            webfetch: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            doom_loop: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
            external_directory: z.ZodOptional<z.ZodEnum<{
                allow: "allow";
                deny: "deny";
                ask: "ask";
            }>>;
        }, z.core.$strip>>;
        maxTokens: z.ZodOptional<z.ZodNumber>;
        thinking: z.ZodOptional<z.ZodObject<{
            type: z.ZodEnum<{
                enabled: "enabled";
                disabled: "disabled";
            }>;
            budgetTokens: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        reasoningEffort: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
            xhigh: "xhigh";
        }>>;
        textVerbosity: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
        }>>;
        providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const ClaudeCodeConfigSchema: z.ZodObject<{
    mcp: z.ZodOptional<z.ZodBoolean>;
    commands: z.ZodOptional<z.ZodBoolean>;
    skills: z.ZodOptional<z.ZodBoolean>;
    agents: z.ZodOptional<z.ZodBoolean>;
    hooks: z.ZodOptional<z.ZodBoolean>;
    plugins: z.ZodOptional<z.ZodBoolean>;
    plugins_override: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
}, z.core.$strip>;
export declare const SisyphusAgentConfigSchema: z.ZodObject<{
    disabled: z.ZodOptional<z.ZodBoolean>;
    default_builder_enabled: z.ZodOptional<z.ZodBoolean>;
    planner_enabled: z.ZodOptional<z.ZodBoolean>;
    replace_plan: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const CategoryConfigSchema: z.ZodObject<{
    description: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    variant: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    top_p: z.ZodOptional<z.ZodNumber>;
    maxTokens: z.ZodOptional<z.ZodNumber>;
    thinking: z.ZodOptional<z.ZodObject<{
        type: z.ZodEnum<{
            enabled: "enabled";
            disabled: "disabled";
        }>;
        budgetTokens: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    reasoningEffort: z.ZodOptional<z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
        xhigh: "xhigh";
    }>>;
    textVerbosity: z.ZodOptional<z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
    }>>;
    tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
    prompt_append: z.ZodOptional<z.ZodString>;
    is_unstable_agent: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const BuiltinCategoryNameSchema: z.ZodEnum<{
    "visual-engineering": "visual-engineering";
    writing: "writing";
    ultrabrain: "ultrabrain";
    quick: "quick";
    "unspecified-high": "unspecified-high";
    "unspecified-low": "unspecified-low";
    deep: "deep";
    artistry: "artistry";
}>;
export declare const CategoriesConfigSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    description: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    variant: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    top_p: z.ZodOptional<z.ZodNumber>;
    maxTokens: z.ZodOptional<z.ZodNumber>;
    thinking: z.ZodOptional<z.ZodObject<{
        type: z.ZodEnum<{
            enabled: "enabled";
            disabled: "disabled";
        }>;
        budgetTokens: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    reasoningEffort: z.ZodOptional<z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
        xhigh: "xhigh";
    }>>;
    textVerbosity: z.ZodOptional<z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
    }>>;
    tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
    prompt_append: z.ZodOptional<z.ZodString>;
    is_unstable_agent: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>>;
export declare const CommentCheckerConfigSchema: z.ZodObject<{
    custom_prompt: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const DynamicContextPruningConfigSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    notification: z.ZodDefault<z.ZodEnum<{
        off: "off";
        minimal: "minimal";
        detailed: "detailed";
    }>>;
    turn_protection: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        turns: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
    protected_tools: z.ZodDefault<z.ZodArray<z.ZodString>>;
    strategies: z.ZodOptional<z.ZodObject<{
        deduplication: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>>;
        supersede_writes: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            aggressive: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>>;
        purge_errors: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            turns: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const ExperimentalConfigSchema: z.ZodObject<{
    aggressive_truncation: z.ZodOptional<z.ZodBoolean>;
    auto_resume: z.ZodOptional<z.ZodBoolean>;
    truncate_all_tool_outputs: z.ZodOptional<z.ZodBoolean>;
    dynamic_context_pruning: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        notification: z.ZodDefault<z.ZodEnum<{
            off: "off";
            minimal: "minimal";
            detailed: "detailed";
        }>>;
        turn_protection: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            turns: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strip>>;
        protected_tools: z.ZodDefault<z.ZodArray<z.ZodString>>;
        strategies: z.ZodOptional<z.ZodObject<{
            deduplication: z.ZodOptional<z.ZodObject<{
                enabled: z.ZodDefault<z.ZodBoolean>;
            }, z.core.$strip>>;
            supersede_writes: z.ZodOptional<z.ZodObject<{
                enabled: z.ZodDefault<z.ZodBoolean>;
                aggressive: z.ZodDefault<z.ZodBoolean>;
            }, z.core.$strip>>;
            purge_errors: z.ZodOptional<z.ZodObject<{
                enabled: z.ZodDefault<z.ZodBoolean>;
                turns: z.ZodDefault<z.ZodNumber>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    disable_model_list_fetch: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const SkillSourceSchema: z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
    path: z.ZodString;
    recursive: z.ZodOptional<z.ZodBoolean>;
    glob: z.ZodOptional<z.ZodString>;
}, z.core.$strip>]>;
export declare const SkillDefinitionSchema: z.ZodObject<{
    description: z.ZodOptional<z.ZodString>;
    template: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    agent: z.ZodOptional<z.ZodString>;
    subtask: z.ZodOptional<z.ZodBoolean>;
    "argument-hint": z.ZodOptional<z.ZodString>;
    license: z.ZodOptional<z.ZodString>;
    compatibility: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    "allowed-tools": z.ZodOptional<z.ZodArray<z.ZodString>>;
    disable: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const SkillEntrySchema: z.ZodUnion<readonly [z.ZodBoolean, z.ZodObject<{
    description: z.ZodOptional<z.ZodString>;
    template: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    agent: z.ZodOptional<z.ZodString>;
    subtask: z.ZodOptional<z.ZodBoolean>;
    "argument-hint": z.ZodOptional<z.ZodString>;
    license: z.ZodOptional<z.ZodString>;
    compatibility: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    "allowed-tools": z.ZodOptional<z.ZodArray<z.ZodString>>;
    disable: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>]>;
export declare const SkillsConfigSchema: z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodBoolean, z.ZodObject<{
    description: z.ZodOptional<z.ZodString>;
    template: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    agent: z.ZodOptional<z.ZodString>;
    subtask: z.ZodOptional<z.ZodBoolean>;
    "argument-hint": z.ZodOptional<z.ZodString>;
    license: z.ZodOptional<z.ZodString>;
    compatibility: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    "allowed-tools": z.ZodOptional<z.ZodArray<z.ZodString>>;
    disable: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>]>>, z.ZodObject<{
    sources: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        path: z.ZodString;
        recursive: z.ZodOptional<z.ZodBoolean>;
        glob: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>]>>>>;
    enable: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    disable: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
}, z.core.$strip>>]>;
export declare const RalphLoopConfigSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    default_max_iterations: z.ZodDefault<z.ZodNumber>;
    state_dir: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const BackgroundTaskConfigSchema: z.ZodObject<{
    defaultConcurrency: z.ZodOptional<z.ZodNumber>;
    providerConcurrency: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    modelConcurrency: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    staleTimeoutMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const NotificationConfigSchema: z.ZodObject<{
    force_enable: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const BabysittingConfigSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    timeout_ms: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const GitMasterConfigSchema: z.ZodObject<{
    commit_footer: z.ZodDefault<z.ZodBoolean>;
    include_co_authored_by: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const BrowserAutomationProviderSchema: z.ZodEnum<{
    playwright: "playwright";
    "agent-browser": "agent-browser";
    "dev-browser": "dev-browser";
}>;
export declare const BrowserAutomationConfigSchema: z.ZodObject<{
    provider: z.ZodDefault<z.ZodEnum<{
        playwright: "playwright";
        "agent-browser": "agent-browser";
        "dev-browser": "dev-browser";
    }>>;
}, z.core.$strip>;
export declare const TmuxLayoutSchema: z.ZodEnum<{
    "main-horizontal": "main-horizontal";
    "main-vertical": "main-vertical";
    tiled: "tiled";
    "even-horizontal": "even-horizontal";
    "even-vertical": "even-vertical";
}>;
export declare const TmuxConfigSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    layout: z.ZodDefault<z.ZodEnum<{
        "main-horizontal": "main-horizontal";
        "main-vertical": "main-vertical";
        tiled: "tiled";
        "even-horizontal": "even-horizontal";
        "even-vertical": "even-vertical";
    }>>;
    main_pane_size: z.ZodDefault<z.ZodNumber>;
    main_pane_min_width: z.ZodDefault<z.ZodNumber>;
    agent_pane_min_width: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const SisyphusTasksConfigSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    storage_path: z.ZodDefault<z.ZodString>;
    claude_code_compat: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const SisyphusSwarmConfigSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    storage_path: z.ZodDefault<z.ZodString>;
    ui_mode: z.ZodDefault<z.ZodEnum<{
        toast: "toast";
        tmux: "tmux";
        both: "both";
    }>>;
}, z.core.$strip>;
export declare const SisyphusConfigSchema: z.ZodObject<{
    tasks: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        storage_path: z.ZodDefault<z.ZodString>;
        claude_code_compat: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
    swarm: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        storage_path: z.ZodDefault<z.ZodString>;
        ui_mode: z.ZodDefault<z.ZodEnum<{
            toast: "toast";
            tmux: "tmux";
            both: "both";
        }>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const OhMyOpenCodeConfigSchema: z.ZodObject<{
    $schema: z.ZodOptional<z.ZodString>;
    disabled_mcps: z.ZodOptional<z.ZodArray<z.ZodString>>;
    disabled_agents: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        "multimodal-looker": "multimodal-looker";
        oracle: "oracle";
        librarian: "librarian";
        sisyphus: "sisyphus";
        prometheus: "prometheus";
        atlas: "atlas";
        metis: "metis";
        momus: "momus";
        explore: "explore";
    }>>>;
    disabled_skills: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        playwright: "playwright";
        "agent-browser": "agent-browser";
        "frontend-ui-ux": "frontend-ui-ux";
        "git-master": "git-master";
    }>>>;
    disabled_hooks: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        atlas: "atlas";
        "anthropic-context-window-limit-recovery": "anthropic-context-window-limit-recovery";
        "todo-continuation-enforcer": "todo-continuation-enforcer";
        "context-window-monitor": "context-window-monitor";
        "session-recovery": "session-recovery";
        "session-notification": "session-notification";
        "comment-checker": "comment-checker";
        "grep-output-truncator": "grep-output-truncator";
        "tool-output-truncator": "tool-output-truncator";
        "directory-agents-injector": "directory-agents-injector";
        "directory-readme-injector": "directory-readme-injector";
        "empty-task-response-detector": "empty-task-response-detector";
        "think-mode": "think-mode";
        "rules-injector": "rules-injector";
        "background-notification": "background-notification";
        "auto-update-checker": "auto-update-checker";
        "startup-toast": "startup-toast";
        "keyword-detector": "keyword-detector";
        "agent-usage-reminder": "agent-usage-reminder";
        "non-interactive-env": "non-interactive-env";
        "interactive-bash-session": "interactive-bash-session";
        "thinking-block-validator": "thinking-block-validator";
        "ralph-loop": "ralph-loop";
        "category-skill-reminder": "category-skill-reminder";
        "compaction-context-injector": "compaction-context-injector";
        "claude-code-hooks": "claude-code-hooks";
        "auto-slash-command": "auto-slash-command";
        "edit-error-recovery": "edit-error-recovery";
        "delegate-task-retry": "delegate-task-retry";
        "prometheus-md-only": "prometheus-md-only";
        "sisyphus-junior-notepad": "sisyphus-junior-notepad";
        "start-work": "start-work";
        "unstable-agent-babysitter": "unstable-agent-babysitter";
        "stop-continuation-guard": "stop-continuation-guard";
    }>>>;
    disabled_commands: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        "start-work": "start-work";
        "init-deep": "init-deep";
    }>>>;
    agents: z.ZodOptional<z.ZodObject<{
        build: z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            variant: z.ZodOptional<z.ZodString>;
            category: z.ZodOptional<z.ZodString>;
            skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
            temperature: z.ZodOptional<z.ZodNumber>;
            top_p: z.ZodOptional<z.ZodNumber>;
            prompt: z.ZodOptional<z.ZodString>;
            prompt_append: z.ZodOptional<z.ZodString>;
            tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
            disable: z.ZodOptional<z.ZodBoolean>;
            description: z.ZodOptional<z.ZodString>;
            mode: z.ZodOptional<z.ZodEnum<{
                subagent: "subagent";
                primary: "primary";
                all: "all";
            }>>;
            color: z.ZodOptional<z.ZodString>;
            permission: z.ZodOptional<z.ZodObject<{
                edit: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                bash: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>]>>;
                webfetch: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                doom_loop: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                external_directory: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
            }, z.core.$strip>>;
            maxTokens: z.ZodOptional<z.ZodNumber>;
            thinking: z.ZodOptional<z.ZodObject<{
                type: z.ZodEnum<{
                    enabled: "enabled";
                    disabled: "disabled";
                }>;
                budgetTokens: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            reasoningEffort: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
                xhigh: "xhigh";
            }>>;
            textVerbosity: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
            }>>;
            providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>>;
        plan: z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            variant: z.ZodOptional<z.ZodString>;
            category: z.ZodOptional<z.ZodString>;
            skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
            temperature: z.ZodOptional<z.ZodNumber>;
            top_p: z.ZodOptional<z.ZodNumber>;
            prompt: z.ZodOptional<z.ZodString>;
            prompt_append: z.ZodOptional<z.ZodString>;
            tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
            disable: z.ZodOptional<z.ZodBoolean>;
            description: z.ZodOptional<z.ZodString>;
            mode: z.ZodOptional<z.ZodEnum<{
                subagent: "subagent";
                primary: "primary";
                all: "all";
            }>>;
            color: z.ZodOptional<z.ZodString>;
            permission: z.ZodOptional<z.ZodObject<{
                edit: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                bash: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>]>>;
                webfetch: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                doom_loop: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                external_directory: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
            }, z.core.$strip>>;
            maxTokens: z.ZodOptional<z.ZodNumber>;
            thinking: z.ZodOptional<z.ZodObject<{
                type: z.ZodEnum<{
                    enabled: "enabled";
                    disabled: "disabled";
                }>;
                budgetTokens: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            reasoningEffort: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
                xhigh: "xhigh";
            }>>;
            textVerbosity: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
            }>>;
            providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>>;
        sisyphus: z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            variant: z.ZodOptional<z.ZodString>;
            category: z.ZodOptional<z.ZodString>;
            skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
            temperature: z.ZodOptional<z.ZodNumber>;
            top_p: z.ZodOptional<z.ZodNumber>;
            prompt: z.ZodOptional<z.ZodString>;
            prompt_append: z.ZodOptional<z.ZodString>;
            tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
            disable: z.ZodOptional<z.ZodBoolean>;
            description: z.ZodOptional<z.ZodString>;
            mode: z.ZodOptional<z.ZodEnum<{
                subagent: "subagent";
                primary: "primary";
                all: "all";
            }>>;
            color: z.ZodOptional<z.ZodString>;
            permission: z.ZodOptional<z.ZodObject<{
                edit: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                bash: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>]>>;
                webfetch: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                doom_loop: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                external_directory: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
            }, z.core.$strip>>;
            maxTokens: z.ZodOptional<z.ZodNumber>;
            thinking: z.ZodOptional<z.ZodObject<{
                type: z.ZodEnum<{
                    enabled: "enabled";
                    disabled: "disabled";
                }>;
                budgetTokens: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            reasoningEffort: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
                xhigh: "xhigh";
            }>>;
            textVerbosity: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
            }>>;
            providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>>;
        "sisyphus-junior": z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            variant: z.ZodOptional<z.ZodString>;
            category: z.ZodOptional<z.ZodString>;
            skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
            temperature: z.ZodOptional<z.ZodNumber>;
            top_p: z.ZodOptional<z.ZodNumber>;
            prompt: z.ZodOptional<z.ZodString>;
            prompt_append: z.ZodOptional<z.ZodString>;
            tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
            disable: z.ZodOptional<z.ZodBoolean>;
            description: z.ZodOptional<z.ZodString>;
            mode: z.ZodOptional<z.ZodEnum<{
                subagent: "subagent";
                primary: "primary";
                all: "all";
            }>>;
            color: z.ZodOptional<z.ZodString>;
            permission: z.ZodOptional<z.ZodObject<{
                edit: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                bash: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>]>>;
                webfetch: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                doom_loop: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                external_directory: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
            }, z.core.$strip>>;
            maxTokens: z.ZodOptional<z.ZodNumber>;
            thinking: z.ZodOptional<z.ZodObject<{
                type: z.ZodEnum<{
                    enabled: "enabled";
                    disabled: "disabled";
                }>;
                budgetTokens: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            reasoningEffort: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
                xhigh: "xhigh";
            }>>;
            textVerbosity: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
            }>>;
            providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>>;
        "OpenCode-Builder": z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            variant: z.ZodOptional<z.ZodString>;
            category: z.ZodOptional<z.ZodString>;
            skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
            temperature: z.ZodOptional<z.ZodNumber>;
            top_p: z.ZodOptional<z.ZodNumber>;
            prompt: z.ZodOptional<z.ZodString>;
            prompt_append: z.ZodOptional<z.ZodString>;
            tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
            disable: z.ZodOptional<z.ZodBoolean>;
            description: z.ZodOptional<z.ZodString>;
            mode: z.ZodOptional<z.ZodEnum<{
                subagent: "subagent";
                primary: "primary";
                all: "all";
            }>>;
            color: z.ZodOptional<z.ZodString>;
            permission: z.ZodOptional<z.ZodObject<{
                edit: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                bash: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>]>>;
                webfetch: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                doom_loop: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                external_directory: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
            }, z.core.$strip>>;
            maxTokens: z.ZodOptional<z.ZodNumber>;
            thinking: z.ZodOptional<z.ZodObject<{
                type: z.ZodEnum<{
                    enabled: "enabled";
                    disabled: "disabled";
                }>;
                budgetTokens: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            reasoningEffort: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
                xhigh: "xhigh";
            }>>;
            textVerbosity: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
            }>>;
            providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>>;
        prometheus: z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            variant: z.ZodOptional<z.ZodString>;
            category: z.ZodOptional<z.ZodString>;
            skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
            temperature: z.ZodOptional<z.ZodNumber>;
            top_p: z.ZodOptional<z.ZodNumber>;
            prompt: z.ZodOptional<z.ZodString>;
            prompt_append: z.ZodOptional<z.ZodString>;
            tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
            disable: z.ZodOptional<z.ZodBoolean>;
            description: z.ZodOptional<z.ZodString>;
            mode: z.ZodOptional<z.ZodEnum<{
                subagent: "subagent";
                primary: "primary";
                all: "all";
            }>>;
            color: z.ZodOptional<z.ZodString>;
            permission: z.ZodOptional<z.ZodObject<{
                edit: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                bash: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>]>>;
                webfetch: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                doom_loop: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                external_directory: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
            }, z.core.$strip>>;
            maxTokens: z.ZodOptional<z.ZodNumber>;
            thinking: z.ZodOptional<z.ZodObject<{
                type: z.ZodEnum<{
                    enabled: "enabled";
                    disabled: "disabled";
                }>;
                budgetTokens: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            reasoningEffort: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
                xhigh: "xhigh";
            }>>;
            textVerbosity: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
            }>>;
            providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>>;
        metis: z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            variant: z.ZodOptional<z.ZodString>;
            category: z.ZodOptional<z.ZodString>;
            skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
            temperature: z.ZodOptional<z.ZodNumber>;
            top_p: z.ZodOptional<z.ZodNumber>;
            prompt: z.ZodOptional<z.ZodString>;
            prompt_append: z.ZodOptional<z.ZodString>;
            tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
            disable: z.ZodOptional<z.ZodBoolean>;
            description: z.ZodOptional<z.ZodString>;
            mode: z.ZodOptional<z.ZodEnum<{
                subagent: "subagent";
                primary: "primary";
                all: "all";
            }>>;
            color: z.ZodOptional<z.ZodString>;
            permission: z.ZodOptional<z.ZodObject<{
                edit: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                bash: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>]>>;
                webfetch: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                doom_loop: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                external_directory: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
            }, z.core.$strip>>;
            maxTokens: z.ZodOptional<z.ZodNumber>;
            thinking: z.ZodOptional<z.ZodObject<{
                type: z.ZodEnum<{
                    enabled: "enabled";
                    disabled: "disabled";
                }>;
                budgetTokens: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            reasoningEffort: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
                xhigh: "xhigh";
            }>>;
            textVerbosity: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
            }>>;
            providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>>;
        momus: z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            variant: z.ZodOptional<z.ZodString>;
            category: z.ZodOptional<z.ZodString>;
            skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
            temperature: z.ZodOptional<z.ZodNumber>;
            top_p: z.ZodOptional<z.ZodNumber>;
            prompt: z.ZodOptional<z.ZodString>;
            prompt_append: z.ZodOptional<z.ZodString>;
            tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
            disable: z.ZodOptional<z.ZodBoolean>;
            description: z.ZodOptional<z.ZodString>;
            mode: z.ZodOptional<z.ZodEnum<{
                subagent: "subagent";
                primary: "primary";
                all: "all";
            }>>;
            color: z.ZodOptional<z.ZodString>;
            permission: z.ZodOptional<z.ZodObject<{
                edit: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                bash: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>]>>;
                webfetch: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                doom_loop: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                external_directory: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
            }, z.core.$strip>>;
            maxTokens: z.ZodOptional<z.ZodNumber>;
            thinking: z.ZodOptional<z.ZodObject<{
                type: z.ZodEnum<{
                    enabled: "enabled";
                    disabled: "disabled";
                }>;
                budgetTokens: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            reasoningEffort: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
                xhigh: "xhigh";
            }>>;
            textVerbosity: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
            }>>;
            providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>>;
        oracle: z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            variant: z.ZodOptional<z.ZodString>;
            category: z.ZodOptional<z.ZodString>;
            skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
            temperature: z.ZodOptional<z.ZodNumber>;
            top_p: z.ZodOptional<z.ZodNumber>;
            prompt: z.ZodOptional<z.ZodString>;
            prompt_append: z.ZodOptional<z.ZodString>;
            tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
            disable: z.ZodOptional<z.ZodBoolean>;
            description: z.ZodOptional<z.ZodString>;
            mode: z.ZodOptional<z.ZodEnum<{
                subagent: "subagent";
                primary: "primary";
                all: "all";
            }>>;
            color: z.ZodOptional<z.ZodString>;
            permission: z.ZodOptional<z.ZodObject<{
                edit: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                bash: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>]>>;
                webfetch: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                doom_loop: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                external_directory: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
            }, z.core.$strip>>;
            maxTokens: z.ZodOptional<z.ZodNumber>;
            thinking: z.ZodOptional<z.ZodObject<{
                type: z.ZodEnum<{
                    enabled: "enabled";
                    disabled: "disabled";
                }>;
                budgetTokens: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            reasoningEffort: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
                xhigh: "xhigh";
            }>>;
            textVerbosity: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
            }>>;
            providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>>;
        librarian: z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            variant: z.ZodOptional<z.ZodString>;
            category: z.ZodOptional<z.ZodString>;
            skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
            temperature: z.ZodOptional<z.ZodNumber>;
            top_p: z.ZodOptional<z.ZodNumber>;
            prompt: z.ZodOptional<z.ZodString>;
            prompt_append: z.ZodOptional<z.ZodString>;
            tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
            disable: z.ZodOptional<z.ZodBoolean>;
            description: z.ZodOptional<z.ZodString>;
            mode: z.ZodOptional<z.ZodEnum<{
                subagent: "subagent";
                primary: "primary";
                all: "all";
            }>>;
            color: z.ZodOptional<z.ZodString>;
            permission: z.ZodOptional<z.ZodObject<{
                edit: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                bash: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>]>>;
                webfetch: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                doom_loop: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                external_directory: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
            }, z.core.$strip>>;
            maxTokens: z.ZodOptional<z.ZodNumber>;
            thinking: z.ZodOptional<z.ZodObject<{
                type: z.ZodEnum<{
                    enabled: "enabled";
                    disabled: "disabled";
                }>;
                budgetTokens: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            reasoningEffort: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
                xhigh: "xhigh";
            }>>;
            textVerbosity: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
            }>>;
            providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>>;
        explore: z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            variant: z.ZodOptional<z.ZodString>;
            category: z.ZodOptional<z.ZodString>;
            skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
            temperature: z.ZodOptional<z.ZodNumber>;
            top_p: z.ZodOptional<z.ZodNumber>;
            prompt: z.ZodOptional<z.ZodString>;
            prompt_append: z.ZodOptional<z.ZodString>;
            tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
            disable: z.ZodOptional<z.ZodBoolean>;
            description: z.ZodOptional<z.ZodString>;
            mode: z.ZodOptional<z.ZodEnum<{
                subagent: "subagent";
                primary: "primary";
                all: "all";
            }>>;
            color: z.ZodOptional<z.ZodString>;
            permission: z.ZodOptional<z.ZodObject<{
                edit: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                bash: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>]>>;
                webfetch: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                doom_loop: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                external_directory: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
            }, z.core.$strip>>;
            maxTokens: z.ZodOptional<z.ZodNumber>;
            thinking: z.ZodOptional<z.ZodObject<{
                type: z.ZodEnum<{
                    enabled: "enabled";
                    disabled: "disabled";
                }>;
                budgetTokens: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            reasoningEffort: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
                xhigh: "xhigh";
            }>>;
            textVerbosity: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
            }>>;
            providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>>;
        "multimodal-looker": z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            variant: z.ZodOptional<z.ZodString>;
            category: z.ZodOptional<z.ZodString>;
            skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
            temperature: z.ZodOptional<z.ZodNumber>;
            top_p: z.ZodOptional<z.ZodNumber>;
            prompt: z.ZodOptional<z.ZodString>;
            prompt_append: z.ZodOptional<z.ZodString>;
            tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
            disable: z.ZodOptional<z.ZodBoolean>;
            description: z.ZodOptional<z.ZodString>;
            mode: z.ZodOptional<z.ZodEnum<{
                subagent: "subagent";
                primary: "primary";
                all: "all";
            }>>;
            color: z.ZodOptional<z.ZodString>;
            permission: z.ZodOptional<z.ZodObject<{
                edit: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                bash: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>]>>;
                webfetch: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                doom_loop: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                external_directory: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
            }, z.core.$strip>>;
            maxTokens: z.ZodOptional<z.ZodNumber>;
            thinking: z.ZodOptional<z.ZodObject<{
                type: z.ZodEnum<{
                    enabled: "enabled";
                    disabled: "disabled";
                }>;
                budgetTokens: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            reasoningEffort: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
                xhigh: "xhigh";
            }>>;
            textVerbosity: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
            }>>;
            providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>>;
        atlas: z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodString>;
            variant: z.ZodOptional<z.ZodString>;
            category: z.ZodOptional<z.ZodString>;
            skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
            temperature: z.ZodOptional<z.ZodNumber>;
            top_p: z.ZodOptional<z.ZodNumber>;
            prompt: z.ZodOptional<z.ZodString>;
            prompt_append: z.ZodOptional<z.ZodString>;
            tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
            disable: z.ZodOptional<z.ZodBoolean>;
            description: z.ZodOptional<z.ZodString>;
            mode: z.ZodOptional<z.ZodEnum<{
                subagent: "subagent";
                primary: "primary";
                all: "all";
            }>>;
            color: z.ZodOptional<z.ZodString>;
            permission: z.ZodOptional<z.ZodObject<{
                edit: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                bash: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>]>>;
                webfetch: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                doom_loop: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
                external_directory: z.ZodOptional<z.ZodEnum<{
                    allow: "allow";
                    deny: "deny";
                    ask: "ask";
                }>>;
            }, z.core.$strip>>;
            maxTokens: z.ZodOptional<z.ZodNumber>;
            thinking: z.ZodOptional<z.ZodObject<{
                type: z.ZodEnum<{
                    enabled: "enabled";
                    disabled: "disabled";
                }>;
                budgetTokens: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            reasoningEffort: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
                xhigh: "xhigh";
            }>>;
            textVerbosity: z.ZodOptional<z.ZodEnum<{
                low: "low";
                medium: "medium";
                high: "high";
            }>>;
            providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    categories: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        description: z.ZodOptional<z.ZodString>;
        model: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodString>;
        temperature: z.ZodOptional<z.ZodNumber>;
        top_p: z.ZodOptional<z.ZodNumber>;
        maxTokens: z.ZodOptional<z.ZodNumber>;
        thinking: z.ZodOptional<z.ZodObject<{
            type: z.ZodEnum<{
                enabled: "enabled";
                disabled: "disabled";
            }>;
            budgetTokens: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        reasoningEffort: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
            xhigh: "xhigh";
        }>>;
        textVerbosity: z.ZodOptional<z.ZodEnum<{
            low: "low";
            medium: "medium";
            high: "high";
        }>>;
        tools: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
        prompt_append: z.ZodOptional<z.ZodString>;
        is_unstable_agent: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>>;
    claude_code: z.ZodOptional<z.ZodObject<{
        mcp: z.ZodOptional<z.ZodBoolean>;
        commands: z.ZodOptional<z.ZodBoolean>;
        skills: z.ZodOptional<z.ZodBoolean>;
        agents: z.ZodOptional<z.ZodBoolean>;
        hooks: z.ZodOptional<z.ZodBoolean>;
        plugins: z.ZodOptional<z.ZodBoolean>;
        plugins_override: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
    }, z.core.$strip>>;
    sisyphus_agent: z.ZodOptional<z.ZodObject<{
        disabled: z.ZodOptional<z.ZodBoolean>;
        default_builder_enabled: z.ZodOptional<z.ZodBoolean>;
        planner_enabled: z.ZodOptional<z.ZodBoolean>;
        replace_plan: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    comment_checker: z.ZodOptional<z.ZodObject<{
        custom_prompt: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    experimental: z.ZodOptional<z.ZodObject<{
        aggressive_truncation: z.ZodOptional<z.ZodBoolean>;
        auto_resume: z.ZodOptional<z.ZodBoolean>;
        truncate_all_tool_outputs: z.ZodOptional<z.ZodBoolean>;
        dynamic_context_pruning: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            notification: z.ZodDefault<z.ZodEnum<{
                off: "off";
                minimal: "minimal";
                detailed: "detailed";
            }>>;
            turn_protection: z.ZodOptional<z.ZodObject<{
                enabled: z.ZodDefault<z.ZodBoolean>;
                turns: z.ZodDefault<z.ZodNumber>;
            }, z.core.$strip>>;
            protected_tools: z.ZodDefault<z.ZodArray<z.ZodString>>;
            strategies: z.ZodOptional<z.ZodObject<{
                deduplication: z.ZodOptional<z.ZodObject<{
                    enabled: z.ZodDefault<z.ZodBoolean>;
                }, z.core.$strip>>;
                supersede_writes: z.ZodOptional<z.ZodObject<{
                    enabled: z.ZodDefault<z.ZodBoolean>;
                    aggressive: z.ZodDefault<z.ZodBoolean>;
                }, z.core.$strip>>;
                purge_errors: z.ZodOptional<z.ZodObject<{
                    enabled: z.ZodDefault<z.ZodBoolean>;
                    turns: z.ZodDefault<z.ZodNumber>;
                }, z.core.$strip>>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
        disable_model_list_fetch: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    auto_update: z.ZodOptional<z.ZodBoolean>;
    skills: z.ZodOptional<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodIntersection<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodBoolean, z.ZodObject<{
        description: z.ZodOptional<z.ZodString>;
        template: z.ZodOptional<z.ZodString>;
        from: z.ZodOptional<z.ZodString>;
        model: z.ZodOptional<z.ZodString>;
        agent: z.ZodOptional<z.ZodString>;
        subtask: z.ZodOptional<z.ZodBoolean>;
        "argument-hint": z.ZodOptional<z.ZodString>;
        license: z.ZodOptional<z.ZodString>;
        compatibility: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        "allowed-tools": z.ZodOptional<z.ZodArray<z.ZodString>>;
        disable: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>]>>, z.ZodObject<{
        sources: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
            path: z.ZodString;
            recursive: z.ZodOptional<z.ZodBoolean>;
            glob: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>]>>>>;
        enable: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
        disable: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    }, z.core.$strip>>]>>;
    ralph_loop: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        default_max_iterations: z.ZodDefault<z.ZodNumber>;
        state_dir: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    background_task: z.ZodOptional<z.ZodObject<{
        defaultConcurrency: z.ZodOptional<z.ZodNumber>;
        providerConcurrency: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        modelConcurrency: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        staleTimeoutMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    notification: z.ZodOptional<z.ZodObject<{
        force_enable: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    babysitting: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        timeout_ms: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
    git_master: z.ZodOptional<z.ZodObject<{
        commit_footer: z.ZodDefault<z.ZodBoolean>;
        include_co_authored_by: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
    browser_automation_engine: z.ZodOptional<z.ZodObject<{
        provider: z.ZodDefault<z.ZodEnum<{
            playwright: "playwright";
            "agent-browser": "agent-browser";
            "dev-browser": "dev-browser";
        }>>;
    }, z.core.$strip>>;
    tmux: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        layout: z.ZodDefault<z.ZodEnum<{
            "main-horizontal": "main-horizontal";
            "main-vertical": "main-vertical";
            tiled: "tiled";
            "even-horizontal": "even-horizontal";
            "even-vertical": "even-vertical";
        }>>;
        main_pane_size: z.ZodDefault<z.ZodNumber>;
        main_pane_min_width: z.ZodDefault<z.ZodNumber>;
        agent_pane_min_width: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
    sisyphus: z.ZodOptional<z.ZodObject<{
        tasks: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            storage_path: z.ZodDefault<z.ZodString>;
            claude_code_compat: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>>;
        swarm: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            storage_path: z.ZodDefault<z.ZodString>;
            ui_mode: z.ZodDefault<z.ZodEnum<{
                toast: "toast";
                tmux: "tmux";
                both: "both";
            }>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type OhMyOpenCodeConfig = z.infer<typeof OhMyOpenCodeConfigSchema>;
export type AgentOverrideConfig = z.infer<typeof AgentOverrideConfigSchema>;
export type AgentOverrides = z.infer<typeof AgentOverridesSchema>;
export type BackgroundTaskConfig = z.infer<typeof BackgroundTaskConfigSchema>;
export type AgentName = z.infer<typeof AgentNameSchema>;
export type HookName = z.infer<typeof HookNameSchema>;
export type BuiltinCommandName = z.infer<typeof BuiltinCommandNameSchema>;
export type BuiltinSkillName = z.infer<typeof BuiltinSkillNameSchema>;
export type SisyphusAgentConfig = z.infer<typeof SisyphusAgentConfigSchema>;
export type CommentCheckerConfig = z.infer<typeof CommentCheckerConfigSchema>;
export type ExperimentalConfig = z.infer<typeof ExperimentalConfigSchema>;
export type DynamicContextPruningConfig = z.infer<typeof DynamicContextPruningConfigSchema>;
export type SkillsConfig = z.infer<typeof SkillsConfigSchema>;
export type SkillDefinition = z.infer<typeof SkillDefinitionSchema>;
export type RalphLoopConfig = z.infer<typeof RalphLoopConfigSchema>;
export type NotificationConfig = z.infer<typeof NotificationConfigSchema>;
export type BabysittingConfig = z.infer<typeof BabysittingConfigSchema>;
export type CategoryConfig = z.infer<typeof CategoryConfigSchema>;
export type CategoriesConfig = z.infer<typeof CategoriesConfigSchema>;
export type BuiltinCategoryName = z.infer<typeof BuiltinCategoryNameSchema>;
export type GitMasterConfig = z.infer<typeof GitMasterConfigSchema>;
export type BrowserAutomationProvider = z.infer<typeof BrowserAutomationProviderSchema>;
export type BrowserAutomationConfig = z.infer<typeof BrowserAutomationConfigSchema>;
export type TmuxConfig = z.infer<typeof TmuxConfigSchema>;
export type TmuxLayout = z.infer<typeof TmuxLayoutSchema>;
export type SisyphusTasksConfig = z.infer<typeof SisyphusTasksConfigSchema>;
export type SisyphusSwarmConfig = z.infer<typeof SisyphusSwarmConfigSchema>;
export type SisyphusConfig = z.infer<typeof SisyphusConfigSchema>;
export { AnyMcpNameSchema, type AnyMcpName, McpNameSchema, type McpName } from "../mcp/types";
