# 内网（无网络）环境安装指南

本文档说明如何将**已实施「禁用 models.dev 联网行为」改造**的 oh-my-opencode 插件，在内网、无外网环境下完整、可运行地安装到 OpenCode 上。

**适用条件：**

- 内网已安装 **OpenCode**、**Node.js**、**Bun**（本指南推荐在内网使用 Bun 安装插件）。
- 内网机器无法访问公网（或不允许访问 GitHub、registry.npmjs.org、models.dev、Exa/Context7/Grep.app 等）。
- 插件源码已包含 `experimental.disable_model_list_fetch` 及相关改造（参见《禁用 models.dev 联网行为》方案）。

---

## 一、安装流程总览

| 阶段 | 执行环境 | 主要内容 |
|------|----------|----------|
| **阶段一** | 有网络环境（可临时安装 Bun） | 构建插件、生成模型/连接缓存、预置二进制 |
| **阶段二** | 迁移 | 将插件产物与缓存拷贝到内网 |
| **阶段三** | 内网 | 使用 **Bun** 从本地 tgz/目录安装插件、注册到 OpenCode、配置离线与禁用联网、验证 |

内网侧**不要**执行 `bunx oh-my-opencode install`（会访问 npm），改为：先把插件 tgz 或构建目录拷贝到内网，再在内网用 **Bun** 从本地安装（见 4.1），并手动编辑 `opencode.json` 与 `oh-my-opencode.json` 完成注册与配置。

---

## 二、阶段一：在有网络的环境准备

在能访问外网的机器上完成以下步骤。若该机器仅有 Node.js、没有 Bun，需**临时安装 Bun** 以执行项目自带的构建脚本（本项目默认使用 `bun run build`）。

### 2.1 安装 Bun（仅构建时需要）

项目 [package.json](package.json) 的构建脚本依赖 Bun：

```bash
# 有网机：安装 Bun（仅用于构建，内网不需要）
curl -fsSL https://bun.sh/install | bash
# 或: npm install -g bun
```

若希望**在内网用 Bun 安装**本插件，内网机也需安装 Bun（见阶段三 4.1）。

### 2.2 克隆/获取源码并构建

```bash
# 有网机
cd /path/to/oh-my-opencode
npm ci
bun run build
```

构建产物在 `dist/` 目录，入口为 `dist/index.js`。若使用 `npm run build` 会因脚本中含 `bun build` 而失败，故需使用 `bun run build`。

### 2.3 打包插件（便于拷贝到内网）

**方式 A：拷贝整个构建后的项目目录（推荐）**

将以下内容整体拷贝到内网同一路径（例如 `D:\company\oh-my-opencode` 或 `/opt/company/oh-my-opencode`）：

- `dist/`（必选）
- `bin/`（CLI 可选，内网若不用 `oh-my-opencode` 命令可省略）
- `package.json`
- `postinstall.mjs`（可选，内网可不执行）
- `node_modules/`（若内网不打算执行 `npm install`，则需在有网机 `npm ci` 后一并拷贝）

**方式 B：使用 npm pack 生成 tgz**

```bash
# 有网机
npm run build
npm pack
# 得到 oh-my-opencode-3.x.x.tgz
```

将 `oh-my-opencode-3.x.x.tgz` 拷贝到内网。在内网可解压到固定目录后，用 `file:` 指向解压后的 `dist/index.js`（见阶段三）；在内网可用 **Bun** 从该 tgz 安装：`bun add ./oh-my-opencode-3.x.x.tgz`（见阶段三 4.1）。

### 2.4 生成模型与连接缓存（必做）

改造后插件**仅使用本地缓存**，不再调用 `client.provider.list()` / `client.model.list()`，因此必须在有网环境**至少运行一次**以生成缓存。

1. 在有网机上确保已安装 OpenCode，且 `opencode.json` 已注册 oh-my-opencode（例如 `"oh-my-opencode"` 或 `file:` 指向本地构建目录）。
2. 完成各 Provider 的 `opencode auth login`（按需）。
3. 启动 OpenCode 并**至少创建/进入一次会话**，使插件在未设置 `disable_model_list_fetch` 时执行一次缓存更新，生成：
   - `~/.cache/oh-my-opencode/connected-providers.json`
   - `~/.cache/oh-my-opencode/provider-models.json`
