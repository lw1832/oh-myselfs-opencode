# Oh My OpenCode Agent / Subagent 技术参考

本文档汇总当前项目中所有 **Agent** 与 **Subagent** 的定位、功能、模型要求与工具限制，供开发与配置参考。

---

## 一、Agent 与 Subagent 概述

### 1.1 角色区分

| 类型 | 说明 | 模型选择 |
|------|------|----------|
| **Primary Agent** | 主控编排角色，管理任务列表、调度子 agent；通常由用户直接会话或作为主入口 | 可尊重 UI 选择的模型 |
| **Subagent** | 子专家角色，被主控 agent 或 delegate_task 工具调用，完成专项任务 | 使用各自定义的 fallback chain |

### 1.2 内置 Agent 一览

| 名称 | 类型 | 主要用途 |
|------|------|----------|
| **Sisyphus** | Primary | 主控编排、任务管理、调度子 agent |
| **Atlas** | Primary | 主控编排、完成 todo 列表、协调各专家 |
| **Prometheus** | Primary | 规划 Agent，面试/咨询模式，生成工作 plans |
| **Hephaestus** | Subagent | 自主深度工作，「匠心工匠」，需 gpt-5.3-codex |
| **Oracle** | Subagent | 战略顾问，架构决策、复杂调试 |
| **Librarian** | Subagent | 多仓库研究、文档检索、GitHub/Context7/Web 搜索 |
| **Explore** | Subagent | 快速上下文 grep，代码库搜索 |
| **Multimodal-Looker** | Subagent | 媒体分析（PDF、图片、图表） |
| **Metis** | Subagent | 规划前咨询，澄清需求、防止 AI 失败 |
| **Momus** | Subagent | 计划审查，验证工作 plan 可执行性 |
| **Sisyphus-Junior** | Subagent | 分类委托的执行者，由 category 派发 |

---

## 二、Primary Agent 详解

### 2.1 Sisyphus

- **定位**：主控编排，管理任务列表，协调各子 agent。
- **模型**：`anthropic/claude-opus-4-6`（fallback: kimi-k2.5 → glm-4.7 → gpt-5.3-codex → gemini-3-pro）。
- **温度**：0.1。
- **职责**：
  - 任务管理：`TaskCreate` / `TaskUpdate`，多步任务前必建任务。
  - 调度子 agent：按任务类型调用 Oracle、Librarian、Explore 等。
  - 遵循 delegation guide、tool selection table、key triggers 等动态 prompt。
- **相关文件**：`src/agents/sisyphus.ts`。

---

### 2.2 Atlas

- **定位**：主控编排，完成 todo 列表直至结束，作为「交响乐指挥」协调各专家。
- **模型**：`anthropic/claude-sonnet-4-5`（fallback: kimi-k2.5 → gpt-5.2 → gemini-3-pro）。
- **温度**：0.1。
- **路由**：GPT 类模型用 `atlas/gpt.ts`，Claude 等用 `atlas/default.ts`。
- **工具限制**：禁用 `task`、`call_omo_agent`（与 Sisyphus 分工不同）。
- **相关文件**：`src/agents/atlas/`。

---

### 2.3 Prometheus

- **定位**：规划 Agent，面试/咨询模式，生成工作 plans。
- **模型**：`anthropic/claude-opus-4-6`（fallback: kimi-k2.5 → gpt-5.2 → gemini-3-pro）。
- **温度**：0.1。
- **职责**：
  - 访谈用户理解需求。
  - 调用 librarian/explore 收集上下文。
  - 仅在用户明确要求时生成 work plan。
  - 生成 plan 前可咨询 Metis、经 Momus 审查。
- **权限**：允许 `edit`、`bash`、`webfetch`、`question`；`.md` 以外写操作由 `prometheus-md-only` hook 限制。
- **相关文件**：`src/agents/prometheus/`（identity-constraints、interview-mode、plan-generation、plan-template、behavioral-summary 等）。

---

## 三、Subagent 详解

### 3.1 Hephaestus

- **定位**：「匠心工匠」，自主深度工作。
- **模型**：`openai/gpt-5.3-codex`，**无 fallback**，需 OpenAI/GitHub-Copilot/OpenCode 任一 provider。
- **温度**：0.1。
- **职责**：自主探索代码库、收集上下文、制定并执行实施计划。
- **相关文件**：`src/agents/hephaestus.ts`。

---

### 3.2 Oracle

- **定位**：战略技术顾问，架构决策与复杂调试。
- **模型**：`openai/gpt-5.2`（fallback: gemini-3-pro → claude-opus-4-6）。
- **温度**：0.1。
- **工具限制**：禁用 `write`、`edit`、`task`、`call_omo_agent`（只分析、不写代码）。
- **适用场景**：架构权衡、自我审查、多次修复失败后的调试、不熟悉模式、安全/性能关注。
- **相关文件**：`src/agents/oracle.ts`。

---

### 3.3 Librarian

- **定位**：多仓库研究与文档检索，查找官方文档与实现示例。
- **模型**：`zai-coding-plan/glm-4.7`（fallback: glm-4.7-free → claude-sonnet-4-5）。
- **温度**：0.1。
- **工具限制**：禁用 `write`、`edit`、`task`、`call_omo_agent`。
- **职责**：使用 GitHub CLI、Context7、Web Search 查找远程仓库、解释库内部、找用法示例。
- **相关文件**：`src/agents/librarian.ts`。

