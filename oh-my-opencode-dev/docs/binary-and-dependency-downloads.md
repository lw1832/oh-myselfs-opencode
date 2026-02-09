# Oh My OpenCode 二进制与依赖下载清单

本文档整理项目中**所有需要下载的二进制与依赖**：来源、版本、平台、缓存路径及直接下载链接，便于离线预置或排查。

---

## 一、运行时自动下载的二进制（HTTP 下载）

以下二进制在**首次使用对应功能且本地无缓存**时，由插件通过 `fetch` 从 GitHub Releases 下载并解压到本地缓存目录。

### 1. Ripgrep（rg）

| 项目 | 说明 |
|------|------|
| **用途** | grep 工具（代码搜索），当系统未安装 ripgrep 时使用 |
| **代码位置** | `src/tools/grep/downloader.ts` |
| **版本** | 固定 `14.1.1`（常量 `RG_VERSION`） |
| **仓库** | https://github.com/BurntSushi/ripgrep |
| **缓存目录** | Unix: `~/.cache/oh-my-opencode/bin`；Windows: `%LOCALAPPDATA%\oh-my-opencode\bin` 或 `%APPDATA%\oh-my-opencode\bin` |
| **二进制名** | `rg`（Windows: `rg.exe`） |

**下载 URL 与文件名：**

| 平台 Key | 文件名 | 直接下载链接 |
|----------|--------|----------------|
| arm64-darwin | `ripgrep-14.1.1-aarch64-apple-darwin.tar.gz` | https://github.com/BurntSushi/ripgrep/releases/download/14.1.1/ripgrep-14.1.1-aarch64-apple-darwin.tar.gz |
| arm64-linux | `ripgrep-14.1.1-aarch64-unknown-linux-gnu.tar.gz` | https://github.com/BurntSushi/ripgrep/releases/download/14.1.1/ripgrep-14.1.1-aarch64-unknown-linux-gnu.tar.gz |
| x64-darwin | `ripgrep-14.1.1-x86_64-apple-darwin.tar.gz` | https://github.com/BurntSushi/ripgrep/releases/download/14.1.1/ripgrep-14.1.1-x86_64-apple-darwin.tar.gz |
| x64-linux | `ripgrep-14.1.1-x86_64-unknown-linux-musl.tar.gz` | https://github.com/BurntSushi/ripgrep/releases/download/14.1.1/ripgrep-14.1.1-x86_64-unknown-linux-musl.tar.gz |
| x64-win32 | `ripgrep-14.1.1-x86_64-pc-windows-msvc.zip` | https://github.com/BurntSushi/ripgrep/releases/download/14.1.1/ripgrep-14.1.1-x86_64-pc-windows-msvc.zip |

**URL 模板：** `https://github.com/BurntSushi/ripgrep/releases/download/14.1.1/ripgrep-14.1.1-<platform>.<tar.gz|zip>`

---

### 2. ast-grep（sg）

| 项目 | 说明 |
|------|------|
| **用途** | AST 级代码搜索与重构；当未使用 `@ast-grep/napi` 或需 CLI 时使用 |
| **代码位置** | `src/tools/ast-grep/downloader.ts` |
| **版本** | 来自已安装的 `@ast-grep/cli` 的 `package.json` 的 `version`，读不到时回退 `0.40.0` |
| **仓库** | https://github.com/ast-grep/ast-grep |
| **缓存目录** | Unix: `~/.cache/oh-my-opencode/bin`（或 `$XDG_CACHE_HOME/oh-my-opencode/bin`）；Windows: `%LOCALAPPDATA%\oh-my-opencode\bin` 或 `%APPDATA%\oh-my-opencode\bin` |
| **二进制名** | `sg`（Windows: `sg.exe`） |

**下载 URL 与文件名（资产名为 zip）：**

