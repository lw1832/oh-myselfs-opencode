# 缓存与二进制说明

本目录对应内网用户需要放置的**缓存**与**可选二进制**位置，拷贝到内网后需放到对应用户目录。

## 一、缓存目录映射

| 本目录 | 内网目标路径（Linux/macOS） | 内网目标路径（Windows） |
|--------|-----------------------------|--------------------------|
| `oh-my-opencode/` | `~/.cache/oh-my-opencode/` | `%LOCALAPPDATA%\oh-my-opencode\` 或 `%APPDATA%\oh-my-opencode\` |
| `opencode/` | `~/.cache/opencode/` | `%LOCALAPPDATA%\opencode\` 或 `%APPDATA%\opencode\` |

## 二、必须的缓存文件（模型/连接列表）

插件在配置 `experimental.disable_model_list_fetch: true` 后**仅使用本地缓存**，不再访问 models.dev。以下文件需存在且内容有效：

- **oh-my-opencode/connected-providers.json** — 已连接 Provider 列表
- **oh-my-opencode/provider-models.json** — 各 Provider 的模型列表
- **opencode/models.json** — OpenCode 模型缓存（可选，插件会作为回退）

**生成方式**：在**有网络**的环境下，安装并启动 OpenCode + oh-my-opencode，至少创建并进入一次会话（不要设置 `disable_model_list_fetch`），让插件执行一次缓存更新。然后将上述目录整体拷贝到本 `cache/` 对应子目录，再随本 output 包一并导入内网。

若本包中未包含这些 json 文件，请从已完成上述步骤的有网机拷贝对应目录到本 `cache/oh-my-opencode/` 与 `cache/opencode/`。

## 三、可选：预置二进制（避免内网首次使用时下载）

以下二进制在首次使用且本地无缓存时会从 GitHub 下载；内网无网时需提前放入 `oh-my-opencode/bin/`：

| 组件 | 文件名（Windows x64 示例） | 下载来源 |
|------|----------------------------|----------|
| ripgrep | `rg.exe` | [BurntSushi/ripgrep Releases](https://github.com/BurntSushi/ripgrep/releases) 14.1.1，解压后取 `rg` |
| ast-grep | `sg.exe` | [ast-grep/ast-grep Releases](https://github.com/ast-grep/ast-grep/releases) 0.40.x，解压后取 `sg` |
| comment-checker | `comment-checker.exe` | [go-claude-code-comment-checker Releases](https://github.com/code-yeongyu/go-claude-code-comment-checker/releases) |

将下载并解压得到的可执行文件放入内网机的 `~/.cache/oh-my-opencode/bin`（或 Windows 下 `%LOCALAPPDATA%\oh-my-opencode\bin`）。也可在有网机触发一次对应功能，让插件自动下载到该 bin 目录后，将整个 `oh-my-opencode` 缓存目录拷贝到本 `cache/oh-my-opencode/`。

完整下载链接与各平台文件名见项目内 `docs/binary-and-dependency-downloads.md`。