4. 若 OpenCode 或宿主会写 `~/.cache/opencode/models.json`，也一并保留。

**缓存路径汇总：**

| 路径 | 用途 |
|------|------|
| `~/.cache/oh-my-opencode/connected-providers.json` | 已连接 Provider 列表 |
| `~/.cache/oh-my-opencode/provider-models.json` | 各 Provider 模型列表 |
| `~/.cache/opencode/models.json` | OpenCode 模型缓存（插件会回退使用） |

**Windows：** 一般为 `%LOCALAPPDATA%\oh-my-opencode`、`%APPDATA%\oh-my-opencode`，以及 `%LOCALAPPDATA%\opencode`、`%APPDATA%\opencode`（与 [data-path.ts](../src/shared/data-path.ts) 一致）。

### 2.5 预置二进制（避免内网首次使用时下载）

以下二进制在**首次使用且本地无缓存**时会从 GitHub 下载；内网无网，需提前放好。

| 组件 | 缓存目录 | 说明 |
|------|----------|------|
| **ripgrep (rg)** | `~/.cache/oh-my-opencode/bin` | 见 [binary-and-dependency-downloads.md](binary-and-dependency-downloads.md) 中对应平台链接，解压后得到 `rg` 放入 `bin/`。 |
| **ast-grep (sg)** | 同上 | 同上文档，按平台下载 zip，解压得到 `sg` 放入 `bin/`。 |
| **comment-checker** | 同上 | 同上文档，按平台下载并解压到 `bin/`。 |

也可在有网机上**触发一次** grep、ast-grep、comment-checker 相关功能，让插件自动下载到上述 `bin/`，再将整个 `~/.cache/oh-my-opencode` 拷贝到内网。

---

## 三、阶段二：迁移到内网

1. **插件**：将 2.3 得到的 **oh-my-opencode-3.x.x.tgz** 或**完整构建目录**拷贝到内网。若为 tgz，放在便于执行的目录（如 `D:\company\packages` 或 `/opt/company/packages`）；若为完整目录，确保含 `dist/`、`package.json`，可选含 `node_modules/`（否则在内网该目录用 Bun 执行 `bun install` 安装依赖，见阶段三）。
2. **缓存**：将 2.4 中的目录拷贝到内网机**对应用户**的相同路径：
   - `~/.cache/oh-my-opencode/`（含 `connected-providers.json`、`provider-models.json`、`bin/`）
   - `~/.cache/opencode/`（含 `models.json`，若存在）
3. **二进制**：若 2.5 已下载，随 `~/.cache/oh-my-opencode/bin` 一并拷贝；否则按 [binary-and-dependency-downloads.md](binary-and-dependency-downloads.md) 在内网可访问的存储上准备对应平台文件，解压到内网机 `~/.cache/oh-my-opencode/bin`。

---

## 四、阶段三：内网配置与验证

内网已具备 **OpenCode**、**Node.js**、**Bun**。以下操作均在内网机完成。

### 4.1 在内网用 Bun 安装 oh-my-opencode

任选一种方式，使插件出现在固定目录的 `node_modules/oh-my-opencode/dist/index.js`，供 OpenCode 加载。

**方式一：从本地 tgz 用 Bun 安装（推荐）**

在内网新建一个专用目录，用 Bun 把 tgz 装进该目录的 `node_modules`：

```bash
# 内网机
mkdir -p /opt/company/opencode-plugins
cd /opt/company/opencode-plugins
bun init -y
bun add ./oh-my-opencode-3.x.x.tgz
# 插件位于 node_modules/oh-my-opencode/dist/index.js
```

Windows 示例：

```powershell
mkdir D:\company\opencode-plugins
cd D:\company\opencode-plugins
bun init -y
bun add .\oh-my-opencode-3.x.x.tgz
```