| 平台 Key | 文件名 | 直接下载链接（以 v0.40.0 为例） |
|----------|--------|--------------------------------|
| darwin-arm64 | `app-aarch64-apple-darwin.zip` | https://github.com/ast-grep/ast-grep/releases/download/0.40.0/app-aarch64-apple-darwin.zip |
| darwin-x64 | `app-x86_64-apple-darwin.zip` | https://github.com/ast-grep/ast-grep/releases/download/0.40.0/app-x86_64-apple-darwin.zip |
| linux-arm64 | `app-aarch64-unknown-linux-gnu.zip` | https://github.com/ast-grep/ast-grep/releases/download/0.40.0/app-aarch64-unknown-linux-gnu.zip |
| linux-x64 | `app-x86_64-unknown-linux-gnu.zip` | https://github.com/ast-grep/ast-grep/releases/download/0.40.0/app-x86_64-unknown-linux-gnu.zip |
| win32-x64 | `app-x86_64-pc-windows-msvc.zip` | https://github.com/ast-grep/ast-grep/releases/download/0.40.0/app-x86_64-pc-windows-msvc.zip |
| win32-arm64 | `app-aarch64-pc-windows-msvc.zip` | https://github.com/ast-grep/ast-grep/releases/download/0.40.0/app-aarch64-pc-windows-msvc.zip |
| win32-ia32 | `app-i686-pc-windows-msvc.zip` | https://github.com/ast-grep/ast-grep/releases/download/0.40.0/app-i686-pc-windows-msvc.zip |

**URL 模板：** `https://github.com/ast-grep/ast-grep/releases/download/<version>/app-<arch>-<os>.zip`  
**版本**：与 `package.json` 中 `@ast-grep/cli` 的版本一致（当前 ^0.40.0，回退 0.40.0）。

---

### 3. Comment Checker（comment-checker）

| 项目 | 说明 |
|------|------|
| **用途** | 注释检查（控制 AI 生成代码中的注释量） |
| **代码位置** | `src/hooks/comment-checker/downloader.ts` |
| **版本** | 来自已安装的 `@code-yeongyu/comment-checker` 的 `package.json` 的 `version`，读不到时回退 `0.4.1` |
| **仓库** | https://github.com/code-yeongyu/go-claude-code-comment-checker |
| **缓存目录** | 与 ripgrep/ast-grep 相同：Unix `~/.cache/oh-my-opencode/bin`，Windows `%LOCALAPPDATA%\oh-my-opencode\bin` 等 |
| **二进制名** | `comment-checker`（Windows: `comment-checker.exe`） |

**下载 URL 与文件名：**

| 平台 Key | 文件名示例（version 以 0.6.1 为例） | 直接下载链接示例 |
|----------|------------------------------------|------------------|
| darwin-arm64 | `comment-checker_v0.6.1_darwin_arm64.tar.gz` | https://github.com/code-yeongyu/go-claude-code-comment-checker/releases/download/v0.6.1/comment-checker_v0.6.1_darwin_arm64.tar.gz |
| darwin-x64 | `comment-checker_v0.6.1_darwin_amd64.tar.gz` | https://github.com/code-yeongyu/go-claude-code-comment-checker/releases/download/v0.6.1/comment-checker_v0.6.1_darwin_amd64.tar.gz |
| linux-arm64 | `comment-checker_v0.6.1_linux_arm64.tar.gz` | https://github.com/code-yeongyu/go-claude-code-comment-checker/releases/download/v0.6.1/comment-checker_v0.6.1_linux_arm64.tar.gz |
| linux-x64 | `comment-checker_v0.6.1_linux_amd64.tar.gz` | https://github.com/code-yeongyu/go-claude-code-comment-checker/releases/download/v0.6.1/comment-checker_v0.6.1_linux_amd64.tar.gz |
| win32-x64 | `comment-checker_v0.6.1_windows_amd64.zip` | https://github.com/code-yeongyu/go-claude-code-comment-checker/releases/download/v0.6.1/comment-checker_v0.6.1_windows_amd64.zip |

