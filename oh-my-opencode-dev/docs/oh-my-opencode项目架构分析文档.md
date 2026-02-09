# Oh My OpenCode 项目架构分析文档

> 本文档从项目目标、技术栈、整体架构三个维度分析 Oh My OpenCode 项目。

---

## 一、项目主要做什么

### 1.1 一句话概括

**Oh My OpenCode** 是运行在 [OpenCode](https://github.com/sst/opencode) 之上的 **“开箱即用” AI 编程插件**，提供多模型编排、并行后台智能体、LSP/AST 工具，以及完整的 Claude Code 兼容层，把单一 AI 助手变成一支可协作的“开发小队”。

### 1.2 核心价值

- **多模型编排**：按用途选择模型（规划用 Opus、前端用 Gemini、快速任务用 Haiku 等），而不是“一个模型包打天下”。
- **智能体分工**：主智能体 Sisyphus 负责规划和调度，Oracle / Librarian / Explore / Frontend 等专门智能体负责架构、文档、代码搜索、UI 等，类似真实团队分工。
- **任务不半途而废**：通过 TODO 延续强制、会话恢复、Ralph Loop 等机制，让任务“推石上山”直到完成（项目名 Sisyphus 即西西弗斯）。
- **与 OpenCode 深度集成**：LSP、格式化、MCP、技能(Skill)、命令(Command)、钩子(Hook) 等能力均可配置，并兼容 Claude Code 的交互方式。

### 1.3 典型使用场景

| 场景 | 说明 |
|------|------|
| **从描述实现功能** | 用户描述需求 → 智能体制定计划、写代码、验证，全程自动化。 |
| **调试与修 Bug** | 描述问题或粘贴报错 → 智能体分析代码库、定位问题并给出修复。 |
| **理解与导航代码库** | 任意提问关于项目的问题，智能体保持对项目结构的认知。 |
| **自动化繁琐工作** | 修 lint、解决合并冲突、写发布说明等，通过一条指令完成。 |
| **Ultrawork 模式** | 在提示词中加入 `ultrawork` 或 `ulw`，自动启用并行智能体、后台任务、深度探索，直到任务完成。 |

---

## 二、技术栈

### 2.1 语言与运行时

| 类别 | 技术 | 说明 |
|------|------|------|
| **语言** | TypeScript 5.7+ | 全项目 TS，严格模式，ESNext 目标。 |
| **运行时/构建** | Bun | 用于构建、测试；`bun build` 产出 ESM，`tsc` 仅负责声明文件。 |
| **模块系统** | ESM | `"type": "module"`，对外导出 ESM。 |

### 2.2 核心依赖

| 依赖 | 用途 |
|------|------|
| `@opencode-ai/plugin` / `@opencode-ai/sdk` | OpenCode 插件与 SDK，插件入口、上下文、会话、工具等。 |
| `@ast-grep/cli` / `@ast-grep/napi` | AST 级代码搜索与重构（与 LSP 互补）。 |
| `@modelcontextprotocol/sdk` | MCP 协议，用于 Skill 内嵌 MCP、Web 搜索等。 |
| `@code-yeongyu/comment-checker` | 注释检查，控制 AI 生成代码中的注释量。 |
| `commander` | CLI 子命令解析（如 `oh-my-opencode install`）。 |
| `zod` | 配置与参数的 schema 校验。 |
| `jsonc-parser` | 支持 JSONC 配置文件（注释、尾逗号）。 |
| `vscode-jsonrpc` | LSP 客户端通信。 |
| `@clack/prompts` | 交互式安装向导。 |
| `picomatch` | Glob 匹配；`js-yaml` 解析 YAML；`detect-libc` 用于二进制分发时的平台检测。 |

### 2.3 开发与质量保障

- **测试**：Bun 内置测试 runner，`test-setup.ts` 预加载。
- **类型**：`bun-types`、严格 TypeScript，构建时 `tsc --emitDeclarationOnly` 生成 `.d.ts`。
- **多平台二进制**：通过 optionalDependencies 按平台安装预编译二进制（darwin-arm64/x64、linux-arm64/x64、windows-x64 等），用于 CLI/Doctor 等。

### 2.4 技术栈小结

- **宿主**：OpenCode（AI 编程环境）。
- **形态**：一个 **OpenCode Plugin**，提供 `Plugin(ctx) => { tool, config, event, chat.message, ... }`。
- **实现**：TypeScript + Bun 构建 + Zod 校验 + MCP/LSP/AST-Grep 等生态。

---

## 三、本地部署与插件暴露

### 3.1 本地如何部署

**环境要求**：Bun（包管理）、TypeScript 5.7+、OpenCode 1.0.150+（若要在 OpenCode 里跑插件）。

**步骤**：

1. **克隆并安装依赖**  
   ```bash
   git clone https://github.com/code-yeongyu/oh-my-opencode.git
   cd oh-my-opencode
   bun install   # 仅用 Bun，不要用 npm/yarn
   ```

2. **构建**  
   ```bash
   bun run build
   ```  
   会执行：
   - `bun build src/index.ts` → 产出 `dist/index.js`（插件主入口）
   - `tsc --emitDeclarationOnly` → 产出 `dist/*.d.ts`
   - `bun build src/cli/index.ts` → 产出 `dist/cli/index.js`（CLI）
   - `bun run build:schema` → 产出配置 schema

3. **安装后校验（可选）**  
   `package.json` 的 `postinstall` 会执行 `node postinstall.mjs`，根据当前平台检测是否安装了对应的可选二进制包（如 `oh-my-opencode-windows-x64`），用于 CLI 的 `install` / `doctor` 等；检测失败只会打警告，不会让安装失败。

**产物位置**：插件入口在 `dist/index.js`，CLI 入口在 `dist/cli/index.js`；发布到 npm 时 `files` 只包含 `dist`、`bin`、`postinstall.mjs`，用户通过 `bunx oh-my-opencode install` 安装的也是这些产物。

---

### 3.2 如何作为插件暴露给 OpenCode

OpenCode 通过**配置文件里的 `plugin` 数组**加载插件；本仓库既是 npm 包，也是“可被 OpenCode 加载的一个插件”。

#### 1）OpenCode 从哪里读配置

- **CLI（opencode）**：优先读用户配置目录下的 `opencode.json` 或 `opencode.jsonc`。  
  - Windows：`%USERPROFILE%\.config\opencode\`，若不存在则回退到 `%APPDATA%\opencode\`  
  - macOS/Linux：`~/.config/opencode/`  
  - 可通过环境变量 `OPENCODE_CONFIG_DIR` 覆盖目录  
- **Desktop**：使用 Tauri 应用数据目录（如 macOS `~/Library/Application Support/ai.opencode.desktop/` 等），逻辑在 `src/shared/opencode-config-dir.ts`。

只要在该目录下存在 `opencode.json` 或 `opencode.jsonc`，其中 `plugin` 数组里列出的条目都会被 OpenCode 加载。

#### 2）插件条目的三种写法

| 写法 | 含义 | 谁解析 |
|------|------|--------|
| `"oh-my-opencode"` | 使用已安装的 npm 包，未固定版本 | OpenCode 通过包管理器解析（如 bun/npm） |
| `"oh-my-opencode@3.1.11"` 或 `"oh-my-opencode@latest"` | 固定版本或 tag | 同上，解析到对应版本的包 |
| `"file:///绝对路径/oh-my-opencode/dist/index.js"` | 本地开发，直接指向构建产物 | OpenCode 直接加载该文件 |

例如本地开发时，在配置里写（注意去掉已有的 `"oh-my-opencode"` 以免冲突）：

```json
{
  "plugin": [
    "file:///C:/Users/18326/Downloads/oh-my-opencode-dev/oh-my-opencode-dev/dist/index.js"
  ]
}
```

保存后**重启 OpenCode**，即会加载本地构建的插件。

#### 3）安装器在做什么（“暴露”到用户环境）

用户执行 `bunx oh-my-opencode install`（或 `npx oh-my-opencode install`）时：

1. **解析版本**：`getPluginNameWithVersion(currentVersion)` 会得到类似 `oh-my-opencode@latest` 或 `oh-my-opencode@3.1.11` 的条目（若当前版本对应 npm 的 dist-tag 则用 tag，否则用具体版本号）。
2. **写入/更新 OpenCode 配置**：`addPluginToOpenCodeConfig()` 会：
   - 若不存在 `opencode.json`/`opencode.jsonc`，则在用户配置目录下新建，并写入 `{ "plugin": [ "oh-my-opencode@..." ] }`；
   - 若已存在，则在 `config.plugin` 里追加或更新 `oh-my-opencode` 或 `oh-my-opencode@...`，保证数组中有一条本插件。
3. **生成插件专用配置**：在同一配置目录下写入 `oh-my-opencode.json`（模型、agent、hook 等），内容由安装时选择的订阅（Claude/OpenAI/Gemini 等）通过 `generateOmoConfig()` 生成。

这样，OpenCode 启动时读取 `opencode.json` 的 `plugin` 数组，发现 `"oh-my-opencode"` 或 `"oh-my-opencode@x.y.z"`，就会通过包管理器解析到已安装的 `oh-my-opencode` 包，并加载其**主入口**。

#### 4）OpenCode 实际加载的入口

- **包名解析**：`plugin` 里写 `"oh-my-opencode"` 或 `"oh-my-opencode@version"` 时，OpenCode 会像 Node 一样解析到该 npm 包的根目录。
- **入口文件**：`package.json` 里 `"main": "dist/index.js"`，所以实际加载的是 **`dist/index.js`**。
- **插件契约**：该文件是 ESM，**默认导出（default export）** 必须是一个符合 OpenCode 约定的 **Plugin 函数**：`(ctx) => { tool, config, event, "chat.message", "tool.execute.before", ... }`。本仓库在 `src/index.ts` 里实现并 default 导出该函数，构建后即成为 `dist/index.js` 的 default export。

**小结**：  
- **本地部署**：clone → `bun install` → `bun run build`，得到 `dist/index.js`。  
- **作为插件暴露**：在 OpenCode 的配置目录下，在 `opencode.json`（或 `opencode.jsonc`）的 `plugin` 数组中加入 `"oh-my-opencode"` / `"oh-my-opencode@版本"`（由安装器写入）或本地开发时写 `"file:///.../dist/index.js"`；OpenCode 启动时解析这些条目，加载对应包的 `main`（即 `dist/index.js`），并调用其 default 导出的函数完成插件注册。

---

## 四、整体架构

### 4.1 顶层视角

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        OpenCode (Host)                                   │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │              Oh My OpenCode Plugin (本仓库)                         │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────────┐  │  │
│  │  │   Agents    │ │   Hooks     │ │   Tools     │ │   Features    │  │  │
│  │  │ (Sisyphus,  │ │ (25+ 钩子)  │ │ (delegate_ │ │ (background,  │  │  │
│  │  │  Oracle,    │ │             │ │  task, LSP, │ │  skill, MCP,  │  │  │
│  │  │  Atlas...)  │ │             │ │  grep...)   │ │  session...)  │  │  │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └───────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────────────────┐   │  │
│  │  │  Config (plugin-config, schema, plugin-handlers)            │   │  │
│  │  └─────────────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

- **Agents**：定义“谁来做”（Sisyphus、Prometheus、Oracle、Librarian、Explore、Atlas、Metis、Momus 等）。
- **Hooks**：在 OpenCode 生命周期节点插入逻辑（chat.message、event、tool.execute.before/after、messages.transform 等）。
- **Tools**：暴露给 AI 的能力（如 `delegate_task`、`call_omo_agent`、LSP、grep、session、slashcommand 等）。
- **Features**：可复用的业务模块（后台任务、技能加载、会话状态、Tmux、MCP OAuth 等）。
- **Config**：从 `.opencode/oh-my-opencode.json` 等加载，经 Zod schema 校验后驱动上述各部分。

### 4.2 目录与模块划分

```
oh-my-opencode-dev/
├── src/
│   ├── index.ts                 # 插件入口：注册 tool / config / event / chat.message / 各 Hook
│   ├── config/                  # 配置 schema（Zod）与类型
│   ├── plugin-config.ts         # 加载与解析用户/项目配置
│   ├── plugin-handlers/        # config 变更等处理器
│   ├── plugin-state.ts         # 插件级状态（如 model cache）
│   │
│   ├── agents/                  # 智能体定义与编排
│   │   ├── sisyphus.ts          # 主智能体
│   │   ├── atlas.ts             # 编排器（执行 /start-work 计划）
│   │   ├── prometheus/          # 规划（面试用户、生成计划）
│   │   ├── metis.ts, momus.ts   # 计划顾问与审查
│   │   ├── oracle.ts, librarian.ts, explore.ts, multimodal-looker.ts
│   │   ├── sisyphus-junior.ts   # 执行具体任务的子智能体
│   │   └── dynamic-agent-prompt-builder.ts
│   │
│   ├── hooks/                   # 各类生命周期钩子
│   │   ├── todo-continuation-enforcer.ts   # 强制完成 TODO
│   │   ├── session-recovery/               # 会话恢复
│   │   ├── comment-checker/                # 注释检查
│   │   ├── rules-injector/                 # 注入 .cursor/rules 等
│   │   ├── start-work/                     # /start-work 触发编排
│   │   ├── atlas/                          # Atlas 编排器 Hook
│   │   ├── ralph-loop/                     # Ralph Loop 循环执行
│   │   ├── think-mode/                     # 思考模式
│   │   ├── claude-code-hooks/              # Claude Code 兼容层
│   │   └── ...（20+ 钩子）
│   │
│   ├── tools/                   # 暴露给 AI 的工具
│   │   ├── delegate-task/       # 按 category/agent 委托子任务（核心）
│   │   ├── call-omo-agent/      # 调用指定 OMO 智能体
│   │   ├── background-task/     # 后台任务查询
│   │   ├── lsp/                 # LSP 诊断、重构等
│   │   ├── grep/, glob/, ast-grep/
│   │   ├── session-manager/     # 会话列表/搜索等
│   │   ├── skill/, skill-mcp/, slashcommand/
│   │   ├── look-at/             # 多模态看图
│   │   └── interactive-bash/   # 交互式 Bash
│   │
│   ├── features/                # 可复用功能模块
│   │   ├── background-agent/    # 后台智能体管理与并发
│   │   ├── builtin-skills/      # playwright, git-master, frontend-ui-ux 等
│   │   ├── builtin-commands/    # /start-work, /ralph-loop 等
│   │   ├── opencode-skill-loader/   # 加载 OpenCode/Claude 技能
│   │   ├── claude-code-mcp-loader/   # MCP 配置加载
│   │   ├── claude-code-session-state/
│   │   ├── context-injector/    # 上下文注入（AGENTS.md、README 等）
│   │   ├── task-toast-manager/  # 任务完成通知
│   │   ├── tmux-subagent/       # Tmux 多窗格展示后台智能体
│   │   ├── boulder-state/       # “推石”状态（与 TODO 延续配合）
│   │   ├── sisyphus-tasks/      # 编排任务存储
│   │   └── mcp-oauth/           # MCP OAuth 流程
│   │
│   ├── mcp/                     # MCP 相关类型与工具
│   ├── shared/                  # 公共 util、日志、版本判断等
│   ├── cli/                     # 独立 CLI
│   │   ├── index.ts             # oh-my-opencode install / doctor / run 等
│   │   ├── doctor/              # 环境检查
│   │   ├── install.ts           # 安装与配置向导
│   │   ├── mcp-oauth/           # MCP 登录/登出/状态
│   │   └── run/                 # 运行与补全
│   └── types/                   # 全局类型声明
│
├── bin/                         # 可执行入口
├── docs/                        # 用户文档与架构说明
├── script/                      # 构建 schema、二进制等脚本
├── packages/                    # 各平台可选二进制包
└── .opencode/                   # 项目级 OpenCode 配置示例
```

### 4.3 编排系统三层架构（Prometheus → Atlas → Junior）

这是 Oh My OpenCode 区别于“单模型单会话”的核心设计：

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Layer 1: 规划层 (Human + Prometheus + Metis + Momus)                    │
│  - 用户按 Tab 进入 Prometheus 模式，描述工作                             │
│  - Prometheus 通过“面试”澄清需求，可选 Metis 做差距分析、Momus 做计划审查  │
│  - 输出：.sisyphus/plans/*.md 等计划文档                                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Layer 2: 执行层 (Atlas 编排器)                                           │
│  - 用户执行 /start-work，Atlas 读取计划                                   │
│  - 拆解任务、积累“智慧”（.sisyphus/notepads/ 下的 learnings/decisions 等）│
│  - 调用 delegate_task 将任务分发给 Junior / Oracle / Explore / 前端等     │
│  - 不写代码，只做协调与验证（lsp_diagnostics、测试、读文件）                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Layer 3: 工作层 (Sisyphus-Junior + Oracle + Explore + Librarian + …)   │
│  - Junior：按计划写代码、修 Bug、做验证，被限制不得再 delegate             │
│  - Oracle：架构与调试建议；Explore：代码库搜索；Librarian：文档与 OSS      │
│  - 结果与“学习”回传给 Atlas，用于后续任务与校验                            │
└─────────────────────────────────────────────────────────────────────────┘
```

- **规划层**：一次规划，多次执行；减少上下文膨胀与目标漂移。
- **执行层**：只做“指挥与验收”，不写业务代码；通过 delegate_task 的 category/skill 做模型与能力选型。
- **工作层**：每个智能体职责单一，通过 Tool 权限（如禁止 edit、delegate）约束行为。

### 4.4 数据流与配置流

- **配置加载**：`loadPluginConfig(ctx.directory, ctx)` → 合并项目 `.opencode/oh-my-opencode.json` 与用户全局配置 → Zod 校验 → `pluginConfig`。
- **Hook 开关**：`pluginConfig.disabled_hooks` 控制各 Hook 是否启用；部分 Hook 还会检查 OpenCode 版本或冲突插件（如 session-notification）。
- **工具注册**：在插件返回的 `tool` 对象中挂载 `delegate_task`、`call_omo_agent`、`skill`、`slashcommand`、LSP、grep、session 等，供所有已配置的智能体按权限使用。
- **事件流**：OpenCode 的 `event`（session.created/deleted、message.updated、session.error）驱动会话状态、Tmux 窗格、恢复逻辑、Atlas 等；`chat.message` 驱动 variant、keyword-detector、start-work、Ralph Loop 等。

### 4.5 与外部系统的边界

| 边界 | 说明 |
|------|------|
| **OpenCode** | 通过 `@opencode-ai/plugin` 注册插件，使用其 session、prompt、client、TUI 等 API。 |
| **LSP** | 使用 `vscode-jsonrpc` 与本地/临时 LSP 服务通信，提供诊断、重命名、引用等工具。 |
| **MCP** | 通过 `@modelcontextprotocol/sdk` 连接 Exa、Context7、Grep.app 等；Skill 可内嵌 MCP。 |
| **Tmux** | 可选：后台智能体以 Tmux 窗格形式展示，由 `features/tmux-subagent` 管理。 |
| **文件系统** | 计划与智慧存储在 `.sisyphus/plans`、`.sisyphus/notepads` 等；配置从 `.opencode/` 或 `~/.config/opencode/` 读取。 |

---

## 五、文档索引（本项目内）

- [Overview](guide/overview.md) - 功能概览与两种工作模式（Ultrawork / Prometheus）
- [Understanding the Orchestration System](guide/understanding-orchestration-system.md) - 编排系统详解
- [Installation](guide/installation.md) - 安装步骤
- [Configurations](configurations.md) - 配置项说明
- [Features](features.md) - 功能列表与用法
- [CLI Guide](cli-guide.md) - `oh-my-opencode` CLI 使用

---

## 六、总结

| 维度 | 总结 |
|------|------|
| **项目定位** | OpenCode 的“开箱即用”插件，把多模型与多智能体编排、LSP/AST、MCP、技能、钩子整合成统一体验。 |
| **技术栈** | TypeScript + Bun + OpenCode Plugin SDK + Zod + MCP + LSP + AST-Grep，ESM 模块。 |
| **架构特点** | 插件式单体：入口 `index.ts` 注册大量 Hooks 与 Tools，Agents/Features/Tools 分层清晰；编排上采用 Prometheus（规划）→ Atlas（执行）→ Junior/专业智能体（工作）的三层模型，配合 delegate_task、category、skill 做任务与模型调度。 |

如需对某一模块做更细的代码级分析（例如 `delegate_task` 或某 Hook 的调用链），可以指定模块名或文件路径继续深入。

---

## 七、Sisyphus 智能体详解（含伪代码）

### 7.1 角色与职责

**Sisyphus** 是 Oh My OpenCode 的**主智能体（primary agent）**，相当于“带队的工程师”：

- **身份**：SF Bay Area 工程师人设；能解析隐含需求、适应代码库成熟度、把专项工作委托给子智能体，并做并行执行与验收。
- **原则**：用户没明确要求实现时，不主动开干；有专家就用专家（前端→委托、深度调研→后台 explore/librarian、架构→问 Oracle）；写出的代码要像资深工程师，不要 AI 味。
- **流程**：先做意图分类（琐碎 / 探索 / 开放 / 模糊），再决定是自己动手还是委托；开放任务先做代码库评估（disciplined / transitional / chaotic / greenfield），再探索与研究（并行 fire explore/librarian），最后实现与验证（todo、delegate_task、lsp_diagnostics）。

### 7.2 模型与推理配置

- **模型**：按回退链解析，优先用当前环境里第一个可用的：
  1. `anthropic/claude-opus-4-5`（variant: max）
  2. `kimi-for-coding/k2p5`
  3. `opencode/kimi-k2.5-free`
  4. `zai-coding-plan/glm-4.7`
  5. `openai/gpt-5.2-codex`（variant: medium）
  6. `google/gemini-3-pro`
- **推理**：若是 Claude 系，启用 `thinking`（budget 32000 tokens）；若是 GPT 系，使用 `reasoningEffort: "medium"`。
- **长度**：`maxTokens: 64000`。

### 7.3 系统提示（摘要）

系统提示是**动态拼出来的**：根据当前可用的 agents、tools、skills、categories 生成若干表格与说明，再嵌进固定模板。核心结构包括：

- **&lt;Role&gt;**：你是 Sisyphus；身份、核心能力、操作模式（能委托就委托，不单独蛮干）。
- **Phase 0 - Intent Gate**：每轮先看 Key Triggers，再按请求类型（Trivial / Exploratory / Open-ended / Ambiguous）决定动作；歧义或关键信息缺失时必须问。
- **Phase 1 - Codebase Assessment**：对开放任务做快速评估（linter/formatter、抽样文件、项目成熟度），并分类为 disciplined / transitional / legacy / greenfield。
- **Phase 2A - Exploration & Research**：工具选择表、何时用 explore/librarian、**默认并行**（explore/librarian 用 `delegate_task(..., run_in_background=true)`），以及何时停止搜索。
- **Phase 2B - Implementation**：先建 todo、委托时必须带 6 段结构（TASK / EXPECTED OUTCOME / REQUIRED TOOLS / MUST DO / MUST NOT DO / CONTEXT）、委托后必须验证、必须用 `session_id` 做会话延续。
- **Hard Blocks**：禁止类型压制（as any / @ts-ignore）、未经请求的 commit、臆测未读代码、留下坏状态。
- **Anti-Patterns**：禁止空 catch、删失败测试“通过”、为鸡毛蒜皮开 agent、乱试式调试等。

### 7.4 工具权限（permission）

- 在 OpenCode 的 agent 配置里，Sisyphus 只显式设置了两项 **permission**：
  - `question: "allow"` — 允许向用户提问。
  - `call_omo_agent: "deny"` — **禁止**使用 `call_omo_agent`（避免主智能体用“点名呼叫”的方式调用自己或造成循环；委托走 `delegate_task`）。
- **其余工具**（read / write / edit / task / delegate_task / grep / glob / lsp_* / ast_grep / session_* / slashcommand / skill 等）未在 Sisyphus 的 permission 里显式禁止，因此按 OpenCode 默认策略为**允许**。  
- 注意：`getAgentToolRestrictions("sisyphus")` 在本项目里返回 `{}`，即**没有**像 oracle/explore/librarian 那样的工具限制表；真正限制的是上述 `permission` 里的 `call_omo_agent: "deny"`。

### 7.5 伪代码：Sisyphus 的“实现”

下面用伪代码概括：**模型解析 → 系统提示生成 → 权限与推理配置 → 返回 OpenCode 的 AgentConfig**。与真实代码（`createSisyphusAgent` + `createBuiltinAgents` 里对 sisyphus 的组装）一一对应。

```text
// ---------- 1. 模型解析（在 createBuiltinAgents 里，不是 Sisyphus 单文件内）
sisyphus_fallback_chain = [
  { providers: ["anthropic", "github-copilot", "opencode"], model: "claude-opus-4-5", variant: "max" },
  { providers: ["kimi-for-coding"], model: "k2p5" },
  { providers: ["opencode"], model: "kimi-k2.5-free" },
  { providers: ["zai-coding-plan"], model: "glm-4.7" },
  { providers: ["openai", "github-copilot", "opencode"], model: "gpt-5.2-codex", variant: "medium" },
  { providers: ["google", "github-copilot", "opencode"], model: "gemini-3-pro" },
]
sisyphus_model, sisyphus_variant = resolveModelPipeline(
  userModel: config.agents.sisyphus?.model,
  requirement: { fallbackChain: sisyphus_fallback_chain },
  availableModels,
  systemDefaultModel
)

// ---------- 2. 创建 Sisyphus AgentConfig（createSisyphusAgent）
function createSisyphusAgent(
  model,                    // 上面解析出的 sisyphus_model
  availableAgents,         // 当前可用的子智能体列表（oracle, librarian, explore, ...）
  availableToolNames,       // 可选，当前插件暴露的工具名列表
  availableSkills,         // 当前可用的 skill（playwright, git-master, frontend-ui-ux, ...）
  availableCategories      // 当前可用的 category（visual-engineering, ultrabrain, quick, ...）
) {
  prompt = buildDynamicSisyphusPrompt(
    availableAgents,
    categorizeTools(availableToolNames ?? []),
    availableSkills ?? [],
    availableCategories ?? []
  )
  // prompt 里包含：<Role>、Phase 0/1/2A/2B、Key Triggers、Tool Selection、Explore/Librarian/Oracle/Delegation 表、
  // Category+Skills 委托说明、Hard Blocks、Anti-Patterns、Tone 等

  permission = {
    question: "allow",
    call_omo_agent: "deny"
  }

  base = {
    description: "Powerful AI orchestrator. Plans obsessively with todos, ...",
    mode: "primary",
    model,
    maxTokens: 64000,
    prompt,
    permission,
    color: "#00CED1",
  }

  if (isGptModel(model)) {
    return { ...base, reasoningEffort: "medium" }
  }
  return { ...base, thinking: { type: "enabled", budgetTokens: 32000 } }
}

// ---------- 3. 在 createBuiltinAgents 里组装最终 Sisyphus 配置
sisyphusConfig = createSisyphusAgent(
  sisyphusModel,
  availableAgents,        // 已先建好的 oracle/librarian/explore/atlas/... 的元信息
  undefined,              // availableToolNames 传 undefined，categorizeTools([]) 仍会跑
  availableSkills,
  availableCategories
)
if (sisyphusResolvedVariant) sisyphusConfig.variant = sisyphusResolvedVariant
sisyphusConfig = applyOverrides(sisyphusConfig, config.agents.sisyphus, mergedCategories)
sisyphusConfig = applyEnvironmentContext(sisyphusConfig, directory)  // 追加 <omo-env> 时间/时区等
result["sisyphus"] = sisyphusConfig
```

**小结表**

| 项目       | 内容 |
|------------|------|
| **模型**   | 回退链：claude-opus-4-5(max) → k2p5 → kimi-k2.5-free → glm-4.7 → gpt-5.2-codex(medium) → gemini-3-pro；可由 `config.agents.sisyphus.model` 覆盖。 |
| **系统提示** | 动态：Role + Phase 0/1/2A/2B + 各表格（Key Triggers、Tool Selection、Explore/Librarian、Delegation、Category+Skills、Hard Blocks、Anti-Patterns）。 |
| **工具权限** | `question: "allow"`，`call_omo_agent: "deny"`；其余工具默认允许（无 AGENT_RESTRICTIONS）。 |
| **推理**   | Claude：`thinking: { type: "enabled", budgetTokens: 32000 }`；GPT：`reasoningEffort: "medium"`。 |