**方式二：从本地构建目录用 Bun 安装**

若拷贝的是完整构建目录（含 `dist/`、`package.json`），可让 Bun 以 `file:` 形式“安装”到同一父目录下的 `node_modules`：

```bash
# 内网机：假设插件目录为 /opt/company/oh-my-opencode
mkdir -p /opt/company/opencode-plugins
cd /opt/company/opencode-plugins
bun init -y
bun add file:../oh-my-opencode
# 或使用绝对路径：bun add "file:/opt/company/oh-my-opencode"
```

若未拷贝 `node_modules`，先在插件目录内安装依赖：

```bash
cd /opt/company/oh-my-opencode
bun install
```

**方式三：仅拷贝目录，不用 Bun add**

将完整构建目录（含 `dist/`、`package.json`、`node_modules/`）拷贝到内网固定路径，不执行 `bun add`，直接在后文 4.2 中用 `file:` 指向该目录下的 `dist/index.js`。

### 4.2 注册插件（opencode.json）

在 OpenCode 配置目录编辑 `opencode.json`（或 `opencode.jsonc`）：

- **Linux/macOS**：`~/.config/opencode/opencode.json`
- **Windows**：`%APPDATA%\opencode\opencode.json` 或 `%USERPROFILE%\.config\opencode\opencode.json`

在 `plugin` 数组中加入**指向插件入口的绝对路径**：

- 若采用 4.1 方式一或二，指向安装后的 `node_modules/oh-my-opencode/dist/index.js`：

```json
{
  "plugin": [
    "file:///opt/company/opencode-plugins/node_modules/oh-my-opencode/dist/index.js"
  ]
}
```

**Windows 示例：**

```json
{
  "plugin": [
    "file:///D:/company/opencode-plugins/node_modules/oh-my-opencode/dist/index.js"
  ]
}
```

- 若采用 4.1 方式三（仅拷贝目录），则指向拷贝后的 `dist/index.js`：

```json
{
  "plugin": [
    "file:///opt/company/oh-my-opencode/dist/index.js"
  ]
}
```

路径必须指向 **dist/index.js**，且该包所在目录下应有可用的 `node_modules`（插件运行时会从该目录加载依赖）。

### 4.3 启用离线与禁用联网（oh-my-opencode.json）