---

### 3.4 Explore

- **定位**：上下文 grep，快速代码库搜索。
- **模型**：`xai/grok-code-fast-1`（fallback: claude-haiku-4-5 → gpt-5-nano）。
- **温度**：0.1。
- **工具限制**：禁用 `write`、`edit`、`task`、`call_omo_agent`。
- **职责**：回答「Where is X?」「Which file has Y?」「Find the code that does Z」；支持并行搜索、多角度探测。
- **相关文件**：`src/agents/explore.ts`。

---

### 3.5 Multimodal-Looker

- **定位**：媒体文件分析，提取非纯文本信息。
- **模型**：`google/gemini-3-flash`（fallback: gpt-5.2 → glm-4.6v → k2p5 → claude-haiku-4-5 → gpt-5-nano）。
- **温度**：0.1。
- **工具限制**：**Allowlist 仅 `read`**（纯只读）。
- **职责**：分析 PDF、图片、图表；提取信息、描述视觉内容。
- **相关文件**：`src/agents/multimodal-looker.ts`。

---

### 3.6 Metis

- **定位**：规划前咨询，澄清需求与潜在风险。
- **模型**：`anthropic/claude-opus-4-6`（fallback: kimi-k2.5 → gpt-5.2 → gemini-3-pro）。
- **温度**：0.3。
- **职责**：识别隐藏意图、发现歧义、标记 AI-slop 风险、生成澄清问题、为 Prometheus 准备指令。
- **相关文件**：`src/agents/metis.ts`。

---

### 3.7 Momus

- **定位**：计划审查，验证工作 plan 可执行性。
- **模型**：`openai/gpt-5.2`（fallback: claude-opus-4-6 → gemini-3-pro）。
- **温度**：0.1。
- **职责**：审查 `.sisyphus/plans/*.md`，验证引用文件存在、任务可启动、无致命矛盾。
- **相关文件**：`src/agents/momus.ts`。

---

### 3.8 Sisyphus-Junior

- **定位**：分类委托的执行者，由 delegate_task 按 category 派发。
- **模型**：`anthropic/claude-sonnet-4-5`，可由 `categories[category].model` 或 `agents["sisyphus-junior"].model` 覆盖。
- **温度**：0.1。
- **工具限制**：禁用 `task`；**允许** `call_omo_agent`（可派发 explore/librarian）。
- **路由**：GPT 类用 `sisyphus-junior/gpt.ts`，Claude 等用 `sisyphus-junior/default.ts`。
- **相关文件**：`src/agents/sisyphus-junior/`。

---

## 四、Category 与模型映射

delegate_task 按 **category** 选择模型并派发给 **Sisyphus-Junior**。默认 category 与模型对应如下：

| Category | 默认模型 | 说明 |
|----------|----------|------|
| visual-engineering | google/gemini-3-pro | 前端/UI/设计 |
| ultrabrain | openai/gpt-5.3-codex | 深度逻辑/复杂架构 |
| deep | openai/gpt-5.3-codex | 目标导向自主执行 |
| artistry | google/gemini-3-pro | 高创意/艺术任务 |
| quick | anthropic/claude-haiku-4-5 | 小/快任务 |
| unspecified-low | anthropic/claude-sonnet-4-5 | 中等、未归类 |
| unspecified-high | anthropic/claude-opus-4-6 | 高工作量、未归类 |
| writing | google/gemini-3-flash | 文档/技术写作 |

---

## 五、工具限制汇总

| Agent | 禁用工具 | 说明 |
|-------|----------|------|
| Oracle | write, edit, task, call_omo_agent | 只顾问，不写代码 |
| Librarian | write, edit, task, call_omo_agent | 只研究，不写代码 |
| Explore | write, edit, task, call_omo_agent | 只搜索，不写代码 |
| Multimodal-Looker | 仅 Allowlist: read | 纯只读 |
| Sisyphus-Junior | task | 不可建 task，可 call_omo_agent |
| Atlas | task, call_omo_agent | 与 Sisyphus 分工 |

---

## 六、Plan 相关 Agent 与流程

- **plan**：规划入口（slash command 或子 agent 名），通常映射到 Prometheus 或独立 planner。
- **Prometheus**：规划主 agent，面试/咨询模式，仅在用户明确要求时生成 work plan。
- **Metis**：规划前咨询，澄清需求与风险。
- **Momus**：plan 生成后审查，验证可执行性。

流程示意：**Metis（澄清）→ Prometheus（访谈 + plan）→ Momus（审查）→ Sisyphus-Junior（执行）**。

---

## 七、配置与扩展

- **禁用 Agent**：在 `oh-my-opencode.json` 的 `disabled_agents` 中加入 agent 名称。
- **覆盖模型**：在 `agents` 中设置 `agents.<name>.model`，如 `agents["sisyphus-junior"].model`。
- **新增 Agent**：参考 `src/agents/AGENTS.md` 的 HOW TO ADD，在 `utils.ts` 的 `agentSources` 中注册，并更新 `config/schema.ts` 的 `AgentNameSchema`。

---

*文档基于对 `src/agents/`、`src/shared/model-requirements.ts`、`src/tools/delegate-task/constants.ts` 等代码的静态分析生成。*
