# Oh My OpenCode 项目联网行为报告

本文档汇总项目中**需要联网**或**可能联网**的代码位置与场景，便于安全审计、离线环境评估与网络策略配置。

---

## 一、明确需要联网的代码路径

以下位置在满足触发条件时会发起 HTTP(S) 请求，**明确需要网络**。

### 1.1 二进制/依赖下载（fetch → 外部 URL）

| 文件路径 | 目标 URL / 说明 | 触发条件 |
|----------|-----------------|----------|
| `src/shared/binary-downloader.ts` | 通用 `downloadArchive(downloadUrl, archivePath)`，对任意传入 URL 执行 `fetch(downloadUrl)` | 被 ripgrep、ast-grep、comment-checker 的 downloader 调用时 |
| `src/tools/grep/downloader.ts` | `https://github.com/BurntSushi/ripgrep/releases/download/${RG_VERSION}/${filename}` | 本地未安装 ripgrep 且工具需要时自动下载 |
| `src/tools/ast-grep/downloader.ts` | `https://github.com/ast-grep/ast-grep/releases/download/${version}/${assetName}` | 本地无 ast-grep 二进制且工具需要时自动下载 |
| `src/hooks/comment-checker/downloader.ts` | `https://github.com/code-yeongyu/go-claude-code-comment-checker/releases/download/v${version}/${assetName}` | comment-checker 首次使用且本地无缓存二进制时下载 |

**说明**：上述下载均走 `binary-downloader.ts` 的 `fetch(..., { redirect: "follow" })`，需能访问对应 GitHub Releases。

---

### 1.2 版本/更新检查（npm registry）

| 文件路径 | 目标 URL | 触发条件 |
|----------|----------|----------|
| `src/hooks/auto-update-checker/constants.ts` + `checker.ts` | `https://registry.npmjs.org/-/package/oh-my-opencode/dist-tags` | 启用 `auto-update-checker` 钩子且非本地开发模式时，检查是否有新版本 |
| `src/cli/config-manager.ts` | `https://registry.npmjs.org/${packageName}/latest` | `fetchLatestVersion(packageName)` 被调用时（如安装向导获取最新版本） |
| `src/cli/config-manager.ts` | `https://registry.npmjs.org/-/package/${packageName}/dist-tags` | `fetchNpmDistTags(packageName)` / `getPluginNameWithVersion()` 被调用时（安装时写 plugin 版本） |
| `src/cli/config-manager.ts` | `https://registry.npmjs.org/opencode-antigravity-auth/latest` | 生成/合并配置时若涉及 Antigravity 相关逻辑会拉取该包版本 |

---

### 1.3 内置远程 MCP 服务（运行时连接）

以下为插件内置的 **remote MCP** 配置；当 OpenCode 使用这些 MCP 时，由运行时（OpenCode/MCP 客户端）向对应 URL 建立连接，**使用这些功能即需联网**。

| 文件路径 | 服务 URL | 用途 |
|----------|----------|------|
| `src/mcp/websearch.ts` | `https://mcp.exa.ai/mcp?tools=web_search_exa` | Exa 网络搜索（可选 `EXA_API_KEY`） |
| `src/mcp/context7.ts` | `https://mcp.context7.com/mcp` | Context7 文档查询（可选 `CONTEXT7_API_KEY`） |
| `src/mcp/grep-app.ts` | `https://mcp.grep.app` | Grep.app GitHub 代码搜索 |

用户若在配置中禁用对应 MCP（如 `disabled_mcps`），则不会连接上述地址。

---

### 1.4 MCP OAuth 流程（发现、注册、换 token）