在**同一 OpenCode 配置目录**（或项目级 `.opencode/`）下创建或编辑 `oh-my-opencode.json`，至少包含：

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  "experimental": {
    "disable_model_list_fetch": true
  },
  "disabled_hooks": [
    "auto-update-checker"
  ],
  "disabled_mcps": [
    "websearch",
    "context7",
    "grep_app"
  ]
}
```

> **说明**：`$schema` 指向的 URL 在内网可能无法访问，可保留或删除该行，不影响插件运行。

说明：

- **experimental.disable_model_list_fetch: true**  
  插件不再调用 `client.provider.list()` 与 `client.model.list()`，仅使用本地缓存，**不再间接触发 models.dev**。
- **disabled_hooks: ["auto-update-checker"]**  
  关闭自动更新检查，避免访问 registry.npmjs.org。
- **disabled_mcps**  
  关闭 websearch、context7、grep_app，避免连接 Exa/Context7/Grep.app。

**可选：环境变量兜底**

不修改配置文件时，可在内网机设置：

```bash
set OH_MY_OPENCODE_OFFLINE_MODELS=1    # Windows CMD
# 或
$env:OH_MY_OPENCODE_OFFLINE_MODELS="1" # Windows PowerShell
# 或
export OH_MY_OPENCODE_OFFLINE_MODELS=1 # Linux/macOS
```

效果等同于 `experimental.disable_model_list_fetch: true`。

### 4.4 模型与 Provider 配置（opencode.json）

内网无法通过 models.dev 或安装向导拉取模型列表，需**手写** OpenCode 与 oh-my-opencode 的模型配置：

- 在 `opencode.json` 中配置好各 Provider（anthropic、openai、google 等）及要使用的模型 ID（与有网机已生成的缓存中的 ID 一致）。
- 在 `oh-my-opencode.json` 的 `agents` 中按需覆盖各 agent 的 `model`，与内网可用 Provider/模型一致（可参考有网机安装完成后生成的 `oh-my-opencode.json` 再改成内网可用模型）。

### 4.5 验证

1. **启动 OpenCode**：在内网机执行 `opencode`（或贵司的启动方式），确认无报错、插件已加载。
2. **新建会话**：创建一次新会话，确认不会出现“Building provider cache for first time”或 models.dev 相关错误。
3. **delegate_task**：执行一次 `delegate_task`（如指定 category 或 subagent_type），确认能解析到模型并创建子任务。
4. **grep/ast-grep**：若使用到相关工具，确认能正常执行（依赖 `~/.cache/oh-my-opencode/bin` 中二进制）。

若 2 或 3 失败，请检查：缓存是否在正确路径、`connected-providers.json` / `provider-models.json` 是否有内容、`experimental.disable_model_list_fetch` 是否为 `true`。

---

## 五、与 README / 官方安装方式的差异

| 项目 | 公网（README/安装指南） | 内网（本指南） |
|------|-------------------------|----------------|
| 安装命令 | `bunx oh-my-opencode install` 或 `npx oh-my-opencode install` | **不使用**安装器；内网用 **Bun** 从本地 tgz/目录安装（`bun add ./oh-my-opencode.tgz` 或 `bun add file:./oh-my-opencode`），再手动编辑 `opencode.json` 与 `oh-my-opencode.json` |
| 插件注册 | 安装器写入 `"oh-my-opencode"` 或 `"oh-my-opencode@版本"`（从 npm 解析） | 使用 `file:///.../node_modules/oh-my-opencode/dist/index.js` 或 `file:///.../oh-my-opencode/dist/index.js` 指向本地安装/拷贝目录 |
| 运行环境 | 推荐 Bun，替代为 Node.js | **OpenCode + Node.js + Bun**（内网用 Bun 安装插件） |
| 构建 | 用户通常不构建，直接从 npm 安装 | 在有网机用 **Bun** 执行 `bun run build` 并 `npm pack`，拷贝 tgz 或完整目录到内网 |

本指南与 [安装指南](guide/installation.md) 的对应关系：安装指南面向有网环境且使用安装器；本指南面向内网无网，采用**本地构建 + 手动配置**，并叠加**禁用 models.dev 与远程 MCP** 的配置。

---

## 六、清单速查

| 步骤 | 有网环境 | 内网环境 |
|------|----------|----------|
| 构建 | 安装 Bun → `npm ci` → `bun run build` | — |
| 插件 | `npm pack` 或拷贝整个构建目录 | 拷贝 tgz 或目录到内网 → 用 **Bun** 安装（`bun add ./oh-my-opencode.tgz` 或 `bun add file:./oh-my-opencode`）→ `opencode.json` 中 `file:` 指向 `.../dist/index.js` |
| 缓存 | 运行一次 OpenCode 会话生成 | 拷贝 `~/.cache/oh-my-opencode/*.json`、`~/.cache/opencode/models.json` |
| 二进制 | 触发下载或按文档下载到 `bin/` | 拷贝 `~/.cache/oh-my-opencode/bin/` 或按文档预置 |
| 配置 | — | `oh-my-opencode.json` 设 `disable_model_list_fetch`、`disabled_hooks`、`disabled_mcps` |
| 可选 | — | 环境变量 `OH_MY_OPENCODE_OFFLINE_MODELS=1` |

---

## 七、参考

- [禁用 models.dev 联网行为] 方案（配置项与逻辑说明）
- [network-usage-report.md](network-usage-report.md)（联网行为与离线建议）
- [binary-and-dependency-downloads.md](binary-and-dependency-downloads.md)（二进制下载与缓存路径）
- [CONTRIBUTING.md](../CONTRIBUTING.md)（本地构建与 `file:` 注册方式）
- [安装指南](guide/installation.md)（公网安装与安装器用法）
