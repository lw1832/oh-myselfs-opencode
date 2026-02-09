# websearch 工具与调用方智能体说明

本文档说明 **websearch**（Exa 联网搜索）在插件中的定义、配置位置，以及哪些智能体会使用它。

---

## 一、websearch 工具本身

### 1.1 能力与来源

- **能力**：实时联网搜索（Exa AI 提供的 `web_search_exa`）。
- **类型**：内置 **Remote MCP**，由 Exa 托管，插件只做配置与注册。
- **实际工具名**（由 OpenCode/宿主暴露）：通常为 `websearch_web_search_exa`（MCP 服务器名 + 工具名）。

### 1.2 定义与配置位置

| 项目 | 位置 | 说明 |
|------|------|------|
| **MCP 定义** | `src/mcp/websearch.ts` | 唯一源码定义：`type: "remote"`、`url`、`headers`（EXA_API_KEY）、`oauth: false`。 |
| **内置 MCP 注册** | `src/mcp/index.ts` | `allBuiltinMcps` 包含 `websearch`；`createBuiltinMcps(disabledMcps)` 决定是否包含。 |
| **合并进运行时配置** | `src/plugin-handlers/config-handler.ts` | `config.mcp = { ...createBuiltinMcps(pluginConfig.disabled_mcps), ... }`，即 **全局** 写入 OpenCode 的 `config.mcp`。 |
| **配置 Schema** | `src/config/schema.ts` | `disabled_mcps: z.array(AnyMcpNameSchema).optional()`，用于禁用指定 MCP（含 websearch）。 |
| **MCP 名称类型** | `src/mcp/types.ts` | `McpNameSchema = z.enum(["websearch", "context7", "grep_app"])`，内置名称为 `"websearch"`。 |

### 1.3 环境与开关

- **API Key**：从环境变量 `EXA_API_KEY` 读取，在 `src/mcp/websearch.ts` 中写入请求头 `x-api-key`；未设置时 `headers` 为 `undefined`（可能影响 Exa 认证）。
- **禁用方式**：
  - 在 **opencode.json**（或等效配置）中设置：`"disabled_mcps": ["websearch"]`。
  - 或关闭 MCP：`claude_code.mcp: false`（会关闭所有 MCP，包括 websearch）。
- **工具名展示**：`src/shared/tool-name.ts` 中 `websearch` 映射为展示名 `"WebSearch"`。

### 1.4 暴露方式（谁“能用”）

- MCP 在插件侧是 **全局配置**：写入 `config.mcp` 后，由 OpenCode 宿主决定哪些会话/智能体能看到这些 MCP 工具。
- 插件 **没有** 按智能体单独配置“仅某智能体可用 websearch”；`src/shared/agent-tool-restrictions.ts` 只做 **禁止**（如 `write`、`edit`、`task`、`delegate_task`、`call_omo_agent`），**没有** 对 websearch 或任意 MCP 工具做限制。
- 因此：**凡宿主为其提供 MCP 工具列表的智能体，理论上都能看到并调用 websearch**；插件侧仅通过 **Librarian 的 prompt** 明确要求使用 websearch。

---

## 二、使用 websearch 的智能体（设计意图与配置）

### 2.1 设计上“主要使用”的智能体：Librarian

- **名称**：`librarian`（内置智能体）。
- **配置/定义位置**：`src/agents/librarian.ts`（prompt 与创建逻辑）。
- **如何“获得” websearch**：与其它智能体相同——通过全局 `config.mcp` 注册的 websearch MCP；若宿主给 Librarian 会话提供 MCP 工具，则会有 websearch。
- **使用方式（在 prompt 中明确写出）**：
  - 文档发现流程：**TYPE A: CONCEPTUAL** 使用 “Doc Discovery → context7 + **websearch**”。
  - 查找文档站：`websearch("library-name official documentation site")`、`websearch("library-name v{version} documentation")`。
  - 工具表：**Find Docs URL** 使用 `websearch_exa` → `websearch_exa_web_search_exa("library official documentation")`；**Latest Info** 使用 `websearch_exa_web_search_exa("query ${new Date().getFullYear()}")`。
  - 流程强调：**Doc Discovery is SEQUENTIAL**（websearch → version check → sitemap → investigate）。