| 文件路径 | 行为 | 触发条件 |
|----------|------|----------|
| `src/features/mcp-oauth/discovery.ts` | `fetchMetadata(url)` → 请求 `/.well-known/oauth-authorization-server` 或 `/.well-known/oauth-protected-resource`（URL 由用户提供的 MCP server URL 派生） | 用户执行 `oh-my-opencode auth login` 等 OAuth 登录且传入的 server 使用 OAuth 时 |
| `src/features/mcp-oauth/dcr.ts` | `fetchImpl(registrationEndpoint, { method: "POST", ... })` → 动态客户端注册 | 该 MCP 服务器支持 DCR 且需注册时 |
| `src/features/mcp-oauth/provider.ts` | `fetch(metadata.tokenEndpoint, { method: "POST", ... })` → 用授权码换 token | 用户完成浏览器授权后，用 code 换 access token |

**说明**：OAuth 目标域名由用户配置的 MCP server URL 决定（必须 HTTPS），非固定域名。

---

### 1.5 Tmux 子智能体健康检查（本地 HTTP）

| 文件路径 | 目标 | 触发条件 |
|----------|------|----------|
| `src/shared/tmux/tmux-utils.ts` | `fetch(healthUrl)`，其中 `healthUrl = new URL("/health", serverUrl)`；`serverUrl` 默认 `http://localhost:${defaultPort}`（见 `features/tmux-subagent/manager.ts`） | 启用 Tmux 集成且检查本地 OpenCode/子智能体服务是否存活时 |

**说明**：默认为 **localhost**，不访问公网；若用户将 `ctx.serverUrl` 配置为远程地址，则会访问该远程地址的 `/health`。

---

### 1.6 模型列表（models.dev 间接触发）

插件调用 OpenCode 提供的 `client.provider.list()` 与 `client.model.list()` 时，**由 OpenCode 宿主**（非本插件）向 models.dev 等发起请求；无网时可能报错。

| 文件路径 | 行为 | 触发条件 |
|----------|------|----------|
| `src/shared/model-availability.ts` | `fetchAvailableModels(client, options)` 在缓存不足时调用 `client.provider.list()`、`client.model.list()` | 委托任务解析 category/model、agent 解析等 |
| `src/shared/connected-providers-cache.ts` | `updateConnectedProvidersCache(client)` 调用 `client.provider.list()` 与 `client.model.list()` 并写缓存 | `session.created` 时由 auto-update-checker 触发 |

**禁用方式**：在 `oh-my-opencode.json` 中设置 `experimental.disable_model_list_fetch: true`，或设置环境变量 `OH_MY_OPENCODE_OFFLINE_MODELS=1`，插件将不再调用上述 client API，仅使用本地缓存（见第六节）。

---

## 二、可能联网的场景（依赖配置或外部调用）

以下行为**是否联网**取决于配置、用户操作或 OpenCode 宿主，本插件只提供配置或调用入口。

### 2.1 用户/项目配置中的 MCP URL

| 位置 | 说明 |
|------|------|
| `src/features/skill-mcp-manager/manager.ts` 等 | 读取用户配置中的 MCP 条目（如 `mcp.*.url`）。若 URL 为远程（如 `https://mcp.example.com/mcp`），则 **OpenCode 或 MCP 客户端连接该 URL** 时需联网。插件本身不直接 fetch 该 URL，但会校验 URL 格式并建立 MCP 连接。 |

即：**用户配置了远程 MCP server 并启用时，可能联网**。

---

### 2.2 OpenCode 宿主与 LLM/API

- **插件不直接调用任何 LLM API**。调用 Anthropic、OpenAI、Google 等由 **OpenCode 宿主** 根据 `opencode.json` 中的 provider 配置完成。
- 使用 Claude、GPT、Gemini 等时，**联网行为由 OpenCode 与各厂商 API 决定**，不在本报告中逐项列出。

---

### 2.3 文档/安装指引中的 URL（仅引用，不自动请求）

以下为文档或提示中的链接，**插件代码不会自动 fetch 这些 URL**（用户或智能体可能手动访问）：

- 安装指南：`https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md`
- Schema 引用：`https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json`（仅作为 `$schema` 字符串写入配置，**不发起 fetch**）
- README/文档中的 GitHub releases、opencode.ai/docs、cli.github.com 等

---

## 三、构建/发布与 CI（仅开发与发布时）

以下在**开发或发布流程**中执行，普通用户安装的插件**不会运行这些脚本**。