**URL 模板：** `https://github.com/code-yeongyu/go-claude-code-comment-checker/releases/download/v<version>/comment-checker_v<version>_<os>_<arch>.<tar.gz|zip>`  
**版本**：与 `package.json` 中 `@code-yeongyu/comment-checker` 的版本一致（当前 ^0.6.1）。

---

## 二、通过 npm/bun 安装的依赖（非运行时 HTTP 下载）

以下由 **包管理器** 在 `bun install` / `npm install` 时从 registry 拉取，**不是**插件内部 `fetch` 下载。

### 2.1 常规依赖（含可选原生二进制）

| 包名 | 用途 | 版本（package.json） |
|------|------|----------------------|
| `@ast-grep/cli` | ast-grep CLI；若未命中缓存二进制，会按上节从 GitHub 下载 sg | ^0.40.0 |
| `@ast-grep/napi` | ast-grep 的 Node 原生模块，部分场景替代 CLI | ^0.40.0 |
| `@code-yeongyu/comment-checker` | 注释检查逻辑与版本号；**实际运行的二进制**由上节从 GitHub 下载 | ^0.6.1 |

### 2.2 可选平台二进制（optionalDependencies）

安装时根据当前系统**只安装对应平台**的一个包，提供 CLI 用的 `oh-my-opencode` 二进制（如 `doctor`、`install` 等）。  
**不**由插件内代码发起 HTTP 下载，而是 `bun install` 时从 npm registry 拉取对应 tgz。

| 包名 | 平台 |
|------|------|
| `oh-my-opencode-darwin-arm64` | macOS ARM64 (Apple Silicon) |
| `oh-my-opencode-darwin-x64` | macOS x64 (Intel) |
| `oh-my-opencode-linux-arm64` | Linux ARM64 (glibc) |
| `oh-my-opencode-linux-arm64-musl` | Linux ARM64 (musl) |
| `oh-my-opencode-linux-x64` | Linux x64 (glibc) |
| `oh-my-opencode-linux-x64-musl` | Linux x64 (musl) |
| `oh-my-opencode-windows-x64` | Windows x64 |

版本与主包一致（当前 3.1.11）。  
二进制路径（相对包根）：`<pkg>/bin/oh-my-opencode` 或 `oh-my-opencode.exe`（Windows）。

---

## 三、缓存目录统一说明

| 环境 | 缓存根目录 |
|------|------------|
| Linux / macOS | `$XDG_CACHE_HOME/oh-my-opencode/bin`，未设置则为 `~/.cache/oh-my-opencode/bin` |
| Windows | `%LOCALAPPDATA%\oh-my-opencode\bin`，未设置则 `%APPDATA%\oh-my-opencode\bin` |

ripgrep、ast-grep、comment-checker 的**运行时下载**二进制均放在该目录下；解压后最终可执行文件名为：`rg` / `rg.exe`、`sg` / `sg.exe`、`comment-checker` / `comment-checker.exe`。

---

## 四、离线或预置建议

1. **预下载运行时二进制**  
   按上表「直接下载链接」在能联网的机器下载对应平台的压缩包，拷贝到目标机同一缓存目录并解压，保证可执行文件名与上一致（ripgrep 需从 tar.gz/zip 内取出 `rg` 放到缓存目录）。

2. **版本对齐**  
   - ripgrep：固定 14.1.1。  
   - ast-grep：与 `node_modules/@ast-grep/cli/package.json` 的 `version` 一致。  
   - comment-checker：与 `node_modules/@code-yeongyu/comment-checker/package.json` 的 `version` 一致。

3. **可选平台包**  
   离线安装时需提前把对应平台的 `oh-my-opencode-<platform>` 的 tgz 放入本地 registry 或通过 `bun add file:./path/to/tgz` 等方式安装，否则该可选依赖会安装失败（不影响主插件运行，仅 CLI 二进制可能不可用）。

---

*清单基于当前仓库代码与 package.json 整理，版本号随依赖升级可能变化，以仓库内常量与 package 为准。*