- **权限**：`agent-tool-restrictions.ts` 中 `librarian` 与 `explore` 使用同一组 **禁止** 列表（禁止 write、edit、task、delegate_task、call_omo_agent），**不禁止** websearch。

结论：**Librarian 是插件中唯一在 prompt 里被明确指导使用 websearch 的智能体**，且未被工具限制排除。

### 2.2 其它智能体与 websearch

- **explore**：与 Librarian 共用同一套工具限制（仅禁止写/编辑/任务/委派等），**没有**在 prompt 中写 websearch；若宿主给 explore 会话提供 MCP，则 **可以** 调用 websearch，但非“设计上的主要使用方”。
- **oracle、sisyphus、prometheus、multimodal-looker、sisyphus-junior 等**：插件未在 prompt 或工具限制中特别提及 websearch；是否可用取决于宿主是否给该智能体会话注入 MCP 工具。
- **agent-usage-reminder**：在 `src/hooks/agent-usage-reminder/constants.ts` 中把 `websearch_web_search_exa` 列为 `TARGET_TOOLS`，用于提醒用户“若直接用了搜索/拉取类工具，建议改用 delegate_task + explore/librarian”。这是 **提醒逻辑**，不是“只有这些智能体能用 websearch”的配置。

---

## 三、配置汇总表

| 配置项 | 位置 | 作用 |
|--------|------|------|
| **EXA_API_KEY** | 环境变量 | websearch MCP 请求 Exa 时的 API Key（`src/mcp/websearch.ts`）。 |
| **disabled_mcps** | opencode.json / 配置 Schema | 数组，含 `"websearch"` 时从 `createBuiltinMcps()` 中排除，即不注册 websearch。 |
| **claude_code.mcp** | 配置 | 为 `false` 时整个 MCP 不加载，websearch 也不会注册。 |
| **config.mcp**（运行时） | config-handler 合并结果 | 最终传给 OpenCode 的 MCP 列表；websearch 在此以键 `websearch` 存在（除非被 disabled_mcps 排除）。 |

---

## 四、相关文件清单

- **工具定义与注册**：`src/mcp/websearch.ts`、`src/mcp/index.ts`、`src/mcp/types.ts`
- **全局配置合并**：`src/plugin-handlers/config-handler.ts`（约 406–414 行）
- **Schema 与合并**：`src/config/schema.ts`（`disabled_mcps`）、`src/plugin-config.ts`（disabled_mcps 合并逻辑）
- **主要使用方**：`src/agents/librarian.ts`（prompt 中多处 websearch / websearch_exa）
- **工具名与提醒**：`src/shared/tool-name.ts`、`src/hooks/agent-usage-reminder/constants.ts`（`websearch_web_search_exa`）
- **智能体工具限制**：`src/shared/agent-tool-restrictions.ts`（无 websearch 相关限制）

---

## 五、简短结论

- **websearch**：即 Exa 的 `web_search_exa`，在插件中由 `src/mcp/websearch.ts` 定义，通过 `createBuiltinMcps()` 并入全局 `config.mcp`；可通过 `disabled_mcps: ["websearch"]` 或 `claude_code.mcp: false` 禁用。
- **使用方**：插件侧 **仅 Librarian** 在 prompt 中被明确要求使用 websearch；其它智能体未在插件中做“仅某智能体可用”的配置，能否调用取决于 OpenCode 宿主是否为该会话提供 MCP 工具。
- **配置要点**：EXA_API_KEY 环境变量、`disabled_mcps`、`claude_code.mcp`；无按智能体维度的 websearch 白名单/黑名单。