| 位置 | 行为 |
|------|------|
| `script/publish.ts` | `fetch(https://registry.npmjs.org/oh-my-opencode/latest)`、`fetch(https://registry.npmjs.org/${pkgName}/${version})` 等，用于发布前版本检查与发布状态查询 |
| `.github/workflows/publish.yml` / `publish-platform.yml` | CI 中 `curl` / 使用 `registry.npmjs.org` 检查版本、发布 npm 包 |
| `.github/workflows/lint-workflows.yml` | `curl` 下载 actionlint 脚本 |

---

## 四、不联网或仅本地的部分

- **postinstall.mjs**：仅 `require.resolve` 检测平台二进制是否存在，**无网络请求**。
- **gh CLI 检查**（`src/cli/doctor/checks/gh.ts`）：仅执行本地 `gh --version` / `gh auth status`，**不直接发 HTTP**（若 `gh` 内部查 GitHub 则属 gh 自身行为）。
- **Schema 写入**（如 `src/cli/model-fallback.ts`）：仅将 `SCHEMA_URL` 字符串写入生成配置的 `$schema` 字段，**不 fetch 该 URL**。

---

## 五、汇总表（按用途）

| 类别 | 目标/域名示例 | 何时发生 |
|------|----------------|----------|
| 二进制下载 | github.com (BurntSushi/ripgrep, ast-grep/ast-grep, code-yeongyu/go-claude-code-comment-checker) | ripgrep/ast-grep/comment-checker 首次使用且本地无缓存时 |
| 版本/更新 | registry.npmjs.org | 自动更新检查、安装向导解析版本、Antigravity 版本查询 |
| 内置 MCP | mcp.exa.ai, mcp.context7.com, mcp.grep.app | 启用并调用 websearch/context7/grep_app 时 |
| MCP OAuth | 用户配置的 MCP server 域名（HTTPS） | `auth login` 及 OAuth 发现/DCR/换 token |
| 本地健康检查 | localhost（默认） | Tmux 集成检查本地服务 `/health` |
| 发布/CI | registry.npmjs.org, raw.githubusercontent.com（actionlint） | 仅维护者构建/发布与 GitHub Actions |
| 模型列表（间接触发） | models.dev（OpenCode 宿主实现） | 插件调用 `client.provider.list()` / `client.model.list()` 时由宿主请求；可通过配置或环境变量禁用 |

---

## 六、离线或受限网络环境建议

1. **禁用自动更新检查**：在 `oh-my-opencode.json` 中通过 `disabled_hooks` 包含 `auto-update-checker`。
2. **禁用 models.dev 间接触发**：在 `oh-my-opencode.json` 中设置 `experimental.disable_model_list_fetch: true`，插件将不再调用 `client.provider.list()` 与 `client.model.list()`，仅使用本地缓存（`~/.cache/oh-my-opencode/`、`~/.cache/opencode/models.json`）。离线使用前需在有网环境至少运行一次以生成缓存，或从它机拷贝。也可设置环境变量 `OH_MY_OPENCODE_OFFLINE_MODELS=1` 达到同样效果（无需改配置）。
3. **避免触发二进制下载**：提前在能联网的环境安装好 ripgrep、ast-grep，或安装 comment-checker 所需二进制并放入缓存目录，避免在离线环境首次调用时下载。
4. **禁用远程 MCP**：在配置中通过 `disabled_mcps` 关闭 `websearch`、`context7`、`grep_app`，或不要配置远程 MCP URL。
5. **OAuth**：在离线环境不执行 `oh-my-opencode auth login`；已登录的 token 存本地，后续使用可能仍会连该 MCP server，需结合策略考虑。
6. **安装**：在离线环境安装时，若安装向导会调用 `fetchLatestVersion` / `fetchNpmDistTags`，可能失败；可手动编辑 `opencode.json` 与 `oh-my-opencode.json` 完成安装。

---

*报告基于对仓库的静态代码与配置遍历生成，未包含 OpenCode 宿主或系统其它进程的联网行为。*
